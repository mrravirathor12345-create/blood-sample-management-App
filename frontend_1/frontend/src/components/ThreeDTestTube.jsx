
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import './ThreeDTestTube.css';

const LiquidMesh = ({ scale = 1 }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -0.3, 0]} scale={scale}>
      <cylinderGeometry args={[0.32, 0.32, 1.2, 32]} />
      <meshPhysicalMaterial
        color="#ff3b30"
        emissive="#5f0a1c"
        roughness={0.1}
        metalness={0.2}
        transmission={0.5}
        thickness={0.8}
        clearcoat={1}
      />
    </mesh>
  );
};

const GlassTubeMesh = () => {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 2, 32]} />
        <meshPhysicalMaterial
          color="white"
          transparent
          opacity={0.15}
          roughness={0.05}
          metalness={0.1}
          transmission={1}
          thickness={0.5}
        />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <torusGeometry args={[0.35, 0.05, 16, 32]} />
        <meshPhysicalMaterial
          color="white"
          transparent
          opacity={0.2}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};

const ThreeDTestTube = () => (
  <div className="three-test-tube">
    <Canvas camera={{ position: [0, 0.5, 4], fov: 35 }}>
      <ambientLight intensity={0.8} />
      <spotLight position={[5, 5, 5]} intensity={1.5} color="#ff4593" castShadow />
      <pointLight position={[-5, -2, 5]} intensity={0.5} color="#70001f" />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <LiquidMesh />
        <GlassTubeMesh />
      </Float>
      <ContactShadows position={[0, -1.2, 0]} opacity={0.5} blur={2} far={3} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  </div>
);

export default ThreeDTestTube;
