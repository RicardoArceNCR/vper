import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@ui/lib/utils";

/**
 * Piezas de maquetación compartidas por las láminas de lineamientos (voz,
 * imagen). Sin estado: sirven en servidor.
 */

/** Migas + fecha, arriba de cada lámina. */
export function Crumbs({ trail, note }: { trail: string[]; note: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-3 pt-10 font-sans text-body-sm font-medium text-muted-foreground md:pt-16">
      <span>
        <Link href="/marca" className="underline underline-offset-4">
          Marca
        </Link>
        {trail.map((t) => ` · ${t}`).join("")}
      </span>
      <span>{note}</span>
    </div>
  );
}

/** Encabezado de lámina: ceja, titular display con golpe en gradiente y bajada. */
export function PageHero({
  over,
  title,
  accent,
  lede,
  children,
}: {
  over: string;
  title: string;
  accent: string;
  lede: string;
  children?: ReactNode;
}) {
  return (
    <div className="@container min-w-0 py-10 md:py-16">
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
          className="grid gap-3 rounded-[var(--radius-lg)] border border-border p-4 md:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-6 md:p-5"
        >
          <span className="font-display text-h3 font-black text-[var(--text-brand)]">
            {n + 1}
          </span>
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
