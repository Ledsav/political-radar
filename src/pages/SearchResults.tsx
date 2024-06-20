import React from 'react';
import useSearch from '../hooks/useSearch'; // Adjust the import path as needed
import SearchBar from '../components/SearchBar';

const SearchResults: React.FC = () => {
    const { results, loading, handleSearch } = useSearch();

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
