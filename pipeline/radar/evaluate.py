"""Measure how consistently verdict sentences are mapped onto the scale.

There is no official mapping for Pagella Politica's post-2021 verdict
sentences, so we cannot measure accuracy against ground truth. What we can
measure is agreement: re-rate a fixed random sample of already-labelled
statements with the configured provider (without looking at the existing
label) and count how often the two match exactly or within one step.

The result is written to EVALUATION_FILE and published in meta.json.
"""

import json
import logging
import random
from collections import Counter
from datetime import datetime, timezone

from . import config
from .normalize import Statement
from .verdicts import SCALE, UNRATED, load_labels, make_rater, needs_llm, resolve

log = logging.getLogger(__name__)

ORDER = {r.key: i for i, r in enumerate(SCALE)}


def agreement(pairs: list[tuple[str, str]]) -> dict:
    """pairs are (reference, candidate) rating keys."""
    n = len(pairs)
    exact = sum(a == b for a, b in pairs)
    within_one = sum(
        a == b or (a in ORDER and b in ORDER and abs(ORDER[a] - ORDER[b]) <= 1) for a, b in pairs
    )
    disagreements = Counter(f"{a}->{b}" for a, b in pairs if a != b)
    return {
        "sample": n,
        "exact": round(exact / n, 3) if n else None,
        "withinOneStep": round(within_one / n, 3) if n else None,
        "topDisagreements": dict(disagreements.most_common(5)),
    }


def run(statements: list[Statement], sample_size: int = 80, seed: int = 7) -> dict | None:
    labels = load_labels()
    pool = [s for s in statements if needs_llm(s) and resolve(s, labels)[1] not in ("missing", "label")]
    if not pool:
        log.warning("nothing to evaluate: no LLM-labelled statements")
        return None
    rater = make_rater()
    if rater is None:
        log.warning("set GROQ_API_KEY or ANTHROPIC_API_KEY to run the evaluation")
        return None

    sample = random.Random(seed).sample(pool, min(sample_size, len(pool)))
    reference = {s.id: labels[str(s.id)] for s in sample}
    log.info("re-rating %d statements with %s", len(sample), rater.model)

    pairs: list[tuple[str, str]] = []
    for start in range(0, len(sample), rater.batch_size):
        batch = sample[start : start + rater.batch_size]
        for item in rater.rate(batch) or []:
            ref = reference.get(item.get("id"))
            if ref and item.get("rating") in {*ORDER, UNRATED}:
                pairs.append((ref["rating"], item["rating"]))

    result = {
        "evaluatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "candidate": rater.model,
        "reference": dict(Counter(ref["by"] for ref in reference.values())),
        **agreement(pairs),
    }
    config.EVALUATION_FILE.write_text(json.dumps(result, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    log.info("agreement: %s", json.dumps(result))
    return result


def load() -> dict | None:
    if config.EVALUATION_FILE.exists():
        return json.loads(config.EVALUATION_FILE.read_text(encoding="utf-8"))
    return None
