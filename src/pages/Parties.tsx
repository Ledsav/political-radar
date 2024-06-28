import React from 'react';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import {Box, Typography} from '@mui/material';
import PartyGridList from "../components/parties/PartiesGridList";
import {useNavigate} from "react-router-dom";
import SearchContainer from "../components/home/SearchContainer";
import useSearch from '../hooks/useSearch';
import {SearchableItem} from "../types/types";
import RankingChart from "../components/charts/RankingChart";
import ActivityChart from "../components/charts/ActivityChart";

const Parties: React.FC = () => {
    const navigate = useNavigate();
    const collectionName = 'party_averages';
    const {results, handleSearch: search} = useSearch(collectionName);

    const handleResultClick = (result: SearchableItem) => {
        navigate(`/parties/${result.id}`);
    };

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
                <SearchContainer onSearch={search} results={results} onResultClick={handleResultClick}/>
                <Box sx={{padding: 3}}>
                    <Typography variant="h1" sx={{fontWeight: 'bold'}}>PARTITI</Typography>
                </Box>
                <Box sx={{padding: 3}}>
                    <PartyGridList filteredData={results}/>
                </Box>
                <Box sx={{padding: 3}}>
                    <RankingChart data={results}/>
                </Box>
                <Box sx={{padding: 3}}>
                    <ActivityChart data={results} collectionName={collectionName}/>
                </Box>
            </Box>
            <Footer/>
        </Box>
    );
};

export default Parties;