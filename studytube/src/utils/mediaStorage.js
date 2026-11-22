/**
 * IndexedDB media store for video files.
 * Overcomes localStorage 5MB quota and ephemeral blob URLs by persisting
 * actual File/Blob objects in the browser's IndexedDB.
 */

const DB_NAME = "sea_of_learning_media";
const DB_VERSION = 1;
const STORE_NAME = "videos";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.error = () => reject(request.error);
  });
}

export async function storeVideoBlob(id, fileOrBlob) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(fileOrBlob, id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("Failed to store video in IndexedDB:", err);
    return false;
  }
}

export async function getVideoBlob(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("Failed to retrieve video from IndexedDB:", err);
    return null;
  }
}
