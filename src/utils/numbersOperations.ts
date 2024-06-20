export function mapCredibilityScore(score: number): number {
    return Math.trunc(((score + 1) / 2) * 100);
}
