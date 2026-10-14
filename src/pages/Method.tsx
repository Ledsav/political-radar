import React from 'react';
import {Box, Link, Typography} from '@mui/material';
import Layout from '../components/shared/Layout';
import {ErrorMessage, Loading} from '../components/shared/Status';
import {loadMeta} from '../data/api';
import {useData} from '../data/useData';
import {RATINGS} from '../data/ratings';
import {methodMeta} from '../seo/meta';
import {useDocumentMeta} from '../seo/useDocumentMeta';

const H: React.FC<{children: React.ReactNode}> = ({children}) => (
    <Typography variant="h2" component="h2" sx={{mt: 5, mb: 1.5}}>{children}</Typography>
);
const P: React.FC<{children: React.ReactNode}> = ({children}) => (
    <Typography variant="body1" sx={{mb: 1.5}}>{children}</Typography>
);

const Method: React.FC = () => {
    const {data: meta, loading, error} = useData(loadMeta);
    useDocumentMeta(methodMeta());

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
                            un modello linguistico ha ricondotto quel verdetto alla stessa scala; ogni classificazione è
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

                        <H>QUANTO È ACCURATO?</H>
                        <P>
                            Meno di quanto un numero da 0 a 100 lasci pensare. Ci sono tre fonti di errore, dalla più grande alla
                            più piccola.
                        </P>
                        <P>
                            <strong>1. Quali dichiarazioni vengono verificate.</strong> Pagella Politica sceglie cosa verificare e
                            avverte che i suoi dati{' '}
                            <Link href="https://pagellapolitica.it/progetto" target="_blank" rel="noopener" color="inherit" underline="always">
                                «non consentono, allo stato attuale, di paragonare i politici»
                            </Link>
                            . Nessun calcolo può correggere questo limite: il punteggio descrive le dichiarazioni verificate, non la
                            persona.
                        </P>
                        <P>
                            <strong>2. Quante dichiarazioni ci sono.</strong> Anche prendendo per buona la selezione, con poche
                            verifiche il punteggio oscilla molto. Per questo accanto a ogni punteggio mostriamo un margine
                            (intervallo approssimato al 90%).
                            {meta.accuracy.medianIntervalWidth !== null && (
                                <> Per i politici con dati sufficienti il margine è di solito ampio circa{' '}
                                    {meta.accuracy.medianIntervalWidth} punti: due politici i cui margini si sovrappongono non sono
                                    distinguibili, anche se uno compare più in alto in classifica.</>
                            )}
                        </P>
                        <P>
                            <strong>3. Come vengono letti i verdetti.</strong>{' '}
                            {Math.round((100 * meta.counts.ratedByLabel) / meta.counts.rated)}% delle valutazioni usa
                            l'etichetta assegnata da Pagella Politica e non introduce errori. Il restante{' '}
                            {Math.round((100 * meta.counts.ratedByModel) / meta.counts.rated)}% è stato ricondotto alla scala da un
                            modello linguistico, che può sbagliare, soprattutto di un gradino (ad esempio «Nì» invece di
                            «C'eri quasi»).{' '}
                            {meta.accuracy.labelAgreement ? (
                                <>
                                    Su un campione di {meta.accuracy.labelAgreement.sample} di queste dichiarazioni, una seconda
                                    classificazione indipendente ({meta.accuracy.labelAgreement.candidate}) dà lo stesso verdetto
                                    nel {Math.round(100 * meta.accuracy.labelAgreement.exact)}% dei casi e uno al massimo a un
                                    gradino di distanza nel {Math.round(100 * meta.accuracy.labelAgreement.withinOneStep)}%.
                                </>
                            ) : (
                                <>La coerenza di queste classificazioni non è ancora stata misurata.</>
                            )}{' '}
                            Ogni dichiarazione riporta il verdetto originale e il link all'articolo, così è sempre possibile
                            controllare.
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
