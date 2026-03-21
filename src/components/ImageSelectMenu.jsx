import React, { useRef, useState } from 'react';

// HTML overlay for selecting an image file
// Renders outside the Canvas as a DOM overlay
function ImageSelectMenu({ visible, onImageSelected, onCancel }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  if (!visible) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploading(true);
      try {
        await onImageSelected(file);
      } finally {
        setUploading(false);
      }
    }
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploading(true);
      try {
        await onImageSelected(file);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h2 style={styles.title}>Add Image to Gallery</h2>
        <p style={styles.subtitle}>Select an image to place at the laser point</p>

        {uploading ? (
          <div style={styles.dropZone}>
            <div style={styles.dropIcon}>⏳</div>
            <p style={styles.dropText}>Uploading to Cloudinary...</p>
            <p style={styles.dropHint}>Please wait</p>
          </div>
        ) : (
          <div style={styles.dropZone} onClick={() => fileInputRef.current?.click()}>
            <div style={styles.dropIcon}>📷</div>
            <p style={styles.dropText}>Click to browse or drag & drop an image here</p>
            <p style={styles.dropHint}>Supports: JPG, PNG, WEBP</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={uploading}
        />

        <button style={styles.cancelBtn} onClick={onCancel} disabled={uploading}>
          Cancel (Esc)
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    cursor: 'default',
  },
  modal: {
    backgroundColor: '#1a1a2e',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '460px',
    width: '90%',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  },
  title: {
    color: '#fff',
    margin: '0 0 8px 0',
    fontSize: '1.6rem',
    fontFamily: 'sans-serif',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '0 0 25px 0',
    fontSize: '0.95rem',
    fontFamily: 'sans-serif',
  },
  dropZone: {
    border: '2px dashed rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '35px 20px',
    cursor: 'pointer',
    transition: 'border-color 0.3s',
    marginBottom: '20px',
  },
  dropIcon: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  dropText: {
    color: '#fff',
    margin: '0 0 8px 0',
    fontSize: '1rem',
    fontFamily: 'sans-serif',
  },
  dropHint: {
    color: 'rgba(255, 255, 255, 0.4)',
    margin: 0,
    fontSize: '0.85rem',
    fontFamily: 'sans-serif',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    padding: '10px 30px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontFamily: 'sans-serif',
    transition: 'all 0.2s',
  },
};

export default ImageSelectMenu;
