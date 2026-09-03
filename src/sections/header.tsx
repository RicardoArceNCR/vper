"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@ui/components/button";
import ThemeToggle from "@/components/theme-toggle";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@ui/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";
import { NAV_ITEMS, NAV_SECTION_IDS, isNavItemActive } from "@/lib/navigation";
import {
  VPER_WORDMARK_PATHS as PATHS,
  VPER_WORDMARK_VIEWBOX as VB,
} from "@/lib/vper-wordmark";
// px — coincide con el alto normal del header (h-16). Bajado de 80 (h-20)
// el 2026-08-12: el estado inicial (sin scroll) se veía sobredimensionado
// — logo, texto de nav y alto del header, los tres a la vez. El
// comportamiento de encoger al scrollear queda igual (mismo mecanismo,
// mismo ratio aproximado), solo se bajó el punto de partida.
const SCROLL_THRESHOLD = 64;

// Ambiente del overlay mobile: mismo idioma que GlowMark (miel + sky +
// grain). Sin backdrop-blur a 100dvh — ver .nav-glass en globals.css.
const MENU_GRAIN_OPACITY = 0.06;

// Misma pila tipográfica que Button (text-body-sm + Montserrat +
// --button-font-weight/--button-letter-spacing). text-label-* no: esa
// utilidad trae letter-spacing 0.9–1.1px del DS y pisa el tracking del
// botón, así que el nav seguía viéndose “wide” aunque ya no era display.
const navLinkType =
  "font-sans text-body-sm font-(weight:--button-font-weight) uppercase tracking-(--button-letter-spacing)";

function HamburgerIcon({ open }: { open: boolean }) {
  const bar = "block h-[2px] w-full bg-current rounded-none";
  return (
    <span className="flex h-4 w-[22px] flex-col justify-between" aria-hidden>
      <span
        className={cn(
          bar,
          "origin-center transition-transform duration-300 ease-out",
          open && "translate-y-[7px] rotate-45",
        )}
      />
      <span className={cn(bar, "transition-opacity duration-200", open && "opacity-0")} />
      <span
        className={cn(
          bar,
          "origin-center transition-transform duration-300 ease-out",
          open && "-translate-y-[7px] -rotate-45",
        )}
      />
    </span>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const grainId = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  // La sonda de scroll solo encuentra secciones en la home; fuera de
  // ella el item activo lo decide el pathname (PROYECTOS en /work y en
  // /work/[slug]). La regla vive en lib/navigation.ts para que footer y
  // header no la implementen cada uno a su manera.
  const pathname = usePathname();
  const activeSection = useActiveSection(NAV_SECTION_IDS);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled((prev) => {
        const next = window.scrollY > SCROLL_THRESHOLD;
        return prev === next ? prev : next;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => {
      if (mq.matches) setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Blur acá, no en <header>: el overlay mobile es hermano, no agranda
          la región de backdrop-filter (eso sí pegaría al scrollear). */}
      <div
        className={cn(
          "relative z-10 nav-glass border-b border-[var(--nav-border)]/40 transition-[height] duration-300",
          isScrolled ? "nav-glass-scrolled h-14" : "h-16",
          mobileMenuOpen && "nav-glass-open",
        )}
      >
        <div className="wrap flex min-w-0 items-center justify-between h-full gap-3 md:gap-6">
          {/* Antes href="#" — en el home eso no rompía nada visible (era
              un anchor a sí mismo), pero en cualquier otra página
              (/work/[slug]) no navegaba a ningún lado, solo agregaba "#"
              a la URL actual. Link a "/" real. */}
          <Link
            href="/"
            className="flex min-w-0 items-center group"
            onClick={() => setMobileMenuOpen(false)}
          >
            {/* currentColor ← --nav-logo-text. viewBox 238×19: h-7 pide
                ~350px y el hamburguesa se sale del 390. Columna min-w-0,
                svg max-w-full — mismo caso que el footer. */}
            <svg
              viewBox={`0 0 ${VB.w} ${VB.h}`}
              className={cn(
                "block h-auto w-full max-h-7 max-w-full origin-left text-[var(--nav-logo-text)] transition-all duration-300 group-hover:opacity-80 md:max-h-8",
                isScrolled ? "scale-50" : "scale-100",
              )}
              role="img"
              aria-label="VPER Media"
            >
              {PATHS.map((d, i) => (
                <path key={i} d={d} fill="currentColor" />
              ))}
            </svg>
          </Link>

          {/* Mismo bug que el logo: href={`#${id}`} solo funciona parado
              en "/" — en /work/[slug] no hace nada. Desde 2026-08-26 el
              href ya no se arma acá: cada item de NAV_ITEMS trae el suyo
              absoluto ("/#services" para las secciones, "/work" para el
              archivo), así que funciona desde cualquier página.
              El CTA dejó de ser la franja a toda altura (rounded-none,
              pegada al borde del viewport). Ahora es un Button sm
              dentro del nav, mismo --button-radius (16px, casi pill)
              que hero/404/form. */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => {
                const active = isNavItemActive(item, pathname, activeSection);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      navLinkType,
                      "transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300",
                      isScrolled && "text-body-xs",
                      "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring-color)] focus-visible:rounded-sm",
                      active
                        ? "text-[var(--nav-item-active)] after:w-full"
                        : "text-[var(--nav-item-default)] hover:text-[var(--nav-item-hover)] after:w-0 hover:after:w-full",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <ThemeToggle />
            <Button variant="default" size="sm" asChild>
              <Link href="/#contact">¿NOS REUNIMOS?</Link>
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden shrink-0 flex size-11 items-center justify-center text-[var(--nav-logo-text)]"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <HamburgerIcon open={mobileMenuOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navegación"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden fixed inset-0 z-0 flex h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--nav-bg)] px-6 pt-16"
          >
            {/* Ambiente: blobs miel/sky + grain. Solo mientras el menú
                está montado — no hay rAF ni canvas. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <motion.div
                className="absolute left-[8%] top-[28%] h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-action)] opacity-[0.16] blur-3xl"
                animate={
                  reduceMotion
                    ? undefined
                    : { x: [0, 28, 0], y: [0, -18, 0] }
                }
                transition={{
                  duration: 11,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute right-[-5%] bottom-[18%] h-[48vmax] w-[48vmax] translate-x-1/4 translate-y-1/4 rounded-full bg-[var(--brand-sky)] opacity-[0.12] blur-3xl"
                animate={
                  reduceMotion
                    ? undefined
                    : { x: [0, -22, 0], y: [0, 14, 0] }
                }
                transition={{
                  duration: 13,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
              />
              <svg
                className="absolute inset-0 h-full w-full mix-blend-overlay"
                style={{ opacity: MENU_GRAIN_OPACITY }}
              >
                <filter
                  id={`${grainId}-grain`}
                  x="0%"
                  y="0%"
                  width="100%"
                  height="100%"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.85"
                    numOctaves="4"
                    stitchTiles="stitch"
                  />
                </filter>
                <rect
                  width="100%"
                  height="100%"
                  filter={`url(#${grainId}-grain)`}
                />
              </svg>
            </div>

            <nav className="relative z-10 flex flex-col items-center gap-7">
              {NAV_ITEMS.map((item, i) => {
                const active = isNavItemActive(item, pathname, activeSection);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.06 * i + 0.08,
                      duration: 0.35,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "font-sans text-h4 font-(weight:--button-font-weight) uppercase tracking-(--button-letter-spacing) text-center transition-colors",
                        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring-color)] focus-visible:rounded-sm",
                        active
                          ? "text-[var(--nav-item-active)]"
                          : "text-[var(--nav-item-default)] hover:text-[var(--nav-item-hover)]",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.06 * NAV_ITEMS.length + 0.08,
                duration: 0.35,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="relative z-10 mt-10 flex flex-col items-center gap-6"
            >
              <Button variant="default" size="lg" asChild>
                <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>
                  ¿NOS REUNIMOS?
                </Link>
              </Button>
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
