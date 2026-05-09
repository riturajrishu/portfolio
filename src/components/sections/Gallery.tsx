"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLenis } from "lenis/react";
import SectionHeading from "@/components/ui/SectionHeading";
import { galleryImages, GalleryImage } from "@/lib/data";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import gsap from "gsap";

/* ─────────────── LIGHTBOX ─────────────── */
function Lightbox({
  image,
  onClose,
}: {
  image: GalleryImage;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const posRef = useRef({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync refs
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { posRef.current = position; }, [position]);

  // Stop Lenis smooth scrolling while lightbox is open
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      lenis.stop();
      return () => { lenis.start(); };
    }
  }, [lenis]);

  const handleZoomIn = () => setZoom((z) => Math.min(+(z + 0.25).toFixed(2), 4));
  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(+(z - 0.25).toFixed(2), 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => { setMounted(true); }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
      if (e.key === "0") handleReset();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Block ALL wheel/scroll on the entire overlay using non-passive listener
  useEffect(() => {
    if (!mounted) return;
    const el = overlayRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Always block page scroll and browser zoom inside lightbox
      e.preventDefault();
      e.stopPropagation();

      // Ctrl + scroll = Zoom In / Zoom Out
      if (e.ctrlKey) {
        if (e.deltaY < 0) {
          setZoom((z) => Math.min(+(z + 0.25).toFixed(2), 4));
        } else {
          setZoom((z) => {
            const next = Math.max(+(z - 0.25).toFixed(2), 1);
            if (next === 1) setPosition({ x: 0, y: 0 });
            return next;
          });
        }
        return;
      }

      // Normal scroll (no Ctrl) when zoomed = pan the image up/down
      if (zoomRef.current > 1) {
        setPosition((p) => ({
          x: p.x - e.deltaX * 2,
          y: p.y - e.deltaY * 2,
        }));
      }
    };

    // Also block touchmove to prevent mobile scroll-through
    const blockTouch = (e: TouchEvent) => e.preventDefault();

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchmove", blockTouch, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchmove", blockTouch);
    };
  }, [mounted]);

  // Drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomRef.current <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };
  const handleMouseUp = () => setIsDragging(false);

  // Click on blank area (not on image) = close / reset
  const handleAreaClick = (e: React.MouseEvent) => {
    // Only if the click target is the container itself, not the image
    if (e.target === e.currentTarget) {
      if (zoomRef.current > 1) {
        handleReset();
      } else {
        onClose();
      }
    }
  };

  if (!mounted) return null;

  const lightboxContent = (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[rgba(3,0,20,0.97)] backdrop-blur-2xl pointer-events-none" />

      {/* Top Bar */}
      <div className="relative flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/5">
        <h2 className="text-lg sm:text-xl font-bold text-white truncate pr-4">
          {image.title}
        </h2>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleZoomIn}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/5"
            title="Zoom In (+)"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/5"
            title="Zoom Out (-)"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/5"
            title="Reset (0)"
          >
            <RotateCcw size={18} />
          </button>

          <span className="text-xs text-white/40 w-12 text-center hidden sm:inline font-mono">
            {Math.round(zoom * 100)}%
          </span>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors border border-red-500/20"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Image Area */}
      <div
        className={`relative flex-1 flex items-center justify-center overflow-hidden ${
          zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
        onClick={handleAreaClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <motion.div
          animate={{
            scale: zoom,
            x: position.x,
            y: position.y,
          }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        >
          <Image
            src={image.src}
            alt={image.title}
            width={image.width}
            height={image.height}
            quality={90}
            priority
            className="rounded-xl object-contain max-w-[90vw] max-h-[70vh] w-auto h-auto select-none"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Bottom Caption */}
      <div className="relative px-4 sm:px-8 py-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            {image.description}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return createPortal(lightboxContent, document.body);
}

/* ─────────────── LIQUID CARD COMPONENT ─────────────── */
function LiquidCard({ image, onClick, index }: { image: GalleryImage; onClick: () => void; index: number }) {
  const filterId = `liquid-${image.id}`;
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);

  const handleMouseEnter = () => {
    if (displacementRef.current && turbRef.current) {
      gsap.killTweensOf([displacementRef.current, turbRef.current]);
      // Animate distortion scale
      gsap.to(displacementRef.current, { attr: { scale: 40 }, duration: 0.6, ease: "power2.out" });
      // Shift base frequency to make the "water" flow
      gsap.to(turbRef.current, { attr: { baseFrequency: "0.03 0.03" }, duration: 0.6, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (displacementRef.current && turbRef.current) {
      gsap.killTweensOf([displacementRef.current, turbRef.current]);
      gsap.to(displacementRef.current, { attr: { scale: 0 }, duration: 0.8, ease: "power2.out" });
      gsap.to(turbRef.current, { attr: { baseFrequency: "0.015 0.015" }, duration: 0.8, ease: "power2.out" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl overflow-hidden group cursor-pointer glass border-white/10 shadow-lg break-inside-avoid inline-block w-full magnetic mb-4 sm:mb-6"
    >
      {/* SVG Liquid Filter Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.015 0.015" numOctaves="3" result="noise" />
          <feDisplacementMap 
            ref={displacementRef} 
            in="SourceGraphic" 
            in2="noise" 
            scale="0" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </svg>

      <div 
        className="relative w-full h-auto" 
        style={{ filter: `url(#${filterId})` }}
      >
        <Image
          src={image.src}
          alt={image.title}
          width={image.width}
          height={image.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(3,0,20,0.95)] via-[rgba(3,0,20,0.2)] to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

      <div className="absolute inset-0 p-5 flex flex-col justify-end transform transition-transform duration-300 md:translate-y-4 md:group-hover:translate-y-0 pointer-events-none">
        <div className="w-8 h-1 bg-primary mb-2 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity delay-100 duration-300" />
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 drop-shadow-md">
          {image.title}
        </h3>
        <p className="text-text-secondary text-xs line-clamp-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity delay-100 duration-300">
          Click to view full size
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────── GALLERY SECTION ─────────────── */
export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <section id="gallery" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Moments & Memories"
          subtitle="A glimpse into my journey, awards, and milestones"
        />

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 mt-12">
          {galleryImages.map((image, i) => (
            <LiquidCard
              key={image.id}
              image={image}
              index={i}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <Lightbox
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
