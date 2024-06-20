import React from 'react';
import {Box} from '@mui/material';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import PoliticianDetails from '../components/politicians/PoliticianDetails';

const PoliticianDetailPage: React.FC = () => {
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
                <PoliticianDetails/>
            </Box>
            <Footer/>
        </Box>
    );
};

export default PoliticianDetailPage;
