import React, {useState} from 'react';
import {Box, Grid, Pagination, Typography} from '@mui/material';

interface PaginatedGridListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    itemsPerPage?: number;
    title?: string;
}

const PaginatedGridList = <T, >({items, renderItem, itemsPerPage = 12, title}: PaginatedGridListProps<T>) => {
    const [page, setPage] = useState(1);

    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Box>
            {title && (
                <Typography variant="h1" sx={{fontWeight: 'bold', marginBottom: 2}}>
                    {title}
                </Typography>
            )}
            <Grid container spacing={2}>
                {items.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        {renderItem(item)}
                    </Grid>
                ))}
                {/* Fill empty spaces to keep grid size consistent */}
                {Array.from({length: itemsPerPage - items.slice((page - 1) * itemsPerPage, page * itemsPerPage).length}).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={`empty-${index}`}/>
                ))}
            </Grid>
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination count={pageCount} page={page} onChange={handleChangePage} color="primary"/>
            </Box>
        </Box>
    );
};

export default PaginatedGridList;
