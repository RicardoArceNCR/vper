"use client";

import { useEffect, useId, useRef } from "react";
import type { SVGProps } from "react";
import {
  VPER_WORDMARK_PATHS as PATHS,
  VPER_WORDMARK_VIEWBOX as VB,
} from "@/lib/vper-wordmark";

/* ─────────────────────────────────────────────────────────────────────
   Wordmark que se "enciende" bajo el cursor. Mismo principio que el
   footer de resend.com: el logo vive apagado (currentColor al 6%) y
   el cursor revela el CONTORNO de las letras a través de una máscara
   radial que sigue al mouse. En oscuro es luz sobre negro; en claro,
   tinta sobre el mismo --footer-bg — no se deja un bloque negro.

   Ojo con los radios si se tocan: el wordmark es 238×19 (12.5:1), mucho
   más chato que el 377×81 de la referencia, así que el mismo radio en
   unidades de usuario ilumina bastante más ancho. Valores afinados con
   Ricardo sobre el preview (2026-08-22): abajo de ~15 se siente
   linterna, arriba de ~70 se prende medio logo de una.

   Sin framer-motion a propósito: son ~60 escrituras de atributos por
   segundo sobre 2 gradientes y 6 grupos, no vale montar un motion value
   para eso. El seguimiento del cursor NO pasa por estado de React
   (cero re-renders); solo se tocan atributos del DOM dentro de un rAF.
   ───────────────────────────────────────────────────────────────────── */

const GLOW_R = 22; // radio del foco que revela el contorno
const WASH_R = 90; // halo amplio, da el "ambiente" alrededor del foco
const AMBIENT_STROKE = 0.9; // grosor del trazo difuminado
const BLUR = 19; // difusión del glow
const BASE_FILL = 0.06; // wordmark apagado — currentColor, no un blanco fijo
const CORE_STROKE = 0.16; // filo brillante
const WASH_STROKE = 0.3;
const SWEEP_STEP = 0.0042; // fracción del ancho por frame (fallback touch)
/* Cuánto del wordmark queda tapado por la superficie del footer. Es la
   línea de horizonte de la referencia: las letras no terminan, se hunden.
   0.12 deja leer más del trazo que 0.18. */
const HIDDEN = 0.12;

type GlyphsProps = SVGProps<SVGGElement> & { "data-role"?: string };

function Glyphs(props: GlyphsProps) {
  return (
    <g {...props}>
      {PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

/** Wordmark apagado: la única capa que se ve sin cursor encima. */
function BaseMark({ label }: { label?: string }) {
  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
      {...(label
        ? { role: "img" as const, "aria-label": label }
        : { "aria-hidden": true })}
    >
      <Glyphs fill={`color-mix(in srgb, currentColor ${BASE_FILL * 100}%, transparent)`} />
    </svg>
  );
}

/**
 * Capa reactiva. Cuatro grupos apilados, todos sobre los mismos paths:
 *   1. halo ambiental — trazo grueso + blur fuerte, enmascarado
 *   2. filo brillante — trazo finísimo pintado con el gradiente
 *   3. wash amplio — mismo truco con radio grande
 *   4. aberración cromática — copias RGB desplazadas fracciones de unidad
 *
 * Los ids van con prefijo porque el componente se monta dos veces (marca
 * + reflejo) y los defs de SVG viven en un namespace global del documento.
 */
function GlowOverlay({ uid }: { uid: string }) {
  const glow = `${uid}-glow`;
  const wash = `${uid}-wash`;
  const fGlow = `${uid}-f-glow`;
  const fAmb = `${uid}-f-amb`;
  const fAb = `${uid}-f-ab`;
  const mask = `${uid}-mask`;

  const outline = {
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      aria-hidden
      data-role="overlay"
      className="pointer-events-none absolute inset-0 h-full w-full select-none opacity-0 transition-opacity duration-500 ease-out [overflow:visible]"
    >
      <defs>
        <radialGradient
          id={glow}
          data-role="glow"
          gradientUnits="userSpaceOnUse"
          cx={VB.w / 2}
          cy={VB.h / 2}
          r={GLOW_R}
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="10%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </radialGradient>

        <radialGradient
          id={wash}
          data-role="wash"
          gradientUnits="userSpaceOnUse"
          cx={VB.w / 2}
          cy={VB.h / 2}
          r={WASH_R}
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="10%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>

        <filter id={fGlow} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.2" result="b1" />
          <feGaussianBlur stdDeviation={BLUR} result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={fAmb} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation={BLUR / 3} />
        </filter>

        <filter id={fAb} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>

        <mask id={mask}>
          <rect
            x={-200}
            y={-200}
            width={VB.w + 400}
            height={VB.h + 400}
            fill={`url(#${glow})`}
          />
        </mask>
      </defs>

      <g filter={`url(#${fAmb})`}>
        <Glyphs
          {...outline}
          stroke="currentColor"
          strokeOpacity={0.4}
          strokeWidth={AMBIENT_STROKE}
          mask={`url(#${mask})`}
        />
      </g>

      <g filter={`url(#${fGlow})`}>
        <Glyphs
          {...outline}
          stroke={`url(#${glow})`}
          strokeWidth={CORE_STROKE}
        />
      </g>

      <g filter={`url(#${fGlow})`}>
        <Glyphs
          {...outline}
          stroke={`url(#${wash})`}
          strokeWidth={WASH_STROKE}
        />
      </g>

      <g filter={`url(#${fAb})`}>
        <Glyphs
          {...outline}
          data-role="ab-r"
          stroke="rgba(255,0,0,0.4)"
          strokeWidth={CORE_STROKE}
          mask={`url(#${mask})`}
        />
        <Glyphs
          {...outline}
          data-role="ab-b"
          stroke="rgba(0,100,255,0.4)"
          strokeWidth={CORE_STROKE}
          mask={`url(#${mask})`}
        />
        <Glyphs
          {...outline}
          data-role="ab-g"
          stroke="rgba(0,255,0,0.2)"
          strokeWidth={CORE_STROKE}
          mask={`url(#${mask})`}
        />
      </g>
    </svg>
  );
}

export default function GlowMark() {
  const rootRef = useRef<HTMLElement>(null);
  // useId trae ":" (ej ":r3:") y ensucia los url(#...): se limpia.
  const uid = `vgm${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const all = <T extends Element>(sel: string) =>
      Array.from(root.querySelectorAll<T>(sel));

    const overlays = all<SVGSVGElement>('[data-role="overlay"]');
    const glows = all<SVGRadialGradientElement>('[data-role="glow"]');
    const washes = all<SVGRadialGradientElement>('[data-role="wash"]');
    const abR = all<SVGGElement>('[data-role="ab-r"]');
    const abB = all<SVGGElement>('[data-role="ab-b"]');
    const abG = all<SVGGElement>('[data-role="ab-g"]');
    const stage = root.querySelector<HTMLElement>('[data-role="stage"]');
    if (!stage) return;

    const setCursor = (x: number, y: number) => {
      for (const el of glows) {
        el.setAttribute("cx", String(x));
        el.setAttribute("cy", String(y));
      }
      for (const el of washes) {
        el.setAttribute("cx", String(x));
        el.setAttribute("cy", String(y));
      }
      // El desplazamiento RGB crece hacia los bordes: en el centro del
      // wordmark el filo queda limpio, en las puntas "se abre".
      const dx = (x / VB.w - 0.5) * 1.1;
      const dy = (y / VB.h - 0.5) * 0.35;
      for (const el of abR)
        el.setAttribute("transform", `translate(${-dx},${-dy})`);
      for (const el of abB)
        el.setAttribute("transform", `translate(${dx},${dy})`);
      for (const el of abG)
        el.setAttribute("transform", `translate(${dx * 0.6},${dy * 0.6})`);
    };

    const setLit = (lit: boolean) => {
      for (const el of overlays) el.style.opacity = lit ? "1" : "0";
      root.dataset.lit = lit ? "true" : "false";
    };

    setCursor(VB.w / 2, VB.h / 2);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(hover: none)").matches;

    // ── Touch: no hay cursor, así que la luz barre sola. Con
    //    prefers-reduced-motion se deja encendido y quieto al centro.
    if (coarse) {
      if (reduced) {
        setCursor(VB.w / 2, VB.h / 2);
        setLit(true);
        return;
      }
      let raf = 0;
      let t = -0.35;
      let visible = false;
      const tick = () => {
        t += SWEEP_STEP;
        if (t > 1.35) t = -0.35;
        setCursor(t * VB.w, VB.h * 0.5);
        raf = requestAnimationFrame(tick);
      };
      // Fuera de pantalla no se anima: el rAF se corta entero.
      const io = new IntersectionObserver(
        ([entry]) => {
          const next = entry?.isIntersecting ?? false;
          if (next === visible) return;
          visible = next;
          if (visible) {
            setLit(true);
            raf = requestAnimationFrame(tick);
          } else {
            cancelAnimationFrame(raf);
            setLit(false);
          }
        },
        { rootMargin: "10% 0px" },
      );
      io.observe(root);
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
      };
    }

    // ── Puntero fino: el glow sigue al mouse, throttleado a un rAF.
    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    const flush = () => {
      raf = 0;
      if (!pending) return;
      setCursor(pending.x, pending.y);
      pending = null;
    };

    const onMove = (ev: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pending = {
        x: ((ev.clientX - r.left) / r.width) * VB.w,
        y: ((ev.clientY - r.top) / r.height) * VB.h,
      };
      setLit(true);
      if (!raf) raf = requestAnimationFrame(flush);
    };

    const onLeave = () => {
      setLit(false);
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      // Oscuro: void negro (luz sobre negro). Claro: mismo papel que el
      // footer; el wordmark y la linterna van en currentColor (tinta).
      className="relative isolate hidden overflow-hidden bg-[var(--footer-bg)] text-foreground px-4 pt-6 md:block md:px-8 md:pt-10"
    >
      {/* La caja del wordmark mide el alto COMPLETO — el 12% de abajo
          existe, solo queda debajo de la superficie del footer. Así el
          mapeo del cursor sigue siendo el del logo entero. */}
      <div
        data-role="stage"
        className="relative w-full"
        style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
      >
        <BaseMark label="VPER Media" />
        <GlowOverlay uid={uid} />

        {/* Superficie del footer. El -mx cancela el padding de la sección
            para que el corte llegue de borde a borde de la pantalla, y el
            color sale del mismo token que usa <Footer />: la banda y el
            footer quedan como una sola pieza. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-10 -mx-4 overflow-hidden md:-mx-8"
          style={{
            height: `${HIDDEN * 100}%`,
            background: "var(--footer-bg)",
          }}
        >
          {/* Reflejo sobre el piso: la misma marca espejada en la línea de
              horizonte. El mx- vuelve a meter el padding para que la copia
              quede alineada con el original, no con el sangrado. */}
          <div
            className="absolute inset-0 mx-4 md:mx-8"
            style={{
              opacity: 0.22,
              maskImage: "linear-gradient(to bottom, #000 0%, transparent 80%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 0%, transparent 80%)",
            }}
          >
            <div
              className="absolute inset-x-0"
              style={{
                top: `-${((1 - HIDDEN) / HIDDEN) * 100}%`,
                height: `${(1 / HIDDEN) * 100}%`,
                transform: "scaleY(-1)",
                transformOrigin: `50% ${(1 - HIDDEN) * 100}%`,
              }}
            >
              <BaseMark />
              <GlowOverlay uid={`${uid}r`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
