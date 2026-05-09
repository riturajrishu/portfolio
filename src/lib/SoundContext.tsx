"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: true,
  toggleMute: () => {},
  playHover: () => {},
  playClick: () => {},
});

export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true); // Default muted to comply with browser autoplay policies
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Ambient Nodes
  const ambientGainRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Setup Ambient Drone (Procedural Sci-Fi Background Noise)
    const ambientGain = ctx.createGain();
    ambientGain.gain.value = 0; // Start silent
    ambientGain.connect(ctx.destination);
    ambientGainRef.current = ambientGain;

    // Filter to make it sound muffled, dark, and cinematic
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.connect(ambientGain);

    // Two oscillators slightly detuned for a rich chorus/drone effect
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 55; // Low A note
    osc1.connect(filter);
    osc1.start();
    osc1Ref.current = osc1;

    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 55.5; // Slight detune
    osc2.connect(filter);
    osc2.start();
    osc2Ref.current = osc2;

    // LFO for slow volume/frequency modulation (breathing effect)
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.1; // 10 second cycle
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 100;
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency); // Modulate filter frequency slowly
    lfo.start();
    lfoRef.current = lfo;
  };

  useEffect(() => {
    if (!isMuted) {
      initAudio();
      
      const ctx = audioCtxRef.current;
      const gainNode = ambientGainRef.current;

      if (ctx?.state === "suspended") {
        ctx.resume();
      }
      
      if (ctx && gainNode) {
        // Cancel any pending transitions to avoid overlapping values
        gainNode.gain.cancelScheduledValues(ctx.currentTime);
        // Start the fade from the exact current volume
        gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
        // Smooth fade in
        gainNode.gain.setTargetAtTime(0.15, ctx.currentTime, 1);
      }
    } else {
      const ctx = audioCtxRef.current;
      const gainNode = ambientGainRef.current;
      
      if (ctx && gainNode) {
        // Cancel any pending transitions
        gainNode.gain.cancelScheduledValues(ctx.currentTime);
        // Start the fade from the exact current volume
        gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
        // Smooth fade out
        gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.2); // Faster fade out
      }
    }
  }, [isMuted]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playHover = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Premium UI mechanical tick - Increased volume
    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  const playClick = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Premium UI satisfying Pop/Drop - Increased volume
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute: () => setIsMuted(!isMuted), playHover, playClick }}>
      {children}
    </SoundContext.Provider>
  );
}
