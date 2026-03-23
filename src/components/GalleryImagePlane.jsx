import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Renders a single image as a textured plane in the 3D scene
const WALL_OFFSET = 1.5; // Distance from wall to prevent z-fighting/clipping

function GalleryImagePlane({ imageUrl, position, normal, width = 55, height = 48 }) {
  const meshRef = useRef();

  // Compute the offset position (push image away from wall along normal)
  const offsetPosition = [
    position[0] + (normal ? normal.x * WALL_OFFSET : 0),
    position[1] + (normal ? normal.y * WALL_OFFSET : 0),
    position[2] + (normal ? normal.z * WALL_OFFSET : 0),
  ];

  useEffect(() => {
    if (!meshRef.current || !imageUrl) {
      console.warn('⚠️ Missing meshRef or imageUrl:', { hasRef: !!meshRef.current, hasUrl: !!imageUrl });
      return;
    }

    console.log('🔄 Loading image:', imageUrl);
    const loader = new THREE.TextureLoader();
    
    loader.load(
      imageUrl,
      (texture) => {
        console.log('✅ Image loaded successfully:', imageUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        
        if (!meshRef.current) {
          console.warn('⚠️ Mesh ref no longer available after texture load');
          return;
        }
        
        meshRef.current.material.map = texture;
        meshRef.current.material.needsUpdate = true;

        // Adjust aspect ratio based on image dimensions
        const imgAspect = texture.image.width / texture.image.height;
        if (imgAspect > 1) {
          meshRef.current.scale.set(width, width / imgAspect, 1);
        } else {
          meshRef.current.scale.set(height * imgAspect, height, 1);
        }
      },
      (progressEvent) => {
        const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
        console.log(`⏳ Loading progress: ${percentComplete.toFixed(0)}%`, imageUrl);
      },
      (error) => {
        console.error('❌ Failed to load image:', imageUrl, error);
        console.error('Error type:', error.type);
        console.error('Error message:', error.message);
        
        // Check if it's a CORS error
        if (error.message?.includes('cors') || error.message?.includes('CORS')) {
          console.error('🚫 CORS ERROR: Canvas may be tainted. Check Cloudinary settings.');
        }
      }
    );
  }, [imageUrl, width, height]);

  useEffect(() => {
    if (!meshRef.current || !normal) return;

    // Orient the plane to face outward from the wall surface
    const lookTarget = new THREE.Vector3(
      offsetPosition[0] + normal.x,
      offsetPosition[1] + normal.y,
      offsetPosition[2] + normal.z
    );
    meshRef.current.lookAt(lookTarget);
  }, [offsetPosition, normal]);

  return (
    <mesh ref={meshRef} position={offsetPosition}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

// Renders all gallery images from the stored data
function GalleryImages({ images }) {
  return (
    <>
      {images.map((img) => (
        <GalleryImagePlane
          key={img.id}
          imageUrl={img.imageUrl}
          position={[img.position.x, img.position.y, img.position.z]}
          normal={img.normal}
          width={img.width || 25}
          height={img.height || 18}
        />
      ))}
    </>
  );
}

export { GalleryImagePlane, GalleryImages };
