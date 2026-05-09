"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function TiltCard({ children, className = "", onClick }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5); // 0 to 1
  const mouseY = useMotionValue(0.5); // 0 to 1

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  // Rotate based on mouse position
  // Adjust the multipliers (12, -12) to make the tilt more or less extreme
  const rotateX = useTransform(ySpring, [0, 1], [10, -10]); // Invert Y
  const rotateY = useTransform(xSpring, [0, 1], [-10, 10]);

  // Glare effect tracking mouse exactly
  const glareX = useTransform(xSpring, (v) => v * 100);
  const glareY = useTransform(ySpring, (v) => v * 100);
  const background = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset to center
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative group ${className}`}
    >
      {/* Content wrapper with inner 3D translation for parallax */}
      <motion.div
        animate={{ z: isHovered ? 20 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full rounded-[inherit] overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
        
        {/* The Dynamic Glare - Place inside the wrapper so it masks to border radius */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 mix-blend-overlay"
          style={{
            background,
            opacity: isHovered ? 1 : 0,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
