import React from 'react';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import PartyList from "../components/home/PartiesList";
import {Box, Typography} from '@mui/material';

const Parties: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Header/>
            <Box sx={{flex: 1, p: 3}}>
                <Typography variant="h3" sx={{mb: 2}}>Partiti</Typography>
                <PartyList/>
            </Box>
            <Footer/>
        </Box>
    );
};

export default Parties;
