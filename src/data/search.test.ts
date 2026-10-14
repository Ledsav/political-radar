import {fold, resultPath, search} from './search';
import {Party, Politician} from './types';

const stats = {rated: 10, breakdown: {vero: 2, quasi: 2, ni: 2, pinocchio: 2, panzana: 2}, raw_mean: 0.5, score: 50,
    reliable: true, first_date: '2020-01-01', last_date: '2024-01-01'};
const politicians: Politician[] = [
    {...stats, id: 'nicola-fratoianni', name: 'Nicola Fratoianni', party: 'Sinistra italiana', partySlug: 'sinistra-italiana', image: null},
    {...stats, id: 'matteo-salvini', name: 'Matteo Salvini', party: 'Lega', partySlug: 'lega', image: null},
    {...stats, id: 'matteo-renzi', name: 'Matteo Renzi', party: 'Italia Viva', partySlug: 'italia-viva', image: null},
];
const parties: Party[] = [{...stats, id: 'piu-europa', name: 'Più Europa', politicians: 3}];

test('fold strips accents and case', () => {
    expect(fold('  Più Europa ')).toBe('piu europa');
});

test('matches every word, ignoring accents', () => {
    expect(search('matteo', politicians, parties).map((r) => r.id)).toEqual(['matteo-salvini', 'matteo-renzi']);
    expect(search('matteo sal', politicians, parties).map((r) => r.id)).toEqual(['matteo-salvini']);
    expect(search('piu', politicians, parties)).toEqual([{kind: 'party', id: 'piu-europa', name: 'Più Europa', detail: '3 politici'}]);
});

test('finds politicians by party and ranks name-prefix matches first', () => {
    expect(search('lega', politicians, parties).map((r) => r.id)).toEqual(['matteo-salvini']);
    expect(search('ni', politicians, parties)[0].id).toBe('nicola-fratoianni');
});

test('empty query returns nothing', () => {
    expect(search('   ', politicians, parties)).toEqual([]);
});

test('result paths', () => {
    expect(resultPath({kind: 'politician', id: 'matteo-renzi', name: '', detail: null})).toBe('/politicians/matteo-renzi');
    expect(resultPath({kind: 'party', id: 'lega', name: '', detail: null})).toBe('/parties/lega');
});
