"""Download every fact-checked statement from Pagella Politica's public WordPress API."""

import json
import logging
import time

import requests

from . import config

log = logging.getLogger(__name__)

FIELDS = "id,date,modified,slug,link,title,acf"
PAGE_SIZE = 100


def fetch_all(session: requests.Session | None = None, delay: float = 0.5) -> list[dict]:
    session = session or requests.Session()
    session.headers["User-Agent"] = config.USER_AGENT

    statements: list[dict] = []
    page, total_pages = 1, 1
    while page <= total_pages:
        resp = session.get(
            f"{config.API_BASE}/dichiarazioni",
            params={"per_page": PAGE_SIZE, "page": page, "_fields": FIELDS},
            timeout=60,
        )
        resp.raise_for_status()
        total_pages = int(resp.headers.get("X-WP-TotalPages", 1))
        statements.extend(resp.json())
        log.info("fetched page %d/%d (%d statements)", page, total_pages, len(statements))
        page += 1
        time.sleep(delay)
    return statements


def run() -> list[dict]:
    statements = fetch_all()
    config.RAW_DIR.mkdir(parents=True, exist_ok=True)
    config.RAW_STATEMENTS.write_text(json.dumps(statements, ensure_ascii=False), encoding="utf-8")
    log.info("saved %d statements to %s", len(statements), config.RAW_STATEMENTS)
    return statements
