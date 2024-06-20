import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getItem} from "../../utils/indexedDb";
import {mapCredibilityScore} from "../../utils/numbersOperations";

interface Politician {
    author: string;
    party: string;
    details: string;
    average_score: number;
    count: number;
    author_image?: string;
}

const PoliticianDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [politician, setPolitician] = useState<Politician | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPoliticianDetails = async () => {
            const cachedData = await getItem('author_averages_data');
            let politicianData;
            if (cachedData && Array.isArray(cachedData.data)) {
                politicianData = cachedData.data.find((p: any, index: number) => index === parseInt(id as string));
            } else if (cachedData && Array.isArray(cachedData)) {
                politicianData = cachedData.find((p: any, index: number) => index === parseInt(id as string));
            } else if (cachedData && cachedData.data && Array.isArray(cachedData.data.data)) {
                politicianData = cachedData.data.data.find((p: any, index: number) => index === parseInt(id as string));
            } else if (cachedData && Array.isArray(cachedData.data)) {
                politicianData = cachedData.data.find((p: any, index: number) => index === parseInt(id as string));
            } else {
                console.error("Unexpected data format:", cachedData);
            }
            setPolitician(politicianData);
            setLoading(false);
        };

        fetchPoliticianDetails().then(r => r);
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!politician) {
        return <div>Nessun politico trovato</div>;
    }

    const mappedScore = mapCredibilityScore(politician.average_score);

    return (
        <div>
            <h1>{politician.author}</h1>
            <p>Partito: {politician.party}</p>
            <p>Credibilità: {mappedScore}</p>
            <p>Numero di articoli: {politician.count}</p>
            <p>{politician.details}</p>
            {politician.author_image && <img src={politician.author_image} alt={politician.author}/>}
        </div>
    );
};

export default PoliticianDetails;
