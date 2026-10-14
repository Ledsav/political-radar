import React, {useMemo, useState} from 'react';
import {Box, Chip, Link, Pagination, Stack, Typography} from '@mui/material';
import {RatingKey, Statement} from '../../data/types';
import {formatDate, RATING_BY_KEY, RATINGS} from '../../data/ratings';

const PAGE_SIZE = 10;

// Claims often arrive already wrapped in quote marks; strip them so we add exactly one pair.
export const unquote = (text: string) => text.replace(/^[\s«"“]+|[\s»"”]+$/g, '');

const RatingBadge: React.FC<{rating: RatingKey | null}> = ({rating}) => {
    if (!rating) return <Chip size="small" label="Non valutabile" variant="outlined"/>;
    const r = RATING_BY_KEY[rating];
    const dark = rating === 'vero' || rating === 'panzana';
    return <Chip size="small" label={r.label} sx={{borderRadius: 0, bgcolor: r.color, color: dark ? 'white' : 'black', border: '1px solid black'}}/>;
};

const StatementList: React.FC<{statements: Statement[]}> = ({statements}) => {
    const [filter, setFilter] = useState<RatingKey | 'all'>('all');
    const [page, setPage] = useState(1);

    const visible = useMemo(
        () => (filter === 'all' ? statements : statements.filter((s) => s.rating === filter)),
        [statements, filter],
    );
    const pageItems = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const choose = (key: RatingKey | 'all') => {
        setFilter(key);
        setPage(1);
    };

    return (
        <Box>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{mb: 2}}>
                <Chip label={`Tutte (${statements.length})`} onClick={() => choose('all')}
                      variant={filter === 'all' ? 'filled' : 'outlined'}/>
                {RATINGS.map((r) => {
                    const count = statements.filter((s) => s.rating === r.key).length;
                    return count > 0 && (
                        <Chip key={r.key} label={`${r.label} (${count})`} onClick={() => choose(r.key)}
                              variant={filter === r.key ? 'filled' : 'outlined'}/>
                    );
                })}
            </Stack>

            <Box component="ol" sx={{m: 0, p: 0, listStyle: 'none'}}>
                {pageItems.map((s) => (
                    <Box component="li" key={s.id} sx={{borderTop: '1px solid black', py: 2}}>
                        <Box sx={{display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mb: 1}}>
                            <RatingBadge rating={s.rating}/>
                            <Typography variant="body2">Verificata il {formatDate(s.published)}</Typography>
                        </Box>
                        <Typography variant="body1" sx={{fontStyle: 'italic', mb: 1}}>«{unquote(s.claim)}»</Typography>
                        {s.verdict && !RATINGS.some((r) => r.label === s.verdict) && (
                            <Typography variant="body2" sx={{mb: 1}}>Verdetto: {s.verdict}</Typography>
                        )}
                        <Typography variant="body2">
                            <Link href={s.factCheck} target="_blank" rel="noopener" color="inherit">
                                Leggi la verifica su Pagella Politica
                            </Link>
                            {s.claimSource && (
                                <>
                                    {' · '}
                                    <Link href={s.claimSource} target="_blank" rel="noopener noreferrer" color="inherit">
                                        Fonte della dichiarazione
                                    </Link>
                                </>
                            )}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {visible.length > PAGE_SIZE && (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                    <Pagination count={Math.ceil(visible.length / PAGE_SIZE)} page={page} onChange={(_, p) => setPage(p)}/>
                </Box>
            )}
        </Box>
    );
};

export default StatementList;
