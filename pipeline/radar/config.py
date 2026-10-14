from pathlib import Path

PIPELINE_ROOT = Path(__file__).resolve().parent.parent
REPO_ROOT = PIPELINE_ROOT.parent

# Raw API dumps are re-downloadable, so they stay out of git.
RAW_DIR = PIPELINE_ROOT / "data" / "raw"
RAW_STATEMENTS = RAW_DIR / "dichiarazioni.json"

# Verdict labels produced by the LLM (or by hand) are committed, so a rebuild
# never re-classifies a statement whose verdict text has not changed.
LABELS_FILE = PIPELINE_ROOT / "data" / "verdict_labels.json"

# Output of `python -m radar evaluate` (label agreement on a sample).
EVALUATION_FILE = PIPELINE_ROOT / "data" / "evaluation.json"

# Where the frontend reads its data from.
EXPORT_DIR = REPO_ROOT / "public" / "data"

API_BASE = "https://backend.pagellapolitica.it/wp-json/wp/v2"
SITE_BASE = "https://pagellapolitica.it"
USER_AGENT = "political-radar/1.0 (+https://github.com/Ledsav/political-radar)"

# Below this many rated statements a politician's score is not shown as a
# headline number, only as "dati insufficienti" plus the raw breakdown.
MIN_STATEMENTS_FOR_SCORE = 5

# Pseudo-count for shrinking small samples toward the global mean.
SHRINKAGE_STRENGTH = 5
