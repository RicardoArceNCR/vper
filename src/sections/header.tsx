"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@ui/components/button";
import ThemeToggle from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@ui/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";
import { NAV_ITEMS, NAV_SECTION_IDS, isNavItemActive } from "@/lib/navigation";

const LOGO = "/images/logo-vper-media.svg";
// px — coincide con el alto normal del header (h-16). Bajado de 80 (h-20)
// el 2026-08-12: el estado inicial (sin scroll) se veía sobredimensionado
// — logo, texto de nav y alto del header, los tres a la vez. El
// comportamiento de encoger al scrollear queda igual (mismo mecanismo,
// mismo ratio aproximado), solo se bajó el punto de partida.
const SCROLL_THRESHOLD = 64;

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
        <div className="wrap flex items-center justify-between h-full gap-6">
          {/* Antes href="#" — en el home eso no rompía nada visible (era
              un anchor a sí mismo), pero en cualquier otra página
              (/work/[slug]) no navegaba a ningún lado, solo agregaba "#"
              a la URL actual. Link a "/" real. */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src={LOGO}
              alt="VPER Media"
              className={cn(
                "h-7 md:h-8 w-auto origin-left transition-all duration-300 group-hover:opacity-80",
                isScrolled ? "scale-50" : "scale-100",
              )}
            />
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
            className="md:hidden -mr-2 flex size-11 items-center justify-center text-[var(--nav-logo-text)]"
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
            className="md:hidden fixed inset-0 z-0 flex h-dvh flex-col items-center justify-center bg-[var(--nav-bg)] px-6"
          >
            <nav className="flex flex-col items-center gap-7">
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
                        "font-sans text-h2 font-(weight:--button-font-weight) uppercase tracking-(--button-letter-spacing) text-center transition-colors",
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
              className="mt-10 flex flex-col items-center gap-6"
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
