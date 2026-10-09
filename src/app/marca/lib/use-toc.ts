"use client";

import { useEffect, useState } from "react";

/**
 * Índice de la página activa, leído del DOM: las <section id> de primer nivel
 * dentro de <main>, con el texto de su h2 o de `data-toc`. `current` es la
 * sección que se está leyendo (scroll-spy). Lo usan el sidebar de escritorio y
 * el "En esta página" de mobile.
 */

export type Toc = { id: string; label: string }[];

function readToc(): Toc {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
  return sections
    .filter((s) => !s.parentElement?.closest("section[id]"))
    .map((s) => {
      const raw = s.dataset.toc ?? s.querySelector("h2")?.textContent ?? "";
      return { id: s.id, label: raw.trim().replace(/\.$/, "") };
    })
    .filter((t) => t.label);
}

export function useToc(pathname: string) {
  const [toc, setToc] = useState<Toc>([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    // Un frame después de navegar: la página nueva ya montó sus secciones.
    const raf = requestAnimationFrame(() => setToc(readToc()));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    if (!toc.length) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Activa: la última sección cuyo borde superior ya pasó el 30 % de la
        // ventana. Al fondo de la página, la última.
        const line = window.innerHeight * 0.3;
        let id = "";
        for (const t of toc) {
          const el = document.getElementById(t.id);
          if (el && el.getBoundingClientRect().top <= line) id = t.id;
        }
        const atEnd =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 4;
        setCurrent(atEnd ? (toc[toc.length - 1]?.id ?? id) : id);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [toc]);

  return { toc, current };
}
