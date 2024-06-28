import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getItemsByCollection} from "../../utils/indexedDb";
import {Party} from '../../types/types';
import DetailPage from '../shared/DetailPage';
import {createReasonTemplate} from "../../utils/reasonOperations";
import {
    getScoreReferences,
    mapActivityScore,
    mapControversyScore,
    mapCredibilityScore,
    mapOverallScore
} from "../../utils/scoresOperations";

const usePartyData = (id: string | undefined) => {
    const [party, setParty] = useState<Party | null>(null);
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

            const collectionName = 'party_averages';
            const cachedData = await getItemsByCollection<Party>(collectionName);
            const partyData = cachedData.find(p => p.id === id);

            if (partyData) {
                setParty(partyData);
                // Fetch score references and map scores
                const scoreReferences = await getScoreReferences(collectionName);
                setMappedScores({
                    credibility: mapCredibilityScore(partyData.average_score),
                    overall: mapOverallScore(partyData.overall_score),
                    activity: mapActivityScore(partyData.activity_score, scoreReferences.avgActivityScore, scoreReferences.stdActivityScore),
                    controversy: mapControversyScore(partyData.controversy_score, scoreReferences.maxControversyScore)
                });

                console.log('controversy party,', partyData.controversy_score)
                console.log('max party,', scoreReferences.maxControversyScore)
            } else {
                console.error("Party not found");
            }
            setLoading(false);
        };

        fetchPoliticianDetails().then(r => r);
    }, [id]);

    return {party, loading, mappedScores};
};


const PartyDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {party, loading, mappedScores} = usePartyData(id);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!party) {
        return <div>Nessun politico trovato</div>;
    }

    const reason = createReasonTemplate(party);

    const formatDate = (date: string | { seconds: number, nanoseconds: number }) => {
        if (typeof date === 'string') {
            return new Date(date).toLocaleDateString('it-IT');
        } else {
            return new Date(date.seconds * 1000).toLocaleDateString('it-IT');
        }
    };

    return (
        <DetailPage
            name={party.party}
            subtitle={party.orientation}
            description={`${party.party} è un partito politico con orientamento ${party.orientation}.`}
            credibilityScore={mappedScores.credibility}
            overallScore={mappedScores.overall}
            activityScore={mappedScores.activity}
            controversyScore={mappedScores.controversy}
            image={party.party_image || ''}
            reason={reason}
            topTopics={JSON.stringify(party.top_topics)}
            orientation={party.orientation}
            firstDate={formatDate(party.first_date)}
            lastDate={formatDate(party.last_date)}
            statementsCount={party.count}
        />
    );
};

export default PartyDetails;