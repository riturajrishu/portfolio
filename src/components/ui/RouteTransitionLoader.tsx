"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Glitch, ChromaticAberration } from "@react-three/postprocessing";
import { GlitchMode, BlendFunction } from "postprocessing";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";

function SpinningCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && coreRef.current && ringRef1.current && ringRef2.current) {
      const t = state.clock.elapsedTime;
      
      meshRef.current.rotation.x = t * 1.5;
      meshRef.current.rotation.y = t * 2.0;
      
      coreRef.current.rotation.x = t * -1.0;
      coreRef.current.rotation.y = t * -1.5;

      ringRef1.current.rotation.x = t * 4.0;
      ringRef1.current.rotation.y = t * 0.5;
      
      ringRef2.current.rotation.x = t * 0.5;
      ringRef2.current.rotation.y = t * -4.0;

      // Add an intense pulsing scale effect
      const scale = 1 + Math.sin(t * 15) * 0.08;
      meshRef.current.scale.set(scale, scale, scale);
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Outer Wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial color="#7c3aed" wireframe={true} transparent opacity={0.6} />
      </mesh>

      {/* Fast Spinning Rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} />
      </mesh>
      <mesh ref={ringRef2}>
        <torusGeometry args={[2.8, 0.02, 16, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
      </mesh>
      
      {/* Inner solid glowing core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Module-level trigger so any component can fire the loader instantly
let _triggerTransition: (() => void) | null = null;
export function triggerRouteTransition() {
  _triggerTransition?.();
}

export default function RouteTransitionLoader() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isInitialMount = useRef(true);
  const lastPathname = useRef(pathname);

  // Register the module-level trigger
  useEffect(() => {
    _triggerTransition = () => setIsTransitioning(true);
    return () => { _triggerTransition = null; };
  }, []);

  // Trigger instantly on link click to mask Next.js routing delay
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (!link) return;
      
      const href = link.getAttribute("href");
      const targetAttr = link.getAttribute("target");
      
      // Check if it's an internal link
      if (href && href.startsWith("/") && !href.startsWith("//") && targetAttr !== "_blank") {
        const currentPath = window.location.pathname;
        const targetPath = href.split('#')[0] || "/";
        
        // Only trigger if we are actually navigating to a different page
        if (targetPath !== currentPath) {
          setIsTransitioning(true);
        }
      }
    };

    // Use capture phase to catch the click instantly
    document.addEventListener("click", handleLinkClick, true);
    
    return () => {
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, []);

  // Also trigger on pathname change (for browser back/forward buttons)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (pathname !== lastPathname.current) {
      lastPathname.current = pathname;
      setIsTransitioning(true);
    }
  }, [pathname]);

  // Handle the automatic fade-out
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTransitioning) {
      timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [isTransitioning]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-[#030014] flex flex-col items-center justify-center overflow-hidden pointer-events-auto"
        >
          {/* CRT Scanlines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none mix-blend-overlay z-10" />

          {/* Glitchy Text and Progress Line */}
          <div className="absolute bottom-1/4 left-0 w-full flex flex-col items-center justify-center z-20 pointer-events-none">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-[#a78bfa] text-[10px] sm:text-xs tracking-[0.4em] uppercase font-mono mb-4 glow-purple"
            >
              Establishing Connection...
            </motion.p>
            <div className="w-[200px] h-[2px] bg-[#3b82f6]/20 relative overflow-hidden rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7c3aed] to-[#3b82f6] shadow-[0_0_10px_#7c3aed]"
              />
            </div>
          </div>

          <div className="absolute inset-0 z-0">
            <Canvas
              camera={{ position: [0, 0, 8], fov: 45 }}
              dpr={[1, 2]}
              gl={{ alpha: true, antialias: false }}
            >
              <color attach="background" args={["#030014"]} />
              <SpinningCore />
              
              <EffectComposer>
                <Bloom 
                  luminanceThreshold={0.1} 
                  luminanceSmoothing={0.9} 
                  intensity={4.0} 
                />
                <ChromaticAberration
                  blendFunction={BlendFunction.NORMAL}
                  offset={new THREE.Vector2(0.005, 0.005)}
                />
                <Glitch 
                  delay={new THREE.Vector2(0.1, 0.3)} 
                  duration={new THREE.Vector2(0.1, 0.3)} 
                  strength={new THREE.Vector2(0.02, 0.1)} 
                  mode={GlitchMode.CONSTANT_MILD} 
                  active={true}
                  ratio={0.85} 
                />
              </EffectComposer>
            </Canvas>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
