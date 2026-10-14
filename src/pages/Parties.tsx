import React from 'react';
import {Box, Typography} from '@mui/material';
import Layout from '../components/shared/Layout';
import PaginatedGridList from '../components/shared/PaginatedGridList';
import PartyCard from '../components/parties/PartyCard';
import RankingChart from '../components/charts/RankingChart';
import {ErrorMessage, Loading} from '../components/shared/Status';
import {loadParties} from '../data/api';
import {useData} from '../data/useData';
import {partiesMeta} from '../seo/meta';
import {useDocumentMeta} from '../seo/useDocumentMeta';

const Parties: React.FC = () => {
    const {data, loading, error} = useData(loadParties);
    useDocumentMeta(data ? partiesMeta(data.length) : null);

    return (
        <Layout>
            <Box sx={{p: 3}}>
                <Typography variant="h1" sx={{fontWeight: 'bold'}}>PARTITI</Typography>
                <Typography variant="body1" sx={{mb: 3, maxWidth: 760}}>
                    Ogni partito somma le verifiche dei suoi esponenti attuali. I partiti con pochi esponenti
                    verificati dipendono quasi interamente da una o due persone.
                </Typography>
                {loading && <Loading/>}
                {error && <ErrorMessage message={error}/>}
                {data && (
                    <>
                        <PaginatedGridList items={data} getKey={(p) => p.id} renderItem={(p) => <PartyCard party={p}/>}/>
                        <Box sx={{mt: 8}}>
                            <RankingChart title="CLASSIFICA" items={data}/>
                        </Box>
                    </>
                )}
            </Box>
        </Layout>
    );
};

export default Parties;
