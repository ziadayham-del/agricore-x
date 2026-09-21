import { openDB, idbPut, idbGetAll, idbDelete } from './indexedDB';

let dbPromise: Promise<IDBDatabase> | null = null;
const STORE = 'offlineQueue';

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB('AgriCoreCache', 1, (db) => {
      if (!db.objectStoreNames.contains('dashboardCache')) db.createObjectStore('dashboardCache');
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    });
  }
  return dbPromise;
}

export async function enqueueCommand(commandPayload: any) {
  const db = await getDB();
  await idbPut(db, STORE, { payload: commandPayload, timestamp: Date.now() });
}

export async function getQueuedCommands() {
  const db = await getDB();
  return await idbGetAll(db, STORE);
}

export async function dequeueCommand(id: number) {
  const db = await getDB();
  await idbDelete(db, STORE, id);
}
