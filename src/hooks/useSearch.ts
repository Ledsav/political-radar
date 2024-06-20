import { useState } from 'react';
import { AverageScore } from '../types/types';
import { getAllItems } from '../utils/indexedDb';

type SearchableItem = AverageScore;

const isAverageScore = (item: any): item is AverageScore => {
    return ('party' in item || 'author' in item) && 'average_score' in item;
};

const useSearch = () => {
    const [results, setResults] = useState<SearchableItem[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (queryStr: string) => {
        setLoading(true);
        console.log(`Searching for: ${queryStr}`);

        const allItems = await getAllItems();
        console.log('All items retrieved from IndexedDB:', allItems);

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

    return { results, loading, handleSearch };
};

export default useSearch;
