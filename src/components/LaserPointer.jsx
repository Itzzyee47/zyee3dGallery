import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Laser pointer that raycasts from camera center and shows a beam + dot
function LaserPointer({ onHitUpdate }) {
  const { camera, scene } = useThree();
  const laserRef = useRef();
  const dotRef = useRef();
  const raycaster = useRef(new THREE.Raycaster());
  const direction = useRef(new THREE.Vector3());

  useFrame(() => {
    // Raycast from camera center
    camera.getWorldDirection(direction.current);
    raycaster.current.set(camera.position, direction.current);

    const intersects = raycaster.current.intersectObjects(scene.children, true);

    // Filter out the laser beam and dot themselves
    const hit = intersects.find(
      (i) => i.object !== laserRef.current && i.object !== dotRef.current
    );

    if (hit) {
      const hitPoint = hit.point;
      const hitNormal = hit.face ? hit.face.normal.clone() : new THREE.Vector3(0, 0, 1);

      // Transform normal to world space
      hitNormal.transformDirection(hit.object.matrixWorld);

      // Update laser beam geometry (line from camera to hit point)
      const laserStart = camera.position.clone().add(direction.current.clone().multiplyScalar(2));
      if (laserRef.current) {
        const positions = laserRef.current.geometry.attributes.position;
        positions.setXYZ(0, laserStart.x, laserStart.y, laserStart.z);
        positions.setXYZ(1, hitPoint.x, hitPoint.y, hitPoint.z);
        positions.needsUpdate = true;
      }

      // Update dot position at hit point (slight offset along normal)
      if (dotRef.current) {
        dotRef.current.position.copy(hitPoint).add(hitNormal.clone().multiplyScalar(0.1));
        dotRef.current.lookAt(
          hitPoint.x + hitNormal.x,
          hitPoint.y + hitNormal.y,
          hitPoint.z + hitNormal.z
        );
        dotRef.current.visible = true;
      }

      // Report hit info to parent
      if (onHitUpdate) {
        onHitUpdate({
          point: hitPoint.clone(),
          normal: hitNormal.clone(),
          distance: hit.distance,
        });
      }
    } else {
      // No hit - extend laser forward and hide dot
      const laserStart = camera.position.clone().add(direction.current.clone().multiplyScalar(2));
      const laserEnd = camera.position.clone().add(direction.current.clone().multiplyScalar(500));
      if (laserRef.current) {
        const positions = laserRef.current.geometry.attributes.position;
        positions.setXYZ(0, laserStart.x, laserStart.y, laserStart.z);
        positions.setXYZ(1, laserEnd.x, laserEnd.y, laserEnd.z);
        positions.needsUpdate = true;
      }
      if (dotRef.current) {
        dotRef.current.visible = false;
      }
      if (onHitUpdate) {
        onHitUpdate(null);
      }
    }
  });

  return (
    <>
      {/* Laser beam line */}
      <line ref={laserRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, 0, 0, -1])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff0000" linewidth={2} transparent opacity={0.6} />
      </line>

      {/* Hit dot */}
      <mesh ref={dotRef} visible={false}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

export default LaserPointer;
