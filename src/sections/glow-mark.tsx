"use client";

import { useEffect, useId, useRef } from "react";
import type { SVGProps } from "react";
import {
  VPER_WORDMARK_PATHS as PATHS,
  VPER_WORDMARK_VIEWBOX as VB,
} from "@/lib/vper-wordmark";

/* ─────────────────────────────────────────────────────────────────────
   Wordmark que se "enciende" bajo el cursor. Mismo principio que el
   footer de resend.com: el logo vive apagado y el cursor revela el
   CONTORNO. Sin WebGL — SVG + CSS. Dial board abajo: tocá, guardá,
   mirá. Los radios son unidades de usuario del viewBox 238×19
   (12.5:1): el mismo número ilumina más ancho que en un logo cuadrado.

   2026-09-02 — capa "shaders-lite": ambiente miel/sky, wash más
   amplio, grain y mirror. Sigue sin canvas. Mobile: visible con
   barrido automático (hover:none) y rAF cortado fuera de pantalla.
   ───────────────────────────────────────────────────────────────────── */

/** Dial — afinar acá, no en className sueltos. */
const GLOW_R = 18; // foco que revela el contorno
const WASH_R = 88; // halo amplio alrededor del foco
const AMBIENT_STROKE = 1.05;
const BLUR = 18;
const BASE_FILL = 0.075; // wordmark apagado (currentColor)
const CORE_STROKE = 0.18;
const WASH_STROKE = 0.38;
const SWEEP_STEP = 0.0042; // touch: fracción del ancho por frame
const HIDDEN = 0.14; // % inferior hundido bajo la superficie del footer
const MIRROR_OPACITY = 0.34;
const GRAIN_OPACITY = 0.055;
// Aberración: fracción del desplazamiento hacia los bordes
const AB_X = 1.25;
const AB_Y = 0.4;

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
 * Capa reactiva. Grupos apilados sobre los mismos paths:
 *   1. halo ambiental — trazo grueso + blur, enmascarado
 *   2. filo brillante — stroke con el gradiente del foco
 *   3. wash amplio — radio grande
 *   4. wash de marca — sky/miel muy lavados (sin pelear con currentColor)
 *   5. aberración cromática — copias RGB desplazadas
 *
 * Ids con prefijo: el componente se monta dos veces (marca + reflejo).
 */
function GlowOverlay({ uid }: { uid: string }) {
  const glow = `${uid}-glow`;
  const wash = `${uid}-wash`;
  const brand = `${uid}-brand`;
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
          <stop offset="12%" stopColor="currentColor" stopOpacity="0.55" />
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
          <stop offset="14%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>

        {/* Wash de marca: el pointer mueve cx/cy igual que el wash. */}
        <radialGradient
          id={brand}
          data-role="brand-wash"
          gradientUnits="userSpaceOnUse"
          cx={VB.w / 2}
          cy={VB.h / 2}
          r={WASH_R * 1.15}
        >
          <stop offset="0%" stopColor="var(--brand-action)" stopOpacity="0.55" />
          <stop offset="35%" stopColor="var(--brand-sky)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--brand-sky)" stopOpacity="0" />
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
          strokeOpacity={0.45}
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

      <g filter={`url(#${fGlow})`} opacity={0.85}>
        <Glyphs
          {...outline}
          stroke={`url(#${brand})`}
          strokeWidth={WASH_STROKE * 1.4}
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
    const brands = all<SVGRadialGradientElement>('[data-role="brand-wash"]');
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
      for (const el of brands) {
        el.setAttribute("cx", String(x));
        el.setAttribute("cy", String(y));
      }
      // El desplazamiento RGB crece hacia los bordes: en el centro del
      // wordmark el filo queda limpio, en las puntas "se abre".
      const dx = (x / VB.w - 0.5) * AB_X;
      const dy = (y / VB.h - 0.5) * AB_Y;
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
    // Touch real: hover:none. Algunos WebViews reportan hover y aún
    // así no hay cursor útil — en viewport mobile siempre barre.
    const coarse =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(max-width: 767px)").matches;

    // ── Touch / mobile: no hay cursor útil, la luz barre sola. Con
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
      // Mobile: barrido automático (rama `coarse` arriba) + IO — el rAF
      // solo corre en vista. No es WebGL; el costo es SVG filters en un
      // bloque bajo. prefers-reduced-motion = lit quieto al centro.
      className="relative isolate overflow-hidden bg-[var(--footer-bg)] px-4 pt-4 pb-2 text-foreground md:px-8 md:pt-10 md:pb-0"
    >
      {/* Ambiente estático miel + sky. No sigue al cursor: da cuerpo
          detrás del wordmark sin montar canvas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-[12%] top-1/2 h-[140%] w-[48%] -translate-y-1/2 rounded-full bg-[var(--brand-action)] opacity-[0.09] blur-3xl" />
        <div className="absolute right-[8%] top-[40%] h-[120%] w-[36%] -translate-y-1/2 rounded-full bg-[var(--brand-sky)] opacity-[0.07] blur-3xl" />
      </div>

      {/* La caja del wordmark mide el alto COMPLETO. En desktop el
          tramo HIDDEN queda debajo de la superficie (horizonte +
          mirror). En mobile no hay horizonte: se lee entero. */}
      <div
        data-role="stage"
        className="relative w-full"
        style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
      >
        <BaseMark label="VPER Media" />
        <GlowOverlay uid={uid} />

        {/* Grain: feTurbulence estático, una sola vez. Overlay suave. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6] h-full w-full mix-blend-overlay"
          style={{ opacity: GRAIN_OPACITY }}
        >
          <filter id={`${uid}-grain`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${uid}-grain)`} />
        </svg>

        {/* Superficie / horizonte — solo desktop. En mobile el wordmark
            animado se muestra completo (el footer ya no duplica la marca). */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-10 -mx-4 hidden overflow-hidden md:-mx-8 md:block"
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
              opacity: MIRROR_OPACITY,
              maskImage: "linear-gradient(to bottom, #000 0%, transparent 78%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 0%, transparent 78%)",
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
