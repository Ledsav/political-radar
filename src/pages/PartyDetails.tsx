import React from 'react';
import {Box} from '@mui/material';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import PartyDetails from '../components/parties/PartyDetails';

const PartyDetailPage: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Header/>
            <Box sx={{flex: 1}}>
                <PartyDetails/>
            </Box>
            <Footer/>
        </Box>
    );
};

export default PartyDetailPage;
