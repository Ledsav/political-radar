import React from 'react';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import MainPageContent from '../components/home/MainPageContent';
import {Box} from '@mui/material';

const Home: React.FC = () => {
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
                <MainPageContent/>
            </Box>
            <Footer/>
        </Box>
    );
};

export default Home;
