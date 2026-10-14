import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Link, Typography} from '@mui/material';

const Footer: React.FC = () => (
    <Box
        component="footer"
        sx={{
            py: 3,
            px: 3,
            mt: 6,
            bgcolor: 'black',
            color: 'white',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid white',
        }}
    >
        <Typography variant="body2" sx={{maxWidth: 640}}>
            Tutte le verifiche sono di{' '}
            <Link href="https://pagellapolitica.it" target="_blank" rel="noopener" color="inherit" underline="always">
                Pagella Politica
            </Link>
            . Radar Politico è un progetto indipendente: ne riassume i verdetti e rimanda sempre all'articolo originale.
        </Typography>
        <Typography variant="h1" component={RouterLink} to="/metodo" sx={{fontSize: '2rem'}}>
            COME FUNZIONA
        </Typography>
    </Box>
);

export default Footer;
