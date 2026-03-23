import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import FPSControls from './gwithFPS';
import MobileFPSControls from './MobileFPSControls';
import VirtualJoystick from './VirtualJoystick';
import { useIsMobile } from './useIsMobile';
import { lights } from './lightValues';
import LaserPointer from './LaserPointer';
import { GalleryImages } from './GalleryImagePlane';
import ImageSelectMenu from './ImageSelectMenu';
import {
  loadGalleryImages,
  saveGalleryImage,
  generateId,
  uploadToCloudinary,
} from './cloudinaryStore';


function PointLight() {
  return <pointLight position={[0, 70, 0]} intensity={2000} />;
}

function RectAreaLights({ lights }) {
  return lights.map((lightData, index) => {
    const { position, rotation, color = 0xffffff, intensity = 20, width = 45, height = 4 } = lightData;
    return (
      <rectAreaLight
        key={index}
        color={color}
        intensity={intensity}
        width={width}
        height={height}
        position={position}
        rotation={rotation}
      />
    );
  });
}


function Model({ path, scale = [1, 1, 1], position = [0, 0, 0], name }) {
  const { scene } = useGLTF(path);
  scene.scale.set(...scale);
  scene.position.set(...position);
  scene.name = name;

  const modelRef = useRef();
  useFrame(() => {
    modelRef.current.rotation.y += 0.01;
  });
  
  // Optimize materials for better performance
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.roughness = 0.2;
      child.material.envMapIntensity = 0.3;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  
  return <primitive ref={modelRef} object={scene} />;
}

function Model2({ path, scale = [1, 1, 1], position = [0, 0, 0], name }) {
  const { scene, animations } = useGLTF(path);
  const modelRef = useRef();
  const { actions } = useAnimations(animations, modelRef);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Play all animations if they exist
    if (animations && animations.length > 0) {
      Object.values(actions).forEach((action) => {
        if (action) action.play();
      });
    }
  }, [animations, actions]);

  // Set position and scale
  scene.scale.set(...scale);
  scene.position.set(...position);
  scene.name = name;

  // Optimize materials for mobile and desktop performance
  scene.traverse((child) => {
    if (child.isMesh) {
      // Enhance visual quality with proper material settings
      child.material.roughness = 0.15;
      child.material.metalness = 0.5;
      child.material.envMapIntensity = 0.2;
      
      // Enable shadows for better depth perception
      child.castShadow = true;
      child.receiveShadow = true;
      
      // Optimize for mobile
      if (isMobile) {
        child.material.side = 2; // DoubleSide optimization
      }
    }
  });

  return <primitive ref={modelRef} object={scene} />;
}

function ThreeScene() {
  const isMobile = useIsMobile();
  const [galleryImages, setGalleryImages] = useState([]);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [laserHit, setLaserHit] = useState(null);
  const pendingHitRef = useRef(null);

  // Joystick input refs (shared between DOM joystick and Canvas controls)
  const moveInput = useRef({ x: 0, y: 0 });
  const lookInput = useRef({ x: 0, y: 0 });

  const handleMove = useCallback((v) => { moveInput.current = v; }, []);
  const handleLook = useCallback((v) => { lookInput.current = v; }, []);

  // Load saved images on mount
  useEffect(() => {
    loadGalleryImages().then(setGalleryImages);
  }, []);

  // Handle laser hit updates
  const handleHitUpdate = useCallback((hitInfo) => {
    setLaserHit(hitInfo);
  }, []);

  // Listen for P key to open image menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyP' && !showImageMenu) {
        if (laserHit) {
          pendingHitRef.current = { ...laserHit };
          setShowImageMenu(true);
          // Exit pointer lock so user can interact with the menu
          if (document.pointerLockElement) {
            document.exitPointerLock();
          }
        }
      }
      if (e.code === 'Escape' && showImageMenu) {
        setShowImageMenu(false);
        pendingHitRef.current = null;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [laserHit, showImageMenu]);

  // Handle image selection from the menu
  const handleImageSelected = async (file) => {
    try {
      console.log('Uploading image to Cloudinary...');
      const cloudinaryData = await uploadToCloudinary(file);
      const hit = pendingHitRef.current;

      if (!hit) return;

      // Store only metadata + Cloudinary URL in IndexedDB
      const entry = {
        id: generateId(),
        name: file.name,
        imageUrl: cloudinaryData.url, // Use Cloudinary URL instead of base64
        publicId: cloudinaryData.publicId, // For potential deletion later
        position: { x: hit.point.x, y: hit.point.y, z: hit.point.z },
        normal: { x: hit.normal.x, y: hit.normal.y, z: hit.normal.z },
        width: 52.5,
        height: 35,
        addedAt: new Date().toISOString(),
      };

      const updated = await saveGalleryImage(entry);
      setGalleryImages(updated);
      setShowImageMenu(false);
      pendingHitRef.current = null;
    } catch (err) {
      console.error('Failed to add image:', err);
      alert('Failed to upload image. Check console for details.');
    }
  };

  const handleCancelMenu = () => {
    setShowImageMenu(false);
    pendingHitRef.current = null;
  };

  return (
    <>
    <Canvas
      camera={{ position: [577.5609661389192, 44.58551523738378, 15.620699438870597], fov: 75 }}
      onCreated={({ gl }) => {
        gl.setPixelRatio(window.devicePixelRatio);
        gl.shadowMap.enabled = true;
      }}
      shadows
    >
      <ambientLight intensity={1} />
      <RectAreaLights lights={lights} />
      
        <Model path="/models/donut.glb" scale={[8, 8, 8]} position={[0, 40, 0]} name="Donut" />
        <Model2 path="/models/scene.gltf" scale={[10, 10, 10]} position={[0, 0, 0]} name="Gallery" />
      
      <GalleryImages images={galleryImages} />
      <LaserPointer onHitUpdate={handleHitUpdate} />
      <PointLight />
      {isMobile ? (
        <MobileFPSControls moveRef={moveInput} lookRef={lookInput} />
      ) : (
        <FPSControls />
      )}
    </Canvas>

    {/* Crosshair */}
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: 'red',
      border: '1px solid white',
      zIndex: 10,
      pointerEvents: 'none',
    }} />

    {/* P key hint */}
    {/* <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'white',
      fontSize: '14px',
      fontFamily: 'monospace',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: '8px 16px',
      borderRadius: '8px',
      zIndex: 10,
      pointerEvents: 'none',
    }}>
      Press <strong>P</strong> to place an image at the laser point
    </div> */}

    {/* Mobile joysticks */}
    {isMobile && !showImageMenu && (
      <VirtualJoystick onMove={handleMove} onLook={handleLook} />
    )}

    {/* Mobile place-image button */}
    {/* {isMobile && !showImageMenu && laserHit && (
      <button
        onClick={() => {
          pendingHitRef.current = { ...laserHit };
          setShowImageMenu(true);
        }}
        style={{
          position: 'fixed',
          bottom: 170,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          fontSize: 14,
          fontFamily: 'monospace',
          fontWeight: 700,
          color: '#fff',
          background: 'rgba(37, 99, 235, 0.85)',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: 12,
          zIndex: 100,
          touchAction: 'manipulation',
        }}
      >
        Place Image
      </button>
    )} */}

    {/* Image selection overlay */}
    <ImageSelectMenu
      visible={showImageMenu}
      onImageSelected={handleImageSelected}
      onCancel={handleCancelMenu}
    />
    </>
  );
}

export default ThreeScene;