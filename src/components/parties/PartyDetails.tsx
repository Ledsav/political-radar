import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getItem} from "../../utils/indexedDb";
import {mapCredibilityScore} from "../../utils/numbersOperations";

interface Party {
    party: string;
    orientation: string;
    average_score: number;
    count: number;
    details: string;
    party_image?: string; // Add image field if needed
}

const PartyDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [party, setParty] = useState<Party | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartyDetails = async () => {
            const cachedData = await getItem('party_averages_data');
            let partyData;
            if (cachedData && Array.isArray(cachedData.data)) {
                partyData = cachedData.data.find((p: any, index: number) => index === parseInt(id as string));
            } else if (cachedData && Array.isArray(cachedData)) {
                partyData = cachedData.find((p: any, index: number) => index === parseInt(id as string));
            } else if (cachedData && cachedData.data && Array.isArray(cachedData.data.data)) {
                partyData = cachedData.data.data.find((p: any, index: number) => index === parseInt(id as string));
            } else {
                console.error("Unexpected data format:", cachedData);
            }
            setParty(partyData);
            setLoading(false);
        };

        fetchPartyDetails().then(r => r);
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!party) {
        return <div>No party found</div>;
    }

    const mappedScore = mapCredibilityScore(party.average_score);

    return (
        <div>
            <h1>{party.party}</h1>
            <p>Orientamento: {party.orientation}</p>
            <p>Credibilità: {mappedScore}</p>
            <p>Numero di articoli: {party.count}</p>
            <p>{party.details}</p>
            {party.party_image && <img src={party.party_image} alt={party.party}/>}
        </div>
    );
};

export default PartyDetails;
