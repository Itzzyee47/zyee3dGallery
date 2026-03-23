import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// Firebase configuration (from .env.local)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection reference
const IMAGES_COLLECTION = 'gallery_images';

/**
 * Load all images from Firestore
 * Images are sorted by newest first
 */
export async function loadImagesFromFirestore() {
  try {
    const q = query(collection(db, IMAGES_COLLECTION), orderBy('addedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Failed to load images from Firestore:', error);
    throw error;
  }
}

/**
 * Save image metadata to Firestore
 * Image itself is on Cloudinary, only metadata stored here
 */
export async function saveImageToFirestore(imageData) {
  try {
    const docRef = await addDoc(collection(db, IMAGES_COLLECTION), {
      ...imageData,
      addedAt: new Date().toISOString(),
      createdAt: new Date(), // For Firestore sorting
    });
    
    return {
      id: docRef.id,
      ...imageData,
    };
  } catch (error) {
    console.error('Failed to save image to Firestore:', error);
    throw error;
  }
}

/**
 * Delete image metadata from Firestore
 * (Cloudinary image link is deleted separately if needed)
 */
export async function deleteImageFromFirestore(imageId) {
  try {
    await deleteDoc(doc(db, IMAGES_COLLECTION, imageId));
  } catch (error) {
    console.error('Failed to delete image from Firestore:', error);
    throw error;
  }
}

export { db };
