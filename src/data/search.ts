import {Party, Politician} from './types';

export type SearchResult =
    | {kind: 'politician'; id: string; name: string; detail: string | null}
    | {kind: 'party'; id: string; name: string; detail: string | null};

export function fold(text: string): string {
    return text.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

// Matches every word of the query against the name (or party), accent- and
// case-insensitively. Names that start with the query rank first.
export function search(query: string, politicians: Politician[], parties: Party[], limit = 10): SearchResult[] {
    const words = fold(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    const candidates: SearchResult[] = [
        ...parties.map((p) => ({kind: 'party' as const, id: p.id, name: p.name, detail: `${p.politicians} politici`})),
        ...politicians.map((p) => ({kind: 'politician' as const, id: p.id, name: p.name, detail: p.party})),
    ];

    return candidates
        .map((c) => ({c, haystack: fold(`${c.name} ${c.kind === 'politician' ? c.detail ?? '' : ''}`)}))
        .filter(({haystack}) => words.every((w) => haystack.includes(w)))
        .sort((a, b) => Number(!fold(a.c.name).startsWith(words[0])) - Number(!fold(b.c.name).startsWith(words[0])))
        .slice(0, limit)
        .map(({c}) => c);
}

export function resultPath(result: SearchResult): string {
    return result.kind === 'politician' ? `/politicians/${result.id}` : `/parties/${result.id}`;
}
