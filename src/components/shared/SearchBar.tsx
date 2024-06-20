import React, {useState} from 'react';
import {Box, IconButton, InputAdornment, TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({onSearch}) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <Box style={{display: 'flex', alignItems: 'center', marginTop: '20px'}}>
            <TextField
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton onClick={handleSearch}>
                                <SearchIcon/>
                            </IconButton>
                        </InputAdornment>
                    ),
                    style: {
                        borderRadius: '20px',
                    }
                }}
                sx={{width: '700px'}}
            />
        </Box>
    );
};

export default SearchBar;
