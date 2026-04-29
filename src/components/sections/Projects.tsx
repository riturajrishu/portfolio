"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects, type Project } from "@/lib/data";

const filters = ["All", "Featured", "Web", "Full Stack"] as const;

export default function Projects() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered = projects.filter((p) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Featured") return p.featured;
    if (activeFilter === "Web") return p.category === "web";
    if (activeFilter === "Full Stack") return p.category === "fullstack";
    return true;
  });

  return (
    <section id="projects" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Projects"
          subtitle="A selection of projects that showcase my skills and passion"
        />

        {/* Filters */}
        <div className="flex justify-center flex-wrap gap-2 mb-10 sm:mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeFilter === filter
                  ? "text-white"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {activeFilter === filter && (
                <motion.span
                  layoutId="activeProjectFilter"
                  className="absolute inset-0 rounded-full bg-primary/10 border border-primary/30"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{filter}</span>
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                y: -8,
                rotateX: 2,
                rotateY: -2,
                transition: { duration: 0.3 },
              }}
              style={{ perspective: 1000 }}
              className="glass rounded-xl overflow-hidden group cursor-pointer"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              {/* Image / Gradient Area */}
              <div className="relative h-44 sm:h-48 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(3,0,20,0.95)] via-transparent to-transparent" />
                {/* Decorative floating elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold gradient-text opacity-20 group-hover:opacity-30 transition-opacity">
                    {project.title.split("—")[0]?.trim().slice(0, 2)}
                  </div>
                </div>
                {/* Featured badge */}
                {project.featured && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary-light border border-primary/30 rounded-full backdrop-blur-sm">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-white font-semibold text-base leading-snug group-hover:text-primary-light transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-medium rounded bg-white/5 text-text-secondary border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-white/5 text-text-muted">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary-light hover:bg-primary/20 transition-colors"
                  >
                    <ExternalLink size={12} /> Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <FaGithub size={12} /> Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
