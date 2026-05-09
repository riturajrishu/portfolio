"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Glitch } from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";

function SpinningCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && coreRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.8;
      meshRef.current.rotation.y = state.clock.elapsedTime * 1.2;
      
      coreRef.current.rotation.x = state.clock.elapsedTime * -0.5;
      coreRef.current.rotation.y = state.clock.elapsedTime * -0.8;

      // Add a slight pulsing scale effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Outer Wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial color="#7c3aed" wireframe={true} transparent opacity={0.6} />
      </mesh>
      
      {/* Inner solid core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
}

export default function RouteTransitionLoader() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isInitialMount = useRef(true);
  const lastPathname = useRef(pathname);

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
          className="fixed inset-0 z-[99999] bg-[#030014]/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden pointer-events-auto"
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
              <color attach="background" args={["transparent"]} />
              <SpinningCore />
              
              <EffectComposer>
                <Bloom 
                  luminanceThreshold={0.2} 
                  luminanceSmoothing={0.9} 
                  intensity={2.5} 
                />
                <Glitch 
                  delay={new THREE.Vector2(0.2, 1.0)} 
                  duration={new THREE.Vector2(0.1, 0.2)} 
                  strength={new THREE.Vector2(0.01, 0.05)} 
                  mode={GlitchMode.SPORADIC} 
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
