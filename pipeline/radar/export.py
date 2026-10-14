"""Write the static JSON files the frontend reads from public/data/."""

import json
import shutil
from datetime import datetime, timezone
from pathlib import Path

from . import config, evaluate
from .normalize import Politician, Statement
from .scoring import NON_PARTIES, Rated, by_party, by_politician, global_mean, global_variance, slugify
from .verdicts import SCALE, resolve


def _write(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def build(statements: list[Statement], politicians: dict[int, Politician], labels: dict[str, dict]) -> dict:
    rated: list[Rated] = []
    resolved: dict[int, tuple[str | None, str]] = {}
    for s in statements:
        if s.politician_id is None:
            continue
        rating, how = resolve(s, labels)
        resolved[s.id] = (rating, how)
        if rating:
            rated.append(Rated(s.id, s.politician_id, s.published, rating))

    prior = global_mean(rated)
    prior_var = global_variance(rated, prior)
    pol_stats = by_politician(rated, prior, prior_var)
    party_of = {pid: p.party for pid, p in politicians.items()}
    party_stats = by_party(rated, party_of, prior, prior_var)

    out = config.EXPORT_DIR
    if out.exists():
        shutil.rmtree(out)

    politician_rows = []
    for pid, stats in pol_stats.items():
        p = politicians[pid]
        politician_rows.append(
            {"id": p.slug, "name": p.name, "party": p.party, "partySlug": slugify(p.party) if p.party else None,
             "image": p.image, **stats}
        )
    politician_rows.sort(key=lambda r: (-r["rated"], r["name"]))
    _write(out / "politicians.json", politician_rows)

    party_rows = [{"id": slugify(name), "name": name, **stats} for name, stats in party_stats.items()]
    party_rows.sort(key=lambda r: (-r["rated"], r["name"]))
    _write(out / "parties.json", party_rows)

    per_politician: dict[int, list[dict]] = {}
    for s in statements:
        if s.politician_id is None or s.politician_id not in pol_stats:
            continue
        rating, how = resolved[s.id]
        per_politician.setdefault(s.politician_id, []).append(
            {"id": s.id, "published": s.published, "claim": s.claim, "claimDate": s.claim_date,
             "claimSource": s.claim_source_url, "factCheck": s.fact_check_url,
             "verdict": s.verdict_text or None, "rating": rating, "ratedBy": how if rating else None}
        )
    for pid, rows in per_politician.items():
        rows.sort(key=lambda r: r["published"], reverse=True)
        _write(out / "statements" / f"{politicians[pid].slug}.json", rows)

    attributed = [s for s in statements if s.politician_id is not None]
    reliable_widths = sorted(r["score_high"] - r["score_low"] for r in politician_rows if r["reliable"])
    meta = {
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": {"name": "Pagella Politica", "url": config.SITE_BASE},
        "scale": [{"key": r.key, "label": r.label, "value": r.score} for r in SCALE],
        "method": {"globalMean": round(prior, 4), "shrinkage": config.SHRINKAGE_STRENGTH,
                   "minStatements": config.MIN_STATEMENTS_FOR_SCORE, "nonParties": sorted(NON_PARTIES)},
        "counts": {
            "statements": len(statements),
            "attributed": len(attributed),
            "rated": len(rated),
            "ratedByLabel": sum(1 for r, how in resolved.values() if r and how == "label"),
            "ratedByModel": sum(1 for r, how in resolved.values() if r and how != "label"),
            "unrated": sum(1 for r, how in resolved.values() if r is None and how != "missing"),
            "awaitingClassification": sum(1 for _, how in resolved.values() if how == "missing"),
            "politicians": len(politician_rows),
            "parties": len(party_rows),
        },
        "accuracy": {
            "medianIntervalWidth": reliable_widths[len(reliable_widths) // 2] if reliable_widths else None,
            "labelAgreement": evaluate.load(),
        },
    }
    _write(out / "meta.json", meta)
    return meta

