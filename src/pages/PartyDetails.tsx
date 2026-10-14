import React from 'react';
import {useParams} from 'react-router-dom';
import {Box, Grid, Typography} from '@mui/material';
import Layout from '../components/shared/Layout';
import DetailHeader from '../components/shared/DetailHeader';
import ScoreBox from '../components/shared/ScoreBox';
import VerdictBar from '../components/shared/VerdictBar';
import PaginatedGridList from '../components/shared/PaginatedGridList';
import PoliticianCard from '../components/politicians/PoliticianCard';
import {ErrorMessage, Loading, NotFoundMessage} from '../components/shared/Status';
import {loadMeta, loadParties, loadPoliticians} from '../data/api';
import {useData} from '../data/useData';
import {formatDate} from '../data/ratings';

const PartyDetailPage: React.FC = () => {
    const {id = ''} = useParams<{id: string}>();
    const {data, loading, error} = useData(
        () => Promise.all([loadParties(), loadPoliticians(), loadMeta()]).then(([parties, politicians, meta]) => ({
            party: parties.find((p) => p.id === id) ?? null,
            members: politicians.filter((p) => p.partySlug === id),
            meta,
        })),
        [id],
    );

    let content: React.ReactNode;
    if (loading) content = <Loading/>;
    else if (error) content = <ErrorMessage message={error}/>;
    else if (!data?.party) content = <NotFoundMessage what="Partito"/>;
    else {
        const {party, members, meta} = data;
        content = (
            <>
                <DetailHeader name={party.name} subtitle={`${party.politicians} ${party.politicians === 1 ? 'esponente verificato' : 'esponenti verificati'}`}/>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <ScoreBox score={party.score} low={party.score_low} high={party.score_high} rated={party.rated} reliable={party.reliable} minStatements={meta.method.minStatements}/>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5" component="h2" sx={{fontWeight: 'bold', mb: 1}}>Come si dividono i verdetti</Typography>
                        <VerdictBar breakdown={party.breakdown}/>
                        <Typography variant="body1" sx={{mt: 2}}>
                            Verifiche dal {formatDate(party.first_date)} al {formatDate(party.last_date)}.
                        </Typography>
                        <Typography variant="body2" sx={{mt: 2}}>
                            Il punteggio somma le verifiche di chi oggi fa parte del partito, comprese quelle
                            di dichiarazioni fatte quando militava altrove. Pesa di più chi viene verificato più spesso.
                        </Typography>
                    </Grid>
                </Grid>
                <Box sx={{mt: 6}}>
                    <Typography variant="h2" component="h2" sx={{mb: 2}}>ESPONENTI</Typography>
                    <PaginatedGridList items={members} renderItem={(p) => <PoliticianCard politician={p}/>} getKey={(p) => p.id}/>
                </Box>
            </>
        );
    }

    return (
        <Layout>
            <Box sx={{px: {xs: 2, sm: 3}}}>{content}</Box>
        </Layout>
    );
};

export default PartyDetailPage;
