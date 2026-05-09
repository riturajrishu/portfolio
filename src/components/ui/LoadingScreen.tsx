"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import LoaderParticles from "../canvas/LoaderParticles";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("portfolio_loaded");
    }
    return true;
  });

  const handleComplete = () => {
    // Fade out the entire loading screen after the flythrough
    setTimeout(() => {
      setLoading(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("portfolio_loaded", "true");
      }
    }, 200);
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#030014] overflow-hidden"
        >
          {/* Noise overlay for cinematic feel */}
          <div className="absolute inset-0 noise-bg opacity-40 z-10 pointer-events-none" />

          {/* Minimalist loading text at bottom */}
          <div className="absolute bottom-12 left-0 w-full flex flex-col items-center justify-center z-20 pointer-events-none">
             <motion.p 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.5 }}
               className="text-text-muted text-xs tracking-[0.3em] uppercase font-mono mb-2"
             >
                Initializing Quantum Core
             </motion.p>
             <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 6.5, ease: "linear", delay: 0.5 }}
                className="h-[1px] max-w-[200px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"
             />
          </div>

          {/* R3F Canvas */}
          <Canvas
            camera={{ position: [0, 0, 15], fov: 45 }}
            dpr={[1, 2]} // Optimize for mobile vs retina
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}
          >
            <color attach="background" args={["#030014"]} />
            
            {/* The Custom Particle System */}
            <LoaderParticles onComplete={handleComplete} />

            {/* Cinematic Post-Processing */}
            <EffectComposer>
              <Bloom 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                intensity={2.0} 
                mipmapBlur 
              />
            </EffectComposer>
          </Canvas>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
