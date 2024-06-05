export interface FactCheckingItem {
    id: string;
    author: string;
    party: string;
    score: number;
    date: string;
    [key: string]: any;
}

export interface AverageScore {
    author?: string;
    party: string;
    average_score: number;
    count: number;
}
