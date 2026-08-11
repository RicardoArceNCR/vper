"use client";

import { useState, useEffect } from "react";
import { Button } from "@ui/components/button";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = {
  hero1: "/images/55d2a969fc609eaedfdf9745ba9dcd543cde9836.webp",
  hero2: "/images/614bb68043c305dc176a286eb6a45bbc1daf6c2c.webp",
  hero3: "/images/727d2809dc3e7714eec8b7598155acb0ee852f32.webp",
};

const carouselSlides = [
  { image: IMAGES.hero1, title: "NO HACEMOS MARKETING, HACEMOS QUE TENGA SENTIDO." },
  { image: IMAGES.hero2, title: "CREAMOS ESTRATEGIAS QUE IMPACTAN Y CONVIERTEN." },
  { image: IMAGES.hero3, title: "DISEÑO DE VANGUARDIA PARA MARCAS EXCEPCIONALES." },
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
          <div className="absolute inset-0 bg-background/60 z-20" />
          <motion.img
            src={slide.image}
            alt="VPER Creative"
            className="w-full h-full object-cover object-center"
            animate={{ scale: index === currentSlide ? 1.08 : 1 }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/70 to-transparent z-20 pointer-events-none" />

      <div className="relative z-30 wrap text-center px-4 flex flex-col items-center justify-center h-full pt-20">
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="font-display font-extrabold tracking-tight max-w-5xl leading-[0.95] mb-8 text-foreground"
            style={{
              fontSize:
                "clamp(var(--typography-styles-display-sm-size), 3.5vw + 0.5rem, var(--typography-styles-display-hero-size))",
            }}
          >
            {carouselSlides[currentSlide]!.title}
          </motion.h1>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-body-sm md:text-body-lg text-muted-foreground dark:text-foreground max-w-2xl font-medium mb-12"
        >
          Campaigns, content and experiences that convert. Creamos experiencias digitales y de
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
            SCHEDULE A CALL
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
          >
            VIEW WORK
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
