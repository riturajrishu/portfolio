"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, MapPin } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { educationList } from "@/lib/data";

export default function Education() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="education" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Education"
          subtitle="My academic background and qualifications"
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
                "linear-gradient(180deg, #06b6d4, #3b82f6, #7c3aed)",
            }}
          />

          <div className="space-y-10 sm:space-y-12">
            {educationList.map((edu, i) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative flex items-start gap-6 pl-16 lg:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-[12px] lg:left-[20px] top-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="w-8 h-8 rounded-full border-2 border-accent bg-background flex items-center justify-center"
                    style={{
                      boxShadow: "0 0 16px rgba(6, 182, 212, 0.4)",
                    }}
                  >
                    <GraduationCap size={14} className="text-accent" />
                  </motion.div>
                </div>

                {/* Card */}
                <div className="glass rounded-xl p-5 sm:p-6 flex-1 hover:bg-surface-hover transition-colors duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <h3 className="text-white font-semibold text-base sm:text-lg">
                      {edu.degree}
                    </h3>
                    <span className="text-sm font-mono font-bold text-accent shrink-0">
                      {edu.year}
                    </span>
                  </div>
                  <h4 className="text-primary-light font-medium text-sm sm:text-base mb-3">
                    {edu.institution}
                  </h4>
                  {edu.description && (
                    <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-4">
                      {edu.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-text-muted text-xs sm:text-sm">
                      <MapPin size={14} />
                      {edu.location}
                    </div>
                    {edu.status && (
                      <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-accent/10 text-accent border border-accent/20">
                        {edu.status}
                      </span>
                    )}
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
