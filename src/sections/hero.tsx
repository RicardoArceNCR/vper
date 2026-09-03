"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { Button } from "@ui/components/button";
import { useReducedMotion } from "framer-motion";

// Cada slide tiene recorte propio (desktop landscape / mobile portrait).
// WebP a q90, desktop tope 3840px de ancho (2× un 1920): más que eso
// no se ve y el PNG original pesaba hasta 39MB. <picture> hace que el
// teléfono no baje el archivo de desktop.
//
// LCP (PageSpeed mobile): el <img> es el elemento grande. Tres trampas
// que dejaban NO_LCP + ~600 KB de más en el primer paint:
//   1. Montar actual+prev+next — el browser pide tres retratos de
//      1301×2046 aunque dos estén en opacity 0.
//   2. Ken Burns en el mismo nodo que Lighthouse toma como LCP
//      (`motion.img` + scale). El lab a veces no registra el paint.
//   3. El carrusel arrancaba a los 6s aunque la foto LCP no hubiera
//      cargado. El intervalo espera a que el fondo esté listo.
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

/** Intrínseco del recorte mobile (el `src` del <img>). El desktop
 *  entra por <source>; el box del hero es `h-dvh`, no estos píxeles. */
const HERO_MOBILE_W = 1301;
const HERO_MOBILE_H = 2046;

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgReady, setBgReady] = useState(false);
  const [cycled, setCycled] = useState(false);
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
    if (!bgReady) return;
    const timer = setInterval(() => {
      setCycled(true);
      setCurrentSlide((prev) => (prev + 1) % n);
    }, 6000);
    return () => clearInterval(timer);
  }, [n, bgReady]);

  return (
    <section className="relative h-dvh w-full overflow-hidden">
      {slides.map((slide, index) => {
        const isCurrent = index === currentSlide;
        const isPrev = index === (currentSlide - 1 + n) % n;
        const isNext = index === (currentSlide + 1) % n;
        const isLcp = index === 0 && !cycled;

        // Primer paint: solo el slide actual. Después de LCP, el
        // siguiente (preload). El anterior entra recién cuando ya
        // cicló — hace falta para el crossfade, no para el primer
        // request.
        if (!isCurrent && !bgReady) return null;
        if (!isCurrent && !isNext && !(isPrev && cycled)) return null;

        return (
          <div
            key={slide.desktop}
            className={`absolute inset-0 w-full h-full overflow-hidden transition-all duration-1000 ease-in-out ${isCurrent ? "hero-slide-current opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <div className="hero-kenburns">
              <picture className="block h-full w-full">
                <source
                  media="(min-width: 768px)"
                  srcSet={slide.desktop}
                  type="image/webp"
                />
                <img
                  ref={isLcp ? firstImgRef : undefined}
                  src={slide.mobile}
                  alt=""
                  width={HERO_MOBILE_W}
                  height={HERO_MOBILE_H}
                  sizes="100vw"
                  fetchPriority={isLcp ? "high" : "auto"}
                  decoding={isLcp ? "sync" : "async"}
                  className="h-full w-full object-cover object-center"
                  onLoad={isLcp ? markBgReady : undefined}
                />
              </picture>
            </div>
          </div>
        );
      })}

      {/* El fade es negro siempre: from-background en claro es blanco y
          se come el copy. El hero es foto, no superficie de página. */}
      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-black via-black/75 to-transparent z-20 pointer-events-none" />

      {/* Anclado al fondo. Mobile: menos aire entre título/copy
          (más en el p). El margin en el botón no expandía el box. */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 wrap min-w-0 text-center px-4 flex flex-col items-center pb-[30px] md:pb-16 ${bgReady || prefersReducedMotion ? "hero-ready" : ""}`}
      >
        <div className="@container min-w-0 w-full">
          <h1 className="hero-enter hero-title-enter font-display display-title-hero font-extrabold tracking-tight max-w-5xl mx-auto mb-4 md:mb-8 flex min-w-0 flex-col items-center text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.55)]">
            <span className="min-w-0 w-full">
              SIEMPRE HAY ALGO MÁS GRANDE POR
            </span>
            <span className="hero-script-word">Crear.</span>
          </h1>
        </div>

        <p className="hero-enter hero-copy-enter text-body-sm md:text-body-lg text-white/90 max-w-2xl font-medium mb-6 md:mb-12 [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">
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
