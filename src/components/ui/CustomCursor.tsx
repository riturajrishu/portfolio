"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useSound } from "@/lib/SoundContext";

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(true); // Default true to prevent flash on mobile
  const [isHovering, setIsHovering] = useState(false);
  const isHoveringRef = useRef(false);

  // Motion values for hardware-accelerated positioning
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs to trail the mouse
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device supports hover (not a touch device)
    const checkMobile = () => {
      const isTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
      setIsMobile(isTouch);
    };
    
    checkMobile();

    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // Center the 32px cursor
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      const isInteractive = 
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".magnetic") ||
        target.classList.contains("magnetic");

      if (isInteractive) {
        if (!isHoveringRef.current) {
          isHoveringRef.current = true;
          setIsHovering(true);
        }
      } else {
        if (isHoveringRef.current) {
          isHoveringRef.current = false;
          setIsHovering(false);
        }
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isMobile, cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[999999] hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        opacity: isHovering ? 0.8 : 1,
      }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 20 },
        opacity: { duration: 0.2 },
      }}
    >
      {/* Optional: Add an inner dot or glow here if desired, but a solid difference-blended circle looks very premium */}
    </motion.div>
  );
}
