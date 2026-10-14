import {Party, Politician} from './types';
import {assetUrl} from './api';

export interface SearchResult {
    kind: 'politician' | 'party';
    id: string;
    name: string;
    detail: string | null;
    image: string | null;
    score: number;
    reliable: boolean;
    rated: number;
}

export function fold(text: string): string {
    return text.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function toCandidates(politicians: Politician[], parties: Party[]): SearchResult[] {
    const stats = (s: Politician | Party) => ({score: s.score, reliable: s.reliable, rated: s.rated});
    return [
        ...politicians.map((p) => ({kind: 'politician' as const, id: p.id, name: p.name, detail: p.party, image: p.image, ...stats(p)})),
        ...parties.map((p) => ({kind: 'party' as const, id: p.id, name: p.name, detail: `${p.politicians} politici`,
            image: p.logo ? assetUrl(p.logo.path) : null, ...stats(p)})),
    ];
}

// Matches every word of the query against the name (and, for politicians, the
// party), accent- and case-insensitively. Names that start with the query rank
// first, then the most-verified. Results come grouped: politicians, then parties.
export function rank(query: string, candidates: SearchResult[], limit = 10): SearchResult[] {
    const words = fold(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    const startsWith = (c: SearchResult) => fold(c.name).split(/\s+/).some((part) => part.startsWith(words[0]));

    const matches = candidates
        .filter((c) => {
            const haystack = fold(`${c.name} ${c.kind === 'politician' ? c.detail ?? '' : ''}`);
            return words.every((w) => haystack.includes(w));
        })
        .sort((a, b) => Number(startsWith(b)) - Number(startsWith(a)) || b.rated - a.rated)
        .slice(0, limit);
    return [...matches.filter((m) => m.kind === 'politician'), ...matches.filter((m) => m.kind === 'party')];
}

export function search(query: string, politicians: Politician[], parties: Party[], limit = 10): SearchResult[] {
    return rank(query, toCandidates(politicians, parties), limit);
}

// Splits text into [plain, matched, plain, ...] parts for highlighting the
// query's words, comparing folded characters so "piu" highlights "Più".
export function highlight(text: string, query: string): {text: string; match: boolean}[] {
    const words = fold(query).split(/\s+/).filter(Boolean);
    const chars = [...text];
    const folded = chars.map((c) => fold(c) || c);
    const hit = new Array(chars.length).fill(false);
    const joined = folded.join('');
    // Map positions in the joined folded string back to character indexes.
    const owner: number[] = folded.flatMap((f, i) => Array(f.length).fill(i));
    for (const w of words) {
        for (let at = joined.indexOf(w); at !== -1; at = joined.indexOf(w, at + 1)) {
            for (let k = at; k < at + w.length; k++) hit[owner[k]] = true;
        }
    }
    const parts: {text: string; match: boolean}[] = [];
    chars.forEach((c, i) => {
        const last = parts[parts.length - 1];
        if (last && last.match === hit[i]) last.text += c;
        else parts.push({text: c, match: hit[i]});
    });
    return parts;
}

export function resultPath(result: Pick<SearchResult, 'kind' | 'id'>): string {
    return result.kind === 'politician' ? `/politicians/${result.id}` : `/parties/${result.id}`;
}
