import {IDBPDatabase, openDB} from 'idb';


const DB_NAME = 'factCheckDb';
const DB_VERSION = 1;

interface CachedItem<T> {
    id: string;
    collection: string;
    data: T;
    timestamp: number;
}

let db: IDBPDatabase | null = null;

const initDB = async (): Promise<IDBPDatabase> => {
    if (!db) {
        db = await openDB(DB_NAME, DB_VERSION, {
            upgrade(upgradeDB) {
                console.log('Upgrading database...');
                if (!upgradeDB.objectStoreNames.contains('items')) {
                    const store = upgradeDB.createObjectStore('items', {keyPath: 'id'});
                    store.createIndex('collection', 'collection');
                    store.createIndex('timestamp', 'timestamp');
                    console.log('Object store "items" created.');
                } else {
                    console.log('Object store "items" already exists.');
                }
            },
            blocked() {
                console.error('Database upgrade blocked.');
            },
            blocking() {
                console.error('Database is blocking the version change.');
            },
            terminated() {
                console.error('Database connection terminated unexpectedly.');
            },
        });
    }
    return db;
};

export const setItems = async <T>(collection: string, items: T[]): Promise<void> => {
    try {
        const db = await initDB();
        const tx = db.transaction('items', 'readwrite');
        const store = tx.objectStore('items');

        for (const item of items) {
            const cachedItem: CachedItem<T> = {
                id: `${collection}_${(item as any).id || Date.now()}`,
                collection,
                data: item,
                timestamp: Date.now(),
            };
            await store.put(cachedItem);
        }

        await tx.done;
        console.log(`Set items in IndexedDB for collection: ${collection}`);
    } catch (error) {
        console.error(`Error setting items in IndexedDB for collection: ${collection}`, error);
    }
};


export const getItemsByCollection = async <T>(collection: string): Promise<T[]> => {
    try {
        const db = await initDB();
        const tx = db.transaction('items', 'readonly');
        const store = tx.objectStore('items');
        const index = store.index('collection');
        const items = await index.getAll(collection);
        await tx.done;
        console.log(`Retrieved items from IndexedDB for collection: ${collection}`, items);
        return items.map(item => item.data);
    } catch (error) {
        console.error(`Error getting items from IndexedDB for collection: ${collection}`, error);
        return [];
    }
};


export const getAllItems = async <T>(): Promise<T[]> => {
    try {
        const db = await initDB();
        const items = await db.getAll('items');
        console.log('Retrieved all items from IndexedDB', items);
        return items.map(item => item.data);
    } catch (error) {
        console.error('Error getting all items from IndexedDB', error);
        return [];
    }
};


