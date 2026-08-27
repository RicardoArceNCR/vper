"use client";

import { useState, useEffect } from "react";
import { Button } from "@ui/components/button";
import { motion, AnimatePresence } from "framer-motion";

const carouselSlides = [
  { image: "/images/hero-portada-1.webp", title: "NO HACEMOS MARKETING, HACEMOS QUE TENGA SENTIDO." },
  { image: "/images/hero-portada-2.webp", title: "CREAMOS ESTRATEGIAS QUE IMPACTAN Y CONVIERTEN." },
  { image: "/images/hero-portada-3.webp", title: "DISEÑO DE VANGUARDIA PARA MARCAS EXCEPCIONALES." },
  { image: "/images/hero-portada-4.webp", title: "NO HACEMOS MARKETING, HACEMOS QUE TENGA SENTIDO." },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {carouselSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <motion.img
            src={slide.image}
            alt="VPER Media"
            className="w-full h-full object-cover object-center"
            animate={{ scale: index === currentSlide ? 1.08 : 1 }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />

      {/* pt-16 coincide con el alto del header sin scroll (h-16, bajado de
          h-20 el 2026-08-12) — mismo criterio que antes, solo el valor
          nuevo. */}
      <div className="relative z-30 wrap min-w-0 text-center px-4 flex flex-col items-center justify-center h-full pt-16">
        <div className="@container min-w-0 w-full">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="font-display display-title-hero font-extrabold tracking-tight max-w-5xl mx-auto mb-8 text-foreground [text-shadow:0_2px_28px_rgba(0,0,0,0.55)]"
            >
              {carouselSlides[currentSlide]!.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-body-sm md:text-body-lg text-muted-foreground dark:text-foreground max-w-2xl font-medium mb-12 [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]"
        >
          Campañas, contenido y experiencias que convierten. Creamos experiencias digitales y de
          marca memorables.
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
