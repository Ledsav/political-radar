// Page titles and descriptions, shared by the app (useDocumentMeta) and the
// build-time pre-renderer (scripts/prerender.ts) so both always agree.
import {Party, Politician, Stats} from '../data/types';
import {RATINGS} from '../data/ratings';

export const SITE_NAME = 'Radar Politico';
export const SITE_DESCRIPTION =
    'Quanto sono attendibili i politici italiani? Le verifiche di Pagella Politica riassunte per politico e per partito, con margine di errore.';

export interface PageMeta {
    title: string;
    description: string;
    /** Path relative to the site root, without a leading slash ('' for home). */
    path: string;
    noindex?: boolean;
    breadcrumb?: {name: string; path: string}[];
}

const withSite = (title: string) => `${title} | ${SITE_NAME}`;

function scoreSentence(s: Stats): string {
    const breakdown = RATINGS.filter((r) => s.breakdown[r.key] > 0).map((r) => `${s.breakdown[r.key]} ${r.label}`).join(', ');
    const score = s.reliable
        ? `Attendibilità ${s.score}/100 (margine ${s.score_low}–${s.score_high})`
        : 'Dati insufficienti per un punteggio';
    return `${score}. Verdetti: ${breakdown}.`;
}

export const homeMeta = (): PageMeta => ({
    title: `${SITE_NAME}: quanto sono attendibili i politici italiani`,
    description: SITE_DESCRIPTION,
    path: '',
});

export const politiciansMeta = (count: number): PageMeta => ({
    title: withSite('Politici'),
    description: `${count} politici italiani con dichiarazioni verificate da Pagella Politica: verdetti, punteggi e margini di errore.`,
    path: 'politicians/',
});

export const partiesMeta = (count: number): PageMeta => ({
    title: withSite('Partiti'),
    description: `${count} partiti italiani: le verifiche di Pagella Politica sui loro esponenti, sommate.`,
    path: 'parties/',
});

export const methodMeta = (): PageMeta => ({
    title: withSite('Come funziona'),
    description: 'Da dove vengono i dati, come si calcola il punteggio di attendibilità e quanto è accurato.',
    path: 'metodo',
});

export const politicianMeta = (p: Politician): PageMeta => ({
    title: withSite(`${p.name}${p.party ? ` (${p.party})` : ''}`),
    description: `${p.name}: ${p.rated} ${p.rated === 1 ? 'dichiarazione verificata' : 'dichiarazioni verificate'} da Pagella Politica. ${scoreSentence(p)}`,
    path: `politicians/${p.id}`,
    breadcrumb: [{name: 'Politici', path: 'politicians/'}, {name: p.name, path: `politicians/${p.id}`}],
});

export const partyMeta = (p: Party): PageMeta => ({
    title: withSite(p.name),
    description: `${p.name}: ${p.rated} dichiarazioni dei suoi ${p.politicians} esponenti verificate da Pagella Politica. ${scoreSentence(p)}`,
    path: `parties/${p.id}`,
    breadcrumb: [{name: 'Partiti', path: 'parties/'}, {name: p.name, path: `parties/${p.id}`}],
});

export const notFoundMeta = (path = ''): PageMeta => ({
    title: withSite('Pagina non trovata'),
    description: 'Questa pagina non esiste.',
    path,
    noindex: true,
});
