"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense } from "react";
import ParticleField from "./ParticleField";
import FloatingShapes from "./FloatingShapes";

export default function Scene3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#7c3aed" />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.3}
            color="#3b82f6"
          />
          <fog attach="fog" args={["#030014", 5, 25]} />
          <ParticleField />
          <FloatingShapes />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
