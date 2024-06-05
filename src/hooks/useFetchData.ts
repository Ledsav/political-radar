import { useEffect, useState } from 'react';
import { collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../storage/firebase';
import { getItem, setItem } from '../utils/indexedDb';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const useFetchData = (collectionName: string) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async (): Promise<QuerySnapshot<DocumentData>> => {
            return await getDocs(collection(db, collectionName));
        };

        const loadCachedData = async () => {
            const cachedData = await getItem(`${collectionName}_data`);
            const now = Date.now();

            if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
                console.log(`Loaded cached data for ${collectionName}`, cachedData.data);
                setData(cachedData.data);
                setLoading(false);
            } else {
                fetchData().then(querySnapshot => {
                    const dataList = querySnapshot.docs.map(doc => doc.data());
                    console.log(`Fetched data from Firebase for collection: ${collectionName}`, dataList);
                    setItem(`${collectionName}_data`, dataList);
                    setData(dataList);
                    setLoading(false);
                }).catch(error => {
                    console.error(`Error fetching data from Firebase for collection: ${collectionName}`, error);
                    setLoading(false);
                });
            }
        };

        loadCachedData().then(r => r);
    }, [collectionName]);

    return { data, loading };
};

export default useFetchData;
