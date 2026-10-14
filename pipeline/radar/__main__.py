"""Political Radar data pipeline.

    python -m radar fetch      download statements from the Pagella Politica API
    python -m radar classify   rate new verdict sentences (needs GROQ_API_KEY or ANTHROPIC_API_KEY)
    python -m radar build      write public/data/*.json from the raw dump and labels
    python -m radar all        fetch, classify (when a key is available), build
"""

import argparse
import json
import logging
import sys

from . import config, export, fetch, verdicts
from .normalize import normalize

log = logging.getLogger("radar")


def _load_raw() -> list[dict]:
    if not config.RAW_STATEMENTS.exists():
        sys.exit(f"{config.RAW_STATEMENTS} not found; run `python -m radar fetch` first")
    return json.loads(config.RAW_STATEMENTS.read_text(encoding="utf-8"))


def _classify(statements) -> None:
    labels = verdicts.load_labels()
    added = verdicts.classify_with_llm(statements, labels)
    log.info("added %d new labels", added)


def _build(statements, politicians) -> None:
    meta = export.build(statements, politicians, verdicts.load_labels())
    log.info("exported to %s: %s", config.EXPORT_DIR, json.dumps(meta["counts"]))
    if meta["counts"]["awaitingClassification"]:
        log.warning("%d statements still need classification and were left out of the scores",
                    meta["counts"]["awaitingClassification"])


def main() -> None:
    parser = argparse.ArgumentParser(prog="radar")
    parser.add_argument("command", choices=["fetch", "classify", "build", "all"])
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

    raw = fetch.run() if args.command in ("fetch", "all") else None
    if args.command == "fetch":
        return

    statements, politicians = normalize(raw if raw is not None else _load_raw())
    if args.command in ("classify", "all"):
        _classify(statements)
    if args.command in ("build", "all"):
        _build(statements, politicians)


if __name__ == "__main__":
    main()
