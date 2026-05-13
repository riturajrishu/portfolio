import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Metadata } from "next";

export async function generateStaticParams() {
  return projects.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title.split("—")[0].trim()} | Case Study`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  return (
    <main className="min-h-screen noise-bg pt-24 pb-20 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8 sm:mb-12 group text-sm sm:text-base"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Portfolio
        </Link>

        {/* Hero Section */}
        <div className="relative h-[40vh] sm:h-[50vh] min-h-[300px] rounded-3xl overflow-hidden mb-16 glass border-border/50 group">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            className="object-cover object-top opacity-40 transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 mix-blend-overlay" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12 z-10 flex flex-col justify-end h-full">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className="px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/10 text-white rounded-full backdrop-blur-md">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary-light border border-primary/30 rounded-full backdrop-blur-md">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              {project.title.split("—")[0].trim()}
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl text-text-secondary max-w-2xl font-light line-clamp-3 sm:line-clamp-none">
              {project.title.split("—")[1]?.trim() || project.description}
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-primary/50" />
                Overview
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                {project.longDescription}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-primary/50" />
                Key Features
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.features.map((feature, i) => (
                  <div
                    key={i}
                    className="glass p-5 rounded-xl border border-white/5 flex gap-4"
                  >
                    <span className="text-primary-light mt-1 font-mono">
                      {"0" + (i + 1)}
                    </span>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-10">
            <div className="glass-strong p-8 rounded-2xl border border-white/10">
              <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 text-text-secondary border border-white/5 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient flex items-center justify-center gap-2 w-full py-4 text-base"
              >
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <ExternalLink size={18} /> View Live Demo
                </span>
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center justify-center gap-2 w-full py-4 text-base"
              >
                <span className="flex items-center justify-center gap-2">
                  <FaGithub size={18} /> View Source Code
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
