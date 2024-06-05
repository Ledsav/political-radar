import React from 'react';
import useFetchData from '../hooks/useFetchData';
import { FactCheckingItem } from '../types/types';

const FactCheckingList: React.FC = () => {
    const { data, loading } = useFetchData('fact_checking');

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Fact Checking List</h1>
            <ul>
                {data.map((item: FactCheckingItem) => (
                    <li key={item.id}>
                        <strong>{item.author}</strong>: {item.score.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FactCheckingList;
