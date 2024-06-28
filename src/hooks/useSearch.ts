// src/hooks/useSearch.ts
import {useCallback, useState} from 'react';
import {Party, Politician, SearchableItem} from '../types/types';
import {getAllItems, getItemsByCollection} from '../utils/indexedDb';

const isPolitician = (item: unknown): item is Politician => {
    return (
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'author' in item &&
        'party' in item &&
        'average_score' in item &&
        'count' in item
    );
};

const isParty = (item: unknown): item is Party => {
    return (
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'party' in item &&
        'average_score' in item &&
        'count' in item
    );
};

const useSearch = (collection: string = 'all') => {
    const [results, setResults] = useState<SearchableItem[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(async (queryStr: string, searchType: 'all' | 'author' | 'party' = 'all'): Promise<SearchableItem[]> => {
        setLoading(true);
        console.log(`Searching for: ${queryStr} in collection: ${collection}`);

        try {
            const items: unknown[] = collection !== 'all'
                ? await getItemsByCollection(collection)
                : await getAllItems();

            console.log('Items retrieved from IndexedDB:', items);

            const filteredResults = items.filter((item): item is SearchableItem => {
                if (isPolitician(item)) {
                    if (searchType === 'party') return false;
                    return searchType === 'author'
                        ? item.author.toLowerCase().includes(queryStr.toLowerCase())
                        : item.author.toLowerCase().includes(queryStr.toLowerCase()) || item.party.toLowerCase().includes(queryStr.toLowerCase());
                } else if (isParty(item)) {
                    if (searchType === 'author') return false;
                    return item.party.toLowerCase().includes(queryStr.toLowerCase());
                }
                return false;
            });

            console.log('Filtered results:', filteredResults);
            setResults(filteredResults);
            return filteredResults;
        } catch (error) {
            console.error('Error during search:', error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [collection]);

    return {results, loading, handleSearch};
};

export default useSearch;