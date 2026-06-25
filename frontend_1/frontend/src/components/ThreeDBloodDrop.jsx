import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import './ThreeDBloodDrop.css';

const BloodDropMesh = () => {
  const meshRef = useRef();
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

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.02);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.1}>
      <mesh ref={meshRef} rotation={[Math.PI, 0, 0]} position={[0, -0.1, 0]}>
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
    </Float>
  );
};

const ThreeDBloodDrop = () => (
  <div className="three-drop">
    <Canvas camera={{ position: [0, 0, 4], fov: 35 }}>
      <ambientLight intensity={0.85} />
      <spotLight position={[5, 5, 5]} intensity={1.5} color="#ff4593" castShadow />
      <pointLight position={[-5, -2, 5]} intensity={0.5} color="#70001f" />
      <BloodDropMesh />
      <ContactShadows position={[0, -1.35, 0]} opacity={0.5} blur={2.5} far={3} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
    </Canvas>
  </div>
);

export default ThreeDBloodDrop;
