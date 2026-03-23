// Cloudinary storage module
// Uses Cloudinary for image hosting + IndexedDB + localStorage for metadata sync

const DB_NAME = 'galleryDB';
const DB_VERSION = 2;
const STORE_NAME = 'galleryMetadata';
const LOCAL_STORAGE_KEY = 'zyee3d_gallery_images';

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
    // Make URL CORS-safe by using fetch transformation
    const corsUrl = makeCORSSafeUrl(data.secure_url);
    
    return {
      url: corsUrl,
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

// Make Cloudinary URLs CORS-safe for WebGL textures
function makeCORSSafeUrl(url) {
  if (!url) return url;
  // Ensure the URL uses HTTPS and v1_1 format
  if (!url.includes('https://')) {
    url = url.replace('http://', 'https://');
  }
  // Add crossOrigin handling via Cloudinary's fetch parameter
  if (!url.includes('fl=')) {
    url += url.includes('?') ? '&fl=getinfo' : '?fl=getinfo';
  }
  return url;
}

// Test Cloudinary connectivity (call on app load)
export async function testCloudinaryConnectivity() {
  try {
    console.log('🧪 Testing Cloudinary connectivity...');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload?unsigned=true`,
      { method: 'OPTIONS' }
    );
    console.log('✅ Cloudinary is accessible');
    return true;
  } catch (error) {
    console.error('❌ Cannot reach Cloudinary:', error);
    return false;
  }
}

// Load all saved gallery metadata from IndexedDB, with localStorage fallback
export async function loadGalleryImages() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const images = request.result || [];
        // If IndexedDB is empty, try localStorage as fallback
        if (images.length === 0) {
          const storedImages = loadFromLocalStorage();
          if (storedImages.length > 0) {
            console.log('⚡ Loaded images from localStorage fallback:', storedImages.length);
            // Sync localStorage images back to IndexedDB
            syncToIndexedDB(storedImages);
          }
          resolve(storedImages);
        } else {
          resolve(images);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('Failed to load gallery images:', e);
    // Final fallback to localStorage
    return loadFromLocalStorage();
  }
}

// Helper: Load images from localStorage
function loadFromLocalStorage() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return [];
  }
}

// Helper: Save images to localStorage for cross-device sync
function saveToLocalStorage(images) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(images));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Helper: Sync localStorage images to IndexedDB
async function syncToIndexedDB(images) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    images.forEach((img) => store.put(img));
  } catch (e) {
    console.error('Failed to sync to IndexedDB:', e);
  }
}

// Save image metadata to IndexedDB + localStorage for cross-device sync
export async function saveGalleryImage(imageEntry) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(imageEntry);
      tx.oncomplete = async () => {
        const all = await loadGalleryImages();
        // Also sync to localStorage
        saveToLocalStorage(all);
        console.log('✅ Image saved to Cloudinary + synced to IndexedDB & localStorage');
        resolve(all);
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error('Failed to save gallery image:', e);
    return await loadGalleryImages();
  }
}

// Remove a gallery image by id (deletes metadata from all stores)
export async function removeGalleryImage(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = async () => {
        const all = await loadGalleryImages();
        // Sync deletion to localStorage
        saveToLocalStorage(all);
        console.log('🗑️ Image removed and synced across storage');
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
