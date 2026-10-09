import type { CSSProperties } from "react";
import { MARKS, type MarkKey } from "./marks-data";

/**
 * Logo VPER desde los trazos de marks-data.ts. Tinta: `currentColor`, así
 * el color lo decide la superficie (token) y no el archivo.
 *
 * `fill="btl"` es una PROPUESTA de esta lámina, no una versión entregada:
 * el recorrido sky → clay → amber de los titulares (.title-brand-gradient)
 * aplicado al logo, solo para video y redes.
 */

const NAMES: Record<MarkKey, string> = {
  h1: "VPER Media, horizontal en bloque",
  h2: "VPER Media, horizontal en línea",
  v: "VPER Media, vertical",
  iso: "VPER, monograma",
};

export function Logo({
  k,
  className,
  style,
  registered = true,
  fill = "ink",
  clear = false,
  pad = 0,
  decorative = false,
}: {
  k: MarkKey;
  className?: string;
  style?: CSSProperties;
  /** Sin el ®: solo para la prueba de reducción. */
  registered?: boolean;
  fill?: "ink" | "btl";
  /** Dibuja el área de respeto (x) alrededor de la marca. */
  clear?: boolean;
  /** Aire alrededor como fracción del lado mayor; vuelve el viewBox cuadrado. */
  pad?: number;
  decorative?: boolean;
}) {
  const m = MARKS[k];
  const [w, h] = m.viewBox;
  const gid = `vper-btl-${k}`;

  let vb: [number, number, number, number] = [0, 0, w, h];
  if (clear) vb = [-m.x, -m.x, w + 2 * m.x, h + 2 * m.x];
  else if (pad > 0) {
    const side = Math.max(w, h) * (1 + pad);
    vb = [w / 2 - side / 2, h / 2 - side / 2, side, side];
  }

  const paint = fill === "btl" ? `url(#${gid})` : "currentColor";
  const a11y = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": NAMES[k] } as const);

  return (
    <svg viewBox={vb.join(" ")} className={className} style={style} {...a11y}>
      {fill === "btl" ? (
        <defs>
          <linearGradient
            id={gid}
            x1="0"
            y1="0"
            x2={w}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" style={{ stopColor: "var(--brand-sky)" }} />
            <stop offset="0.42" style={{ stopColor: "var(--color-accent-600)" }} />
            <stop offset="1" style={{ stopColor: "var(--brand-action)" }} />
          </linearGradient>
        </defs>
      ) : null}
      {clear ? (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth={Math.max(w, h) / 400}
          opacity={0.55}
        >
          <rect
            x={-m.x}
            y={-m.x}
            width={w + 2 * m.x}
            height={h + 2 * m.x}
            strokeDasharray={`${m.x / 6} ${m.x / 6}`}
          />
          <rect x={0} y={0} width={w} height={h} />
          {/* La unidad x, dibujada en la esquina: un cuadrado de x × x. */}
          <rect
            x={-m.x}
            y={-m.x}
            width={m.x}
            height={m.x}
            fill="currentColor"
            opacity={0.25}
          />
        </g>
      ) : null}
      {m.strokes.map(([role, d]) =>
        role === "r" && !registered ? null : (
          <path key={d.slice(0, 40)} d={d} fill={paint} />
        ),
      )}
    </svg>
  );
}

/** Proporción ancho:alto de cada versión, para cajas y textos. */
export function ratio(k: MarkKey): number {
  const [w, h] = MARKS[k].viewBox;
  return w / h;
}
