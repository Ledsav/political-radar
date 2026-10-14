# Data pipeline

Builds `public/data/` from Pagella Politica's public WordPress REST API
(`https://backend.pagellapolitica.it/wp-json/wp/v2/dichiarazioni`).

```sh
python -m radar fetch      # download all statements to data/raw/ (gitignored)
python -m radar classify   # rate new verdict sentences with Claude (needs ANTHROPIC_API_KEY)
python -m radar build      # write ../public/data/*.json
python -m radar all        # all three; skips classify when no key is set
```

## Stages

| Module | Does |
|---|---|
| `fetch.py` | Pages through the API (≈38 requests) and saves the raw records. |
| `normalize.py` | Cleans HTML, links each statement to its politician, builds the fact-check URL. |
| `verdicts.py` | Maps each statement onto the 5-point scale (see below). |
| `scoring.py` | Per-politician and per-party scores with shrinkage toward the global mean. |
| `export.py` | Writes `politicians.json`, `parties.json`, `statements/<slug>.json`, `meta.json`. |

## How verdicts are rated

Pagella Politica's scale: **Vero** (1.0), **C'eri quasi** (0.75), **Nì** (0.5), **Pinocchio andante** (0.25),
**Panzana pazzesca** (0).

- Until 2021 each statement carries one of those labels, which is used as-is.
- Since then the site publishes a verdict sentence ("Il ministro esagera."), or for the newest statements only
  an article. These are rated by Claude with the prompt in `verdicts.py`. A statement can also be
  `non_valutabile`, for example when its only text is a round-up article covering several claims.
- Ratings are cached in `data/verdict_labels.json`, keyed by statement id and a hash of the text they were
  derived from. A statement is reclassified only when that text changes. To redo one, delete its entry and run
  `classify`. You can also edit an entry by hand: set `"by"` to something like `"manual"` so it is clear where it came from.

The initial 569 entries marked `"by": "claude-code-session"` were rated interactively in a Claude Code session
using the same scale and conventions as the prompt, because no API key was available at the time. Entries
written by the API carry the model name instead.

## Known gaps

- About 2,400 statements from 2012–2019 are not linked to any politician in the API and are skipped.
- A politician's party is their current one, so older statements can count toward a party they have since left.
- For 2026 round-up articles the per-claim verdict is only in the article body; those statements are currently
  `non_valutabile`. Fetching the article and matching each claim's paragraph would recover them.
