"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { AnimatePresence, motion } from "framer-motion";
import LoaderParticles from "../canvas/LoaderParticles";

// Use an in-memory module variable instead of sessionStorage.
// This ensures the loading screen plays on hard reloads (F5) because JS memory resets,
// but skips during Next.js client-side navigation (like going back from a project page).
let hasPlayedInitialAnimation = false;

export default function LoadingScreen() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !hasPlayedInitialAnimation;
    }
    return true;
  });

  // Track lightning flash moments for the screen flash overlay
  const [flashActive, setFlashActive] = useState(false);
  const flashTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!loading) return;

    // Clear any leftover timeouts
    flashTimeoutsRef.current.forEach(clearTimeout);
    flashTimeoutsRef.current = [];

    // Helper to schedule a flash (tracks both outer + inner timeout for proper cleanup)
    const scheduleFlash = (delay: number, duration: number) => {
      const outer = setTimeout(() => {
        setFlashActive(true);
        const inner = setTimeout(() => setFlashActive(false), duration);
        flashTimeoutsRef.current.push(inner);
      }, delay);
      flashTimeoutsRef.current.push(outer);
    };

    // Lightning flash timings — synced with shader's uLightningFlash
    scheduleFlash(800, 150);
    scheduleFlash(1500, 120);
    scheduleFlash(2400, 200);
    scheduleFlash(3200, 100);
    scheduleFlash(6300, 250);

    return () => {
      flashTimeoutsRef.current.forEach(clearTimeout);
      flashTimeoutsRef.current = [];
    };
  }, [loading]);

  const handleComplete = useCallback(() => {
    setTimeout(() => {
      setLoading(false);
      hasPlayedInitialAnimation = true;
    }, 200);
  }, []);

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

          {/* ══════ THUNDER FLASH — lightweight screen flash ══════ */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            animate={{ opacity: flashActive ? 1 : 0 }}
            transition={{ duration: flashActive ? 0.05 : 0.2 }}
            style={{
              background: "radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, rgba(6,182,211,0.12) 40%, transparent 70%)",
            }}
          />

          {/* R3F Canvas — no wrapper div that shifts layout */}
          <Canvas
            camera={{ position: [0, 0, 15], fov: 45 }}
            dpr={[1, 2]}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5 }}
          >
            <color attach="background" args={["#030014"]} />

            {/* The Custom Particle System with all thunder/neon logic inside shaders */}
            <LoaderParticles onComplete={handleComplete} />

            {/* Cinematic Post-Processing — cranked bloom */}
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.15}
                luminanceSmoothing={0.9}
                intensity={2.5}
                mipmapBlur
              />
            </EffectComposer>
          </Canvas>


          {/* ══════ BOTTOM STATUS TEXT ══════ */}
          <div className="absolute bottom-12 left-0 w-full flex flex-col items-center justify-center z-20 pointer-events-none">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xs tracking-[0.3em] uppercase font-mono mb-2"
              style={{ color: "rgba(139, 92, 246, 0.5)" }}
            >
              ⚡ Igniting Neural Matrix ⚡
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 7.0, ease: "linear", delay: 0.3 }}
              className="h-[1px] max-w-[200px]"
              style={{
                background: "linear-gradient(90deg, transparent, #7c3aed, #06b6d4, #7c3aed, transparent)",
              }}
            />
          </div>

          {/* ══════ VIGNETTE ══════ */}
          <div
            className="absolute inset-0 pointer-events-none z-[6]"
            style={{
              background: "radial-gradient(ellipse at center, transparent 50%, rgba(3,0,20,0.5) 100%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
