import {Breakdown, RatingKey} from './types';

// Diverging scale: blue for true, red for false, grey for the "Nì" midpoint.
// Checked with the dataviz palette validator against a white surface (adjacent
// CVD ΔE ≥ 19). The pale steps sit below 3:1 contrast, so bars get a black
// outline and counts are always shown as text alongside them.
export const RATINGS: {key: RatingKey; label: string; color: string}[] = [
    {key: 'vero', label: 'Vero', color: '#184f95'},
    {key: 'quasi', label: "C'eri quasi", color: '#5598e7'},
    {key: 'ni', label: 'Nì', color: '#e4e3de'},
    {key: 'pinocchio', label: 'Pinocchio andante', color: '#e66767'},
    {key: 'panzana', label: 'Panzana pazzesca', color: '#a32121'},
];

export const RATING_BY_KEY = Object.fromEntries(RATINGS.map((r) => [r.key, r])) as Record<RatingKey, (typeof RATINGS)[number]>;

export function breakdownTotal(breakdown: Breakdown): number {
    return RATINGS.reduce((sum, r) => sum + breakdown[r.key], 0);
}

export function formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(`${iso}T00:00:00`).toLocaleDateString('it-IT', {year: 'numeric', month: 'long', day: 'numeric'});
}
