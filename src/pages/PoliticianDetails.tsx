import React from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {Box, Grid, Link, Typography} from '@mui/material';
import Layout from '../components/shared/Layout';
import DetailHeader from '../components/shared/DetailHeader';
import ScoreBox from '../components/shared/ScoreBox';
import VerdictBar from '../components/shared/VerdictBar';
import StatementList from '../components/politicians/StatementList';
import {ErrorMessage, Loading, NotFoundMessage} from '../components/shared/Status';
import {loadMeta, loadPoliticians, loadStatements} from '../data/api';
import {useData} from '../data/useData';
import {formatDate} from '../data/ratings';
import {notFoundMeta, politicianMeta} from '../seo/meta';
import {useDocumentMeta} from '../seo/useDocumentMeta';

const PoliticianDetailPage: React.FC = () => {
    const {id = ''} = useParams<{id: string}>();
    const {data, loading, error} = useData(
        () => Promise.all([loadPoliticians(), loadMeta()]).then(([politicians, meta]) => ({
            politician: politicians.find((p) => p.id === id) ?? null,
            meta,
        })),
        [id],
    );
    const statements = useData(() => loadStatements(id), [id]);
    useDocumentMeta(data ? (data.politician ? politicianMeta(data.politician) : notFoundMeta(`politicians/${id}`)) : null);

    let content: React.ReactNode;
    if (loading) content = <Loading/>;
    else if (error) content = <ErrorMessage message={error}/>;
    else if (!data?.politician) content = <NotFoundMessage what="Politico"/>;
    else {
        const {politician: p, meta} = data;
        content = (
            <>
                <DetailHeader
                    name={p.name}
                    image={p.image}
                    subtitle={p.party && p.partySlug
                        ? <Link component={RouterLink} to={`/parties/${p.partySlug}`} color="inherit">{p.party}</Link>
                        : 'Senza partito'}
                />
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <ScoreBox score={p.score} low={p.score_low} high={p.score_high} rated={p.rated} reliable={p.reliable} minStatements={meta.method.minStatements}/>
                        <Box sx={{mt: 3}}>
                            <Typography variant="h5" component="h2" sx={{fontWeight: 'bold', mb: 1}}>Come si dividono i verdetti</Typography>
                            <VerdictBar breakdown={p.breakdown}/>
                        </Box>
                        <Box sx={{mt: 3}}>
                            <Typography variant="h5" component="h2" sx={{fontWeight: 'bold', mb: 1}}>Periodo</Typography>
                            <Typography variant="body1">Verifiche dal {formatDate(p.first_date)} al {formatDate(p.last_date)}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{mt: 3}}>
                            Il partito indicato è quello attuale secondo Pagella Politica: alcune dichiarazioni
                            possono risalire a quando {p.name} militava altrove. Il punteggio dipende da quali
                            dichiarazioni la redazione ha scelto di verificare, non da tutto ciò che ha detto.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Typography variant="h2" component="h2" sx={{mb: 2}}>LE DICHIARAZIONI VERIFICATE</Typography>
                        {statements.loading && <Loading/>}
                        {statements.error && <ErrorMessage message={statements.error}/>}
                        {statements.data && <StatementList statements={statements.data}/>}
                    </Grid>
                </Grid>
            </>
        );
    }

    return (
        <Layout>
            <Box sx={{px: {xs: 2, sm: 3}}}>{content}</Box>
        </Layout>
    );
};

export default PoliticianDetailPage;
