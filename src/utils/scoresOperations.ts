import {getItemsByCollection, setItems} from './indexedDb';

interface ScoreReferences {
    maxControversyScore: number;
    avgActivityScore: number;
    stdActivityScore: number;
}

const SCORE_REFERENCES_COLLECTION = 'scoreReferences';

export async function updateScoreReferences(entries: any[], collectionName: string): Promise<void> {
    const controversyScores = entries.map(p => p.controversy_score);
    const activityScores = entries.map(p => p.activity_score);

    const maxControversyScore = Math.max(...controversyScores);
    const avgActivityScore = activityScores.reduce((sum, score) => sum + score, 0) / activityScores.length;
    const stdActivityScore = Math.sqrt(
        activityScores.reduce((sum, score) => sum + Math.pow(score - avgActivityScore, 2), 0) / activityScores.length
    );

    const scoreReferences: ScoreReferences = {
        maxControversyScore,
        avgActivityScore,
        stdActivityScore,
    };

    const scoreCollection = SCORE_REFERENCES_COLLECTION + collectionName;

    await setItems(scoreCollection, [scoreReferences]);
}

export async function getScoreReferences(collectionName: string): Promise<ScoreReferences> {
    const scoreCollection = SCORE_REFERENCES_COLLECTION + collectionName;
    const cachedReferences = await getItemsByCollection<ScoreReferences>(scoreCollection);
    if (cachedReferences.length > 0) {
        console.log('ref:', cachedReferences[0])
        return cachedReferences[0];
    }
    throw new Error('Score references not found. Please update score references first.');
}

export function mapCredibilityScore(score: number): number {
    return Math.trunc(((score + 1) / 2) * 100);
}

export function mapOverallScore(score: number): number {
    return Math.trunc(score * 100);
}

export function mapActivityScore(score: number, avgScore: number, stdScore: number): number {
    const zScore = (score - avgScore) / stdScore;
    const normalizedScore = (zScore + 3) / 6;
    return Math.trunc(Math.min(Math.max(normalizedScore * 100, 0), 100));
}

export function mapControversyScore(score: number, maxScore: number): number {
    const controversy = Math.trunc((score / maxScore) * 100);
    console.log('result: ', controversy)
    return controversy;
}