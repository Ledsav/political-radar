"""Probe the Google Fact Check Tools API for Italian fact-checks.

Exploratory only: nothing here feeds the site. It answers "which Italian publishers
show up, how many reviews each, which rating labels they use, and who they check?"
before we decide whether to build a real fetcher.

    cd pipeline
    .venv/Scripts/python scripts/probe_google_factcheck.py              # top 25 politicians + parties
    .venv/Scripts/python scripts/probe_google_factcheck.py --top 60 --max-age-days 730
    .venv/Scripts/python scripts/probe_google_factcheck.py --query "reddito di cittadinanza"

Needs GOOGLE_FACTCHECK_API_KEY in pipeline/.env (Google Cloud console: enable
"Fact Check Tools API", then Credentials -> Create API key). Raw results are saved to
pipeline/data/raw/google_factcheck_probe.json (gitignored).
"""

import argparse
import json
import os
import sys
import time
from collections import Counter, defaultdict
from pathlib import Path

import requests

PIPELINE = Path(__file__).resolve().parents[1]
REPO = PIPELINE.parent
ENDPOINT = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
USER_AGENT = "political-radar/1.0 (+https://github.com/Ledsav/political-radar)"
OUT = PIPELINE / "data" / "raw" / "google_factcheck_probe.json"


def load_dotenv() -> None:
    path = PIPELINE / ".env"
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        key, sep, value = line.partition("=")
        if sep and key.strip() and not key.lstrip().startswith("#"):
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def default_queries(top: int) -> list[str]:
    """Most-rated politicians and every party from the site's own export."""
    data = REPO / "public" / "data"
    politicians = json.loads((data / "politicians.json").read_text(encoding="utf-8"))
    parties = json.loads((data / "parties.json").read_text(encoding="utf-8"))
    names = [p["name"] for p in sorted(politicians, key=lambda p: -p.get("rated", 0))[:top]]
    return names + [p["name"] for p in parties]


def search(session: requests.Session, key: str, query: str, lang: str,
           max_age_days: int | None, max_pages: int) -> list[dict]:
    params = {"query": query, "languageCode": lang, "pageSize": 100, "key": key}
    if max_age_days:
        params["maxAgeDays"] = max_age_days
    claims: list[dict] = []
    for _ in range(max_pages):
        for attempt in range(4):
            resp = session.get(ENDPOINT, params=params, timeout=30)
            if resp.status_code not in (429, 500, 503):
                break
            time.sleep(2 ** attempt)
        if resp.status_code != 200:
            msg = resp.json().get("error", {}).get("message", resp.text[:200]) if resp.content else ""
            sys.exit(f"API error {resp.status_code} for {query!r}: {msg}")
        body = resp.json()
        claims.extend(body.get("claims", []))
        token = body.get("nextPageToken")
        if not token:
            break
        params["pageToken"] = token
    return claims


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--query", action="append", help="search term (repeatable); default: politicians + parties")
    ap.add_argument("--top", type=int, default=25, help="how many most-rated politicians to query (default 25)")
    ap.add_argument("--lang", default="it", help="BCP-47 language code (default it)")
    ap.add_argument("--max-age-days", type=int, help="only reviews newer than this")
    ap.add_argument("--max-pages", type=int, default=5, help="pages of 100 per query (default 5)")
    args = ap.parse_args()

    load_dotenv()
    key = os.environ.get("GOOGLE_FACTCHECK_API_KEY")
    if not key:
        sys.exit("GOOGLE_FACTCHECK_API_KEY is empty: add it to pipeline/.env (see this file's docstring).")

    queries = args.query or default_queries(args.top)
    session = requests.Session()
    session.headers["User-Agent"] = USER_AGENT

    reviews: dict[str, dict] = {}  # review URL -> flattened record (dedupes across queries)
    for i, q in enumerate(queries, 1):
        claims = search(session, key, q, args.lang, args.max_age_days, args.max_pages)
        print(f"[{i:>3}/{len(queries)}] {q:<35} {len(claims):>4} claims", file=sys.stderr)
        for c in claims:
            for r in c.get("claimReview", []):
                url = r.get("url")
                if not url or url in reviews:
                    continue
                pub = r.get("publisher", {})
                reviews[url] = {
                    "query": q,
                    "claim": c.get("text"),
                    "claimant": c.get("claimant"),
                    "claimDate": c.get("claimDate"),
                    "site": pub.get("site") or "?",
                    "publisher": pub.get("name") or "?",
                    "rating": (r.get("textualRating") or "").strip(),
                    "reviewDate": r.get("reviewDate"),
                    "lang": r.get("languageCode"),
                    "title": r.get("title"),
                    "url": url,
                }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(list(reviews.values()), ensure_ascii=False, indent=1), encoding="utf-8")

    by_site: dict[str, list[dict]] = defaultdict(list)
    for r in reviews.values():
        by_site[r["site"]].append(r)

    print(f"\n{len(reviews)} unique reviews from {len(by_site)} publishers  (raw: {OUT.relative_to(REPO)})\n")
    print(f"{'site':<28} {'n':>5} {'with claimant':>13}  {'dates':<23}  top ratings")
    for site, rs in sorted(by_site.items(), key=lambda kv: -len(kv[1])):
        dates = sorted(d[:10] for r in rs if (d := r["reviewDate"]))
        span = f"{dates[0]}..{dates[-1]}" if dates else "-"
        named = sum(1 for r in rs if r["claimant"])
        top = ", ".join(f"{k} ({v})" for k, v in Counter(r["rating"].lower() for r in rs).most_common(5))
        print(f"{site[:28]:<28} {len(rs):>5} {named:>13}  {span:<23}  {top}")

    print("\nMost frequent claimants (who is being checked):")
    for name, n in Counter(r["claimant"] for r in reviews.values() if r["claimant"]).most_common(20):
        print(f"  {n:>4}  {name}")


if __name__ == "__main__":
    main()
