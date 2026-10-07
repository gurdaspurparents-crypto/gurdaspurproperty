// IndexedDB helper for large media files (walkthrough videos and high-res photos)
// IndexedDB has gigabytes of storage capacity, eliminating localStorage 5MB quota errors.

const DB_NAME = 'gp_media_database';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.warn('IndexedDB open error:', event.target.error);
      resolve(null);
    };
  });
}

export async function saveMediaItem(id, dataUrl, meta = {}) {
  try {
    const db = await openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id, dataUrl, ...meta, updatedAt: Date.now() });

      tx.oncomplete = () => resolve(true);
      tx.onerror = (err) => {
        console.warn('Failed to save to IndexedDB:', err);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('Error in saveMediaItem:', err);
    return false;
  }
}

export async function getMediaItem(id) {
  try {
    const db = await openDB();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Error in getMediaItem:', err);
    return null;
  }
}

export async function deleteMediaItem(id) {
  try {
    const db = await openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
}
