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

// Status text messages that cycle during the animation
const STATUS_MESSAGES = [
  { text: "☄️ Collapsing Singularity ☄️", time: 0 },
  { text: "🌌 Supernova Detected 🌌", time: 3000 },
  { text: "✨ Systems Online ✨", time: 5500 },
];

export default function LoadingScreen() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !hasPlayedInitialAnimation;
    }
    return true;
  });

  // Shockwave ring overlay state
  const [shockwaveActive, setShockwaveActive] = useState(false);
  // Screen shake state
  const [shakeActive, setShakeActive] = useState(false);
  // Cycling status text
  const [statusIndex, setStatusIndex] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!loading) return;

    // Clear any leftover timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // ── Shockwave ring timings — synced with shader supernova ──
    // Supernova shockwave at t≈3.0s
    const sw1 = setTimeout(() => {
      setShockwaveActive(true);
      const sw1off = setTimeout(() => setShockwaveActive(false), 800);
      timeoutsRef.current.push(sw1off);
    }, 3000);
    timeoutsRef.current.push(sw1);

    // Second smaller shockwave at warp exit t≈6.3s
    const sw2 = setTimeout(() => {
      setShockwaveActive(true);
      const sw2off = setTimeout(() => setShockwaveActive(false), 600);
      timeoutsRef.current.push(sw2off);
    }, 6300);
    timeoutsRef.current.push(sw2);

    // ── Screen shake at supernova moment ──
    const shake = setTimeout(() => {
      setShakeActive(true);
      const shakeOff = setTimeout(() => setShakeActive(false), 400);
      timeoutsRef.current.push(shakeOff);
    }, 3000);
    timeoutsRef.current.push(shake);

    // ── Status text cycling ──
    STATUS_MESSAGES.forEach((msg, idx) => {
      if (idx === 0) return; // First message shown immediately
      const textTimer = setTimeout(() => setStatusIndex(idx), msg.time);
      timeoutsRef.current.push(textTimer);
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
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
          transition={shakeActive
            ? { duration: 0.4, ease: "easeInOut" }
            : { duration: 1.2, ease: "easeInOut" }
          }
          className="fixed inset-0 z-[100] bg-[#030014] overflow-hidden"
          // Screen shake via CSS transform
          animate={shakeActive ? {
            x: [0, -3, 4, -2, 3, -1, 0],
            y: [0, 2, -3, 1, -2, 3, 0],
          } : { x: 0, y: 0 }}
        >
          {/* Noise overlay for cinematic feel */}
          <div className="absolute inset-0 noise-bg opacity-40 z-10 pointer-events-none" />

          {/* ══════ SHOCKWAVE RINGS — triple-layered expanding chromatic rings ══════ */}
          <AnimatePresence>
            {shockwaveActive && (
              <motion.div
                key="shockwave"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
              >
                {/* Primary ring — bright cyan with purple glow */}
                <div
                  style={{
                    position: "absolute",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "2.5px solid rgba(6, 182, 212, 0.8)",
                    boxShadow: "0 0 40px rgba(124, 58, 237, 0.5), 0 0 80px rgba(6, 182, 212, 0.3), inset 0 0 25px rgba(124, 58, 237, 0.3)",
                    animation: "shockwave-ring 0.9s ease-out forwards",
                  }}
                />
                {/* Secondary ring — magenta/pink, slightly delayed */}
                <div
                  style={{
                    position: "absolute",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: "1.5px solid rgba(236, 72, 153, 0.6)",
                    boxShadow: "0 0 30px rgba(236, 72, 153, 0.3), 0 0 60px rgba(139, 92, 246, 0.2)",
                    animation: "shockwave-ring-secondary 1.0s ease-out 0.1s forwards",
                  }}
                />
                {/* Outer ring — wide purple glow halo */}
                <div
                  style={{
                    position: "absolute",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    boxShadow: "0 0 60px rgba(124, 58, 237, 0.2), 0 0 120px rgba(59, 130, 246, 0.1)",
                    animation: "shockwave-ring-outer 0.7s ease-out forwards",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chromatic flash overlay — multi-color radial burst during shockwave */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            animate={{ opacity: shockwaveActive ? 0.5 : 0 }}
            transition={{ duration: shockwaveActive ? 0.08 : 0.6 }}
            style={{
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, rgba(6,182,212,0.15) 15%, rgba(124,58,237,0.12) 30%, rgba(236,72,153,0.06) 50%, transparent 70%)",
            }}
          />

          {/* R3F Canvas — no wrapper div that shifts layout */}
          <Canvas
            camera={{ position: [0, 0, 15], fov: 45 }}
            dpr={[1, 2]}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5 }}
          >
            <color attach="background" args={["#030014"]} />

            {/* The Custom Particle System with cosmic supernova shaders */}
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


          {/* ══════ BOTTOM STATUS TEXT — cycling messages ══════ */}
          <div className="absolute bottom-12 left-0 w-full flex flex-col items-center justify-center z-20 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-xs tracking-[0.3em] uppercase font-mono mb-2"
                style={{ color: "rgba(139, 92, 246, 0.5)" }}
              >
                {STATUS_MESSAGES[statusIndex].text}
              </motion.p>
            </AnimatePresence>
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
