const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src', 'lib', 'cache');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'indexedDB.ts'), `export function openDB(dbName: string, version: number, upgradeCallback: (db: IDBDatabase) => void): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject('Not in browser');
    const request = indexedDB.open(dbName, version);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e: any) => upgradeCallback(e.target.result);
  });
}

export function idbGet(db: IDBDatabase, storeName: string, key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function idbPut(db: IDBDatabase, storeName: string, value: any, key?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const request = key ? tx.objectStore(storeName).put(value, key) : tx.objectStore(storeName).put(value);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function idbGetAll(db: IDBDatabase, storeName: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function idbDelete(db: IDBDatabase, storeName: string, key: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const request = tx.objectStore(storeName).delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
`);

fs.writeFileSync(path.join(dir, 'telemetryCache.ts'), `import { openDB, idbGet, idbPut } from './indexedDB';

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
`);

fs.writeFileSync(path.join(dir, 'offlineQueue.ts'), `import { openDB, idbPut, idbGetAll, idbDelete } from './indexedDB';

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
`);

console.log('Created cache components');
