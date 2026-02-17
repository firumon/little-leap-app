import { openDB } from 'idb';

const DB_NAME = 'little-leap-aql-db';
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
        // Store for API responses used as a local cache
        if (!db.objectStoreNames.contains('api-cache')) {
            db.createObjectStore('api-cache', { keyPath: 'url' });
        }

        // Store for pending mutations (POST/PUT/DELETE) that need to be synced
        if (!db.objectStoreNames.contains('sync-queue')) {
            db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true });
        }

        // Generic store for application state/data
        if (!db.objectStoreNames.contains('app-data')) {
            db.createObjectStore('app-data');
        }
    },
});

export async function getCache(url) {
    return (await dbPromise).get('api-cache', url);
}

export async function setCache(url, data) {
    return (await dbPromise).put('api-cache', {
        url,
        data,
        timestamp: Date.now()
    });
}

export async function addToSyncQueue(requestData) {
    return (await dbPromise).add('sync-queue', {
        ...requestData,
        timestamp: Date.now()
    });
}

export async function getSyncQueue() {
    return (await dbPromise).getAll('sync-queue');
}

export async function removeFromSyncQueue(id) {
    return (await dbPromise).delete('sync-queue', id);
}
