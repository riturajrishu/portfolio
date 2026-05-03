"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, CheckCircle } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import SectionHeading from "@/components/ui/SectionHeading";
import { personalInfo } from "@/lib/data";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email address";
    if (!formData.message.trim()) errs.message = "Message is required";
    else if (formData.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters";
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    // Simulate submission delay
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: "", email: "", message: "" });

    setTimeout(() => setIsSuccess(false), 4000);
  };

  const socials = [
    {
      icon: FaGithub,
      label: "GitHub",
      href: personalInfo.github,
      display: personalInfo.github.replace("https://", ""),
      color: "#f1f5f9",
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      href: personalInfo.linkedin,
      display: personalInfo.linkedin.replace("https://", ""),
      color: "#0a66c2",
    },
    {
      icon: Mail,
      label: "Email",
      href: `mailto:${personalInfo.email}`,
      display: personalInfo.email,
      color: "#06b6d4",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      href: personalInfo.instagram,
      display: "@itsriturajrishu",
      color: "#e1306c",
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      href: "https://wa.me/916299313040?text=Hello!%20I%20visited%20your%20portfolio%20and%20I'd%20like%20to%20connect%20with%20you.",
      display: "+91 62993 13040",
      color: "#25D366",
    },
  ];

  return (
    <section id="contact" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a project in mind? Let's build something amazing together"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="glass rounded-xl p-6 sm:p-8">
              <h3 className="text-white text-xl font-semibold mb-4">
                Let&apos;s Connect
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision. Feel free to reach
                out through any of the following channels.
              </p>

              <div className="space-y-4">
                {socials.map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: `${social.color}10` }}
                      >
                        <Icon size={20} style={{ color: social.color }} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium group-hover:text-primary-light transition-colors">
                          {social.label}
                        </p>
                        <p className="text-text-muted text-xs truncate">
                          {social.display}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass rounded-xl p-6 sm:p-8 relative overflow-hidden">
              {/* Success overlay */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#030014]/90 backdrop-blur-sm rounded-xl"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      <CheckCircle
                        size={64}
                        className="text-green-400 mb-4"
                      />
                    </motion.div>
                    <p className="text-white text-lg font-semibold mb-1">
                      Message Sent!
                    </p>
                    <p className="text-text-secondary text-sm">
                      I&apos;ll get back to you soon
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-text-secondary text-sm mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.name ? "border-red-400/50" : "border-border"
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-text-secondary text-sm mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.email ? "border-red-400/50" : "border-border"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-text-secondary text-sm mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${
                      errors.message ? "border-red-400/50" : "border-border"
                    }`}
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gradient w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner !w-5 !h-5 !border-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
