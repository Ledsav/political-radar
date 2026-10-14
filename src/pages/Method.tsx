import React from 'react';
import {Box, Link, Typography} from '@mui/material';
import Layout from '../components/shared/Layout';
import {ErrorMessage, Loading} from '../components/shared/Status';
import {loadMeta} from '../data/api';
import {useData} from '../data/useData';
import {RATINGS} from '../data/ratings';

const H: React.FC<{children: React.ReactNode}> = ({children}) => (
    <Typography variant="h2" component="h2" sx={{mt: 5, mb: 1.5}}>{children}</Typography>
);
const P: React.FC<{children: React.ReactNode}> = ({children}) => (
    <Typography variant="body1" sx={{mb: 1.5}}>{children}</Typography>
);

const Method: React.FC = () => {
    const {data: meta, loading, error} = useData(loadMeta);

    return (
        <Layout>
            <Box sx={{p: 3, maxWidth: 820}}>
                <Typography variant="h1" sx={{fontWeight: 'bold'}}>COME FUNZIONA</Typography>
                {loading && <Loading/>}
                {error && <ErrorMessage message={error}/>}
                {meta && (
                    <>
                        <H>DA DOVE VENGONO I DATI</H>
                        <P>
                            Ogni verifica è di{' '}
                            <Link href={meta.source.url} target="_blank" rel="noopener" color="inherit" underline="always">{meta.source.name}</Link>,
                            che dal 2012 controlla le dichiarazioni dei politici italiani. Radar Politico non verifica nulla
                            da solo: raccoglie i verdetti pubblicati, li riassume e rimanda sempre all'articolo originale.
                        </P>
                        <P>
                            Su {meta.counts.statements.toLocaleString('it-IT')} dichiarazioni pubblicate,{' '}
                            {meta.counts.attributed.toLocaleString('it-IT')} sono collegate a un politico nei dati di Pagella Politica.
                            Le altre, quasi tutte tra il 2012 e il 2019, non indicano chi ha parlato e restano escluse.
                        </P>

                        <H>LA SCALA</H>
                        <P>Usiamo la scala di Pagella Politica, dalla più vera alla più falsa:</P>
                        <Box component="ul" sx={{mb: 2}}>
                            {RATINGS.map((r) => {
                                const value = meta.scale.find((s) => s.key === r.key)?.value ?? 0;
                                return (
                                    <Box component="li" key={r.key} sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 0.5}}>
                                        <Box sx={{width: 14, height: 14, bgcolor: r.color, border: '1px solid black'}}/>
                                        <Typography variant="body1"><strong>{r.label}</strong> — vale {Math.round(value * 100)} punti</Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                        <P>
                            Fino al 2021 Pagella Politica assegnava direttamente una di queste etichette
                            ({meta.counts.ratedByLabel.toLocaleString('it-IT')} dichiarazioni). Da allora pubblica un verdetto
                            a parole, ad esempio «Il ministro esagera». Per {meta.counts.ratedByModel.toLocaleString('it-IT')} dichiarazioni
                            un modello linguistico (Claude) ha ricondotto quel verdetto alla stessa scala; ogni classificazione è
                            salvata e consultabile nel repository. {meta.counts.unrated} dichiarazioni non contengono un verdetto
                            utilizzabile e non sono conteggiate.
                        </P>

                        <H>IL PUNTEGGIO</H>
                        <P>
                            Il punteggio di attendibilità è la media dei punti delle dichiarazioni verificate, corretta per chi ne
                            ha poche: a ogni politico aggiungiamo {meta.method.shrinkage} verifiche «medie» (la media generale è{' '}
                            {Math.round(meta.method.globalMean * 100)} punti). Così una sola dichiarazione falsa non porta nessuno a
                            zero, e una sola vera non porta nessuno a cento. Con molte verifiche la correzione diventa trascurabile.
                        </P>
                        <P>
                            Sotto le {meta.method.minStatements} verifiche il punteggio non viene mostrato: compare la scritta
                            «dati insufficienti» insieme ai singoli verdetti.
                        </P>

                        <H>COSA NON DICE</H>
                        <P>
                            Il punteggio misura come sono andate le dichiarazioni che Pagella Politica ha scelto di verificare, non
                            l'onestà complessiva di una persona. La redazione verifica più spesso chi parla di più, chi governa e le
                            affermazioni che sembrano dubbie: per questo i punteggi vanno letti insieme ai verdetti e agli articoli.
                        </P>
                        <P>
                            I partiti sommano le verifiche dei loro esponenti attuali, comprese le dichiarazioni fatte quando militavano
                            altrove. {meta.method.nonParties.join(', ')} non è trattato come un partito.
                        </P>

                        <Typography variant="body2" sx={{mt: 5}}>
                            Dati aggiornati il {new Date(meta.generatedAt).toLocaleDateString('it-IT', {year: 'numeric', month: 'long', day: 'numeric'})}.
                        </Typography>
                    </>
                )}
            </Box>
        </Layout>
    );
};

export default Method;
