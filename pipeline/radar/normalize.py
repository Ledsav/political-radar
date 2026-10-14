"""Turn raw WordPress records into flat, typed statement and politician records."""

import html
import re
from dataclasses import dataclass

from . import config

TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")


def clean_text(value) -> str:
    if not isinstance(value, str):
        return ""
    return WS_RE.sub(" ", html.unescape(TAG_RE.sub(" ", value))).strip()


@dataclass
class Politician:
    id: int
    slug: str
    name: str
    party: str | None
    image: str | None


@dataclass
class Statement:
    id: int
    published: str  # ISO date the fact-check was published
    claim: str
    claim_date: str  # free text as published, e.g. "7 ottobre"
    claim_source_url: str | None
    fact_check_url: str
    politician_id: int | None
    verdict_text: str  # exact label, verdict sentence, or "" when there is none
    context: str  # extra text for classifying: summary bullets or article lede


def _politician(raw) -> Politician | None:
    if not isinstance(raw, dict) or not raw.get("ID"):
        return None
    return Politician(
        id=raw["ID"],
        slug=raw.get("post_name") or str(raw["ID"]),
        name=clean_text(raw.get("post_title")),
        party=clean_text(raw.get("partito")) or None,
        image=(raw.get("image") or {}).get("url") or None,
    )


def _fact_check_url(record: dict) -> str:
    article = record["acf"].get("articolo")
    if isinstance(article, dict) and article.get("post_name"):
        return f"{config.SITE_BASE}/articoli/{article['post_name']}"
    return f"{config.SITE_BASE}/dichiarazioni/{record['slug']}"


def _context(acf: dict) -> str:
    parts = []
    verdict = acf.get("verdetto")
    if isinstance(verdict, dict) and isinstance(verdict.get("in_breve"), list):
        parts += [clean_text(b.get("testo")) for b in verdict["in_breve"] if isinstance(b, dict)]
    article = acf.get("articolo")
    if isinstance(article, dict):
        parts += [clean_text(article.get("post_title")), clean_text(article.get("post_content"))]
    return " ".join(p for p in parts if p)


def normalize(raw_records: list[dict]) -> tuple[list[Statement], dict[int, Politician]]:
    statements: list[Statement] = []
    politicians: dict[int, Politician] = {}

    for record in raw_records:
        acf = record.get("acf") or {}
        if not isinstance(acf, dict):
            continue
        politician = _politician(acf.get("politico"))
        if politician:
            politicians[politician.id] = politician

        verdict = acf.get("verdetto")
        verdict_text = clean_text(verdict.get("testo")) if isinstance(verdict, dict) else ""

        statements.append(
            Statement(
                id=record["id"],
                published=record["date"][:10],
                claim=clean_text(acf.get("sentenza")) or clean_text((record.get("title") or {}).get("rendered")),
                claim_date=clean_text(acf.get("data_della_dichiarazione")),
                claim_source_url=acf.get("link") or None,
                fact_check_url=_fact_check_url(record),
                politician_id=politician.id if politician else None,
                verdict_text=verdict_text,
                context=_context(acf),
            )
        )
    return statements, politicians
