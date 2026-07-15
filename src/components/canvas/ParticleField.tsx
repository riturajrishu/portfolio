"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const scrollY = useRef(0);
  const count = 1200;

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const SINE_TABLE_SIZE = 2048;
  const sineTable = useMemo(() => {
    const table = new Float32Array(SINE_TABLE_SIZE);
    for (let i = 0; i < SINE_TABLE_SIZE; i++) {
      table[i] = Math.sin((i / SINE_TABLE_SIZE) * Math.PI * 2);
    }
    return table;
  }, []);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const purple = new THREE.Color("#7c3aed");
    const blue = new THREE.Color("#3b82f6");
    const cyan = new THREE.Color("#06b6d4");
    const colorChoices = [purple, blue, cyan];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 20;

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Smooth scroll interpolation
    const targetY = scrollY.current * 0.002;
    const targetRotationX = scrollY.current * 0.0005;
    const targetRotationY = scrollY.current * 0.001;

    pointsRef.current.position.y = THREE.MathUtils.lerp(
      pointsRef.current.position.y,
      targetY,
      0.05
    );

    // Combine time-based and scroll-based rotation
    pointsRef.current.rotation.y = t * 0.02 + targetRotationY;
    pointsRef.current.rotation.x = Math.sin(t * 0.01) * 0.1 + targetRotationX;

    const posArr = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    
    // Pre-calculated values for the lookup table index calculations
    const TWO_PI = Math.PI * 2;
    const tableScale = SINE_TABLE_SIZE / TWO_PI;
    const baseIndex = t * tableScale;
    const indexStep = 0.01 * tableScale;
    const mask = SINE_TABLE_SIZE - 1; // 2047 for bitwise wrapping

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Get the index in the sine table using super fast bitwise AND mapping
      const lutIndex = (Math.floor(baseIndex + i * indexStep)) & mask;
      posArr[i3 + 1] += sineTable[lutIndex] * 0.001;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
