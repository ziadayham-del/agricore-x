import { openDB, idbGet, idbPut } from './indexedDB';

let dbPromise: Promise<IDBDatabase> | null = null;
const STORE = 'dashboardCache';

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB('AgriCoreCache', 1, (db) => {
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      if (!db.objectStoreNames.contains('offlineQueue')) db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
    });
  }
  return dbPromise;
}

export async function cacheDashboardState(key: string, data: any) {
  const db = await getDB();
  await idbPut(db, STORE, { data, timestamp: Date.now() }, key);
}

export async function getCachedDashboardState(key: string) {
  const db = await getDB();
  return await idbGet(db, STORE, key);
}
