"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

const COMMANDS: Record<string, string | string[]> = {
  help: [
    "Available commands:",
    "  whoami    - Display user identity",
    "  skills    - List core competencies",
    "  contact   - Display contact information",
    "  sudo      - Execute command as superuser",
    "  clear     - Clear terminal output",
    "  exit      - Close terminal connection"
  ],
  whoami: "guest@quantum-core-server",
  skills: ["React", "Next.js", "Node.js", "TypeScript", "WebGL/Three.js", "Cyber Security", "UI/UX Design"],
  contact: "Email: rishurituraj1@gmail.com | Phone: +91 62993 13040",
  sudo: "Nice try, but this incident will be reported. 🚨",
};

export default function TerminalEasterEgg() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<{ command: string; output: string | string[] }[]>([
    { command: "", output: ["Quantum Core Terminal initialized...", "Type 'help' for available commands."] }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Secret code listener
  useEffect(() => {
    let keyBuffer = "";
    const secretCode = "rishu";

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't listen if the user is typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (isOpen) {
        if (e.key === "Escape") setIsOpen(false);
        return;
      }

      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > secretCode.length) {
        keyBuffer = keyBuffer.slice(-secretCode.length);
      }

      if (keyBuffer === secretCode) {
        setIsOpen(true);
        keyBuffer = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom on new history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    
    if (cmd === "") return;
    
    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    if (cmd === "exit") {
      setIsOpen(false);
      setInput("");
      return;
    }

    const output = COMMANDS[cmd] || `Command not found: ${cmd}. Type 'help' for available commands.`;
    
    setHistory(prev => [...prev, { command: input, output }]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed inset-0 z-[99999] flex flex-col bg-black/95 backdrop-blur-xl text-[#0f0] font-mono p-4 sm:p-8 magnetic"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Scanline Effect overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#0f0]/30 pb-4 mb-4 relative z-40">
            <div className="flex items-center gap-3">
              <Terminal size={24} />
              <h2 className="text-xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]">RISHU_OS_v1.0.4</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="px-4 py-1 border border-[#0f0]/50 hover:bg-[#0f0]/20 hover:shadow-[0_0_10px_rgba(0,255,0,0.5)] transition-all rounded text-sm uppercase"
            >
              Close (Esc)
            </button>
          </div>

          {/* Terminal Output */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-4 pb-16 relative z-40 [&::-webkit-scrollbar]:hidden"
          >
            {history.map((entry, i) => (
              <div key={i} className="space-y-1">
                {entry.command && (
                  <div className="flex gap-2">
                    <span className="text-[#0f0]/60">guest@rishu:~$</span>
                    <span>{entry.command}</span>
                  </div>
                )}
                <div className="text-[#0f0]/90 whitespace-pre-wrap">
                  {Array.isArray(entry.output) ? (
                    entry.output.map((line, j) => <div key={j}>{line}</div>)
                  ) : (
                    <div>{entry.output}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Current Input */}
            <form onSubmit={handleCommandSubmit} className="flex gap-2 mt-4">
              <span className="text-[#0f0]/60">guest@rishu:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[#0f0] caret-[#0f0]"
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
