"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { journeyMilestones } from "@/lib/data";

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
            className="absolute left-6 lg:left-8 top-0 w-0.5 origin-top"
            style={{
              height: lineHeight,
              background:
                "linear-gradient(180deg, #7c3aed, #3b82f6, #06b6d4)",
            }}
          />

          <div className="space-y-10 sm:space-y-12">
            {journeyMilestones.map((milestone, i) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative flex items-start gap-6 pl-16 lg:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-[18px] lg:left-[26px] top-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center"
                    style={{
                      boxShadow: "0 0 16px rgba(124, 58, 237, 0.4)",
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </motion.div>
                </div>

                {/* Card — full width */}
                <div className="glass rounded-xl p-5 sm:p-6 flex-1 hover:bg-surface-hover transition-colors duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <h3 className="text-white font-semibold text-base sm:text-lg">
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
                    {milestone.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-primary/10 text-primary-light border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
