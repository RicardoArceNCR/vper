"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { Button } from "@ui/components/button";
import { motion, useReducedMotion } from "framer-motion";

// Cada slide tiene recorte propio (desktop landscape / mobile portrait).
// WebP a q90, desktop tope 3840px de ancho (2× un 1920): más que eso
// no se ve y el PNG original pesaba hasta 39MB. <picture> hace que el
// teléfono no baje el archivo de desktop.
const slides = [
  {
    desktop: "/images/hero-face-desktop.webp",
    mobile: "/images/hero-face-mobile.webp",
  },
  {
    desktop: "/images/hero-tomatola-desktop.webp",
    mobile: "/images/hero-tomatola-mobile.webp",
  },
  {
    desktop: "/images/hero-santa-desktop.webp",
    mobile: "/images/hero-santa-mobile.webp",
  },
  {
    desktop: "/images/hero-tabaco-desktop.webp",
    mobile: "/images/hero-tabaco-mobile.webp",
  },
] as const;

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgReady, setBgReady] = useState(false);
  const firstImgRef = useRef<HTMLImageElement>(null);
  const n = slides.length;
  const prefersReducedMotion = useReducedMotion();
  const markBgReady = useCallback(() => setBgReady(true), []);

  useLayoutEffect(() => {
    const img = firstImgRef.current;
    if (img?.complete && img.naturalWidth > 0) setBgReady(true);
  }, []);

  useEffect(() => {
    const fallback = setTimeout(() => setBgReady(true), 1200);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % n);
    }, 6000);
    return () => clearInterval(timer);
  }, [n]);

  return (
    <section className="relative h-dvh w-full overflow-hidden">
      {slides.map((slide, index) => {
        const isCurrent = index === currentSlide;
        const isPrev = index === (currentSlide - 1 + n) % n;
        const isNext = index === (currentSlide + 1) % n;
        // Actual + anterior (crossfade) + siguiente (preload). Los
        // otros ni se montan: si los 4 <img> viven en el DOM, el
        // browser los pide todos aunque estén en opacity-0.
        if (!isCurrent && !isPrev && !isNext) return null;

        return (
          <div
            key={slide.desktop}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet={slide.desktop}
                type="image/webp"
              />
              <motion.img
                ref={index === 0 ? firstImgRef : undefined}
                src={slide.mobile}
                alt=""
                sizes="100vw"
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                className="w-full h-full object-cover object-center"
                onLoad={index === 0 ? markBgReady : undefined}
                animate={{ scale: prefersReducedMotion || !isCurrent ? 1 : 1.08 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 6, ease: "linear" }
                }
              />
            </picture>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />

      {/* Anclado al fondo. Mobile: menos aire entre título/copy
          (más en el p). El margin en el botón no expandía el box. */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 wrap min-w-0 text-center px-4 flex flex-col items-center pb-[30px] md:pb-16 ${bgReady || prefersReducedMotion ? "hero-ready" : ""}`}
      >
        <div className="@container min-w-0 w-full">
          <h1 className="hero-enter hero-title-enter font-display display-title-hero font-extrabold tracking-tight max-w-5xl mx-auto mb-4 md:mb-8 text-foreground [text-shadow:0_2px_28px_rgba(0,0,0,0.55)]">
            SIEMPRE HAY ALGO MÁS GRANDE POR CREAR.
          </h1>
        </div>

        <p className="hero-enter hero-copy-enter text-body-sm md:text-body-lg text-muted-foreground dark:text-foreground max-w-2xl font-medium mb-6 md:mb-12 [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">
          Las buenas ideas tienen un pequeño problema: nunca se quedan quietas. Las
          convertimos en campañas, contenido y experiencias para descubrir hasta dónde
          pueden llegar.
        </p>

        <div className="hero-enter hero-cta-enter flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            VER REEL
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
          >
            VER PROYECTOS
          </Button>
        </div>
      </div>
    </section>
  );
}
