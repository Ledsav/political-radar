import React from 'react';
import useFetchData from '../../hooks/useFetchData';
import PoliticianCard from "./PoliticianCard";
import PaginatedGridList from "../shared/PaginatedGridList ";
import {isPolitician, SearchableItem} from '../../types/types';

interface PoliticiansGridListProps {
    filteredData: SearchableItem[];
}

const PoliticiansGridList: React.FC<PoliticiansGridListProps> = ({filteredData}) => {
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

    const politicians = filteredData.length > 0 ? filteredData : responseData;
    console.log('filtered', filteredData);

    return (
        <PaginatedGridList
            items={politicians}
            renderItem={(politician) => {
                if (isPolitician(politician)) {
                    return (
                        <PoliticianCard
                            politician={{
                                id: politician.id,
                                name: politician.author,
                                party: politician.party,
                                image: politician.author_image // Ensure this field is available in your data
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

export default PoliticiansGridList;