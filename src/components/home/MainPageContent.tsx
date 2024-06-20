import React from 'react';
import PartiesList from './PartiesList';
import PoliticianList from "./PoliticiansList";
import {Box, Typography} from "@mui/material";
import SearchContainer from "./SearchContainer";

const MainPageContent: React.FC = () => {
    const handleSearch = (query: string) => {
        // Implement search functionality
    };

    return (
        <Box>
            <SearchContainer onSearch={handleSearch}/>
            <Box sx={{padding: 3}}>
                <Box sx={{marginTop: 3}}>
                    <Typography variant="h1" sx={{fontWeight: 'bold'}}>POLITICI</Typography>
                    <Typography variant="h6">analizza i politici italiani</Typography>
                    <Box sx={{marginTop: 1}}>
                        <PoliticianList/>
                    </Box>
                </Box>
                <Box sx={{marginTop: 3}}>
                    <Typography variant="h1" sx={{fontWeight: 'bold'}}>PARTITI</Typography>
                    <Typography variant="h6">analizza i partiti italiani</Typography>
                    <Box sx={{marginTop: 1}}>
                        <PartiesList/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MainPageContent;
