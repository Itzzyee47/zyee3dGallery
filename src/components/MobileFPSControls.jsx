import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const boundaries = {
  minX: -64.60,
  maxX: 598.78,
  minZ: -212.18,
  maxZ: 206.29,
};

const MOVE_SPEED = 45;
const LOOK_SPEED = 1.5;

// Camera controls driven by joystick input refs (works inside R3F Canvas)
export default function MobileFPSControls({ moveRef, lookRef }) {
  const { camera } = useThree();
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

  // Initialize euler from camera on first frame
  const initialized = useRef(false);

  useFrame((_, delta) => {
    if (!initialized.current) {
      euler.current.setFromQuaternion(camera.quaternion, 'YXZ');
      initialized.current = true;
    }

    // --- Look (right joystick) ---
    const look = lookRef.current;
    if (look.x !== 0 || look.y !== 0) {
      euler.current.y -= look.x * LOOK_SPEED * delta;
      euler.current.x += look.y * LOOK_SPEED * delta;
      // Clamp vertical look to avoid flipping
      euler.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    }

    // --- Move (left joystick) ---
    const mv = moveRef.current;
    if (mv.x !== 0 || mv.y !== 0) {
      const direction = new THREE.Vector3();

      // Forward/backward (y axis of joystick)
      if (mv.y !== 0) {
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
        camera.position.addScaledVector(direction, mv.y * MOVE_SPEED * delta);
      }

      // Left/right (x axis of joystick)
      if (mv.x !== 0) {
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
        direction.cross(camera.up);
        camera.position.addScaledVector(direction, mv.x * MOVE_SPEED * delta);
      }
    }

    // Enforce boundaries
    camera.position.x = Math.max(boundaries.minX, Math.min(boundaries.maxX, camera.position.x));
    camera.position.z = Math.max(boundaries.minZ, Math.min(boundaries.maxZ, camera.position.z));
    // Fix height
    camera.position.y = 44.58551523738378;
  });

  return null;
}
