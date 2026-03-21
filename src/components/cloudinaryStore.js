// Cloudinary storage module
// Uses Cloudinary for image hosting + IndexedDB for metadata

const DB_NAME = 'galleryDB';
const DB_VERSION = 2;
const STORE_NAME = 'galleryMetadata';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.warn(
    'Cloudinary credentials missing! Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.local'
  );
}

// Open or create IndexedDB for metadata storage
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

// Upload image to Cloudinary
export async function uploadToCloudinary(file) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary credentials not configured');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'xr-gallery/images');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      size: data.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// Load all saved gallery metadata from IndexedDB
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

// Save image metadata to IndexedDB (image itself is on Cloudinary)
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

// Remove a gallery image by id (deletes metadata, Cloudinary keeps the file)
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
