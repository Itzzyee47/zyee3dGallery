// Gallery image storage utility
// Uses IndexedDB for large image storage (no size limits like localStorage)

const DB_NAME = 'galleryDB';
const DB_VERSION = 1;
const STORE_NAME = 'images';

// Open or create the IndexedDB database
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Load all saved gallery images
export async function loadGalleryImages() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('Failed to load gallery images:', e);
    return [];
  }
}

// Save a new image to the gallery
export async function saveGalleryImage(imageEntry) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(imageEntry);
      tx.oncomplete = async () => {
        const all = await loadGalleryImages();
        resolve(all);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error('Failed to save gallery image:', e);
    return await loadGalleryImages();
  }
}

// Remove a gallery image by id
export async function removeGalleryImage(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = async () => {
        const all = await loadGalleryImages();
        resolve(all);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error('Failed to remove gallery image:', e);
    return await loadGalleryImages();
  }
}

// Generate a unique id
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Read a file as base64 data URL
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
