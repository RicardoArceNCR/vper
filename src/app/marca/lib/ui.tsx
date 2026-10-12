import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@ui/lib/utils";
import { MARCA } from "./config";

/**
 * Piezas de maquetación compartidas por las láminas de lineamientos (voz,
 * imagen, personaje) y el Inicio. Sin estado: sirven en servidor.
 */

/** Migas + fecha, arriba de cada lámina. */
export function Crumbs({ trail, note }: { trail: string[]; note: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-3 pt-10 font-sans text-body-sm font-medium text-muted-foreground md:pt-16">
      <span>
        <Link href="/marca" className="underline underline-offset-4">
          {MARCA.name}
        </Link>
        {trail.map((t) => ` · ${t}`).join("")}
      </span>
      <span>{note}</span>
    </div>
  );
}

/**
 * Encabezado de lámina: ceja, titular display con golpe en gradiente y bajada.
 *
 * Por defecto va en un panel con la textura de radios de la marca
 * (`.bg-brand-texture`, recortes claro/oscuro de brand.css) y el filete
 * Sky → Clay → Amber arriba (`.brand-rule`). La textura es casi plana (≥96 %
 * de sus píxeles a menos de 4 % del fondo), así que el contraste del texto es
 * el mismo que sobre la página. `texture={false}` vuelve al encabezado liso.
 */
export function PageHero({
  over,
  title,
  accent,
  lede,
  children,
  texture = true,
}: {
  over: string;
  title: string;
  accent: string;
  lede: string;
  children?: ReactNode;
  texture?: boolean;
}) {
  const body = (
    <>
      <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
        {over}
      </p>
      <h1 className="mt-3 font-display display-title font-black uppercase tracking-tight">
        {title} <span className="title-brand-gradient">{accent}</span>
      </h1>
      <p className="mt-6 max-w-2xl font-sans text-body-lg font-medium text-muted-foreground">
        {lede}
      </p>
      {children}
    </>
  );
  if (!texture) {
    return <div className="@container min-w-0 py-10 md:py-16">{body}</div>;
  }
  return (
    <div className="mt-6 mb-2 min-w-0 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-background bg-brand-texture md:mt-8">
      <div aria-hidden className="brand-rule" />
      <div className="@container min-w-0 px-4 py-10 sm:px-6 md:px-10 md:py-14">{body}</div>
    </div>
  );
}

/** Sección de primer nivel: entra sola en el índice (sidebar y mobile). */
export function Section({
  id,
  toc,
  over,
  title,
  lede,
  children,
  className,
}: {
  id: string;
  toc: string;
  over: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-toc={toc}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-24 border-t border-border py-14 md:py-20", className)}
    >
      <div className="@container mb-8 min-w-0 max-w-3xl md:mb-12">
        <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
          {over}
        </p>
        <h2
          id={`${id}-title`}
          className="mt-3 font-display display-title-sm font-black uppercase tracking-tight"
        >
          {title}
        </h2>
        {lede ? (
          <div className="mt-4 font-sans text-body-md font-medium text-[var(--text-secondary)]">
            {lede}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** Texto con `código` entre backticks: lo que viene de los archivos de contenido. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <code
            key={i}
            className="rounded-[var(--radius-xs)] bg-[var(--background-subtle)] px-1 font-mono text-[0.9em]"
          >
            {p}
          </code>
        ) : (
          p
        ),
      )}
    </>
  );
}

/**
 * Numeral de lista (01, 02… o 1, 2…) como insignia Amber: relleno
 * `--brand-action` y texto `--text-on-brand` (11.8:1 en claro y oscuro). El
 * numeral suelto en amber/700 se leía marrón oliva.
 */
export function Numeral({ n, pad = false }: { n: number; pad?: boolean }) {
  return (
    <span className="inline-grid h-9 w-fit min-w-9 place-items-center rounded-[var(--pill-radius)] bg-[var(--brand-action)] px-2 font-display text-body-sm font-black text-[var(--text-on-brand)]">
      {pad ? String(n).padStart(2, "0") : n}
    </span>
  );
}

/**
 * Lista de trabajo del equipo web, al final de la lámina y plegada: no es un
 * lineamiento, es lo que falta corregir en el sitio. Entra al índice con su
 * propio nombre.
 */
export function Pending({
  id = "corregir",
  count,
  lede,
  children,
  className,
}: {
  id?: string;
  count: number;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Section
      id={id}
      toc="Pendientes del sitio"
      over="Para el equipo web"
      title="Pendientes del sitio (equipo web)"
      lede={lede}
      className={className}
    >
      <details className="group rounded-[var(--radius-lg)] border border-border bg-[var(--surface-raised)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-[var(--radius-lg)] p-4 font-sans text-body-md font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] md:p-5 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="group-open:hidden">Ver</span>
            <span className="hidden group-open:inline">Ocultar</span> los {count}{" "}
            pendientes
          </span>
          <ChevronDown
            aria-hidden
            className="size-5 shrink-0 transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-border p-4 md:p-5">{children}</div>
      </details>
    </Section>
  );
}

/** Lista "Para corregir en el sitio": cada lámina termina con lo que encontró. */
export function Findings({
  items,
}: {
  items: { donde: string; que: string; propuesta: string }[];
}) {
  return (
    <ol className="grid gap-3">
      {items.map((it, n) => (
        <li
          key={it.donde + it.que}
          className="grid gap-3 rounded-[var(--radius-lg)] border border-border p-4 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-6 md:p-5"
        >
          <Numeral n={n + 1} />
          <div className="grid content-start gap-1.5">
            <code className="font-mono text-body-xs [overflow-wrap:anywhere] text-[var(--text-secondary)]">
              {it.donde}
            </code>
            <p className="font-sans text-body-sm font-medium">
              <Rich text={it.que} />
            </p>
          </div>
          <p className="font-sans text-body-sm text-[var(--text-secondary)]">
            <b className="font-bold text-[var(--feedback-success-text)]">Propuesta: </b>
            <Rich text={it.propuesta} />
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Fuentes de una lámina, plegadas. */
export function Sources({ items }: { items: string[] }) {
  return (
    <details className="mt-10 rounded-[var(--radius-lg)] border border-border p-4 font-sans text-body-sm">
      <summary className="cursor-pointer font-bold">
        De dónde sale esto ({items.length} archivos)
      </summary>
      <ul className="mt-3 grid gap-1 font-mono text-body-xs text-[var(--text-secondary)] sm:grid-cols-2">
        {items.map((f) => (
          <li key={f} className="[overflow-wrap:anywhere]">
            {f}
          </li>
        ))}
      </ul>
    </details>
  );
}
