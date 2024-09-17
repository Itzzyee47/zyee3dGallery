import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

export function setupFPSControls(camera, renderer) {
    // Add PointerLockControls to the camera
    const controlz = new PointerLockControls(camera, renderer.domElement);
    document.body.addEventListener('click', () => {
      controlz.lock(); // Lock pointer on click to enable movement
    });
  
    // Set movement speed and keys
    const movementSpeed = 40;
    const move = { forward: false, backward: false, left: false, right: false };
  
    // Boundaries (constants for the camera movement limits)
    const boundaries = {
        minX: -195.89336411911646,
        maxX: 195.89336411911646,
        minZ: -128.629661363364,
        maxZ: 151.93708797511098,
    };

    // Log current camera position on spacebar press (for debugging)
    document.addEventListener('keypress', (ev) => {
      if (ev.key === " ") {
        console.log(camera.position);
      }
    });

    // Add keyboard event listeners for movement
    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyW': // Move forward
          move.forward = true;
          break;
        case 'KeyS': // Move backward
          move.backward = true;
          break;
        case 'KeyA': // Move left
          move.left = true;
          break;
        case 'KeyD': // Move right
          move.right = true;
          break;
      }
    });

    document.addEventListener('keyup', (event) => {
      switch (event.code) {
        case 'KeyW': // Stop moving forward
          move.forward = false;
          break;
        case 'KeyS': // Stop moving backward
          move.backward = false;
          break;
        case 'KeyA': // Stop moving left
          move.left = false;
          break;
        case 'KeyD': // Stop moving right
          move.right = false;
          break;
      }
    });

    // Update camera movement based on input and enforce boundaries
    function moveCamera(deltaTime) {
      const direction = new THREE.Vector3();
      
      if (move.forward) {
        camera.getWorldDirection(direction);
        camera.position.add(direction.multiplyScalar(movementSpeed * deltaTime));
      }
      if (move.backward) {
        camera.getWorldDirection(direction);
        camera.position.add(direction.multiplyScalar(-movementSpeed * deltaTime));
      }
      if (move.left) {
        camera.getWorldDirection(direction);
        direction.cross(camera.up);
        camera.position.add(direction.multiplyScalar(-movementSpeed * deltaTime));
      }
      if (move.right) {
        camera.getWorldDirection(direction);
        direction.cross(camera.up);
        camera.position.add(direction.multiplyScalar(movementSpeed * deltaTime));
      }

      // Enforce boundaries
      camera.position.x = Math.max(boundaries.minX, Math.min(boundaries.maxX, camera.position.x));
      camera.position.z = Math.max(boundaries.minZ, Math.min(boundaries.maxZ, camera.position.z));

      // Keep the camera height fixed if needed (optional)
      camera.position.setY(44.58551523738378);
    }

    return { controlz, moveCamera };
}
