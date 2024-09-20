import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

const boundaries = {
  minX: -195.89336411911646,
  maxX: 195.89336411911646,
  minZ: -128.629661363364,
  maxZ: 151.93708797511098,
};

const movementSpeed = 40; // Movement speed

// Main FPS component
function FPSControls() {
  const { camera, gl } = useThree(); // Get camera and renderer
  const [move, setMove] = useState({ forward: false, backward: false, left: false, right: false });
  const velocity = useRef(new THREE.Vector3()); // To control movement

  useEffect(() => {
    // Add event listeners for keyboard controls
    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW': // Move forward
          setMove((prev) => ({ ...prev, forward: true }));
          break;
        case 'KeyS': // Move backward
          setMove((prev) => ({ ...prev, backward: true }));
          break;
        case 'KeyA': // Move left
          setMove((prev) => ({ ...prev, left: true }));
          break;
        case 'KeyD': // Move right
          setMove((prev) => ({ ...prev, right: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
          setMove((prev) => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
          setMove((prev) => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
          setMove((prev) => ({ ...prev, left: false }));
          break;
        case 'KeyD':
          setMove((prev) => ({ ...prev, right: false }));
          break;
        default:
          break;
      }
    };

    // Attach event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      // Clean up event listeners when the component is unmounted
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle camera movement
  const moveCamera = (deltaTime) => {
    const direction = new THREE.Vector3();

    // Move forward and backward
    if (move.forward) {
      camera.getWorldDirection(direction);
      velocity.current.copy(direction).multiplyScalar(movementSpeed * deltaTime);
      camera.position.add(velocity.current);
    }
    if (move.backward) {
      camera.getWorldDirection(direction);
      velocity.current.copy(direction).multiplyScalar(-movementSpeed * deltaTime);
      camera.position.add(velocity.current);
    }

    // Move left and right
    if (move.left || move.right) {
      camera.getWorldDirection(direction);
      direction.cross(camera.up); // Move sideways
      velocity.current.copy(direction).multiplyScalar(move.left ? -movementSpeed * deltaTime : movementSpeed * deltaTime);
      camera.position.add(velocity.current);
    }

    // Enforce boundaries
    camera.position.x = Math.max(boundaries.minX, Math.min(boundaries.maxX, camera.position.x));
    camera.position.z = Math.max(boundaries.minZ, Math.min(boundaries.maxZ, camera.position.z));

    // Optional: Fix camera height
    camera.position.y = 44.58551523738378;
  };

  // Animation loop for updating the camera's position
  useFrame((_, deltaTime) => {
    moveCamera(deltaTime);
  });

  return (
    <>
      {/* PointerLockControls for locking the mouse and enabling FPS movement */}
      <PointerLockControls args={[camera, gl.domElement]} />
    </>
  );
}

export default FPSControls;
