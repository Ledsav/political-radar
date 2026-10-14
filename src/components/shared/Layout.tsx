import React from 'react';
import {Box} from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => (
    <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
        <Header/>
        <Box component="main" sx={{flex: 1}}>
            {children}
        </Box>
        <Footer/>
    </Box>
);

export default Layout;
