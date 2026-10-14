import {fold, highlight, resultPath, search} from './search';
import {Party, Politician} from './types';

const stats = {breakdown: {vero: 2, quasi: 2, ni: 2, pinocchio: 2, panzana: 2}, raw_mean: 0.5, score: 50, score_low: 40, score_high: 60,
    reliable: true, first_date: '2020-01-01', last_date: '2024-01-01'};
const politicians: Politician[] = [
    {...stats, rated: 10, id: 'nicola-fratoianni', name: 'Nicola Fratoianni', party: 'Sinistra italiana', partySlug: 'sinistra-italiana', image: null},
    {...stats, rated: 165, id: 'matteo-salvini', name: 'Matteo Salvini', party: 'Lega', partySlug: 'lega', image: 'salvini.jpg'},
    {...stats, rated: 72, id: 'matteo-renzi', name: 'Matteo Renzi', party: 'Italia Viva', partySlug: 'italia-viva', image: null},
];
const parties: Party[] = [
    {...stats, rated: 6, id: 'piu-europa', name: 'Più Europa', politicians: 3, logo: {path: 'logos/piu-europa.png', author: '', license: '', source: ''}},
    {...stats, rated: 240, id: 'lega', name: 'Lega', politicians: 39, logo: null},
];

test('fold strips accents and case', () => {
    expect(fold('  Più Europa ')).toBe('piu europa');
});

test('matches every word, ignoring accents, most-verified first', () => {
    expect(search('matteo', politicians, parties).map((r) => r.id)).toEqual(['matteo-salvini', 'matteo-renzi']);
    expect(search('matteo sal', politicians, parties).map((r) => r.id)).toEqual(['matteo-salvini']);
    const [piu] = search('piu', politicians, parties);
    expect(piu).toMatchObject({kind: 'party', id: 'piu-europa', detail: '3 politici', image: '/logos/piu-europa.png'});
});

test('groups politicians before parties and finds politicians by party', () => {
    expect(search('lega', politicians, parties).map((r) => `${r.kind}:${r.id}`)).toEqual(['politician:matteo-salvini', 'party:lega']);
});

test('ranks matches at the start of a word first', () => {
    expect(search('ni', politicians, parties)[0].id).toBe('nicola-fratoianni');
});

test('empty query returns nothing', () => {
    expect(search('   ', politicians, parties)).toEqual([]);
});

test('highlight marks matched characters, accent-insensitively', () => {
    expect(highlight('Più Europa', 'piu')).toEqual([{text: 'Più', match: true}, {text: ' Europa', match: false}]);
    expect(highlight('Matteo Salvini', 'sal mat')).toEqual([
        {text: 'Mat', match: true}, {text: 'teo ', match: false}, {text: 'Sal', match: true}, {text: 'vini', match: false},
    ]);
});

test('result paths', () => {
    expect(resultPath({kind: 'politician', id: 'matteo-renzi'})).toBe('/politicians/matteo-renzi');
    expect(resultPath({kind: 'party', id: 'lega'})).toBe('/parties/lega');
});
