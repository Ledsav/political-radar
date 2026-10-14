import React from 'react';
import {Box, CircularProgress, Typography} from '@mui/material';

export const Loading: React.FC = () => (
    <Box sx={{display: 'flex', justifyContent: 'center', p: 6}} role="status" aria-label="Caricamento">
        <CircularProgress color="inherit"/>
    </Box>
);

export const ErrorMessage: React.FC<{message: string}> = ({message}) => (
    <Box sx={{p: 3, border: '1px solid black', m: 3}} role="alert">
        <Typography variant="h2" component="p">Qualcosa è andato storto</Typography>
        <Typography variant="body2">{message}</Typography>
    </Box>
);

export const NotFoundMessage: React.FC<{what: string}> = ({what}) => (
    <Box sx={{p: 3, m: 3, border: '1px solid black'}}>
        <Typography variant="h2" component="h1">{what} non trovato</Typography>
    </Box>
);
