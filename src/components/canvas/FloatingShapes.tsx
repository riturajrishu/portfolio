"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  speed: number;
  geometry: "icosahedron" | "torus" | "octahedron" | "dodecahedron";
  scale?: number;
}

function FloatingShape({
  position,
  color,
  speed,
  geometry,
  scale = 1,
}: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * speed * 0.3;
    meshRef.current.rotation.y = t * speed * 0.2;
    meshRef.current.position.y =
      position[1] + Math.sin(t * speed) * 0.5;
  });

  const renderGeometry = () => {
    switch (geometry) {
      case "icosahedron":
        return <icosahedronGeometry args={[1, 1]} />;
      case "torus":
        return <torusGeometry args={[1, 0.3, 16, 32]} />;
      case "octahedron":
        return <octahedronGeometry args={[1, 0]} />;
      case "dodecahedron":
        return <dodecahedronGeometry args={[1, 0]} />;
      default:
        return <icosahedronGeometry args={[1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {renderGeometry()}
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.15}
        wireframe
        distort={0.3}
        speed={2}
      />
    </mesh>
  );
}

export default function FloatingShapes() {
  return (
    <group>
      <FloatingShape
        position={[-4, 2, -3]}
        color="#7c3aed"
        speed={0.4}
        geometry="icosahedron"
        scale={1.5}
      />
      <FloatingShape
        position={[4, -1, -2]}
        color="#3b82f6"
        speed={0.3}
        geometry="torus"
        scale={1.2}
      />
      <FloatingShape
        position={[-2, -3, -4]}
        color="#06b6d4"
        speed={0.5}
        geometry="octahedron"
        scale={1.0}
      />
      <FloatingShape
        position={[3, 3, -5]}
        color="#a78bfa"
        speed={0.35}
        geometry="dodecahedron"
        scale={0.8}
      />
    </group>
  );
}
