import type { Metadata } from "next";
import { Crumbs, Findings, PageHero, Rich, Section, Sources } from "../lib/ui";
import { VOZ } from "./voz-content";

export const metadata: Metadata = { title: "Voz y tono" };

/**
 * Lineamientos · Voz y tono. El contenido (./voz-content.ts) lo escribió
 * dirección de contenidos a partir del copy publicado: cada ejemplo con fuente
 * es una cita textual del sitio. Esta página solo lo presenta.
 */

/** Ejemplos de titular y golpe se muestran con la tipografía con la que viven. */
function ExampleText({ pieza, text }: { pieza: string; text: string }) {
  if (/titular/i.test(pieza)) {
    return (
      <span className="font-display text-h3 font-black uppercase leading-tight">
        {text}
      </span>
    );
  }
  if (/script|golpe/i.test(pieza)) {
    const [before, after] = text.split(" — ");
    return (
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-h4 font-black uppercase">{before}</span>
        {after ? (
          <span className="font-[family-name:var(--brand-font-script)] text-h1 leading-none text-[var(--text-brand)]">
            {after}
          </span>
        ) : null}
      </span>
    );
  }
  return <span className="font-sans text-body-md font-medium">“{text}”</span>;
}

export default function VozPage() {
  return (
    <main className="wrap mx-auto max-w-[1217px] pb-24">
      <Crumbs
        trail={["Lineamientos", "Voz y tono"]}
        note="Derivada del copy del sitio · Octubre 2026"
      />
      <PageHero over="Voz y tono" title="Cómo" accent="suena." lede={VOZ.resumen}>
        <p className="mt-8 max-w-3xl border-l-[3px] border-[var(--brand-action)] pl-5 font-sans text-h3 font-bold">
          {VOZ.enUnaFrase}
        </p>
      </PageHero>

      <Section
        id="rasgos"
        toc="Rasgos"
        over="Personalidad"
        title={`${VOZ.rasgos.length} rasgos, una voz`}
        lede="Cada rasgo tiene su límite: lo que es y lo que no. El ejemplo es una cita del sitio."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {VOZ.rasgos.map((r) => (
            <article
              key={r.nombre}
              className="grid content-start gap-4 rounded-[var(--radius-xl)] border border-border bg-[var(--surface-raised)] p-5 md:p-6"
            >
              <h3 className="font-display text-h2 font-black uppercase">{r.nombre}</h3>
              <dl className="grid gap-3 font-sans text-body-sm sm:grid-cols-2">
                <div>
                  <dt className="font-bold text-[var(--feedback-success-text)]">Es</dt>
                  <dd className="mt-1 text-[var(--text-secondary)]">{r.es}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[var(--feedback-error-text)]">No es</dt>
                  <dd className="mt-1 text-[var(--text-secondary)]">{r.noEs}</dd>
                </div>
              </dl>
              <figure className="m-0 grid gap-2 rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-4">
                <blockquote className="font-sans text-body-md font-bold">
                  “{r.ejemplo}”
                </blockquote>
                <figcaption className="font-mono text-body-xs text-[var(--text-secondary)]">
                  {r.fuente}
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="principios"
        toc="Principios"
        over="Cómo se escribe"
        title="Reglas de la casa"
        lede="El “antes” es como escribe cualquier agencia. El “después” es VPER."
      >
        <ol className="grid gap-4">
          {VOZ.principios.map((p, n) => (
            <li
              key={p.titulo}
              className="grid gap-4 rounded-[var(--radius-xl)] border border-border p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-8 md:p-6"
            >
              <div className="grid content-start gap-2">
                <span className="font-display text-h3 font-black text-[var(--text-brand)]">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <h3 className="font-sans text-h4 font-bold">{p.titulo}</h3>
                <p className="font-sans text-body-sm text-[var(--text-secondary)]">
                  {p.regla}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid content-start gap-2 rounded-[var(--radius-lg)] bg-[var(--feedback-error-bg)] p-4">
                  <span className="font-sans text-label-xs font-bold uppercase text-[var(--feedback-error-text)]">
                    Antes
                  </span>
                  <p className="font-sans text-body-sm text-[var(--text-secondary)] line-through decoration-[var(--feedback-error-border)]/50">
                    {p.antes}
                  </p>
                </div>
                <div className="grid content-start gap-2 rounded-[var(--radius-lg)] bg-[var(--feedback-success-bg)] p-4">
                  <span className="font-sans text-label-xs font-bold uppercase text-[var(--feedback-success-text)]">
                    En voz VPER
                  </span>
                  <p className="font-sans text-body-md font-bold">{p.despues}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="vocabulario"
        toc="Vocabulario"
        over="Palabras"
        title="Qué decimos y qué no"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-12">
          <div>
            <h3 className="mb-4 font-sans text-label-sm font-bold uppercase tracking-widest text-[var(--feedback-success-text)]">
              Usamos
            </h3>
            <ul className="flex flex-wrap gap-2">
              {VOZ.vocabulario.usamos.map((w) => (
                <li
                  key={w}
                  className="rounded-[var(--pill-radius)] border border-border px-3 py-1 font-sans text-body-sm font-bold"
                >
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-sans text-label-sm font-bold uppercase tracking-widest text-[var(--feedback-error-text)]">
              Evitamos
            </h3>
            <ul className="grid gap-3">
              {VOZ.vocabulario.evitamos.map((w) => (
                <li key={w.palabra} className="grid gap-1 border-b border-border pb-3">
                  <b className="font-sans text-body-md font-bold line-through decoration-[var(--feedback-error-border)]">
                    {w.palabra}
                  </b>
                  <span className="font-sans text-body-sm text-[var(--text-secondary)]">
                    <Rich text={w.porque} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="formatos"
        toc="Por pieza"
        over="Formatos"
        title="Pieza por pieza"
        lede="Cómo se escribe cada cosa que el sitio y el equipo publican. Los ejemplos con archivo son del sitio; el resto, redacciones nuevas en la misma voz."
      >
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border">
          {VOZ.formatos.map((f) => (
            <div
              key={f.pieza}
              className="grid gap-3 bg-background p-5 md:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1.2fr)] md:gap-6"
            >
              <h3 className="font-sans text-label-sm font-bold uppercase tracking-widest">
                {f.pieza}
              </h3>
              <p className="font-sans text-body-sm text-[var(--text-secondary)]">
                <Rich text={f.regla} />
              </p>
              <div className="grid content-start gap-1.5">
                <ExampleText pieza={f.pieza} text={f.ejemplo} />
                {f.fuente ? (
                  <span className="font-mono text-body-xs text-[var(--text-secondary)]">
                    {f.fuente}
                  </span>
                ) : (
                  <span className="font-sans text-label-xs font-bold uppercase text-[var(--text-secondary)]">
                    Ejemplo nuevo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="tono"
        toc="Tono"
        over="Tono"
        title="La voz no cambia. El tono sí."
        lede="Misma persona, distinta situación."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {VOZ.tono.map((t) => (
            <article
              key={t.situacion}
              className="grid content-start gap-3 rounded-[var(--radius-xl)] border border-border p-5"
            >
              <h3 className="font-sans text-h5 font-bold">{t.situacion}</h3>
              <p className="font-sans text-body-sm text-[var(--text-secondary)]">
                {t.como}
              </p>
              <p className="rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-4 font-sans text-body-sm font-medium">
                “{t.ejemplo}”
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="ortografia"
        toc="Ortografía"
        over="Detalles"
        title="Ortografía y estilo"
      >
        <ul className="grid gap-3">
          {VOZ.ortografia.map((o) => (
            <li
              key={o.regla}
              className="grid gap-3 rounded-[var(--radius-lg)] border border-border p-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-6"
            >
              <p className="font-sans text-body-sm font-medium">
                <Rich text={o.regla} />
              </p>
              <p className="font-sans text-body-sm">
                <b className="mr-1 font-bold text-[var(--feedback-success-text)]">Sí</b>
                {o.si}
              </p>
              <p className="font-sans text-body-sm text-[var(--text-secondary)]">
                <b className="mr-1 font-bold text-[var(--feedback-error-text)]">No</b>
                <span className="line-through decoration-[var(--feedback-error-border)]">
                  {o.no}
                </span>
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
        lede="Lo que la revisión del copy encontró mezclado o fuera de voz. Ninguno está cambiado todavía: es la lista de trabajo."
      >
        <Findings items={VOZ.inconsistencias} />
        <Sources items={VOZ.fuentes} />
      </Section>
    </main>
  );
}
