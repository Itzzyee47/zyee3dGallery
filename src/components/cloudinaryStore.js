// Cloudinary-only storage module
// Simple localStorage for metadata, all images served from Cloudinary

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  throw new Error('Cloudinary credentials not configured in .env.local');
}

// Upload image to Cloudinary and save metadata
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

// Load all images from localStorage (metadata only)
export async function loadGalleryImages() {
  try {
    const stored = localStorage.getItem('zyee3d_gallery_images');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load images:', error);
    return [];
  }
}

// Save image metadata to localStorage
export async function saveGalleryImage(imageEntry) {
  try {
    const allImages = await loadGalleryImages();
    allImages.push(imageEntry);
    localStorage.setItem('zyee3d_gallery_images', JSON.stringify(allImages));
    return allImages;
  } catch (error) {
    console.error('Failed to save image:', error);
    return await loadGalleryImages();
  }
}

// Remove image metadata from localStorage
export async function removeGalleryImage(id) {
  try {
    const allImages = await loadGalleryImages();
    const filtered = allImages.filter((img) => img.id !== id);
    localStorage.setItem('zyee3d_gallery_images', JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Failed to remove image:', error);
    return await loadGalleryImages();
  }
}

// Generate unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}


