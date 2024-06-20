import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                bgcolor: 'black',
                color: 'white',
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'flex-end',
                px: 3,
                borderTop: '1px solid white'
            }}
        >
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="h1" sx={{mx: 2}}>CONTATTI</Typography>
                <Typography variant="h1" sx={{mx: 2}}>INSTAGRAM</Typography>
            </Box>
        </Box>
    );
};

export default Footer;
