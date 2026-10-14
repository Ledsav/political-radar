# Radar Politico

How reliable are Italian politicians' statements? Radar Politico collects the fact-checks published by
[Pagella Politica](https://pagellapolitica.it) and shows them per politician and per party: the verdict
breakdown, every checked statement with a link to the original article, and a score with a margin of error.

There is no backend and no database. A Python pipeline turns Pagella Politica's public data into static JSON
files, and a React site reads them.

---

## How it works

```
                    ┌───────────────────────── pipeline/ (Python) ─────────────────────────┐
 Pagella Politica   │                                                                       │
 WordPress API ───► │ fetch ──► normalize ──► verdicts ──► scoring ──► export               │ ──► public/data/*.json ──► React app
 (dichiarazioni)    │                           │                                           │        (committed)          (src/)
                    │                           └─ data/verdict_labels.json (LLM cache)     │
                    └───────────────────────────────────────────────────────────────────────┘
                                 ▲
                   GitHub Actions, every Monday (.github/workflows/update-data.yml)
```

### 1. Fetch

`pipeline/radar/fetch.py` pages through
`https://backend.pagellapolitica.it/wp-json/wp/v2/dichiarazioni` (about 3,800 statements, 38 requests) and
saves the raw JSON in `pipeline/data/raw/` (gitignored; it can always be downloaded again).

### 2. Normalize

`normalize.py` cleans the HTML, links each statement to its politician (name, current party, photo) and builds
the URL of the fact-check on pagellapolitica.it. About 2,400 statements from 2012–2019 have no politician
attached in the source and are dropped.

### 3. Rate each verdict

Every statement is mapped onto Pagella Politica's own 5-point scale:

| Label | Value |
|---|---|
| Vero | 1.00 |
| C'eri quasi | 0.75 |
| Nì | 0.50 |
| Pinocchio andante | 0.25 |
| Panzana pazzesca | 0.00 |

- **Until 2021** the site assigned one of these labels itself. Those are used as-is (62% of ratings).
- **Since 2021** it writes a verdict sentence instead ("Il ministro esagera."). An LLM maps the sentence onto
  the same scale, or marks it `non_valutabile` when there is no usable verdict (38% of ratings).
- LLM ratings are saved in `pipeline/data/verdict_labels.json`, keyed by statement id plus a hash of the text,
  so each statement is classified once and re-classified only if Pagella Politica edits it. The file is
  committed, so every rating can be reviewed and corrected by hand.
- The LLM is **Groq's free tier** (`openai/gpt-oss-120b`) when `GROQ_API_KEY` is set. Claude also works
  (`ANTHROPIC_API_KEY` + `pip install anthropic`). With no key, new verdicts simply stay unrated.

### 4. Score

`scoring.py` computes, for each politician and party:

- **score**: the average value of their rated statements, shrunk toward the overall average by adding 5
  "average" statements. One false statement can't drive anyone to 0, and one true statement can't drive anyone to 100.
- **score_low / score_high**: an approximate 90% margin of error.
- **reliable**: false below 5 rated statements. The site then shows "dati insufficienti" instead of a number.

Parties add up the statements of their *current* members.

### Party logos

`logos.py` downloads 12 party logos from **Wikimedia Commons** (public domain or CC BY-SA only), saves them to
`public/logos/` and records author and licence in `pipeline/data/party_logos.json`. Party pages show that credit.
The list in `PARTY_LOGOS` is curated by hand, because automatic name matching kept picking the wrong party.
Fratelli d'Italia, Italia Viva, Impegno Civico, Alleanza Verdi e Sinistra, Partito Liberaldemocratico and
Futuro Nazionale have no free logo on Commons and get a typographic card instead. Run
`python -m radar logos` after editing the list.

### 5. Export

`export.py` writes `public/data/politicians.json`, `parties.json`, `statements/<politician>.json` and
`meta.json` (counts, method parameters, accuracy figures). The website loads only these files.

### The website

`src/` is a Vite + React + MUI single-page app:

- `src/data/` loads and caches the JSON and holds the types, the scale colours and the search logic
- `src/pages/` has Home, Politicians, Parties, the detail pages, and `/metodo`, which explains the method and its accuracy
- `src/components/` holds the cards, verdict bar, score box, ranking chart and statement list

Fonts are bundled via `@fontsource`, so the site makes no third-party requests.

### Logo

The mark, **"Margine"**, is a square speech bubble with a ± cut out of it: every statement, with its margin
of error. Masters are in `design/logo/`:

- `radar-politico-symbol.svg`: the master symbol
- `-symbol-small.svg`: a heavier cut for 16–32 px
- `-lockup.svg`: symbol plus wordmark, with Antonio Bold traced to outlines (Antonio is OFL-licensed)
- white, black and app-icon variants, plus `test-sheet.png`

The rejected concepts are kept in `design/logo-concepts/`. In the app the mark is `src/components/shared/LogoMark.tsx`,
which inherits the text colour. The favicons, app icons and `site.webmanifest` in `public/` use black on lime (`#abfb73`),
so they show up in both light and dark browser tabs.

---

## How accurate is it?

The `/metodo` page states this to visitors; in short:

1. **Selection bias, the largest error.** Pagella Politica chooses which statements to check and itself warns
   that its data do not allow politicians to be compared. No calculation fixes that.
2. **Sample size.** Each score carries a 90% margin. Among politicians with enough data the median margin is
   about 23 points wide, so politicians whose ranges overlap are not distinguishable.
3. **Verdict reading.** 62% of ratings are Pagella Politica's own labels. The other 38% come from an LLM.
   `python -m radar evaluate` re-rates a sample with a second model and publishes how often the two agree.

---

## Running it locally

Requirements: Node 20+, Python 3.10+.

### With VS Code tasks (`Terminal → Run Task…`)

| Task | What it does |
|---|---|
| **App: start dev server** | `npm run dev`, then open http://localhost:5173 (also the default build task: `Ctrl+Shift+B`) |
| **App: test** | Vitest |
| **App: production build + preview** | builds to `build/` and serves it |
| **Pipeline: set up Python environment** | creates `pipeline/.venv` (run once) |
| **Pipeline: update data** | fetch, classify new verdicts, rebuild `public/data` |
| **Pipeline: rebuild data from cache (offline)** | re-export from the last download, no network |
| **Pipeline: measure label agreement** | runs `evaluate` with your Groq key |
| **Pipeline: test** / **Test everything** | pytest, or both test suites |

Run `npm install` once before the App tasks.

### From a terminal

```sh
npm install
npm run dev                    # http://localhost:5173
npm test

cd pipeline
python -m venv .venv
.venv/Scripts/pip install -r requirements-dev.txt     # macOS/Linux: .venv/bin/pip
.venv/Scripts/python -m radar all                     # fetch + classify + build
.venv/Scripts/python -m radar build                   # rebuild only, offline
.venv/Scripts/python -m radar evaluate                # measure label agreement
.venv/Scripts/python -m pytest
```

### API key

Copy `pipeline/.env.example` to `pipeline/.env` and paste your Groq key. `.env` is gitignored, and the pipeline
reads it automatically. Without a key, everything works except rating newly published verdicts.

---

## Setting up Groq (free)

1. Sign up at https://console.groq.com. No credit card is needed for the free tier.
2. Create a key under **API Keys**.
3. **Locally:** put it in `pipeline/.env` as `GROQ_API_KEY=gsk_...`.
4. **For the weekly update:** on GitHub, go to repo → **Settings → Secrets and variables → Actions → New
   repository secret**, name `GROQ_API_KEY`.
5. Optionally measure agreement once: **Actions → Update data → Run workflow**, tick *"Also measure label
   agreement"*. The result appears on `/metodo`.

Free-tier limits are per minute and per day. The pipeline sends small batches and waits when rate-limited.
A normal week has only a handful of new statements.

---

## Automation

- **`.github/workflows/ci.yml`** runs both test suites and the build on every push and pull request.
- **`.github/workflows/update-data.yml`** runs every Monday at 05:00 UTC (or manually). It fetches, classifies
  and rebuilds, then commits `public/data` and the label cache only if something besides the timestamp changed.

## Deploying (GitHub Pages)

The site is published at **https://ledsav.github.io/political-radar/** by `.github/workflows/pages.yml`:

- It runs on every push to `main`, after every successful **Update data** run (bot pushes don't trigger
  `push` workflows by themselves), or manually from the Actions tab.
- It builds with `BASE_PATH=/political-radar/`. `vite.config.ts` uses that as the base URL and the router uses it
  as its basename. Without `BASE_PATH` the app builds for the domain root, which is what `npm run dev` uses.
- It copies `index.html` to `404.html`. Pages has no URL rewriting, so this makes direct links such as
  `/political-radar/politicians/matteo-salvini` load the app, which then shows the right page.

One-time setup: repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.

To preview the Pages build locally:

```sh
BASE_PATH=/political-radar/ npm run build && BASE_PATH=/political-radar/ npm run preview
# open http://localhost:4173/political-radar/   (Git Bash on Windows: prefix with MSYS_NO_PATHCONV=1)
```

Any other static host works too: build without `BASE_PATH` and configure it to serve `index.html` for
unknown paths.

## License and attribution

Code: MIT. All fact-checks belong to Pagella Politica (The Fact-Checking Factory Srl). The site shows verdict
labels and short claim excerpts and always links to the original article. Politician photos are served from
Pagella Politica and belong to their respective authors.
