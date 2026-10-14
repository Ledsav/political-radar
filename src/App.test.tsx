import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import {AppRoutes} from './App';
import {clearCache} from './data/api';
import theme from './theme/theme';
import {Meta, Party, Politician, Statement} from './data/types';

const breakdown = {vero: 3, quasi: 1, ni: 1, pinocchio: 1, panzana: 0};
const base = {raw_mean: 0.75, first_date: '2021-03-01', last_date: '2024-05-01'};
const politicians: Politician[] = [
    {...base, id: 'matteo-salvini', name: 'Matteo Salvini', party: 'Lega', partySlug: 'lega', image: null,
        rated: 6, breakdown, score: 68, score_low: 60, score_high: 75, reliable: true},
    {...base, id: 'mario-rossi', name: 'Mario Rossi', party: 'Lega', partySlug: 'lega', image: null,
        rated: 1, breakdown: {vero: 0, quasi: 0, ni: 0, pinocchio: 0, panzana: 1}, score: 47, score_low: 30, score_high: 64, reliable: false},
];
const parties: Party[] = [{...base, id: 'lega', name: 'Lega', politicians: 2,
    logo: {path: 'logos/lega.png', author: 'Lega', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Lega.svg'}, rated: 7, breakdown, score: 62, score_low: 55, score_high: 69, reliable: true}];
const statements: Statement[] = [
    {id: 1, published: '2024-05-01', claim: 'Il PIL è cresciuto del 2%', claimDate: '1 maggio', claimSource: null,
        factCheck: 'https://pagellapolitica.it/articoli/pil', verdict: 'Il leader della Lega esagera.', rating: 'ni', ratedBy: 'llm'},
];
const meta = {
    generatedAt: '2026-10-14T12:00:00+00:00', source: {name: 'Pagella Politica', url: 'https://pagellapolitica.it'},
    scale: [], method: {globalMean: 0.57, shrinkage: 5, minStatements: 5, nonParties: ['Tecnico']},
    counts: {statements: 10, attributed: 8, rated: 7, ratedByLabel: 5, ratedByModel: 2, unrated: 1,
        awaitingClassification: 0, politicians: 2, parties: 1},
    accuracy: {medianIntervalWidth: 23, labelAgreement: null},
} as Meta;

const files: Record<string, unknown> = {
    'politicians.json': politicians,
    'parties.json': parties,
    'meta.json': meta,
    'statements/matteo-salvini.json': statements,
};

beforeEach(() => {
    clearCache();
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
        const path = url.replace(/^.*\/data\//, '');
        return path in files
            ? new Response(JSON.stringify(files[path]), {status: 200})
            : new Response('not found', {status: 404, statusText: 'Not Found'});
    }));
});

afterEach(() => vi.unstubAllGlobals());

function renderAt(path: string) {
    return render(
        <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={[path]}>
                <AppRoutes/>
            </MemoryRouter>
        </ThemeProvider>,
    );
}

test('a politician page works on a direct visit with nothing cached', async () => {
    renderAt('/politicians/matteo-salvini');
    expect(await screen.findByText('MATTEO SALVINI')).toBeInTheDocument();
    expect(screen.getByText('68')).toBeInTheDocument();
    expect(screen.getByText('margine: tra 60 e 75')).toBeInTheDocument();
    expect(await screen.findByText('«Il PIL è cresciuto del 2%»')).toBeInTheDocument();
    expect(screen.getByText('Leggi la verifica su Pagella Politica')).toHaveAttribute('href', 'https://pagellapolitica.it/articoli/pil');
});

test('a politician with too few statements shows no headline score', async () => {
    renderAt('/politicians/mario-rossi');
    expect(await screen.findByText('DATI INSUFFICIENTI')).toBeInTheDocument();
    expect(screen.getByText(/solo 1 dichiarazione verificata \(minimo 5\)/)).toBeInTheDocument();
});

test('unknown ids show a not-found message instead of crashing', async () => {
    renderAt('/politicians/nessuno');
    expect(await screen.findByText('Politico non trovato')).toBeInTheDocument();
});

test('a party page lists its members', async () => {
    renderAt('/parties/lega');
    expect(await screen.findByText('LEGA')).toBeInTheDocument();
    expect(screen.getByText('Matteo Salvini')).toBeInTheDocument();
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument();
    expect(screen.getByAltText('Lega')).toHaveAttribute('src', '/logos/lega.png');
    expect(screen.getByText(/Logo: Lega, Public domain, via/)).toBeInTheDocument();
});

test('the methodology page reports the counts from meta.json', async () => {
    renderAt('/metodo');
    expect(await screen.findByText(/Su 10 dichiarazioni pubblicate, 8 sono collegate/)).toBeInTheDocument();
    expect(screen.getByText(/il margine è di solito ampio circa 23 punti/)).toBeInTheDocument();
    expect(screen.getByText(/non è ancora stata misurata/)).toBeInTheDocument();
});

test('the home page lists politicians', async () => {
    renderAt('/');
    expect(await screen.findByText('Matteo Salvini')).toBeInTheDocument();
});

test('the search dropdown lists matches and opens the chosen page', async () => {
    renderAt('/');
    await screen.findAllByText('Matteo Salvini'); // data loaded
    const input = screen.getByRole('combobox', {name: 'Cerca un politico o un partito'});
    fireEvent.change(input, {target: {value: 'salv'}});
    expect(await screen.findByText('POLITICI', {selector: 'div'})).toBeInTheDocument();
    expect(screen.getByRole('option')).toHaveTextContent('Matteo SalviniLega68/1006 verifiche');
    fireEvent.keyDown(input, {key: 'Enter'});
    expect(await screen.findByText('MATTEO SALVINI')).toBeInTheDocument();
});

test('the search dropdown says when nothing matches', async () => {
    renderAt('/');
    await screen.findAllByText('Matteo Salvini');
    const input = screen.getByRole('combobox', {name: 'Cerca un politico o un partito'});
    fireEvent.change(input, {target: {value: 'zzz'}});
    expect(await screen.findByText('Nessun politico o partito trovato per «zzz»')).toBeInTheDocument();
});
