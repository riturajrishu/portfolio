"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { personalInfo, stats } from "@/lib/data";
import { Code2, Sparkles, Zap } from "lucide-react";
import Image from "next/image";

export default function About() {
  const highlights = [
    {
      icon: Code2,
      title: "Clean Code",
      desc: "Writing maintainable, scalable, and well-documented code",
    },
    {
      icon: Sparkles,
      title: "Creative Design",
      desc: "Crafting pixel-perfect UIs with modern design principles",
    },
    {
      icon: Zap,
      title: "High Performance",
      desc: "Optimizing applications for speed and user experience",
    },
  ];

  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="About Me"
          subtitle="Passionate about building digital experiences that make a difference"
        />

        {/* Bio Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 max-w-5xl mx-auto">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-48 h-48 sm:w-64 sm:h-64 shrink-0 rounded-3xl overflow-hidden border-2 border-primary/20 relative"
            style={{
              boxShadow: "0 0 30px rgba(124, 58, 237, 0.2)",
            }}
          >
            <Image
              src="/avatar.png"
              alt="Ritu Raj"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 192px, 256px"
            />
          </motion.div>

          {/* Bio Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-2xl p-6 sm:p-8 flex-1"
          >
            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
              {personalInfo.bio}
            </p>
          </motion.div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-16">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass rounded-xl p-6 text-center group hover:bg-surface-hover transition-colors duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <item.icon
                  size={24}
                  className="text-primary-light"
                />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">
                {item.title}
              </h3>
              <p className="text-text-muted text-xs sm:text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-xl p-4 sm:p-6"
            >
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
