import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "./logo/marks";

export const metadata: Metadata = {
  title: { absolute: "Marca VPER" },
};

/**
 * Inicio de Marca VPER. Presenta las tres capas del portal (como los portales de
 * marca de empresas grandes: lineamientos, design system y recursos) y lo que lo
 * distingue: se arma con el mismo código que el sitio.
 */

const RAMP = [
  "--brand-sky",
  "--color-accent-600",
  "--brand-action",
  "--brand-leaf",
] as const;

function Area({
  href,
  over,
  title,
  body,
  items,
  visual,
}: {
  href: string;
  over: string;
  title: string;
  body: string;
  items: readonly string[];
  visual: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group grid min-w-0 content-start gap-5 rounded-[var(--radius-xl)] border border-border bg-[var(--surface-raised)] p-5 transition-colors hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)] md:p-6"
    >
      <div className="grid aspect-[16/9] place-items-center overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-50)]">
        {visual}
      </div>
      <div className="grid gap-2">
        <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
          {over}
        </p>
        <h2 className="flex items-center gap-2 font-display text-h2 font-black uppercase">
          {title}
          <ArrowRight
            aria-hidden
            className="size-5 transition-transform group-hover:translate-x-1"
          />
        </h2>
        <p className="font-sans text-body-sm font-medium text-[var(--text-secondary)]">
          {body}
        </p>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <li
            key={i}
            className="rounded-[var(--pill-radius)] border border-border px-2.5 py-0.5 font-sans text-label-xs font-bold uppercase text-[var(--text-secondary)]"
          >
            {i}
          </li>
        ))}
      </ul>
    </Link>
  );
}

export default function MarcaHome() {
  return (
    <main className="wrap mx-auto max-w-[1217px] pb-24">
      <div className="@container min-w-0 py-12 md:py-20">
        <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
          Portal de marca · Uso interno
        </p>
        <h1 className="mt-3 font-display display-title font-black uppercase tracking-tight">
          Marca <span className="title-brand-gradient">VPER.</span>
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-body-lg font-medium text-muted-foreground">
          Todo lo que hace falta para que VPER se vea como VPER, en un solo lugar: el
          sistema con el que está hecho el sitio, cómo se usa el logo y los recursos que
          el equipo instala o descarga.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Area
          href="/marca/sistema"
          over="Design system"
          title="Sistema"
          body="Escalas, tipografía, superficies y componentes, leídos en vivo desde el sitio, con su contraste medido."
          items={["Color", "Tipo", "Componentes", "Movimiento"]}
          visual={
            <div className="grid w-3/4 gap-3">
              <div className="grid grid-cols-4 gap-1.5">
                {RAMP.map((t) => (
                  <span
                    key={t}
                    className="aspect-square rounded-[var(--radius-sm)]"
                    style={{ backgroundColor: `var(${t})` }}
                  />
                ))}
              </div>
              <span className="font-display text-h3 font-black uppercase">
                Aa · 96/64/48
              </span>
            </div>
          }
        />
        <Area
          href="/marca/logo"
          over="Lineamientos"
          title="Logo"
          body="Las cuatro versiones, en qué fondos van, hasta dónde se achican y nueve aplicaciones reales."
          items={["Versiones", "Color", "Reducción", "Usos"]}
          visual={<Logo k="h1" decorative className="h-auto w-3/5" />}
        />
        <Area
          href="/marca/firmas"
          over="Recursos"
          title="Firmas"
          body="Ocho propuestas de firma de correo listas para copiar en Gmail u Outlook, con el kit de imágenes para publicar."
          items={["Gmail", "Outlook", "Kit .zip"]}
          visual={
            <div className="grid w-3/4 grid-cols-[auto_1fr] items-center gap-3 rounded-[var(--radius-md)] bg-[var(--color-neutral-50)] p-3 text-[var(--color-neutral-950)]">
              <span className="grid size-12 place-items-center rounded-[var(--radius-sm)] bg-[var(--brand-action)]">
                <Logo k="v" decorative className="h-auto w-8" />
              </span>
              <span className="grid gap-1">
                <span className="h-2 w-3/5 rounded-full bg-[var(--color-neutral-900)]" />
                <span className="h-1.5 w-4/5 rounded-full bg-[var(--color-neutral-300)]" />
                <span className="h-1.5 w-2/3 rounded-full bg-[var(--color-neutral-300)]" />
              </span>
            </div>
          }
        />
      </div>

      <section
        aria-labelledby="como-title"
        className="mt-16 grid gap-6 border-t border-border pt-12 md:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12"
      >
        <h2 id="como-title" className="font-display text-h3 font-black uppercase">
          Cómo se mantiene
        </h2>
        <ul className="grid gap-4 font-sans text-body-sm text-[var(--text-secondary)] sm:grid-cols-3">
          <li>
            <b className="block font-bold text-foreground">Mismo código que el sitio</b>
            Cada color y tamaño se lee del sitio mientras se mira. No hay un manual aparte
            que se desactualice.
          </li>
          <li>
            <b className="block font-bold text-foreground">Un cambio, un lugar</b>
            La marca se ajusta en Figma y en{" "}
            <code className="font-mono text-body-xs">brand.css</code>; el sitio y este
            portal cambian juntos.
          </li>
          <li>
            <b className="block font-bold text-foreground">Recursos con dueño</b>
            Lo que se descarga (firmas, kits) sale de acá, con instrucciones y una
            verificación de que está publicado.
          </li>
        </ul>
      </section>
    </main>
  );
}
