import React from 'react';
import useFetchData from '../../hooks/useFetchData';
import HorizontalScrollableList from "../shared/HorizontalScrollableList";
import {Box} from "@mui/material";
import PartyCard from "./PartyCard";

const PartyList: React.FC = () => {
    const {data: responseData, loading, error} = useFetchData('party_averages');

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!responseData || !responseData || !Array.isArray(responseData) || responseData.length === 0) {
        console.error("Unexpected or empty data format: ", responseData);
        return <div>Unexpected or empty data format</div>;
    }

    const parties = responseData;

    console.log("Parties data received in component: ", parties);

    return (
        <HorizontalScrollableList>
            {parties.map((party: any, index: number) => (
                <Box key={index} sx={{minWidth: '300px', maxWidth: '300px'}}>
                    <PartyCard party={{
                        id: party.id,
                        name: party.party,
                        orientation: party.orientation,
                        image: party.party_image
                    }}/>
                </Box>
            ))}
        </HorizontalScrollableList>
    );
};

export default PartyList;
