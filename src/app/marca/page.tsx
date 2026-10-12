import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Download,
  Mail,
  Pipette,
  type LucideIcon,
} from "lucide-react";
import { Swatch } from "./live";
import { MARCA, hasOwner, ownerLabel } from "./lib/config";
import { PageHero, Section } from "./lib/ui";

export const metadata: Metadata = {
  title: { absolute: MARCA.name },
};

/**
 * Inicio de Marca VPER: portada de tareas. Primero lo que el equipo viene a
 * buscar (logo, firma, un color, vpercito), después los colores listos para
 * copiar y los lineamientos; el sistema y el lab quedan en una franja para
 * diseño y desarrollo. Los colores se pintan con `var(--…)` y el hex que se
 * muestra y se copia es el que resolvió el navegador (Swatch, ./live).
 */

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)]";

const TAREAS: { href: string; title: string; body: string; icon: LucideIcon }[] = [
  {
    href: "/marca/logo#descargas",
    title: "Descargar el logo",
    body: "SVG y PNG en las cuatro versiones, en negro, blanco y Amber.",
    icon: Download,
  },
  {
    href: "/marca/firmas",
    title: "Armar mi firma de correo",
    body: "Escribí tus datos y copiala en Gmail u Outlook.",
    icon: Mail,
  },
  {
    href: "#colores",
    title: "Copiar un color",
    body: "Amber, Clay, Sky y Jade, con un toque.",
    icon: Pipette,
  },
  {
    href: "/marca/personaje#descargas",
    title: "Bajar a vpercito",
    body: "PNG para presentaciones, avatar y emoji para Slack.",
    icon: Bot,
  },
];

const COLORES: { token: string; name: string; uso: string }[] = [
  { token: "--brand-action", name: "Amber", uso: "Botones y la palabra que golpea." },
  { token: "--color-accent-600", name: "Clay", uso: "Cejas, etiquetas y errores." },
  { token: "--brand-sky", name: "Sky", uso: "Enlaces, información y el 3D." },
  { token: "--brand-leaf", name: "Jade", uso: "Confirmaciones y detalles." },
];

const LINEAMIENTOS: { href: string; title: string; body: string }[] = [
  {
    href: "/marca/logo",
    title: "Logo",
    body: "Qué versión va dónde, en qué color y qué no hacerle.",
  },
  {
    href: "/marca/voz",
    title: "Voz y tono",
    body: "Cómo escribe VPER, con ejemplos del sitio.",
  },
  {
    href: "/marca/imagen",
    title: "Imagen",
    body: "Cómo elegir fotos e íconos.",
  },
  {
    href: "/marca/personaje",
    title: "Personaje",
    body: "Dónde va vpercito y dónde no.",
  },
];

const DISENO: { href: string; title: string; body: string }[] = [
  {
    href: "/marca/sistema",
    title: "Sistema",
    body: "Escalas, tipo y componentes, leídos en vivo del sitio.",
  },
  {
    href: "/lab/proceso",
    title: "Lab 3D",
    body: "Los íconos de vidrio del proceso, en movimiento.",
  },
];

function Tarea({
  href,
  title,
  body,
  icon: Icon,
}: {
  href: string;
  title: string;
  body: string;
  icon: LucideIcon;
}) {
  const className = `group grid min-w-0 content-start gap-4 rounded-[var(--radius-xl)] border border-border bg-[var(--surface-raised)] p-5 transition-colors hover:border-[var(--border-strong)] md:p-6 ${ring}`;
  const inner: ReactNode = (
    <>
      <span className="grid size-12 place-items-center rounded-[var(--radius-md)] bg-[var(--brand-action)] text-[var(--text-on-brand)]">
        <Icon aria-hidden className="size-6" />
      </span>
      <span className="grid gap-1.5">
        <span className="flex items-center gap-2 font-sans text-h4 font-bold">
          {title}
          <ArrowRight
            aria-hidden
            className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
          />
        </span>
        <span className="font-sans text-body-sm text-[var(--text-secondary)]">{body}</span>
      </span>
    </>
  );
  return href.startsWith("#") ? (
    <a href={href} className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export default function MarcaHome() {
  const contacto = ownerLabel();
  const aContacto = contacto.startsWith("el ") ? `al ${contacto.slice(3)}` : `a ${contacto}`;
  return (
    <main className="wrap mx-auto max-w-[1217px] pt-4 pb-24 md:pt-8">
      <PageHero
        over="Uso interno · Equipo VPER Media"
        title="Marca"
        accent="VPER."
        lede="El logo, los colores, la voz y las firmas de VPER Media, listos para usar."
      />

      <Section
        id="tareas"
        toc="Tareas"
        over="Atajos"
        title="¿Qué necesitás?"
        className="border-t-0"
      >
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TAREAS.map((t) => (
            <li key={t.href} className="grid min-w-0">
              <Tarea {...t} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="colores"
        toc="Colores"
        over="Paleta"
        title="Los colores de VPER"
        lede="Tocá un color para copiar su código hex."
      >
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {COLORES.map((c) => (
            <li key={c.token} className="grid min-w-0 content-start gap-2">
              <Swatch token={c.token} label={c.name} />
              <p className="font-sans text-body-sm text-[var(--text-secondary)]">{c.uso}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-sans text-body-sm font-medium text-[var(--text-secondary)]">
          ¿Necesitás la escala completa?{" "}
          <Link
            href="/marca/sistema"
            className="rounded-[var(--radius-xs)] font-bold text-[var(--interaction-link-default)] underline underline-offset-4 hover:text-[var(--interaction-link-hover)]"
          >
            Está en Sistema
          </Link>
          .
        </p>
      </Section>

      <Section
        id="lineamientos"
        toc="Lineamientos"
        over="Lineamientos"
        title="Cómo se ve, cómo suena"
      >
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
          {LINEAMIENTOS.map((l) => (
            <li key={l.href} className="grid min-w-0">
              <Link
                href={l.href}
                className={`group grid content-start gap-1.5 bg-background p-5 transition-colors hover:bg-[var(--background-subtle)] md:p-6 ${ring}`}
              >
                <span className="flex items-center gap-2 font-display text-h4 font-black uppercase">
                  {l.title}
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
                  />
                </span>
                <span className="font-sans text-body-sm text-[var(--text-secondary)]">
                  {l.body}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <section
        id="diseno-y-desarrollo"
        data-toc="Para diseño y desarrollo"
        aria-labelledby="diseno-y-desarrollo-title"
        className="grid scroll-mt-24 gap-4 rounded-[var(--radius-xl)] bg-[var(--background-subtle)] p-5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:items-center md:gap-8 md:p-6"
      >
        <h2
          id="diseno-y-desarrollo-title"
          className="font-sans text-label-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]"
        >
          Para diseño y desarrollo
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {DISENO.map((d) => (
            <li key={d.href} className="min-w-0">
              <Link
                href={d.href}
                className={`group grid gap-0.5 rounded-[var(--radius-md)] ${ring}`}
              >
                <span className="flex items-center gap-1.5 font-sans text-body-md font-bold">
                  {d.title}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
                <span className="font-sans text-body-sm text-[var(--text-secondary)]">
                  {d.body}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="estado"
        data-toc="Estado"
        aria-label="Estado"
        className="mt-16 grid scroll-mt-24 gap-1 border-t border-border pt-8 font-sans text-body-sm text-[var(--text-secondary)] md:mt-20"
      >
        <p className="font-bold text-foreground">
          {MARCA.name} v{MARCA.version} · Actualizado {MARCA.updated}
        </p>
        {hasOwner() ? (
          <p>
            Responsable: {MARCA.owner.name}
            {MARCA.owner.role ? ` · ${MARCA.owner.role}` : ""} ·{" "}
            <a
              href={`mailto:${MARCA.owner.email}`}
              className="text-[var(--interaction-link-default)] underline underline-offset-4 hover:text-[var(--interaction-link-hover)]"
            >
              {MARCA.owner.email}
            </a>
          </p>
        ) : null}
        <p>¿Falta algo o algo está mal? Escribile {aContacto}.</p>
      </section>
    </main>
  );
}
