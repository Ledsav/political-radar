import React from 'react';
import useFetchData from '../../hooks/useFetchData';
import PartyCard from "../parties/PartyCard";
import PaginatedGridList from "../shared/PaginatedGridList ";
import {isParty, SearchableItem} from '../../types/types';

interface PartyGridListProps {
    filteredData: SearchableItem[];
}

const PartyGridList: React.FC<PartyGridListProps> = ({filteredData}) => {
    const {data: responseData, loading, error} = useFetchData('party_averages');

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

    const parties = filteredData.length > 0 ? filteredData : responseData;
    console.log('filtered', filteredData)

    return (
        <PaginatedGridList
            items={parties}
            renderItem={(party) => {
                if (isParty(party)) {
                    return (
                        <PartyCard
                            party={{
                                id: party.id,
                                name: party.party,
                                orientation: party.orientation,
                                image: party.party_image
                            }}
                        />
                    );
                }
                return null; // or some fallback component
            }}
            itemsPerPage={12}
            title=""
        />
    );
};

export default PartyGridList;