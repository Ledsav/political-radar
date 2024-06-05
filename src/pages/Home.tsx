import React from 'react';
import FactCheckingList from '../components/FactCheckingList';
import PartyAveragesList from '../components/PartyAveragesList';
import AuthorAveragesList from '../components/AuthorAveragesList';

const Home: React.FC = () => {
    return (
        <div>
            <FactCheckingList />
            <PartyAveragesList />
            <AuthorAveragesList />
        </div>
    );
};

export default Home;
