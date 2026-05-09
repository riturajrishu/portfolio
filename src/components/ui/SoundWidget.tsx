"use client";

import { useSound } from "@/lib/SoundContext";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function SoundWidget() {
  const { isMuted, toggleMute } = useSound();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-[90] w-12 h-12 flex items-center justify-center rounded-full glass magnetic border border-white/10 hover:border-white/20 transition-colors cursor-pointer group"
      title={isMuted ? "Turn Sound On" : "Turn Sound Off"}
    >
      {isMuted ? (
        <VolumeX size={20} className="text-text-muted group-hover:text-white transition-colors" />
      ) : (
        <div className="relative flex items-center justify-center">
          <Volume2 size={20} className="text-primary-light" />
          {/* subtle glow when active */}
          <div className="absolute inset-0 bg-primary-light rounded-full blur-md opacity-20" />
        </div>
      )}
    </motion.button>
  );
}
