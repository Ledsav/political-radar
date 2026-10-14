"""Aggregate rated statements into per-politician and per-party scores.

The score is the average truth value on Pagella Politica's scale (0 = Panzana
pazzesca, 1 = Vero), shrunk toward the global average:

    score = (sum of truth values + K * global_mean) / (n + K)

With few statements the score stays near the global mean instead of swinging
to 0 or 100 on a single fact-check. Below MIN_STATEMENTS_FOR_SCORE the score
is still computed but flagged so the UI does not present it as a headline.

Each score also gets an approximate 90% interval (normal approximation, with
the spread shrunk toward the global spread the same way the mean is). It only
covers sampling noise among the statements Pagella Politica chose to check,
not the bias in which statements get checked.
"""

import math

import re
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass

from . import config
from .verdicts import RATINGS, SCALE

# Labels Pagella Politica uses for people who are not party members.
NON_PARTIES = {"Tecnico"}

Z_90 = 1.645


@dataclass
class Rated:
    statement_id: int
    politician_id: int
    published: str
    rating: str


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def global_mean(rated: list[Rated]) -> float:
    return sum(RATINGS[r.rating].score for r in rated) / len(rated) if rated else 0.5


def global_variance(rated: list[Rated], mean: float) -> float:
    return sum((RATINGS[r.rating].score - mean) ** 2 for r in rated) / len(rated) if rated else 0.125


def summarize(rated: list[Rated], prior: float, prior_var: float) -> dict:
    n = len(rated)
    counts = Counter(r.rating for r in rated)
    values = [RATINGS[r.rating].score for r in rated]
    total = sum(values)
    k = config.SHRINKAGE_STRENGTH
    mean = (total + k * prior) / (n + k)
    variance = (sum((v - mean) ** 2 for v in values) + k * prior_var) / (n + k)
    margin = Z_90 * math.sqrt(variance / (n + k))
    dates = sorted(r.published for r in rated)
    return {
        "rated": n,
        "breakdown": {r.key: counts.get(r.key, 0) for r in SCALE},
        "raw_mean": round(total / n, 4) if n else None,
        "score": round(100 * mean),
        "score_low": max(0, round(100 * (mean - margin))),
        "score_high": min(100, round(100 * (mean + margin))),
        "reliable": n >= config.MIN_STATEMENTS_FOR_SCORE,
        "first_date": dates[0] if dates else None,
        "last_date": dates[-1] if dates else None,
    }


def by_politician(rated: list[Rated], prior: float, prior_var: float) -> dict[int, dict]:
    groups: dict[int, list[Rated]] = defaultdict(list)
    for r in rated:
        groups[r.politician_id].append(r)
    return {pid: summarize(items, prior, prior_var) for pid, items in groups.items()}


def by_party(rated: list[Rated], party_of: dict[int, str | None], prior: float, prior_var: float) -> dict[str, dict]:
    groups: dict[str, list[Rated]] = defaultdict(list)
    members: dict[str, set[int]] = defaultdict(set)
    for r in rated:
        party = party_of.get(r.politician_id)
        if party and party not in NON_PARTIES:
            groups[party].append(r)
            members[party].add(r.politician_id)
    return {party: {**summarize(items, prior, prior_var), "politicians": len(members[party])} for party, items in groups.items()}
