import React from 'react';
import useFetchData from '../hooks/useFetchData';
import { AverageScore } from '../types/types';

const AuthorAveragesList: React.FC = () => {
    const { data, loading } = useFetchData('author_averages');

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log('Author Averages Data:', data);

    return (
        <div>
            <h1>Author Averages</h1>
            <ul>
                {data.map((item: AverageScore, index: number) => (
                    <li key={index}>
                        <strong>{item.author}</strong>: {item.average_score !== undefined ? item.average_score.toFixed(2) : 'N/A'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AuthorAveragesList;
