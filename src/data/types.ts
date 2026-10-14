// Shapes of the JSON files written by pipeline/radar/export.py.

export type RatingKey = 'vero' | 'quasi' | 'ni' | 'pinocchio' | 'panzana';

export type Breakdown = Record<RatingKey, number>;

export interface Stats {
    rated: number;
    breakdown: Breakdown;
    raw_mean: number | null;
    score: number;
    score_low: number; // approximate 90% interval
    score_high: number;
    reliable: boolean;
    first_date: string | null;
    last_date: string | null;
}

export interface Politician extends Stats {
    id: string;
    name: string;
    party: string | null;
    partySlug: string | null;
    image: string | null;
}

export interface Party extends Stats {
    id: string;
    name: string;
    politicians: number;
}

export interface Statement {
    id: number;
    published: string;
    claim: string;
    claimDate: string;
    claimSource: string | null;
    factCheck: string;
    verdict: string | null;
    rating: RatingKey | null;
    ratedBy: string | null;
}

export interface Meta {
    generatedAt: string;
    source: {name: string; url: string};
    scale: {key: RatingKey; label: string; value: number}[];
    method: {globalMean: number; shrinkage: number; minStatements: number; nonParties: string[]};
    counts: {
        statements: number;
        attributed: number;
        rated: number;
        ratedByLabel: number;
        ratedByModel: number;
        unrated: number;
        awaitingClassification: number;
        politicians: number;
        parties: number;
    };
    accuracy: {
        medianIntervalWidth: number | null;
        labelAgreement: LabelAgreement | null;
    };
}

export interface LabelAgreement {
    evaluatedAt: string;
    candidate: string;
    reference: Record<string, number>;
    sample: number;
    exact: number;
    withinOneStep: number;
    topDisagreements: Record<string, number>;
}
