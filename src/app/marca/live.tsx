"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@ui/lib/utils";

/**
 * Lectura en vivo de la cascada. La página de sistema NO copia hex ni px:
 * pinta con `var(--token)` y después le pregunta al navegador qué valor
 * ganó. Así lo que se ve es tokens.css → tokens-dark.css → bridge →
 * brand.css ya resuelto, incluido un override de brand.css que pise al
 * paquete (o uno que deje de pisarlo porque el orden de carga se rompió).
 */

/** Sube un contador cada vez que cambia la clase de <html> (toggle de tema). */
export function useThemeVersion(): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    const obs = new MutationObserver(() => setV((n) => n + 1));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return v;
}

type Rgba = [number, number, number, number];

/** rgb()/rgba() o color(srgb …) — lo que devuelve getComputedStyle. */
export function parseColor(input: string): Rgba | null {
  const s = input.trim();
  let m = s.match(/^rgba?\(([^)]+)\)$/);
  if (m?.[1]) {
    const p = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    return [p[0] ?? 0, p[1] ?? 0, p[2] ?? 0, p[3] ?? 1];
  }
  m = s.match(/^color\(srgb ([^)]+)\)$/);
  if (m?.[1]) {
    const p = m[1]
      .split(/[\s/]+/)
      .filter(Boolean)
      .map(Number);
    return [(p[0] ?? 0) * 255, (p[1] ?? 0) * 255, (p[2] ?? 0) * 255, p[3] ?? 1];
  }
  return null;
}

export function toHex([r, g, b]: Rgba): string {
  return (
    "#" +
    [r, g, b]
      .map((n) =>
        Math.round(Math.min(255, Math.max(0, n)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

function luminance([r, g, b]: Rgba): number {
  const ch = (c: number) => {
    const x = c / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

/** Compone un color con alfa sobre su fondo antes de medir. */
function over(fg: Rgba, bg: Rgba): Rgba {
  const a = fg[3];
  return [
    fg[0] * a + bg[0] * (1 - a),
    fg[1] * a + bg[1] * (1 - a),
    fg[2] * a + bg[2] * (1 - a),
    1,
  ];
}

export function contrast(fg: Rgba, bg: Rgba): number {
  const f = luminance(over(fg, bg));
  const b = luminance(bg);
  const [hi, lo] = f > b ? [f, b] : [b, f];
  return (hi + 0.05) / (lo + 0.05);
}

/** Primer ancestro con fondo opaco: contra eso se mide el contraste. */
function effectiveBg(el: Element | null): Rgba {
  let node: Element | null = el;
  while (node) {
    const c = parseColor(getComputedStyle(node).backgroundColor);
    if (c && c[3] > 0.99) return c;
    node = node.parentElement;
  }
  return [255, 255, 255, 1];
}

function measure(el: HTMLElement, prop: "color" | "backgroundColor" | "borderTopColor") {
  return parseColor(getComputedStyle(el)[prop]);
}

/* ─────────────────────────── piezas ─────────────────────────── */

/* ─────────────────────────── copiar ─────────────────────────── */

const COPY_EVENT = "marca:copied";

/**
 * Copia texto al portapapeles y avisa al <CopyToast /> del layout. Un solo
 * aviso para toda la página: no hay un "copiado" por cada muestra.
 */
export async function copyText(text: string): Promise<void> {
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch {
    // Safari viejo o permisos: textarea oculto + execCommand.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    Object.assign(ta.style, { position: "fixed", left: "-9999px" });
    document.body.appendChild(ta);
    ta.select();
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
  }
  window.dispatchEvent(new CustomEvent(COPY_EVENT, { detail: ok ? text : "" }));
}

/** Aviso único de "copiado", abajo al centro. Va en el layout de Marca. */
export function CopyToast() {
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  useEffect(() => {
    let t = 0;
    const on = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      setMsg({ text, ok: Boolean(text) });
      window.clearTimeout(t);
      t = window.setTimeout(() => setMsg(null), 1800);
    };
    window.addEventListener(COPY_EVENT, on);
    return () => {
      window.removeEventListener(COPY_EVENT, on);
      window.clearTimeout(t);
    };
  }, []);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {msg ? (
        <span className="flex max-w-full items-center gap-2 rounded-[var(--pill-radius)] bg-[var(--color-neutral-950)] px-4 py-2 font-sans text-body-sm font-bold text-[var(--color-neutral-50)] shadow-[var(--shadow-lg)] ring-1 ring-[var(--color-neutral-800)]">
          <span
            aria-hidden
            className={cn(
              "size-2 shrink-0 rounded-full",
              msg.ok ? "bg-[var(--brand-action)]" : "bg-[var(--color-accent-500)]",
            )}
          />
          {msg.ok ? (
            <>
              Copiado <code className="truncate font-mono font-normal">{msg.text}</code>
            </>
          ) : (
            "No se pudo copiar"
          )}
        </span>
      ) : null}
    </div>
  );
}

/** Qué se copia de un nombre: `--x` como `var(--x)`; clases y valores, tal cual. */
function copyValue(name: string): string {
  return name.startsWith("--") ? `var(${name})` : name;
}

/**
 * Nombre de token o clase. Si es un nombre solo (`--spacing-4`,
 * `text-display-lg`, `.title-solid`) se copia al hacer clic; si es una frase
 * o un par (`--a / --b`) queda como texto.
 */
export function TokenName({ children }: { children: ReactNode }) {
  const text = typeof children === "string" ? children : null;
  const copyable = text !== null && /^[.\w-]+$/.test(text);
  if (!copyable || text === null) {
    return (
      <code className="font-mono text-body-xs break-all text-[var(--text-secondary)]">
        {children}
      </code>
    );
  }
  const value = copyValue(text);
  return (
    <button
      type="button"
      onClick={() => copyText(value)}
      title={`Copiar ${value}`}
      className="w-fit cursor-copy rounded-[var(--radius-xs)] text-left font-mono text-body-xs break-all text-[var(--text-secondary)] decoration-dotted underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)]"
    >
      {text}
    </button>
  );
}

/**
 * Muestra de color: pinta `var(token)` y debajo escribe el hex que
 * resolvió el navegador. `anchor` dibuja el aro del hex de marca.
 */
export function Swatch({
  token,
  label,
  anchor = false,
  className,
}: {
  token: string;
  label?: string;
  anchor?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useThemeVersion();
  const [hex, setHex] = useState("");
  useEffect(() => {
    const c = ref.current && measure(ref.current, "backgroundColor");
    setHex(c ? toHex(c) : "");
  }, [v]);
  return (
    <figure className={cn("m-0 flex min-w-0 flex-col gap-1.5", className)}>
      <button
        type="button"
        onClick={() => hex && copyText(hex)}
        title={hex ? `Copiar ${hex}` : undefined}
        aria-label={`${label ?? token}: copiar ${hex || "color"}`}
        className="group relative block w-full cursor-copy rounded-[var(--radius-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)]"
      >
        <div
          ref={ref}
          className={cn(
            "aspect-square w-full rounded-[var(--radius-md)] border border-[var(--border-subtle)] transition-transform group-hover:scale-[1.04] group-active:scale-95",
            anchor &&
              "outline-2 outline-offset-2 outline-[var(--text-primary)] outline-solid",
          )}
          style={{ backgroundColor: `var(${token})` }}
        />
      </button>
      <figcaption className="flex flex-col items-start">
        <button
          type="button"
          onClick={() => copyText(`var(${token})`)}
          title={`Copiar var(${token})`}
          className="cursor-copy rounded-[var(--radius-xs)] text-left font-sans text-label-xs font-bold text-[var(--text-primary)] decoration-dotted underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)]"
        >
          {label ?? token}
        </button>
        <span className="font-mono text-body-xs text-[var(--text-tertiary)]">
          {hex || "—"}
        </span>
      </figcaption>
    </figure>
  );
}

/** Rampa completa de una familia, con el stop ancla marcado. */
export function Ramp({
  family,
  role,
  anchor,
  note,
}: {
  family: string;
  role: string;
  anchor?: number;
  note: string;
}) {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-sans text-h4 font-bold">{role}</h3>
        <TokenName>{`--color-${family}-*`}</TokenName>
        <span className="font-sans text-body-sm text-[var(--text-tertiary)]">{note}</span>
      </div>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
        {stops.map((s) => (
          <Swatch
            key={s}
            token={`--color-${family}-${s}`}
            label={String(s)}
            anchor={s === anchor}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Texto sobre fondo, ambos por token, con el ratio medido. Si el par no
 * llega al mínimo, la etiqueta lo dice — no se esconde.
 */
export function Pair({
  fg,
  bg,
  label,
  min = 4.5,
  sample = "Aa",
  className,
  sampleClassName,
}: {
  fg: string;
  bg: string;
  label?: string;
  min?: number;
  sample?: ReactNode;
  className?: string;
  sampleClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useThemeVersion();
  const [ratio, setRatio] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const f = measure(el, "color");
    const b = measure(el, "backgroundColor");
    if (f && b) setRatio(contrast(f, b[3] > 0.99 ? b : effectiveBg(el)));
  }, [v]);
  const pass = ratio !== null && ratio >= min;
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <div
        ref={ref}
        className="flex min-h-20 items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] px-4 py-3"
        style={{ color: `var(${fg})`, backgroundColor: `var(${bg})` }}
      >
        <span className={cn("font-sans text-h3 font-bold", sampleClassName)}>
          {sample}
        </span>
        <span
          className={cn(
            "rounded-[var(--radius-sm)] px-1.5 py-0.5 font-mono text-body-xs",
            pass
              ? "bg-[var(--feedback-success-bg)] text-[var(--feedback-success-text)]"
              : "bg-[var(--feedback-error-bg)] text-[var(--feedback-error-text)]",
          )}
        >
          {ratio === null ? "…" : `${ratio.toFixed(2)}:1`}
        </span>
      </div>
      <div className="flex flex-col">
        {label ? (
          <span className="font-sans text-label-xs font-bold text-[var(--text-primary)]">
            {label}
          </span>
        ) : null}
        <TokenName>{`${fg} / ${bg}`}</TokenName>
      </div>
    </div>
  );
}

/**
 * Fila de tipo: renderiza la clase y escribe al lado el size / leading
 * que de verdad computó el navegador (no el que dice un comentario).
 */
export function TypeRow({
  name,
  className,
  children,
}: {
  name: string;
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const v = useThemeVersion();
  const [spec, setSpec] = useState("");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const cs = getComputedStyle(el);
      const lh =
        cs.lineHeight === "normal"
          ? "normal"
          : `${Math.round(parseFloat(cs.lineHeight))}`;
      const ls = cs.letterSpacing === "normal" ? "0" : cs.letterSpacing;
      setSpec(
        `${Math.round(parseFloat(cs.fontSize))} / ${lh} · ${ls} · ${cs.fontWeight}`,
      );
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [v]);
  return (
    <li className="grid items-baseline gap-x-6 gap-y-1 border-b border-[var(--border-subtle)] py-4 md:grid-cols-[minmax(11rem,max-content)_minmax(9rem,max-content)_minmax(0,1fr)]">
      <TokenName>{name}</TokenName>
      <span className="font-mono text-body-xs text-[var(--text-tertiary)]">
        {spec || "—"}
      </span>
      <p ref={ref} className={cn("min-w-0 overflow-hidden", className)}>
        {children}
      </p>
    </li>
  );
}

/** Caja con el ancho fijado para probar `.display-title*` (lee `cqi`). */
export function WidthProbe({
  width,
  children,
  style,
}: {
  width: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div className="min-w-0">
      <TokenName>{`${width}px`}</TokenName>
      <div
        className="@container mt-2 min-w-0 max-w-full overflow-hidden border border-dashed border-[var(--border-strong)] p-3"
        style={{ width, ...style }}
      >
        {children}
      </div>
    </div>
  );
}

/** Repite la coreografía del hero: quita y vuelve a poner `.hero-ready`. */
export function ReplayHero({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(true);
  const replay = () => {
    setReady(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
  };
  return (
    <div className="flex flex-col gap-4">
      <div className={ready ? "hero-ready" : undefined}>{children}</div>
      <button
        type="button"
        onClick={replay}
        className="w-fit font-sans text-body-sm font-bold text-[var(--interaction-link-default)] underline underline-offset-4 hover:text-[var(--interaction-link-hover)]"
      >
        Repetir entrada
      </button>
    </div>
  );
}
