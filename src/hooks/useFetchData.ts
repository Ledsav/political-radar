import {useEffect, useState} from 'react';
import {collection, getDocs} from 'firebase/firestore';
import {db as firebaseDB} from '../storage/firebase';
import {getItemsByCollection, setItems} from '../utils/indexedDb';
import {SearchableItem} from '../types/types';
import {updateScoreReferences} from "../utils/scoresOperations";

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const useFetchData = (collectionName: string) => {
    const [data, setData] = useState<SearchableItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(firebaseDB, collectionName));
                const dataList = querySnapshot.docs.map(doc => ({
                    id: doc.id, ...doc.data(),
                    timestamp: Date.now()
                } as SearchableItem));
                console.log(`Fetched data from Firebase for collection: ${collectionName}`, dataList);
                await updateScoreReferences(dataList, collectionName);
                await setItems(collectionName, dataList);
                setData(dataList);
            } catch (error: unknown) {
                console.error(`Error fetching data from Firebase for collection: ${collectionName}`, error);
                setError(`Error fetching data: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                setLoading(false);
            }
        };

        const loadCachedData = async () => {
            try {
                const cachedData = await getItemsByCollection<SearchableItem>(collectionName);
                if (cachedData.length > 0) {
                    const now = Date.now();
                    const oldestTimestamp = Math.min(...cachedData.map(item => item.timestamp || now));

                    if (now - oldestTimestamp < CACHE_DURATION) {
                        console.log(`Loaded cached data for ${collectionName}`, cachedData);
                        setData(cachedData);
                        setLoading(false);
                        return true;
                    }
                }
            } catch (error: unknown) {
                console.error(`Error loading cached data for collection: ${collectionName}`, error);
            }
            return false;
        };

        loadCachedData().then(cacheLoaded => {
            if (!cacheLoaded) {
                console.log("Fetching data from Firebase...");
                fetchData().then(r => r);
            }
        });
    }, [collectionName]);

    return {data, loading, error};
};

export default useFetchData;
