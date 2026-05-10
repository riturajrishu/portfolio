"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { achievements } from "@/lib/data";

const categoryColors: Record<string, string> = {
  hackathon: "#7c3aed",
  competition: "#3b82f6",
  certification: "#06b6d4",
  academic: "#a78bfa",
};

export default function Achievements() {
  return (
    <section id="achievements" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Achievements"
          subtitle="Milestones and recognitions along the way"
        />

        {/* Grid layout for achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {achievements.map((item, i) => {
            const color = categoryColors[item.category] ?? "#7c3aed";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass rounded-xl p-5 sm:p-6 hover:bg-surface-hover transition-all duration-300 group relative overflow-hidden"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${color}15, 0 0 60px ${color}08`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                  }}
                />

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                    style={{ background: `${color}12` }}
                  >
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Category & Date badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                        style={{
                          background: `${color}15`,
                          color: color,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {item.category}
                      </span>
                      <span className="text-text-muted text-[10px] font-mono">
                        {item.date}
                      </span>
                    </div>

                    <h3 className="text-white font-semibold text-sm sm:text-base leading-snug mb-1.5 group-hover:text-primary-light transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
