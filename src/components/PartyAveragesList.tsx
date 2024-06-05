import React from 'react';
import useFetchData from '../hooks/useFetchData';
import { AverageScore } from '../types/types';

const PartyAveragesList: React.FC = () => {
    const { data, loading } = useFetchData('party_averages');

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log('Party Averages Data:', data);

    return (
        <div>
            <h1>Party Averages</h1>
            <ul>
                {data.map((item: AverageScore, index: number) => (
                    <li key={index}>
                        <strong>{item.party}</strong>: {item.average_score !== undefined ? item.average_score.toFixed(2) : 'N/A'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PartyAveragesList;
