import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  Download,
  Instagram,
  LayoutGrid,
  Phone,
  Play,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { Crumbs, Findings, PageHero, Rich, Section, Sources } from "../lib/ui";
import { IMAGEN, type Icono } from "./imagen-content";

export const metadata: Metadata = { title: "Imagen e iconografía" };

/**
 * Lineamientos · Imagen e iconografía. El contenido (./imagen-content.ts) lo
 * escribió dirección de arte mirando las fotos e íconos que el sitio ya usa;
 * cada `src` es un archivo real de /public. Esta página solo lo presenta.
 */

// Íconos de interfaz citados en el contenido como "lucide:Nombre". Mapa
// explícito: importar todo lucide rompería el tree-shaking.
const LUCIDE: Record<string, LucideIcon> = {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  Download,
  Instagram,
  LayoutGrid,
  Phone,
  Play,
  Sun,
};

function Glyph({ icon }: { icon: Icono }) {
  if (icon.src.startsWith("lucide:")) {
    const Icon = LUCIDE[icon.src.slice("lucide:".length)];
    return Icon ? <Icon aria-hidden className="size-7" /> : null;
  }
  return (
    <img
      src={icon.src}
      alt=""
      loading="lazy"
      decoding="async"
      className="max-h-14 max-w-full object-contain"
    />
  );
}

export default function ImagenPage() {
  const { fotografia: foto, iconografia: ico } = IMAGEN;
  return (
    <main className="wrap mx-auto max-w-[1217px] pb-24">
      <Crumbs
        trail={["Lineamientos", "Imagen e iconografía"]}
        note="Derivada del material del sitio · Octubre 2026"
      />
      <PageHero
        over="Imagen e iconografía"
        title="Cómo"
        accent="se ve."
        lede={IMAGEN.resumen}
      />

      <Section
        id="fotografia"
        toc="Fotografía"
        over="Fotografía"
        title="Clave baja, un solo color"
        lede="Seis decisiones que se repiten en todo el material del sitio."
      >
        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {foto.principios.map((p, n) => (
            <li
              key={p.titulo}
              className="grid content-start gap-2 rounded-[var(--radius-xl)] border border-border p-5"
            >
              <span className="font-display text-h3 font-black text-[var(--text-brand)]">
                {String(n + 1).padStart(2, "0")}
              </span>
              <h3 className="font-sans text-h5 font-bold">{p.titulo}</h3>
              <p className="font-sans text-body-sm text-[var(--text-secondary)]">
                <Rich text={p.regla} />
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="ejemplos"
        toc="Ejemplos"
        over="Referencias"
        title="Así se ve"
        lede="Fotos del sitio y qué mirar en cada una."
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {foto.ejemplos.map((f) => (
            <li key={f.src} className="grid content-start gap-3">
              <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-neutral-950)]">
                <img
                  src={f.src}
                  alt={f.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="grid gap-1">
                <span className="font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-eyebrow)]">
                  {f.proyecto}
                </span>
                <p className="font-sans text-body-sm text-[var(--text-secondary)]">
                  <Rich text={f.nota} />
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="mb-4 font-sans text-label-sm font-bold uppercase tracking-widest text-[var(--feedback-error-text)]">
              Evitar
            </h3>
            <ul className="grid gap-3">
              {foto.evitar.map((e) => (
                <li
                  key={e}
                  className="flex gap-3 font-sans text-body-sm text-[var(--text-secondary)]"
                >
                  <span
                    aria-hidden
                    className="font-bold text-[var(--feedback-error-text)]"
                  >
                    ✕
                  </span>
                  <span>
                    <Rich text={e} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-sans text-label-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Especificaciones
            </h3>
            <dl className="grid gap-3">
              {foto.tecnico.map((t) => (
                <div key={t.titulo} className="grid gap-1 border-b border-border pb-3">
                  <dt className="font-sans text-body-sm font-bold">{t.titulo}</dt>
                  <dd className="font-sans text-body-sm text-[var(--text-secondary)]">
                    <Rich text={t.regla} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section
        id="iconografia"
        toc="Iconografía"
        over="Iconografía"
        title="Un set por superficie"
        lede={
          <ul className="mt-2 grid gap-2">
            {ico.principios.map((p) => (
              <li key={p.titulo}>
                <b className="font-bold text-foreground">{p.titulo}. </b>
                <Rich text={p.regla} />
              </li>
            ))}
          </ul>
        }
      >
        <div className="grid gap-6">
          {ico.sets.map((set) => (
            <article
              key={set.nombre}
              className="grid gap-5 rounded-[var(--radius-xl)] border border-border p-5 md:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-10"
            >
              <div className="grid content-start gap-2">
                <h3 className="font-display text-h3 font-black uppercase">
                  {set.nombre}
                </h3>
                <p className="font-sans text-body-sm text-[var(--text-secondary)]">
                  <Rich text={set.descripcion} />
                </p>
                <p className="font-sans text-body-sm">
                  <b className="font-bold">Cuándo: </b>
                  <Rich text={set.cuando} />
                </p>
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {set.iconos.map((i) => (
                  <li key={i.src + i.nombre} className="grid content-start gap-2">
                    <div className="flex h-24 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-3 text-[var(--text-primary)]">
                      <Glyph icon={i} />
                    </div>
                    <span className="font-sans text-body-xs font-bold">{i.nombre}</span>
                    <span className="font-sans text-body-xs text-[var(--text-secondary)]">
                      <Rich text={i.uso} />
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {ico.reglas.map((r) => (
            <li
              key={r.titulo}
              className="rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-4"
            >
              <b className="font-sans text-body-sm font-bold">{r.titulo}</b>
              <p className="mt-1 font-sans text-body-sm text-[var(--text-secondary)]">
                <Rich text={r.regla} />
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="corregir"
        toc="Para corregir"
        over="Revisión del sitio"
        title="Para corregir en el sitio"
        lede="Lo que la revisión del material encontró fuera de estilo o roto. Ninguno está cambiado todavía: es la lista de trabajo."
      >
        <Findings items={IMAGEN.inconsistencias} />
        <Sources items={IMAGEN.fuentes} />
      </Section>
    </main>
  );
}
