import React from 'react';
import useFetchData from "../../hooks/useFetchData";
import PoliticianCard from "../politicians/PoliticianCard";
import HorizontalScrollableList from '../shared/HorizontalScrollableList';
import {Box} from "@mui/material";

const PoliticianList: React.FC = () => {
    const {data: responseData, loading, error} = useFetchData('author_averages');

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!responseData || !Array.isArray(responseData) || responseData.length === 0) {
        console.error("Unexpected or empty data format: ", responseData);
        return <div>Unexpected or empty data format</div>;
    }

    const politicians = responseData;

    console.log("Politicians data received in component: ", politicians);

    return (
        <HorizontalScrollableList>
            {politicians.map((politician: any, index: number) => (
                <Box key={index} sx={{minWidth: '300px', maxWidth: '300px'}}>
                    <PoliticianCard politician={{
                        id: index,
                        name: politician.author,
                        party: politician.party,
                        image: politician.author_image // Ensure this field is available in your data
                    }}/>
                </Box>
            ))}
        </HorizontalScrollableList>
    );
};

export default PoliticianList;
