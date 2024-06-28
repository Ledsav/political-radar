import React from 'react';
import {Box, Typography, useMediaQuery, useTheme} from '@mui/material';
import SearchBar from "../shared/SearchBar";
import emoji from "../../assets/images/emoji.png"
import {SearchableItem} from "../../types/types";

interface SearchContainerProps {
    onSearch: (query: string) => void;
    results: any[];
    onResultClick: (result: SearchableItem) => void;
}

const SearchContainer: React.FC<SearchContainerProps> = ({onSearch, results, onResultClick}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="space-between"
            sx={{padding: {xs: '20px', sm: '20px 0 20px 20px'}}}
        >
            <Box width={isMobile ? '100%' : '700px'}>
                <Typography
                    variant="h3"
                    component="div"
                    sx={{
                        fontFamily: '"Antonio", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 'bold',
                        fontSize: {xs: '3rem', sm: '4rem', md: '5rem'}
                    }}
                >
                    TROVA DI
                </Typography>
                <Typography
                    variant="h3"
                    component="div"
                    sx={{
                        fontFamily: '"Antonio", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        position: 'relative',
                        paddingTop: '15px',
                        fontSize: {xs: '3rem', sm: '4rem', md: '5rem'}
                    }}
                >
                    CHI{' '}
                    <span
                        style={{
                            backgroundColor: theme.palette.primary.main,
                            color: 'black',
                            padding: '0 5px',
                        }}
                    >
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
                    <img src={emoji} alt="Emoji"
                         style={{width: '100%', height: '100%', position: 'absolute', right: '-130px'}}/>
                </Box>
            )}
        </Box>
    );
};

export default SearchContainer;
