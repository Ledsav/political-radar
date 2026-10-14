"""Download party logos from Wikimedia Commons and record their licences.

Only files hosted on Commons are used, because Commons accepts nothing but
freely licensed or public-domain media. The mapping is curated by hand: name
searches on Wikidata/Commons return the wrong party too often (e.g. the US
Democratic Party for "Partito Democratico"). Parties without a free logo on
Commons are left out and get a typographic card in the UI.

Logos are saved under public/logos/ and served by the site itself, so
visitors' browsers never contact Wikimedia.
"""

import html
import json
import logging
import re

import requests

from . import config
from .scoring import slugify

log = logging.getLogger(__name__)

COMMONS_API = "https://commons.wikimedia.org/w/api.php"
WIDTH = 320

PARTY_LOGOS = {
    "Lega": "File:Simbolo di Lega per Salvini Premier.svg",
    "Partito Democratico": "File:Partito Democratico Italy.svg",
    "Movimento 5 Stelle": "File:Movimento5s.svg",
    "Azione": "File:Azionelogo2022.jpg",
    "Forza Italia": "File:Logo Forza Italia.svg",
    "Sinistra italiana": "File:Sinistra Italiana Logo.png",
    "Europa Verde": "File:Europa Verde logo.svg",
    "Liberi e uguali": "File:LeU-it-logo.svg",
    "Più Europa": "File:Più Europa wordmark.svg",
    "Coraggio Italia": "File:Coraggio Italia logo.svg",
    "Italexit": "File:Italexit logo (2023–).svg",
    "Possibile": "File:LogoPossibile.svg",
}


def _clean(value: str) -> str:
    text = html.unescape(re.sub(r"<[^>]+>", " ", value or ""))
    text = re.sub(r"\[\d+\]", "", text)  # footnote markers
    return re.sub(r"\s+", " ", text).strip(" ;,")[:120]


def load_credits() -> dict[str, dict]:
    if config.LOGO_CREDITS_FILE.exists():
        return json.loads(config.LOGO_CREDITS_FILE.read_text(encoding="utf-8"))
    return {}


def run(session: requests.Session | None = None) -> dict[str, dict]:
    session = session or requests.Session()
    session.headers["User-Agent"] = config.USER_AGENT
    credits = load_credits()
    config.LOGO_DIR.mkdir(parents=True, exist_ok=True)

    # Drop logos that are no longer in the curated list.
    for party in [p for p in credits if p not in PARTY_LOGOS]:
        (config.REPO_ROOT / "public" / credits.pop(party)["path"]).unlink(missing_ok=True)

    for party, title in PARTY_LOGOS.items():
        slug = slugify(party)
        target = config.LOGO_DIR / f"{slug}.png"
        if target.exists() and credits.get(party, {}).get("file") == title:
            continue  # already downloaded; Commons files rarely change

        info = session.get(COMMONS_API, params={
            "action": "query", "titles": title, "prop": "imageinfo", "format": "json",
            "iiprop": "url|extmetadata", "iiurlwidth": WIDTH,
        }, timeout=60).json()
        page = next(iter(info["query"]["pages"].values()))
        if "imageinfo" not in page:
            log.warning("logo for %s not found on Commons: %s", party, title)
            continue
        image = page["imageinfo"][0]
        meta = image["extmetadata"]

        resp = session.get(image["thumburl"], timeout=60)
        resp.raise_for_status()
        target.write_bytes(resp.content)
        credits[party] = {
            "file": title,
            "path": f"logos/{slug}.png",
            "author": _clean(meta.get("Artist", {}).get("value")) or "Sconosciuto",
            "license": _clean(meta.get("LicenseShortName", {}).get("value")),
            "source": image["descriptionurl"],
        }
        log.info("downloaded logo for %s", party)

    config.LOGO_CREDITS_FILE.write_text(json.dumps(credits, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return credits
