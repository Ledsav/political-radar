import React from 'react';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import {Box, Typography} from '@mui/material';
import PoliticiansGridList from "../components/politicians/PoliticiansGridList";
import {useNavigate} from "react-router-dom";
import SearchContainer from "../components/home/SearchContainer";
import useSearch from '../hooks/useSearch';
import {SearchableItem} from "../types/types";
import RankingChart from "../components/charts/RankingChart";
import ActivityChart from "../components/charts/ActivityChart";

const Politicians: React.FC = () => {
    const navigate = useNavigate();
    const collectionName = 'author_averages';
    const {results, handleSearch: search} = useSearch(collectionName);

    const handleResultClick = (result: SearchableItem) => {
        navigate(`/politicians/${result.id}`);
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
                    <Typography variant="h1" sx={{fontWeight: 'bold'}}>POLITICI</Typography>
                </Box>
                <Box sx={{padding: 3}}>
                    <PoliticiansGridList filteredData={results}/>
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

export default Politicians;