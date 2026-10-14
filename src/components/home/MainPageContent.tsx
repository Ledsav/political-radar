import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Button, Typography, useTheme} from '@mui/material';
import SearchContainer from './SearchContainer';
import HorizontalScrollableList from '../shared/HorizontalScrollableList';
import PoliticianCard from '../politicians/PoliticianCard';
import PartyCard from '../parties/PartyCard';
import {ErrorMessage, Loading} from '../shared/Status';
import {loadParties, loadPoliticians} from '../../data/api';
import {useData} from '../../data/useData';

const HOME_LIST_SIZE = 12;

const Section: React.FC<{title: string; subtitle: string; to: string; children: React.ReactNode}> = ({title, subtitle, to, children}) => (
    <Box sx={{marginTop: 3}}>
        <Box sx={{padding: 3, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap'}}>
            <Box>
                <Typography variant="h1" component="h2" sx={{fontWeight: 'bold'}}>{title}</Typography>
                <Typography variant="h6" component="p">{subtitle}</Typography>
            </Box>
            <Button component={RouterLink} to={to} variant="outlined" color="inherit" sx={{borderRadius: 0}}>
                Vedi tutti
            </Button>
        </Box>
        <Box sx={{marginTop: 1}}>{children}</Box>
    </Box>
);

const MainPageContent: React.FC = () => {
    const theme = useTheme();
    const politicians = useData(loadPoliticians);
    const parties = useData(loadParties);

    return (
        <Box>
            <SearchContainer/>
            <Box sx={{borderTop: '2px solid', borderColor: theme.palette.primary.contrastText}}>
                <Section title="POLITICI" subtitle="i più verificati da Pagella Politica" to="/politicians">
                    {politicians.loading && <Loading/>}
                    {politicians.error && <ErrorMessage message={politicians.error}/>}
                    {politicians.data && (
                        <HorizontalScrollableList>
                            {politicians.data.slice(0, HOME_LIST_SIZE).map((p) => (
                                <Box key={p.id} sx={{minWidth: '300px', maxWidth: '300px'}}>
                                    <PoliticianCard politician={p}/>
                                </Box>
                            ))}
                        </HorizontalScrollableList>
                    )}
                </Section>
                <Section title="PARTITI" subtitle="le verifiche dei loro esponenti, sommate" to="/parties">
                    {parties.loading && <Loading/>}
                    {parties.error && <ErrorMessage message={parties.error}/>}
                    {parties.data && (
                        <HorizontalScrollableList>
                            {parties.data.filter((p) => p.reliable).map((p) => (
                                <Box key={p.id} sx={{minWidth: '300px', maxWidth: '300px'}}>
                                    <PartyCard party={p}/>
                                </Box>
                            ))}
                        </HorizontalScrollableList>
                    )}
                </Section>
            </Box>
        </Box>
    );
};

export default MainPageContent;
