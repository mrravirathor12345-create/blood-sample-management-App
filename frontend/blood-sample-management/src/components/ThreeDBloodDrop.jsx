import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './ThreeDBloodDrop.css';

const BloodDropMesh = () => {
  const points = useMemo(() => [
    new THREE.Vector2(0, -1.3),
    new THREE.Vector2(0.22, -1.1),
    new THREE.Vector2(0.5, -0.7),
    new THREE.Vector2(0.7, -0.2),
    new THREE.Vector2(0.55, 0.45),
    new THREE.Vector2(0.3, 0.9),
    new THREE.Vector2(0.16, 1.25),
    new THREE.Vector2(0, 1.3),
  ], []);

  return (
    <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.1, 0]}>
      <latheGeometry args={[points, 56]} />
      <meshPhysicalMaterial
        color="#ff4b76"
        emissive="#5f0a1c"
        roughness={0.18}
        metalness={0.4}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transmission={0.4}
      />
    </mesh>
  );
};

const ThreeDBloodDrop = () => (
  <div className="three-drop">
    <Canvas camera={{ position: [0, 0, 4], fov: 35 }}>
      <ambientLight intensity={0.75} />
      <spotLight position={[5, 5, 5]} intensity={1.25} color="#ff4593" />
      <pointLight position={[-5, -2, 5]} intensity={0.4} color="#70001f" />
      <BloodDropMesh />
      <ContactShadows position={[0, -1.35, 0]} opacity={0.45} blur={2.5} far={3} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.1} />
    </Canvas>
  </div>
);

export default ThreeDBloodDrop;
