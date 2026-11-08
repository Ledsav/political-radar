import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Button, Link, Typography} from '@mui/material';
import Layout from '../components/shared/Layout';
import {loadMeta} from '../data/api';
import {useData} from '../data/useData';
import {projectMeta} from '../seo/meta';
import {SOURCES, Status, SURVEY_DATE} from '../data/sources';
import {useDocumentMeta} from '../seo/useDocumentMeta';

const ISSUES_URL = 'https://github.com/Ledsav/political-radar/issues/new';
const REPO_URL = 'https://github.com/Ledsav/political-radar';

const STATUS_STYLE: Record<Status, {label: string; bg: string; color: string}> = {
    usata: {label: 'IN USO', bg: '#abfb73', color: '#000'},
    candidata: {label: 'DA VALUTARE', bg: '#fff3b0', color: '#000'},
    'non indipendente': {label: 'NON INDIPENDENTE', bg: '#e0e0e0', color: '#000'},
    'solo bufale': {label: 'SOLO BUFALE', bg: '#e0e0e0', color: '#000'},
    ferma: {label: 'FERMA', bg: '#e0e0e0', color: '#000'},
    nessuna: {label: 'NESSUNA VERIFICA', bg: '#000', color: '#fff'},
};

const Section: React.FC<{title: string; children: React.ReactNode; tint?: boolean}> = ({title, children, tint}) => (
    <Box component="section" sx={{borderTop: '2px solid black', bgcolor: tint ? 'rgba(171, 251, 115, 0.18)' : 'transparent'}}>
        <Box sx={{p: {xs: 2, sm: 3}, maxWidth: 900}}>
            <Typography variant="h2" component="h2" sx={{mb: 2, fontWeight: 'bold'}}>{title}</Typography>
            {children}
        </Box>
    </Box>
);

const P: React.FC<{children: React.ReactNode}> = ({children}) => (
    <Typography variant="body1" sx={{mb: 1.5, fontSize: '1.05rem', lineHeight: 1.6}}>{children}</Typography>
);

const Ext: React.FC<{href: string; children: React.ReactNode}> = ({href, children}) => (
    <Link href={href} target="_blank" rel="noopener" color="inherit" underline="always">{children}</Link>
);

const Stat: React.FC<{value: string; label: string}> = ({value, label}) => (
    <Box sx={{border: '1px solid black', bgcolor: 'white', p: 2, flex: '1 1 160px'}}>
        <Typography variant="h1" component="p" sx={{fontWeight: 'bold', lineHeight: 1}}>{value}</Typography>
        <Typography variant="body2">{label}</Typography>
    </Box>
);

const Step: React.FC<{n: number; title: string; children: React.ReactNode}> = ({n, title, children}) => (
    <Box sx={{border: '1px solid black', p: 2, flex: '1 1 240px', bgcolor: 'white'}}>
        <Typography variant="h1" component="p" sx={{fontWeight: 'bold', lineHeight: 1, mb: 1}}>{n}</Typography>
        <Typography variant="h6" component="h3" sx={{fontWeight: 'bold', mb: 0.5}}>{title}</Typography>
        <Typography variant="body2" sx={{lineHeight: 1.5}}>{children}</Typography>
    </Box>
);

const Project: React.FC = () => {
    const {data: meta} = useData(loadMeta);
    useDocumentMeta(projectMeta());
    const n = (x: number) => x.toLocaleString('it-IT');

    return (
        <Layout>
            {/* Hero */}
            <Box sx={{bgcolor: 'primary.main', borderBottom: '2px solid black', p: {xs: 2, sm: 4}}}>
                <Typography variant="h1" sx={{fontWeight: 'bold', fontSize: {xs: '2.5rem', sm: '4rem'}, lineHeight: 1.05, maxWidth: 900}}>
                    QUANTO SONO VERE LE PAROLE DEI POLITICI?
                </Typography>
                <Typography variant="h6" component="p" sx={{mt: 2, maxWidth: 720, fontWeight: 400}}>
                    Radar Politico raccoglie le verifiche dei fact-checker e le riassume per politico e per partito,
                    con un margine di errore e il link a ogni articolo originale. E dice apertamente cosa ancora manca.
                </Typography>
                <Box sx={{mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap'}}>
                    <Button component={RouterLink} to="/politicians" variant="contained" disableElevation
                            sx={{bgcolor: 'black', color: 'white', '&:hover': {bgcolor: '#333'}}}>
                        Esplora i politici
                    </Button>
                    <Button component={RouterLink} to="/metodo" variant="outlined" sx={{bgcolor: 'white'}}>
                        Come si calcola il punteggio
                    </Button>
                </Box>
                {meta && (
                    <Box sx={{mt: 4, display: 'flex', gap: 1.5, flexWrap: 'wrap', maxWidth: 900}}>
                        <Stat value={n(meta.counts.rated)} label="dichiarazioni con un verdetto"/>
                        <Stat value={n(meta.counts.politicians)} label="politici"/>
                        <Stat value={n(meta.counts.parties)} label="partiti"/>
                        <Stat value="1" label="fonte di verifiche"/>
                    </Box>
                )}
            </Box>

            <Section title="L'IDEA">
                <P>
                    Ogni settimana i politici fanno affermazioni su tasse, migranti, lavoro, sanità. Qualcuno le verifica,
                    ma i verdetti restano sparsi in migliaia di articoli. Radar Politico li mette in fila: per ogni politico e
                    per ogni partito mostra quante dichiarazioni sono state verificate e com'è andata.
                </P>
                <P>
                    Non verifichiamo nulla da soli e non diamo giudizi sulle persone. Riportiamo i verdetti di chi fa questo
                    lavoro di mestiere, rimandiamo sempre all'articolo originale e pubblichiamo dati e codice, così chiunque
                    può controllare.
                </P>
            </Section>

            <Section title="COME FUNZIONA" tint>
                <Box sx={{display: 'flex', gap: 1.5, flexWrap: 'wrap'}}>
                    <Step n={1} title="Raccogliamo i verdetti">
                        Ogni lunedì scarichiamo le nuove verifiche pubblicate da Pagella Politica.
                    </Step>
                    <Step n={2} title="Li mettiamo sulla stessa scala">
                        Da «Vero» a «Panzana pazzesca». Quando il verdetto è una frase, un modello linguistico lo riconduce
                        alla scala, e ogni classificazione resta consultabile.
                    </Step>
                    <Step n={3} title="Calcoliamo un punteggio prudente">
                        Una media da 0 a 100 con un margine di errore. Sotto le cinque verifiche non mostriamo nessun numero.
                    </Step>
                </Box>
                <Typography variant="body2" sx={{mt: 2}}>
                    I dettagli, compresi i limiti di accuratezza, sono nella pagina{' '}
                    <Link component={RouterLink} to="/metodo" color="inherit" underline="always">Come funziona</Link>.
                </Typography>
            </Section>

            <Section title="IL PROBLEMA: UNA SOLA FONTE">
                <P>
                    Un radar più democratico dovrebbe incrociare verifiche di redazioni diverse, con sensibilità diverse.
                    Lo abbiamo cercato. A {SURVEY_DATE} abbiamo passato in rassegna i fact-checker italiani riconosciuti dalle
                    reti internazionali (IFCN ed EFCSN), le rubriche dei quotidiani e l'archivio di Google che raccoglie le
                    verifiche pubblicate in tutto il mondo.
                </P>
                <P>
                    Il risultato: su circa 1.500 verifiche in italiano dedicate ai politici più citati che compaiono
                    nell'archivio di Google, il 95% è di Pagella Politica. Il resto viene da rubriche ormai ferme o da poche
                    verifiche isolate. Oggi in Italia nessun'altra redazione indipendente verifica con regolarità le
                    dichiarazioni dei politici.
                </P>
                <Box sx={{display: 'grid', gap: 1.5, gridTemplateColumns: {xs: '1fr', md: '1fr 1fr'}, mt: 2}}>
                    {SOURCES.map((s) => {
                        const st = STATUS_STYLE[s.status];
                        return (
                            <Box key={s.name} sx={{border: '1px solid black', p: 2, bgcolor: 'white'}}>
                                <Box component="span" sx={{display: 'inline-block', px: 1, py: 0.25, mb: 1, border: '1px solid black',
                                    bgcolor: st.bg, color: st.color, fontFamily: 'Antonio, sans-serif', fontWeight: 700, letterSpacing: '0.04em'}}>
                                    {st.label}
                                </Box>
                                <Typography variant="h6" component="h3" sx={{fontWeight: 'bold', lineHeight: 1.25}}>
                                    {s.url ? <Ext href={s.url}>{s.name}</Ext> : s.name}
                                </Typography>
                                <Typography variant="body2" sx={{mt: 0.5, lineHeight: 1.5}}>{s.note}</Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Section>

            <Section title="DOVE SONO I FACT-CHECKER DI CENTRODESTRA?" tint>
                <P>
                    Non ci sono, almeno non nella forma che ci servirebbe. Le testate vicine al centrodestra pubblicano
                    commenti e inchieste, e spesso criticano il fact-checking altrui, ma nessuna assegna verdetti regolari
                    alle dichiarazioni dei politici con una scala dichiarata.
                </P>
                <P>
                    Questo conta. Con una sola fonte, i punteggi riflettono le scelte di una sola redazione: quali frasi
                    verificare, di chi, e quando. Non stiamo dicendo che quelle scelte siano di parte. Pagella Politica
                    segue un codice di principi internazionale e verifica politici di tutti gli schieramenti. Ma senza un
                    secondo punto di vista nessuno può misurarlo, nemmeno noi. La stessa Pagella Politica avverte che i suoi
                    dati{' '}
                    <Ext href="https://pagellapolitica.it/progetto">«non consentono, allo stato attuale, di paragonare i politici»</Ext>.
                </P>
                <P>
                    Non vogliamo inventare un equilibrio che non esiste, per esempio pesando a tavolino le fonti o aggiungendo
                    redazioni che non fanno verifiche. Preferiamo dirlo chiaramente.
                </P>
            </Section>

            <Section title="COSA FACCIAMO NEL FRATTEMPO">
                <Box component="ul" sx={{pl: 2.5, m: 0, '& li': {mb: 1, fontSize: '1.05rem', lineHeight: 1.6}}}>
                    <li><strong>Mostriamo il margine di errore</strong> accanto a ogni punteggio: due politici con margini sovrapposti non sono distinguibili.</li>
                    <li><strong>Mostriamo quante verifiche ci sono</strong>, e sotto le cinque non diamo un numero.</li>
                    <li><strong>Rimandiamo sempre all'articolo originale</strong>, così ogni verdetto si può leggere per intero.</li>
                    <li><strong>Pubblichiamo dati, classificazioni e codice</strong> su <Ext href={REPO_URL}>GitHub</Ext>: ogni etichetta si può controllare e correggere.</li>
                    <li><strong>Aggiungeremo altre fonti</strong> appena ne esisterà una indipendente e attiva, e mostreremo i verdetti di ciascuna separatamente, senza fonderli in un numero unico.</li>
                </Box>
            </Section>

            <Section title="CONOSCI UNA FONTE CHE CI È SFUGGITA?" tint>
                <P>
                    Se una redazione, di qualsiasi orientamento, verifica con regolarità le dichiarazioni dei politici e
                    pubblica un verdetto per ciascuna, vogliamo saperlo. Lo stesso vale se stai pensando di avviarne una.
                </P>
                <Button href={ISSUES_URL} target="_blank" rel="noopener" variant="contained" disableElevation
                        sx={{bgcolor: 'black', color: 'white', mt: 1, '&:hover': {bgcolor: '#333'}}}>
                    Segnala una fonte su GitHub
                </Button>
                <Typography variant="body2" sx={{mt: 2}}>Rassegna delle fonti aggiornata a {SURVEY_DATE}.</Typography>
            </Section>
        </Layout>
    );
};

export default Project;
