"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { githubStats } from "@/lib/data";
import { GitBranch, GitCommit, Star, Activity } from "lucide-react";

export default function GitHubStats() {
  const statCards = [
    {
      icon: GitBranch,
      label: "Repositories",
      value: githubStats.repositories,
      suffix: "+",
      color: "#7c3aed",
    },
    {
      icon: GitCommit,
      label: "Total Commits",
      value: githubStats.totalCommits,
      suffix: "+",
      color: "#3b82f6",
    },
    {
      icon: Activity,
      label: "Contributions",
      value: githubStats.contributions,
      suffix: "+",
      color: "#06b6d4",
    },
    {
      icon: Star,
      label: "Stars Earned",
      value: githubStats.stars,
      suffix: "+",
      color: "#a78bfa",
    },
  ];

  return (
    <section id="github" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="GitHub Stats"
          subtitle="My open-source contributions and development activity"
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass rounded-xl p-4 sm:p-6 text-center hover:bg-surface-hover transition-all duration-300"
                onMouseEnter={(e) => {
                  (
                    e.currentTarget as HTMLElement
                  ).style.boxShadow = `0 0 24px ${stat.color}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <Icon
                  size={24}
                  className="mx-auto mb-3"
                  style={{ color: stat.color }}
                />
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-xl p-6 sm:p-8"
        >
          <h3 className="text-white font-semibold text-lg mb-6">
            Most Used Languages
          </h3>

          {/* Language bars */}
          <div className="space-y-4">
            {githubStats.languages.map((lang, i) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: lang.color }}
                    />
                    <span className="text-sm text-text-secondary">
                      {lang.name}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted font-mono">
                    {lang.percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.1 + 0.3,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full"
                    style={{ background: lang.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Visual bar chart */}
          <div className="mt-8 flex items-end gap-1 h-3 rounded-full overflow-hidden">
            {githubStats.languages.map((lang) => (
              <motion.div
                key={lang.name}
                initial={{ width: 0 }}
                whileInView={{ width: `${lang.percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full"
                style={{ background: lang.color }}
                title={`${lang.name}: ${lang.percentage}%`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
