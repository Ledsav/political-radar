// Fact-checking sources reviewed for /progetto. Shared with scripts/prerender.ts.
/** When the source survey below was last done. Update it together with SOURCES. */
export const SURVEY_DATE = 'novembre 2026';
export type Status = 'usata' | 'candidata' | 'non indipendente' | 'solo bufale' | 'ferma' | 'nessuna';

export interface Source {
    name: string;
    url?: string;
    status: Status;
    note: string;
}

export const SOURCES: Source[] = [
    {name: 'Pagella Politica', url: 'https://pagellapolitica.it', status: 'usata',
        note: 'Verifica le dichiarazioni dei politici dal 2012, con una scala a cinque livelli. È la fonte di ogni punteggio.'},
    {name: 'Lavoce.info', url: 'https://lavoce.info', status: 'candidata',
        note: 'Economisti che verificano dichiarazioni di politici sui conti pubblici. Circa 120 verifiche, quasi tutte fino al 2022: utile come seconda opinione sul passato.'},
    {name: 'Facta', url: 'https://facta.news', status: 'non indipendente',
        note: 'Stessa proprietà e stessa direzione di Pagella Politica, e si occupa soprattutto di disinformazione online.'},
    {name: 'Open – Fact-checking', url: 'https://www.open.online/c/fact-checking/', status: 'solo bufale',
        note: 'Attiva e indipendente da Pagella Politica, ma verifica quasi solo contenuti virali, immagini false e bufale, raramente dichiarazioni di politici.'},
    {name: 'ANSA Verified, Butac, Bufale.net', status: 'solo bufale',
        note: 'Smentiscono notizie false, soprattutto su salute, scienza e social. Non danno verdetti sulle dichiarazioni dei politici.'},
    {name: 'AGI, La Stampa, Repubblica, Sky TG24', status: 'ferma',
        note: 'Hanno avuto rubriche di verifica, soprattutto intorno alle elezioni del 2018. Oggi non risultano attive.'},
    {name: 'Il Giornale, Libero, Il Tempo, La Verità, Il Foglio, Nicola Porro, Atlantico Quotidiano', status: 'nessuna',
        note: 'Abbiamo cercato rubriche di verifica nelle testate di centrodestra: nessuna pubblica verdetti sistematici sulle dichiarazioni dei politici.'},
];
