import React from 'react';
import {Box, SxProps} from '@mui/material';

// Stand-in for parties without a freely licensed logo (see pipeline/radar/logos.py).
// It represents the absence of a symbol, not the party: an empty slot, like a blank
// space on the ballot where the symbol would go. No initials, colours or shapes that
// could be read as the party's own (trademarked) symbol, and no slash or cross, which
// on a party would read as "banned".
const NoLogo: React.FC<{name: string; sx?: SxProps}> = ({name, sx}) => (
    <Box component="svg" viewBox="0 0 200 200" role="img" aria-label={`${name}: simbolo non disponibile`}
         sx={{display: 'block', width: '100%', height: '100%', ...sx}}>
        <circle cx="100" cy="100" r="88" fill="white" stroke="black" strokeWidth="3" strokeDasharray="9 9"/>
        <text x="100" y="94" textAnchor="middle" fontFamily="Antonio, Roboto, Helvetica, Arial, sans-serif"
              fontWeight="700" fontSize="17" letterSpacing="1.5" fill="#555">SIMBOLO</text>
        <text x="100" y="116" textAnchor="middle" fontFamily="Antonio, Roboto, Helvetica, Arial, sans-serif"
              fontWeight="700" fontSize="17" letterSpacing="1.5" fill="#555">NON DISPONIBILE</text>
    </Box>
);

export default NoLogo;
