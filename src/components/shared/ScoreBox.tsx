import React from 'react';
import {Box, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';

interface ScoreBoxProps {
    score: number;
    rated: number;
    reliable: boolean;
    minStatements: number;
}

// The headline credibility number, or an explicit "not enough data" state when
// the sample is too small for the number to mean much.
const ScoreBox: React.FC<ScoreBoxProps> = ({score, rated, reliable, minStatements}) => (
    <Box sx={{display: 'flex', alignItems: 'stretch', maxWidth: 420, bgcolor: 'black', color: 'white'}}>
        <Box sx={{width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Typography sx={{transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontSize: '1rem'}}>
                attendibilità
            </Typography>
        </Box>
        <Box sx={{flex: 1, p: 2, textAlign: 'right'}}>
            {reliable ? (
                <Typography variant="h2" component="p" sx={{fontSize: {xs: '3.5rem', sm: '5.5rem'}, lineHeight: 1, fontWeight: 'bold'}}>
                    {score}
                    <Box component="span" sx={{fontSize: {xs: '1rem', sm: '2rem'}, ml: 0.5}}>/100</Box>
                </Typography>
            ) : (
                <Typography variant="h2" component="p" sx={{fontSize: {xs: '2rem', sm: '2.75rem'}, lineHeight: 1.1}}>
                    DATI INSUFFICIENTI
                </Typography>
            )}
            <Typography variant="body2" sx={{mt: 1}}>
                {reliable
                    ? `su ${rated} dichiarazioni verificate`
                    : `solo ${rated} ${rated === 1 ? 'dichiarazione verificata' : 'dichiarazioni verificate'} (minimo ${minStatements})`}
                {' · '}
                <RouterLink to="/metodo" style={{textDecoration: 'underline'}}>come si calcola</RouterLink>
            </Typography>
        </Box>
    </Box>
);

export default ScoreBox;
