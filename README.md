# Radar Politico

How reliable are Italian politicians' statements? Radar Politico summarises the fact-checks published by
[Pagella Politica](https://pagellapolitica.it) into a per-politician and per-party view, and links every
verdict back to the original article.

## How it fits together

```
Pagella Politica WordPress API ──► pipeline/ (Python) ──► public/data/*.json ──► React app (Vite)
                                       │
                                       └─ pipeline/data/verdict_labels.json  (cached LLM ratings)
```

- **`pipeline/`** downloads every statement from the public API, maps each verdict onto Pagella Politica's
  5-point scale, computes scores and writes static JSON. See [`pipeline/README.md`](pipeline/README.md).
- **`src/`** is a static React + MUI site that reads those JSON files. There is no backend and no database.
- **`.github/workflows/update-data.yml`** reruns the pipeline every Monday and commits the new data.

The scoring method, its limits and the data coverage are explained in the app at `/metodo`.

## Development

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest
npm run build      # type-check and build to build/
```

To refresh the data locally:

```sh
cd pipeline
python -m venv .venv && .venv/Scripts/pip install -r requirements-dev.txt   # .venv/bin/pip on macOS/Linux
.venv/Scripts/python -m radar all     # set GROQ_API_KEY to classify new verdict sentences
.venv/Scripts/python -m pytest
```

## Deploying

`npm run build` produces a static site in `build/`. Any static host works. Because routes such as
`/politicians/matteo-salvini` are client-side, configure the host to serve `index.html` for unknown paths
(Firebase Hosting `rewrites`, Netlify `_redirects`, Vercel `rewrites`, …).

For the weekly data update, add a `GROQ_API_KEY` repository secret (free at console.groq.com). Without it the
workflow still runs, but newly published verdict sentences stay unscored until a key is available.

## License

MIT. Fact-check content belongs to Pagella Politica; this project only shows verdict labels and short
claim excerpts, and links to their articles.
