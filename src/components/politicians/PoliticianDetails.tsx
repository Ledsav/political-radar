import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getItemsByCollection} from "../../utils/indexedDb";
import {Politician} from '../../types/types';
import DetailPage from '../shared/DetailPage';
import {createReasonTemplate} from "../../utils/reasonOperations";
import {
    getScoreReferences,
    mapActivityScore,
    mapControversyScore,
    mapCredibilityScore,
    mapOverallScore
} from "../../utils/scoresOperations";

// Custom hook for fetching and mapping politician data
const usePoliticianData = (id: string | undefined) => {
    const [politician, setPolitician] = useState<Politician | null>(null);
    const [loading, setLoading] = useState(true);
    const [mappedScores, setMappedScores] = useState({
        credibility: 0,
        overall: 0,
        activity: 0,
        controversy: 0
    });

    useEffect(() => {
        const fetchPoliticianDetails = async () => {
            if (!id) return;

            const collectionName = 'author_averages';
            const cachedData = await getItemsByCollection<Politician>(collectionName);
            const politicianData = cachedData.find(p => p.id === id);

            if (politicianData) {
                setPolitician(politicianData);

                // Fetch score references and map scores
                const scoreReferences = await getScoreReferences(collectionName);
                setMappedScores({
                    credibility: mapCredibilityScore(politicianData.average_score),
                    overall: mapOverallScore(politicianData.overall_score),
                    activity: mapActivityScore(politicianData.activity_score, scoreReferences.avgActivityScore, scoreReferences.stdActivityScore),
                    controversy: mapControversyScore(politicianData.controversy_score, scoreReferences.maxControversyScore)
                });
            } else {
                console.error("Politician not found");
            }
            setLoading(false);
        };

        fetchPoliticianDetails().then(r => r);
    }, [id]);

    return {politician, loading, mappedScores};
};

const PoliticianDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {politician, loading, mappedScores} = usePoliticianData(id);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!politician) {
        return <div>Nessun politico trovato</div>;
    }

    const reason = createReasonTemplate(politician);

    const formatDate = (date: string | { seconds: number, nanoseconds: number }) => {
        if (typeof date === 'string') {
            return new Date(date).toLocaleDateString('it-IT');
        } else {
            return new Date(date.seconds * 1000).toLocaleDateString('it-IT');
        }
    };

    return (
        <DetailPage
            name={politician.author}
            subtitle={politician.party}
            description={`${politician.author} è un politico appartenente al partito ${politician.party}.`}
            credibilityScore={mappedScores.credibility}
            overallScore={mappedScores.overall}
            activityScore={mappedScores.activity}
            controversyScore={mappedScores.controversy}
            image={politician.author_image || ''}
            reason={reason}
            topTopics={JSON.stringify(politician.top_topics)}
            orientation={politician.orientation}
            firstDate={formatDate(politician.first_date)}
            lastDate={formatDate(politician.last_date)}
            statementsCount={politician.count}
        />
    );
};

export default PoliticianDetails;