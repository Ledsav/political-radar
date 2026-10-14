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
    useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {SearchResult} from "../../data/search";

interface SearchBarProps {
    onSearch: (query: string) => void;
    results: SearchResult[];
    onResultClick: (result: SearchResult) => void;
}


const SearchBar: React.FC<SearchBarProps> = ({onSearch, results, onResultClick}) => {
    const [query, setQuery] = useState('');
    const theme = useTheme();

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
                type="search"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cerca un politico o un partito"
                inputProps={{'aria-label': 'Cerca un politico o un partito'}}
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
                                key={`${result.kind}-${result.id}`}
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
                                    primary={result.name}
                                    secondary={result.kind === 'party' ? `Partito · ${result.detail}` : result.detail}
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
