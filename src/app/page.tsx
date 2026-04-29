"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Achievements from "@/components/sections/Achievements";
import Gallery from "@/components/sections/Gallery";
import Education from "@/components/sections/Education";
import Journey from "@/components/sections/Journey";
import GitHubStats from "@/components/sections/GitHubStats";
import Contact from "@/components/sections/Contact";

const LoadingScreen = dynamic(
  () => import("@/components/ui/LoadingScreen"),
  { ssr: false }
);
const ScrollProgress = dynamic(
  () => import("@/components/ui/ScrollProgress"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <Navbar />

      <main className="relative noise-bg">
        <Hero />

        <div className="relative z-10">
          <About />
          <Skills />
          <Education />
          <Journey />
          <Projects />
          <Achievements />
          <Gallery />
          <GitHubStats />
          <Contact />
        </div>
      </main>

      <Footer />
    </>
  );
}
