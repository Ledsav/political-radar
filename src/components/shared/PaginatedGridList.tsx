import React, {useEffect, useState} from 'react';
import {Box, Grid, Pagination, Typography} from '@mui/material';

interface PaginatedGridListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    getKey: (item: T) => string;
    itemsPerPage?: number;
    emptyText?: string;
}

const PaginatedGridList = <T, >({items, renderItem, getKey, itemsPerPage = 12, emptyText = 'Nessun risultato'}: PaginatedGridListProps<T>) => {
    const [page, setPage] = useState(1);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    // A new filter result starts from the first page.
    useEffect(() => setPage(1), [items]);

    if (items.length === 0) {
        return <Typography variant="body1" sx={{py: 4}}>{emptyText}</Typography>;
    }

    return (
        <Box>
            <Grid container spacing={2}>
                {items.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={getKey(item)}>
                        {renderItem(item)}
                    </Grid>
                ))}
            </Grid>
            {pageCount > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)}/>
                </Box>
            )}
        </Box>
    );
};

export default PaginatedGridList;
