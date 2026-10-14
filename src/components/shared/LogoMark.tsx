import React from 'react';
import {Box, SxProps} from '@mui/material';

// "Margine": a statement (speech bubble) with its margin of error (±).
// Master artwork and variants live in design/logo/.
const LogoMark: React.FC<{size?: number | string; sx?: SxProps}> = ({size = 40, sx}) => (
    <Box component="svg" viewBox="24 28 208 200" aria-hidden="true" focusable="false"
         sx={{width: size, height: size, display: 'block', flexShrink: 0, ...sx}}>
        <path fill="currentColor" fillRule="evenodd" d="M24 28 H232 V180 H112 L64 228 V180 H24 Z M88 75.0 H119.0 V44 H137.0 V75.0 H168 V93.0 H137.0 V124 H119.0 V93.0 H88 Z M88 135.0 H168 V153.0 H88 Z"/>
    </Box>
);

export default LogoMark;
