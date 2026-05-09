"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ChevronDown } from "lucide-react";
import { personalInfo } from "@/lib/data";
import dynamic from "next/dynamic";

const Scene3D = dynamic(
  () => import("@/components/canvas/Scene3D"),
  { ssr: false }
);

export default function Hero() {
  const firstName = personalInfo.name.split(" ")[0];
  const lastName = personalInfo.name.split(" ")[1];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <Scene3D />

      {/* Gradient Orbs */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-secondary text-sm sm:text-base mb-4 tracking-widest uppercase font-mono"
        >
          Welcome to my universe
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
        >
          <span className="text-white">{firstName} </span>
          <span className="gradient-text">{lastName}</span>
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl sm:text-2xl lg:text-3xl text-text-secondary font-light mb-6"
        >
          {personalInfo.title}
        </motion.p>

        {/* Typing Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-sm sm:text-base lg:text-lg text-text-muted mb-10 h-8 font-mono"
        >
          <span className="text-primary-light">{">"} </span>
          <TypeAnimation
            sequence={personalInfo.taglines.flatMap((t) => [t, 2500])}
            wrapper="span"
            speed={40}
            repeat={Infinity}
            className="text-text-secondary"
          />
        </motion.div>


      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-16 md:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] text-text-muted uppercase font-mono magnetic cursor-pointer" onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}>
          Scroll Down
        </span>
        <motion.button
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() =>
            document
              .querySelector("#about")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="text-text-muted hover:text-white transition-colors p-2 magnetic"
          aria-label="Scroll down"
        >
          <ChevronDown size={24} />
        </motion.button>
      </motion.div>
    </section>
  );
}
