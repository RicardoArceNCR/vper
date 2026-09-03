"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { Button } from "@ui/components/button";

// Cada slide tiene recorte propio (desktop landscape / mobile portrait).
// WebP a q78, desktop tope 3840px de ancho (2× un 1920): más que eso
// no se ve y el PNG original pesaba hasta 39MB. <picture> hace que el
// teléfono no baje el archivo de desktop.
//
// LCP (PageSpeed mobile): el <img> del primer retrato es el elemento
// grande. El lab corre ~7–10s en 4G lento. Tres trampas que dejaban
// NO_LCP aunque el filmstrip sí mostraba la cara:
//   1. Montar vecinos en el primer paint — el browser pide retratos
//      en opacity 0 y el lab a veces toma el que zoom-ea.
//   2. Ken Burns (scale en el wrapper) encima del nodo LCP. El zoom
//      del primer retrato espera a que PerformanceObserver registre
//      LCP; los demás slides sí zoom-ean al ser current.
//   3. El carrusel a los 6s sacaba el candidato (opacity 0 o unmount)
//      mientras el lab todavía medía. El primer retrato no se desmonta
//      nunca; el primer cambio espera HERO_FIRST_HOLD_MS.
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

/** Intrínseco del recorte mobile (el `src` del <img>). 960 cubre un
 *  viewport de ~480 CSS px a 2×, más el 8% del Ken Burns. El desktop
 *  entra por <source>; el box del hero es `h-dvh`, no estos píxeles. */
const HERO_MOBILE_W = 960;
const HERO_MOBILE_H = 1510;
const HERO_LCP_FALLBACK_MS = 1200;
const HERO_FIRST_HOLD_MS = 8000;
const HERO_CYCLE_MS = 6000;

type LcpEntry = PerformanceEntry & {
  element?: Element | null;
  url?: string;
};

function isHeroLcp(entry: PerformanceEntry, img: HTMLImageElement | null) {
  const e = entry as LcpEntry;
  if (img && e.element === img) return true;
  return typeof e.url === "string" && /hero-face-(mobile|desktop)\.webp/.test(e.url);
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgReady, setBgReady] = useState(false);
  const [lcpReady, setLcpReady] = useState(false);
  const [cycled, setCycled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const firstImgRef = useRef<HTMLImageElement>(null);
  const n = slides.length;
  const markBgReady = useCallback(() => setBgReady(true), []);

  useLayoutEffect(() => {
    const img = firstImgRef.current;
    if (img?.complete && img.naturalWidth > 0) setBgReady(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const fallback = setTimeout(() => setBgReady(true), 1200);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (!bgReady) return;
    if (prefersReducedMotion) {
      setLcpReady(true);
      return;
    }

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      setLcpReady(true);
    };

    const fallback = window.setTimeout(settle, HERO_LCP_FALLBACK_MS);
    let po: PerformanceObserver | undefined;
    try {
      po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (isHeroLcp(entry, firstImgRef.current)) {
            settle();
            break;
          }
        }
      });
      po.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      // Safari viejo: el timeout arma el resto igual.
    }

    return () => {
      window.clearTimeout(fallback);
      po?.disconnect();
    };
  }, [bgReady, prefersReducedMotion]);

  useEffect(() => {
    if (!lcpReady) return;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      setCycled(true);
      setCurrentSlide((prev) => (prev + 1) % n);
      interval = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % n);
      }, HERO_CYCLE_MS);
    }, HERO_FIRST_HOLD_MS);
    return () => {
      window.clearTimeout(start);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [n, lcpReady]);

  return (
    <section className="relative h-dvh w-full overflow-hidden">
      {slides.map((slide, index) => {
        const isCurrent = index === currentSlide;
        const isPrev = index === (currentSlide - 1 + n) % n;
        const isNext = index === (currentSlide + 1) % n;
        const isLcp = index === 0;

        // Slide 0 no se desmonta: si el lab todavía mide a los 8s,
        // sacar el nodo LCP deja NO_LCP. Vecinos recién después de LCP.
        if (index !== 0) {
          if (!lcpReady) return null;
          if (!isCurrent && !isNext && !(isPrev && cycled)) return null;
        }

        const kenBurns =
          isCurrent && lcpReady && (index !== 0 || cycled);

        return (
          <div
            key={slide.desktop}
            className={`absolute inset-0 w-full h-full overflow-hidden transition-[opacity] duration-1000 ease-in-out ${isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"} ${kenBurns ? "hero-kenburns-armed" : ""}`}
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
          <h1 className="font-display display-title-hero mx-auto mb-4 flex min-w-0 max-w-5xl flex-col items-center font-extrabold tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.55)] md:mb-8">
            <span className="hero-enter hero-title-enter min-w-0 w-full">
              SIEMPRE HAY ALGO MÁS GRANDE POR
            </span>
            {/* Beat de marca: llega después de la Wide — no typewriter. */}
            <span className="hero-script-word hero-enter hero-script-enter">
              Crear.
            </span>
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
