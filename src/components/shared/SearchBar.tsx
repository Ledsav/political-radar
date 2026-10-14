import React, {useMemo, useState} from 'react';
import {Autocomplete, Avatar, Box, InputAdornment, TextField, Typography} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {highlight, rank, SearchResult} from '../../data/search';

interface SearchBarProps {
    candidates: SearchResult[];
    loading?: boolean;
    onSelect: (result: SearchResult) => void;
}

const GROUP_LABELS: Record<SearchResult['kind'], string> = {politician: 'Politici', party: 'Partiti'};

const Initials: React.FC<{name: string}> = ({name}) => (
    <span aria-hidden="true">{name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}</span>
);

const ResultRow: React.FC<{result: SearchResult; query: string}> = ({result, query}) => (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', minWidth: 0}}>
        <Avatar
            variant="square"
            src={result.image ?? undefined}
            alt=""
            imgProps={{loading: 'lazy', style: {objectFit: result.kind === 'party' ? 'contain' : 'cover', objectPosition: '50% 20%'}}}
            sx={{width: 40, height: 40, border: '1px solid black', bgcolor: result.kind === 'party' ? 'white' : 'primary.main', color: 'black', fontSize: '0.9rem', fontWeight: 'bold'}}
        >
            <Initials name={result.name}/>
        </Avatar>
        <Box sx={{flex: 1, minWidth: 0}}>
            <Typography variant="body1" noWrap>
                {highlight(result.name, query).map((part, i) =>
                    part.match ? <Box component="strong" key={i} sx={{bgcolor: 'primary.main'}}>{part.text}</Box> : <span key={i}>{part.text}</span>,
                )}
            </Typography>
            <Typography variant="body2" noWrap sx={{color: '#555'}}>
                {result.detail ?? 'Senza partito'}
            </Typography>
        </Box>
        <Box sx={{textAlign: 'right', flexShrink: 0}}>
            <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                {result.reliable ? `${result.score}/100` : 'n.d.'}
            </Typography>
            <Typography variant="caption" sx={{color: '#555'}}>
                {result.rated} {result.rated === 1 ? 'verifica' : 'verifiche'}
            </Typography>
        </Box>
    </Box>
);

const SearchBar: React.FC<SearchBarProps> = ({candidates, loading = false, onSelect}) => {
    const [input, setInput] = useState('');
    const options = useMemo(() => rank(input, candidates), [input, candidates]);

    return (
        <Autocomplete<SearchResult, false, false, false>
            options={options}
            filterOptions={(o) => o}
            groupBy={(o) => GROUP_LABELS[o.kind]}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(a, b) => a.kind === b.kind && a.id === b.id}
            inputValue={input}
            onInputChange={(_, value, reason) => reason !== 'reset' && setInput(value)}
            value={null}
            onChange={(_, value) => value && onSelect(value)}
            open={input.trim().length > 0}
            autoHighlight
            blurOnSelect
            clearOnEscape
            loading={loading}
            loadingText="Caricamento…"
            noOptionsText={`Nessun politico o partito trovato per «${input.trim()}»`}
            popupIcon={null}
            sx={{marginTop: '20px', maxWidth: {xs: '100%', sm: '700px'}}}
            ListboxProps={{style: {maxHeight: 420}}}
            renderGroup={(params) => (
                <li key={params.key}>
                    <Typography component="div" sx={{
                        px: 2, py: 0.5, bgcolor: 'black', color: 'white',
                        fontFamily: '"Antonio", "Roboto", sans-serif', fontWeight: 700, letterSpacing: 1,
                    }}>
                        {params.group.toUpperCase()}
                    </Typography>
                    <Box component="ul" sx={{p: 0}}>{params.children}</Box>
                </li>
            )}
            renderOption={(props, option) => {
                const {key, ...rest} = props as React.HTMLAttributes<HTMLLIElement> & {key: string};
                return (
                    <Box component="li" key={key} {...rest}>
                        <ResultRow result={option} query={input}/>
                    </Box>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Cerca un politico o un partito"
                    inputProps={{...params.inputProps, 'aria-label': 'Cerca un politico o un partito'}}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
                    }}
                />
            )}
        />
    );
};

export default SearchBar;
