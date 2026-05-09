"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { journeyMilestones } from "@/lib/data";

function MilestoneCard({ milestone, index }: { milestone: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.7 1"], // Card starts entering when its top hits bottom of screen, finishes when its top hits 30% from bottom
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(10px)", "blur(0px)"]);
  
  // Timeline dot animation
  const dotScale = useTransform(scrollYProgress, [0.4, 1], [0, 1]);
  const dotColor = useTransform(scrollYProgress, [0.6, 1], ["#3b82f6", "#7c3aed"]);

  return (
    <div ref={ref} className="relative flex items-start gap-6 pl-16 lg:pl-20 py-2 sm:py-4">
      {/* Timeline dot */}
      <div className="absolute left-[18px] lg:left-[26px] top-6 sm:top-10">
        <motion.div
          style={{ scale: dotScale }}
          className="w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center relative z-10"
          initial={{ boxShadow: "0 0 0px rgba(124, 58, 237, 0)" }}
          whileHover={{ boxShadow: "0 0 16px rgba(124, 58, 237, 0.6)" }}
        >
          <motion.div style={{ backgroundColor: dotColor }} className="w-2 h-2 rounded-full" />
        </motion.div>
      </div>

      {/* Card */}
      <motion.div
        style={{ opacity, scale, x, filter: blur }}
        className="glass rounded-xl p-5 sm:p-6 flex-1 hover:bg-surface-hover transition-colors duration-300 relative overflow-hidden group magnetic cursor-pointer"
      >
        {/* Subtle grid background for tech vibe */}
        <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <h3 className="text-white font-semibold text-base sm:text-lg group-hover:text-primary-light transition-colors">
              {milestone.title}
            </h3>
            <span className="text-sm font-mono font-bold gradient-text shrink-0">
              {milestone.year}
            </span>
          </div>
          <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-4">
            {milestone.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {milestone.skills.map((skill: string) => (
              <span
                key={skill}
                className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-white/5 text-text-secondary border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary-light transition-all duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="journey" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Developer Journey"
          subtitle="My path from writing Hello World to building production applications"
        />

        <div ref={containerRef} className="relative" style={{ position: "relative" }}>
          {/* Background line */}
          <div className="absolute left-6 lg:left-8 top-0 bottom-0 w-0.5 bg-white/5" />

          {/* Animated fill line */}
          <motion.div
            className="absolute left-6 lg:left-8 top-0 w-0.5 origin-top rounded-full z-0"
            style={{
              height: lineHeight,
              background:
                "linear-gradient(180deg, #7c3aed, #3b82f6, #06b6d4)",
            }}
          >
            {/* Leading Spark */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-6 rounded-full bg-white shadow-[0_0_15px_3px_#06b6d4]" />
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            {journeyMilestones.map((milestone, i) => (
              <MilestoneCard key={milestone.id} milestone={milestone} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
