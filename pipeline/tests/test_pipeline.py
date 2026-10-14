import pytest

from radar import config, scoring, verdicts
from radar.normalize import Statement, normalize


def raw_record(id=1, verdict="Vero", politico=True, articolo=None, slug="una-dichiarazione"):
    acf = {"sentenza": "Il PIL &egrave; cresciuto del <b>2%</b>", "verdetto": {"testo": verdict, "in_breve": False},
           "data_della_dichiarazione": "7 ottobre", "link": "https://example.org/fonte"}
    if politico:
        acf["politico"] = {"ID": 135, "post_title": "Matteo Salvini", "post_name": "matteo-salvini",
                           "partito": "Lega", "image": {"url": "https://cdn.example/salvini.jpg"}}
    if articolo:
        acf["articolo"] = articolo
    return {"id": id, "date": "2026-10-08T14:07:01", "slug": slug, "title": {"rendered": "titolo"}, "acf": acf}


def statement(id=1, verdict="", context="", politician_id=135):
    return Statement(id=id, published="2024-01-01", claim="claim", claim_date="", claim_source_url=None,
                     fact_check_url="", politician_id=politician_id, verdict_text=verdict, context=context)


@pytest.mark.parametrize("text, key", [
    ("Vero", "vero"), ("Nì", "ni"), ("Ni", "ni"), ("C'eri quasi", "quasi"), ("C’eri quasi", "quasi"),
    ("Pinocchio andante", "pinocchio"), ("panzana pazzesca.", "panzana"),
    ("Il ministro ha ragione.", None), ("", None),
])
def test_label_from_text(text, key):
    assert verdicts.label_from_text(text) == key


def test_normalize_cleans_html_and_builds_urls():
    statements, politicians = normalize([
        raw_record(1),
        raw_record(2, articolo={"post_name": "salvini-monopattini", "post_title": "T", "post_content": "<p>lede</p>"}),
        raw_record(3, politico=False),
    ])
    assert statements[0].claim == "Il PIL è cresciuto del 2%"
    assert statements[0].fact_check_url == f"{config.SITE_BASE}/dichiarazioni/una-dichiarazione"
    assert statements[1].fact_check_url == f"{config.SITE_BASE}/articoli/salvini-monopattini"
    assert statements[1].context == "T lede"
    assert statements[2].politician_id is None
    assert politicians[135].party == "Lega" and politicians[135].slug == "matteo-salvini"


def test_resolve_prefers_fixed_label_then_cache_with_matching_hash():
    labelled = statement(1, verdict="Panzana pazzesca")
    sentence = statement(2, verdict="Il ministro sbaglia.")
    assert verdicts.resolve(labelled, {}) == ("panzana", "label")
    assert verdicts.resolve(sentence, {}) == (None, "missing")

    cache = {"2": {"rating": "pinocchio", "hash": verdicts.text_hash(sentence), "by": "test"}}
    assert verdicts.resolve(sentence, cache) == ("pinocchio", "test")

    # If the source text changes, the cached label no longer applies.
    edited = statement(2, verdict="Il ministro ha ragione.")
    assert verdicts.resolve(edited, cache) == (None, "missing")


def test_resolve_marks_unrateable_and_empty_statements():
    s = statement(3, verdict="Facebook")
    cache = {"3": {"rating": verdicts.UNRATED, "hash": verdicts.text_hash(s), "by": "test"}}
    assert verdicts.resolve(s, cache) == (None, "test")
    assert verdicts.resolve(statement(4), {}) == (None, "no_verdict")
    assert not verdicts.needs_llm(statement(4))
    assert not verdicts.needs_llm(statement(5, verdict="sbaglia", politician_id=None))


def test_single_statement_is_shrunk_toward_global_mean():
    one_false = [scoring.Rated(1, 1, "2024-01-01", "panzana")]
    summary = scoring.summarize(one_false, prior=0.6, prior_var=0.1)
    # (0 + 5 * 0.6) / (1 + 5) = 0.5, not 0
    assert summary["score"] == 50
    assert summary["raw_mean"] == 0
    assert summary["reliable"] is False
    assert summary["breakdown"]["panzana"] == 1


def test_many_statements_dominate_the_prior():
    rated = [scoring.Rated(i, 1, f"2024-01-{i:02d}", "vero") for i in range(1, 31)]
    summary = scoring.summarize(rated, prior=0.5, prior_var=0.1)
    assert summary["score"] == round(100 * (30 + 2.5) / 35)
    assert summary["reliable"] is True
    assert (summary["first_date"], summary["last_date"]) == ("2024-01-01", "2024-01-30")


def test_parties_exclude_non_parties_and_count_members():
    rated = [scoring.Rated(1, 10, "2024-01-01", "vero"), scoring.Rated(2, 11, "2024-01-01", "ni"),
             scoring.Rated(3, 12, "2024-01-01", "ni")]
    parties = scoring.by_party(rated, {10: "Lega", 11: "Lega", 12: "Tecnico"}, prior=0.5, prior_var=0.1)
    assert set(parties) == {"Lega"}
    assert parties["Lega"]["politicians"] == 2 and parties["Lega"]["rated"] == 2


def test_slugify():
    assert scoring.slugify("Fratelli d'Italia") == "fratelli-d-italia"
    assert scoring.slugify("Più Europa") == "piu-europa"


class FakeResponse:
    def __init__(self, status, payload=None, headers=None):
        self.status_code, self._payload, self.headers = status, payload, headers or {}

    def json(self):
        return self._payload

    def raise_for_status(self):
        if self.status_code >= 400:
            raise RuntimeError(self.status_code)


class FakeSession:
    def __init__(self, responses):
        self.responses, self.headers, self.bodies = list(responses), {}, []

    def post(self, url, json, timeout):
        self.bodies.append(json)
        return self.responses.pop(0)


def test_groq_rater_waits_out_rate_limits(monkeypatch):
    monkeypatch.setattr(verdicts.time, "sleep", lambda s: None)
    content = '{"ratings": [{"id": 1, "rating": "ni"}]}'
    session = FakeSession([
        FakeResponse(429, headers={"retry-after": "1"}),
        FakeResponse(200, {"choices": [{"message": {"content": content}}]}),
    ])
    rater = verdicts.GroqRater("key", model="test-model", session=session)
    assert rater.rate([statement(1, verdict="esagera")]) == [{"id": 1, "rating": "ni"}]
    assert session.headers["Authorization"] == "Bearer key"
    assert session.bodies[0]["response_format"]["json_schema"]["strict"] is True


def test_classify_keeps_only_valid_ratings_for_requested_ids(monkeypatch, tmp_path):
    monkeypatch.setattr(config, "LABELS_FILE", tmp_path / "labels.json")

    class Rater:
        model, batch_size = "fake", 10

        def rate(self, batch):
            return [{"id": 1, "rating": "vero"}, {"id": 2, "rating": "maybe"}, {"id": 99, "rating": "vero"}]

    labels = {}
    added = verdicts.classify_with_llm([statement(1, verdict="ha ragione"), statement(2, verdict="boh")], labels, Rater())
    assert added == 1
    assert labels["1"]["rating"] == "vero" and labels["1"]["by"] == "fake"
    assert "2" not in labels and "99" not in labels


def test_classify_without_any_key_does_nothing(monkeypatch):
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    assert verdicts.classify_with_llm([statement(1, verdict="sbaglia")], {}) == 0


def test_interval_narrows_with_more_statements():
    few = scoring.summarize([scoring.Rated(i, 1, "2024-01-01", "ni") for i in range(5)], prior=0.5, prior_var=0.1)
    many = scoring.summarize([scoring.Rated(i, 1, "2024-01-01", "ni") for i in range(200)], prior=0.5, prior_var=0.1)
    assert few["score_low"] <= few["score"] <= few["score_high"]
    assert (many["score_high"] - many["score_low"]) < (few["score_high"] - few["score_low"])


def test_agreement_counts_exact_and_adjacent_matches():
    from radar.evaluate import agreement
    result = agreement([("vero", "vero"), ("vero", "quasi"), ("vero", "panzana"), ("ni", "non_valutabile")])
    assert result["sample"] == 4
    assert result["exact"] == 0.25
    assert result["withinOneStep"] == 0.5
    assert result["topDisagreements"]["vero->quasi"] == 1


def test_logo_credit_cleanup():
    from radar.logos import _clean
    assert _clean('Cesare Priori <sup>[1]</sup>[2]; Vectorization: <a href="x">Actam</a>') == "Cesare Priori ; Vectorization: Actam"
    assert _clean(None) == ""
