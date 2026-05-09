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
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }
      // Smooth fade in
      ambientGainRef.current?.gain.setTargetAtTime(0.04, audioCtxRef.current!.currentTime, 2);
    } else {
      // Smooth fade out
      if (ambientGainRef.current && audioCtxRef.current) {
        ambientGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
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
    
    // Premium UI mechanical tick
    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.03);
    
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  };

  const playClick = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Premium UI satisfying Pop/Drop
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
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
