import React from 'react';
import PartiesList from '../parties/PartiesList';
import PoliticianList from "../politicians/PoliticiansList";
import {Box, Typography, useTheme} from "@mui/material";
import SearchContainer from "./SearchContainer";
import useSearch from '../../hooks/useSearch';
import {useNavigate} from "react-router-dom";
import {isPolitician, SearchableItem} from "../../types/types";

const MainPageContent: React.FC = () => {
    const navigate = useNavigate();
    const {results, handleSearch: search} = useSearch();
    const theme = useTheme();

    const handleResultClick = (result: SearchableItem) => {

        if (isPolitician(result)) {
            navigate(`/politicians/${result.id}`);
        } else {
            navigate(`/parties/${result.id}`);
        }
    };

    return (
        <Box>
            <SearchContainer onSearch={search} results={results} onResultClick={handleResultClick}/>
            <Box sx={{
                padding: 0,
                borderTop: '2px solid', // Add top border to separate content from image
                borderColor: theme.palette.primary.contrastText,
            }}>
                <Box sx={{marginTop: 3}}>
                    <Box sx={{padding: 3}}>
                        <Typography variant="h1" sx={{fontWeight: 'bold'}}>POLITICI</Typography>
                        <Typography variant="h6">analizza i politici italiani</Typography>
                    </Box>
                    <Box sx={{marginTop: 1}}>
                        <PoliticianList/>
                    </Box>
                </Box>
                <Box sx={{marginTop: 3}}>
                    <Box sx={{padding: 3}}>
                        <Typography variant="h1" sx={{fontWeight: 'bold'}}>PARTITI</Typography>
                        <Typography variant="h6">analizza i partiti italiani</Typography>
                    </Box>
                    <Box sx={{marginTop: 1}}>
                        <PartiesList/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MainPageContent;
