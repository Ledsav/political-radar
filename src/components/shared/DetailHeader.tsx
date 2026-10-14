import React from 'react';
import {Box, Typography} from '@mui/material';

interface DetailHeaderProps {
    name: string;
    subtitle: React.ReactNode;
    image?: string | null;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({name, subtitle, image}) => (
    <Box sx={{
        bgcolor: 'primary.main',
        border: '1px solid black',
        mt: {xs: 3, sm: 6},
        mb: 3,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    }}>
        <Box sx={{p: 2, minWidth: 0}}>
            <Typography variant="h2" component="h1" sx={{fontWeight: 'bold', fontSize: {xs: '2.5rem', sm: '5rem'}, lineHeight: 1.05, wordBreak: 'break-word'}}>
                {name.toUpperCase()}
            </Typography>
            <Typography variant="h5" component="p" sx={{color: 'black', fontSize: {xs: '1rem', sm: '1.5rem'}, mt: 1}}>
                {subtitle}
            </Typography>
        </Box>
        {image && (
            <Box component="img" src={image} alt={name} sx={{
                width: {xs: 110, sm: 220},
                objectFit: 'cover',
                objectPosition: '50% 20%',
                borderLeft: '1px solid black',
                bgcolor: 'white',
                flexShrink: 0,
            }}/>
        )}
    </Box>
);

export default DetailHeader;
