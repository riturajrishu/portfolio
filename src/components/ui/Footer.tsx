"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUp, Download, Heart } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { navLinks, personalInfo } from "@/lib/data";
import Magnetic from "./Magnetic";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const socials = [
    { icon: FaGithub, href: personalInfo.github, label: "GitHub" },
    { icon: FaLinkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    {
      icon: Mail,
      href: `mailto:${personalInfo.email}`,
      label: "Email",
    },
    { icon: FaInstagram, href: personalInfo.instagram, label: "Instagram" },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/916299313040?text=Hello!%20I%20visited%20your%20portfolio%20and%20I'd%20like%20to%20connect%20with%20you.",
      label: "WhatsApp",
    },
  ];

  return (
    <footer className="relative border-t border-border">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold flex items-center gap-1 mb-3">
              <span className="text-white">Ritu</span>
              <span className="gradient-text">Raj.</span>
            </h3>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              Full Stack Developer crafting premium digital experiences with
              modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navLinks.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-text-muted text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              More
            </h4>
            <ul className="space-y-2">
              {navLinks.slice(5).map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-text-muted text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href={personalInfo.resumeUrl}
                  download
                  className="text-text-muted text-sm hover:text-primary-light transition-colors flex items-center gap-1.5"
                >
                  <Download size={12} /> Resume
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <Magnetic key={social.label} intensity={0.2}>
                    <motion.a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                      className="w-10 h-10 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-all"
                      aria-label={social.label}
                    >
                      <Icon size={18} />
                    </motion.a>
                  </Magnetic>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Ritu Raj. Built with{" "}
            <Heart size={12} className="inline text-red-400 mx-0.5" /> using
            Next.js & Three.js
          </p>
          <Magnetic intensity={0.2}>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              className="w-10 h-10 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-all"
              aria-label="Back to top"
            >
              <ArrowUp size={18} />
            </motion.button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
