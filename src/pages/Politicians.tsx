import React, {useMemo, useState} from 'react';
import {Box, FormControlLabel, MenuItem, Switch, TextField, Typography} from '@mui/material';
import Layout from '../components/shared/Layout';
import PaginatedGridList from '../components/shared/PaginatedGridList';
import PoliticianCard from '../components/politicians/PoliticianCard';
import RankingChart from '../components/charts/RankingChart';
import {ErrorMessage, Loading} from '../components/shared/Status';
import {loadPoliticians} from '../data/api';
import {useData} from '../data/useData';
import {fold} from '../data/search';
import {politiciansMeta} from '../seo/meta';
import {useDocumentMeta} from '../seo/useDocumentMeta';

type SortKey = 'rated' | 'scoreDesc' | 'scoreAsc' | 'name';

const SORTS: Record<SortKey, {label: string; compare: (a: {rated: number; score: number; name: string}, b: typeof a) => number}> = {
    rated: {label: 'Più verificati', compare: (a, b) => b.rated - a.rated},
    scoreDesc: {label: 'Più attendibili', compare: (a, b) => b.score - a.score},
    scoreAsc: {label: 'Meno attendibili', compare: (a, b) => a.score - b.score},
    name: {label: 'Nome', compare: (a, b) => a.name.localeCompare(b.name, 'it')},
};

const Politicians: React.FC = () => {
    const {data, loading, error} = useData(loadPoliticians);
    useDocumentMeta(data ? politiciansMeta(data.length) : null);
    const [query, setQuery] = useState('');
    const [party, setParty] = useState('');
    const [sort, setSort] = useState<SortKey>('rated');
    const [onlyReliable, setOnlyReliable] = useState(true);

    const parties = useMemo(
        () => [...new Set((data ?? []).map((p) => p.party).filter((p): p is string => !!p))].sort((a, b) => a.localeCompare(b, 'it')),
        [data],
    );
    const filtered = useMemo(() => {
        const q = fold(query);
        return (data ?? [])
            .filter((p) => !onlyReliable || p.reliable)
            .filter((p) => !party || p.party === party)
            .filter((p) => !q || fold(p.name).includes(q))
            .sort(SORTS[sort].compare);
    }, [data, query, party, sort, onlyReliable]);

    return (
        <Layout>
            <Box sx={{p: 3}}>
                <Typography variant="h1" sx={{fontWeight: 'bold'}}>POLITICI</Typography>
                <Typography variant="body1" sx={{mb: 3}}>
                    {data ? `${data.length} politici con almeno una dichiarazione verificata da Pagella Politica.` : ' '}
                </Typography>

                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3}}>
                    <TextField size="small" label="Nome" value={query} onChange={(e) => setQuery(e.target.value)}/>
                    <TextField size="small" select label="Partito" value={party} onChange={(e) => setParty(e.target.value)} sx={{minWidth: 200}}>
                        <MenuItem value="">Tutti</MenuItem>
                        {parties.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </TextField>
                    <TextField size="small" select label="Ordina" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} sx={{minWidth: 180}}>
                        {Object.entries(SORTS).map(([key, s]) => <MenuItem key={key} value={key}>{s.label}</MenuItem>)}
                    </TextField>
                    <FormControlLabel
                        control={<Switch checked={onlyReliable} onChange={(e) => setOnlyReliable(e.target.checked)}/>}
                        label="Solo con dati sufficienti"
                    />
                </Box>

                {loading && <Loading/>}
                {error && <ErrorMessage message={error}/>}
                {data && (
                    <>
                        <PaginatedGridList items={filtered} getKey={(p) => p.id} renderItem={(p) => <PoliticianCard politician={p}/>}/>
                        <Box sx={{mt: 8}}>
                            <RankingChart title="CLASSIFICA" items={filtered}/>
                        </Box>
                    </>
                )}
            </Box>
        </Layout>
    );
};

export default Politicians;
