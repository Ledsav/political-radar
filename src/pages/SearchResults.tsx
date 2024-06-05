import React, { useState } from 'react';
import { AverageScore } from '../types/types';
import { getAllItems } from '../utils/indexedDb';
import SearchBar from '../components/SearchBar';

type SearchableItem = AverageScore;

const isAverageScore = (item: any): item is AverageScore => {
    return ('party' in item || 'author' in item) && 'average_score' in item;
};

const SearchResults: React.FC = () => {
    const [results, setResults] = useState<SearchableItem[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (queryStr: string) => {
        setLoading(true);
        console.log(`Searching for: ${queryStr}`);

        const allItems = await getAllItems();
        console.log('All items retrieved from IndexedDB:', allItems);

        // Flatten the data arrays from all items
        const flattenedData = allItems.reduce((acc, item) => acc.concat(item.data), []);
        console.log('Flattened data:', flattenedData);

        const filteredResults = flattenedData.filter((data: SearchableItem) => {
            return (
                isAverageScore(data) &&
                ((data.author && data.author.toLowerCase().includes(queryStr.toLowerCase())) ||
                    (data.party && data.party.toLowerCase().includes(queryStr.toLowerCase())))
            );
        });

        console.log('Filtered results:', filteredResults);
        setResults(filteredResults);
        setLoading(false);
    };

    return (
        <div>
            <SearchBar onSearch={handleSearch} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {results.map((item, index) => (
                        <li key={index}>
                            <strong>{item.author ? item.author : item.party}</strong>:
                            {item.average_score !== undefined ? item.average_score.toFixed(2) : 'N/A'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchResults;
