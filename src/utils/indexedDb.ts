import { openDB } from 'idb';

const DB_NAME = 'factCheckDb';
const DB_VERSION = 1;
const STORE_NAME = 'factCheckStore';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
        db.createObjectStore(STORE_NAME);
    },
});

interface CachedItem {
    data: any;
    timestamp: number;
}

export const setItem = async (key: string, value: any) => {
    const db = await dbPromise;
    const cachedItem: CachedItem = {
        data: value,
        timestamp: Date.now(),
    };
    console.log(`Setting item in IndexedDB: ${key}`, cachedItem);
    return db.put(STORE_NAME, cachedItem, key);
};

export const getItem = async (key: string): Promise<CachedItem | undefined> => {
    const db = await dbPromise;
    const item = await db.get(STORE_NAME, key);
    console.log(`Retrieved item from IndexedDB: ${key}`, item);
    return item;
};

export const getAllItems = async (): Promise<CachedItem[]> => {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const items: CachedItem[] = [];
    let cursor = await store.openCursor();

    while (cursor) {
        items.push(cursor.value);
        cursor = await cursor.continue();
    }

    await tx.done;
    console.log('Retrieved all items from IndexedDB', items);
    return items;
};
