"""Map every statement onto Pagella Politica's own 5-point scale.

Until 2021 the site published one of five fixed labels, which we map directly.
Since then it publishes a verdict sentence (or only an article), which an LLM
maps onto the same scale. LLM labels are cached in LABELS_FILE keyed by a hash
of the text they were derived from, so each statement is classified once.
"""

import hashlib
import json
import logging
import unicodedata
from dataclasses import dataclass

from . import config
from .normalize import Statement

log = logging.getLogger(__name__)


@dataclass(frozen=True)
class Rating:
    key: str
    label: str  # Pagella Politica's own wording
    score: float  # 1 = true, 0 = completely false


SCALE = [
    Rating("vero", "Vero", 1.0),
    Rating("quasi", "C'eri quasi", 0.75),
    Rating("ni", "Nì", 0.5),
    Rating("pinocchio", "Pinocchio andante", 0.25),
    Rating("panzana", "Panzana pazzesca", 0.0),
]
RATINGS = {r.key: r for r in SCALE}
UNRATED = "non_valutabile"


def _fold(text: str) -> str:
    text = text.replace("’", "'")
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return text.strip().rstrip(".").lower()


_LABEL_LOOKUP = {_fold(r.label): r.key for r in SCALE}


def label_from_text(verdict_text: str) -> str | None:
    """Return the rating key when the verdict is one of the five fixed labels."""
    return _LABEL_LOOKUP.get(_fold(verdict_text))


def needs_llm(statement: Statement) -> bool:
    return (
        statement.politician_id is not None
        and label_from_text(statement.verdict_text) is None
        and bool(statement.verdict_text or statement.context)
    )


def text_hash(statement: Statement) -> str:
    payload = f"{statement.claim}\n{statement.verdict_text}\n{statement.context}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


def load_labels() -> dict[str, dict]:
    if config.LABELS_FILE.exists():
        return json.loads(config.LABELS_FILE.read_text(encoding="utf-8"))
    return {}


def save_labels(labels: dict[str, dict]) -> None:
    ordered = {k: labels[k] for k in sorted(labels, key=int)}
    config.LABELS_FILE.write_text(json.dumps(ordered, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


def resolve(statement: Statement, labels: dict[str, dict]) -> tuple[str | None, str]:
    """Return (rating key or None, how it was obtained)."""
    direct = label_from_text(statement.verdict_text)
    if direct:
        return direct, "label"
    if not (statement.verdict_text or statement.context):
        return None, "no_verdict"
    cached = labels.get(str(statement.id))
    if cached and cached.get("hash") == text_hash(statement):
        key = cached["rating"]
        return (key if key in RATINGS else None), cached.get("by", "llm")
    return None, "missing"


SYSTEM_PROMPT = """You map Italian political fact-checks from Pagella Politica onto the site's own 5-point scale.

Scale, from true to false:
- vero: the claim is correct ("ha ragione", "è corretta", "i numeri sono attendibili", "Sì").
- quasi: essentially correct with minor imprecision ("ha sostanzialmente ragione", "è sostanzialmente corretta", "più o meno", "esagera un po'").
- ni: half right, half wrong, or a mix of correct and misleading elements ("Nì", "è parziale", "dipende", "esagera", "è imprecisa", "troppo ottimista").
- pinocchio: largely wrong or misleading ("sbaglia", "sbaglia di parecchio", "è fuorviante", "non è supportata dai numeri", "i dati gli danno torto", "si prende meriti che non ha").
- panzana: completely false or invented ("è falsa", "è completamente sbagliato", "non ha alcun fondamento").
- non_valutabile: the text gives no verdict on the claim's accuracy (e.g. a promise, an opinion, or an article that only explains context).

Judge only the verdict the fact-checkers gave, not your own view of the claim. Use the summary bullets and article lede when the verdict sentence is missing or ambiguous.

When there is no verdict sentence and the summary describes an article that checks several statements ("abbiamo verificato nove dichiarazioni..."), it does not say which verdict applies to this claim: answer non_valutabile rather than guessing from the article's overall tone. A single-claim article headline such as "X sbaglia su..." or "No, ... non è vero" does count as the verdict.

Conventions: "non dice la verità", "scorretta", "ha torto", "parecchio esagerato" are pinocchio; "dice una cosa falsa" is panzana; "esagera", "omette un dettaglio importante", "ha ragione solo se..." are ni; "ha ragione, ma..." and "il numero corretto è un po' più alto" are quasi."""

BATCH_SIZE = 20
MODEL = "claude-opus-5-5"


def _schema(ids: list[int]) -> dict:
    return {
        "type": "object",
        "properties": {
            "ratings": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer", "enum": ids},
                        "rating": {"type": "string", "enum": [*RATINGS, UNRATED]},
                    },
                    "required": ["id", "rating"],
                    "additionalProperties": False,
                },
            }
        },
        "required": ["ratings"],
        "additionalProperties": False,
    }


def _prompt(batch: list[Statement]) -> str:
    items = [
        {"id": s.id, "claim": s.claim, "verdict": s.verdict_text or None, "summary": s.context[:1500] or None}
        for s in batch
    ]
    return "Rate each fact-check. Return exactly one rating per id.\n\n" + json.dumps(items, ensure_ascii=False, indent=1)


def classify_with_llm(statements: list[Statement], labels: dict[str, dict]) -> int:
    """Classify statements that have no cached label. Returns how many were added."""
    import anthropic

    todo = [s for s in statements if needs_llm(s) and resolve(s, labels)[1] == "missing"]
    if not todo:
        return 0
    log.info("classifying %d statements with %s", len(todo), MODEL)

    client = anthropic.Anthropic()
    added = 0
    for start in range(0, len(todo), BATCH_SIZE):
        batch = todo[start : start + BATCH_SIZE]
        response = client.messages.create(
            model=MODEL,
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": _prompt(batch)}],
            output_config={"effort": "low", "format": {"type": "json_schema", "schema": _schema([s.id for s in batch])}},
            # Re-run a safety-classifier decline on Anthropic's recommended fallback model.
            extra_headers={"anthropic-beta": "server-side-fallback-2026-07-01"},
            extra_body={"fallbacks": "default"},
        )
        if response.stop_reason != "end_turn":
            log.warning("batch starting at %d stopped with %s; skipping", start, response.stop_reason)
            continue
        text = next(b.text for b in response.content if b.type == "text")
        by_id = {s.id: s for s in batch}
        for item in json.loads(text)["ratings"]:
            statement = by_id.get(item["id"])
            if statement:
                labels[str(statement.id)] = {"rating": item["rating"], "hash": text_hash(statement), "by": response.model}
                added += 1
        save_labels(labels)  # persist progress so an interrupted run is not wasted
    return added
