import React, {useCallback, useEffect, useState} from 'react';
import {
    Box,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    useMediaQuery,
    useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {isPolitician, SearchableItem} from "../../types/types";

interface SearchBarProps {
    onSearch: (query: string) => void;
    results: SearchableItem[];
    onResultClick: (result: SearchableItem) => void;
}


const SearchBar: React.FC<SearchBarProps> = ({onSearch, results, onResultClick}) => {
    const [query, setQuery] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const handleSearch = useCallback(() => {
        onSearch(query);
    }, [query, onSearch]);

    const handleSearchEvent = useCallback(() => {
        if (results.length > 0) {
            onResultClick(results[0]);
        } else {
            handleSearch();
        }
    }, [results, handleSearch, onResultClick]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, handleSearch]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchEvent();
        }
    };

    return (
        <Box style={{display: 'flex', alignItems: 'center', marginTop: '20px', position: 'relative', width: '100%'}}>
            <TextField
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cerca"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton onClick={handleSearchEvent}>
                                <SearchIcon/>
                            </IconButton>
                        </InputAdornment>
                    ),
                    style: {
                        borderRadius: '20px',
                    }
                }}
                sx={{maxWidth: {xs: '100%', sm: '700px'}}}
            />
            {query && results.length > 0 && (
                <Paper sx={{
                    position: 'absolute',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: {xs: '100%', sm: '700px'},
                    top: '100%',
                    mt: 1,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    borderRadius: '20px',
                    backgroundColor: theme.palette.secondary.main,
                    border: '3px solid',
                    borderColor: theme.palette.primary.main,
                    paddingY: 1,
                    boxShadow: theme.shadows[3],
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '8px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#a8a8a8',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                        marginTop: '10px',
                        marginBottom: '10px',
                    }
                }}>
                    <List>
                        {results.map((result) => (
                            <ListItem
                                component="div"
                                key={result.id}
                                onClick={() => onResultClick(result)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        borderRadius: "20px",
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={isPolitician(result) ? result.author : result.party}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default SearchBar;
