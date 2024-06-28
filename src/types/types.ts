// src/types/types.ts

export interface BaseItem {
    id: string;
    average_score: number;
    count: number;
    first_date: string | { seconds: number, nanoseconds: number };
    last_date: string | { seconds: number, nanoseconds: number };
    sources: string;
    timestamp?: number;
    overall_score: number;
    activity_score: number;
    controversy_score: number;
    orientation: string;
    top_topics: { [key: string]: number };
    normalized_avg_score: number;
    sentiment_avg: number;
    statement_length_avg: number;
    statements_per_day: number;
}

export interface Politician extends BaseItem {
    author: string;
    party: string;
    author_image: string;
    center_ratio: number | null;
    left_ratio: number | null;
    right_ratio: number | null;
    days_active: number;
}

export interface Party extends BaseItem {
    party: string;
    party_image: string;
    days_active: number;
}

export const isPolitician = (item: SearchableItem): item is Politician => {
    return 'author' in item;
};

export const isParty = (item: SearchableItem): item is Party => {
    return 'party' in item && !('author' in item);
};

export type SearchableItem = Politician | Party;