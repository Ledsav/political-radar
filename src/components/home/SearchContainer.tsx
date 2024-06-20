import React from 'react';
import {Box, Typography, useTheme} from '@mui/material';
import SearchBar from "../shared/SearchBar";
import emoji from '../../assets/images/emoji.png'

interface SearchContainerProps {
    onSearch: (query: string) => void;
}

const SearchContainer: React.FC<SearchContainerProps> = ({onSearch}) => {
    const theme = useTheme();

    return (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{padding: '20px 0 20px 20px'}}
        >
            <Box>
                <Typography
                    variant="h3"
                    component="div"
                    sx={{
                        fontFamily: '"Antonio", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 'bold',
                        fontSize: '5rem'
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
                        fontSize: '5rem'
                    }}
                >
                    CHI{' '}
                    <span
                        style={{
                            backgroundColor: theme.palette.primary.main, // Use theme.palette.primary.main
                            color: 'black',
                            padding: '0 5px',
                        }}
                    >
                        FIDARTI
                    </span>
                </Typography>
                <SearchBar onSearch={onSearch}/>
            </Box>
            <Box
                sx={{
                    width: '500px',
                    height: '500px',
                    overflow: 'hidden', // Hide the overflow to ensure only part of the image is visible
                    position: 'relative',
                }}
            >
                <img src={emoji} alt="Emoji"
                     style={{width: '100%', height: '100%', position: 'absolute', right: '-130px'}}/>
            </Box>
        </Box>
    );
};

export default SearchContainer;
