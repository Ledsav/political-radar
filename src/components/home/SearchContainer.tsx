import React, {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Typography, useMediaQuery, useTheme} from '@mui/material';
import SearchBar from '../shared/SearchBar';
import emoji from '../../assets/images/emoji.png';
import {loadParties, loadPoliticians} from '../../data/api';
import {useData} from '../../data/useData';
import {resultPath, search, SearchResult} from '../../data/search';

const loadAll = () => Promise.all([loadPoliticians(), loadParties()]);

const SearchContainer: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const {data} = useData(loadAll);
    const [results, setResults] = useState<SearchResult[]>([]);

    const onSearch = useCallback(
        (query: string) => setResults(data ? search(query, data[0], data[1]) : []),
        [data],
    );
    const onResultClick = useCallback((result: SearchResult) => navigate(resultPath(result)), [navigate]);

    return (
        <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'flex-start' : 'center'}
            justifyContent="space-between"
            sx={{padding: {xs: '20px', sm: '20px 0 20px 20px'}}}
        >
            <Box width={isMobile ? '100%' : '700px'}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontFamily: '"Antonio", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 'bold',
                        fontSize: {xs: '3rem', sm: '4rem', md: '5rem'},
                        lineHeight: 1.2,
                    }}
                >
                    TROVA DI
                    <br/>
                    CHI{' '}
                    <span style={{backgroundColor: theme.palette.primary.main, color: 'black', padding: '0 5px'}}>
                        FIDARTI
                    </span>
                </Typography>
                <SearchBar onSearch={onSearch} results={results} onResultClick={onResultClick}/>
            </Box>
            {!isMobile && (
                <Box
                    sx={{
                        width: {sm: '300px', md: '400px', lg: '500px'},
                        height: {sm: '300px', md: '400px', lg: '500px'},
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <img src={emoji} alt="" style={{width: '100%', height: '100%', position: 'absolute', right: '-130px'}}/>
                </Box>
            )}
        </Box>
    );
};

export default SearchContainer;
