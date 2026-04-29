"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { skills, type SkillCategory } from "@/lib/data";

const tabs: { label: string; value: SkillCategory; color: string }[] = [
  { label: "Frontend", value: "frontend", color: "#7c3aed" },
  { label: "Backend", value: "backend", color: "#3b82f6" },
  { label: "Tools", value: "tools", color: "#06b6d4" },
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState<SkillCategory>("frontend");
  const filtered = skills.filter((s) => s.category === activeTab);
  const activeColor =
    tabs.find((t) => t.value === activeTab)?.color ?? "#7c3aed";

  return (
    <section id="skills" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Skills & Expertise"
          subtitle="Technologies I work with to bring ideas to life"
        />

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10 sm:mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-5 sm:px-8 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.value
                  ? "text-white"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {activeTab === tab.value && (
                <motion.span
                  layoutId="activeSkillTab"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `${tab.color}15`,
                    border: `1px solid ${tab.color}40`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map((skill, i) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className="glass rounded-xl p-4 sm:p-5 group hover:bg-surface-hover transition-all duration-300 cursor-default"
                  style={
                    {
                      "--glow-color": activeColor,
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLElement
                    ).style.boxShadow = `0 0 24px ${activeColor}20, 0 0 48px ${activeColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300"
                      style={{ background: `${activeColor}15`, color: activeColor }}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 className="text-white text-sm font-medium">
                      {skill.name}
                    </h3>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: i * 0.05 + 0.3, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${activeColor}, ${activeColor}80)`,
                        }}
                      />
                    </div>
                    <p className="text-text-muted text-xs">{skill.level}%</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
