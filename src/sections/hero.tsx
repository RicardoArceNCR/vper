"use client";

import { useState, useEffect } from "react";
import { Button } from "@ui/components/button";
import { motion } from "framer-motion";

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
  const n = slides.length;

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
                src={slide.mobile}
                alt=""
                sizes="100vw"
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                className="w-full h-full object-cover object-center"
                animate={{ scale: isCurrent ? 1.08 : 1 }}
                transition={{ duration: 6, ease: "linear" }}
              />
            </picture>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />

      {/* Anclado al fondo. pb-[40px] en mobile sube título + copy +
          botones; el margin en el botón no expandía el box. md:pb-16. */}
      <div className="absolute inset-x-0 bottom-0 z-30 wrap min-w-0 text-center px-4 flex flex-col items-center pb-[40px] md:pb-16">
        <div className="@container min-w-0 w-full">
          <h1 className="font-display display-title-hero font-extrabold tracking-tight max-w-5xl mx-auto mb-8 text-foreground [text-shadow:0_2px_28px_rgba(0,0,0,0.55)]">
            SIEMPRE HAY ALGO MÁS GRANDE POR CREAR.
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-body-sm md:text-body-lg text-muted-foreground dark:text-foreground max-w-2xl font-medium mb-12 [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]"
        >
          Las buenas ideas tienen un pequeño problema: nunca se quedan quietas. Las
          convertimos en campañas, contenido y experiencias para descubrir hasta dónde
          pueden llegar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
