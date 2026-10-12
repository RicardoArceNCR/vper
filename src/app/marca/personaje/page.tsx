import type { Metadata } from "next";
import { Vpercito } from "@/components/vpercito";
import { Crumbs, Findings, PageHero, Rich, Section } from "../lib/ui";
import PersonajeDownload from "./personaje-download";
import { PERSONAJE } from "./personaje-content";

export const metadata: Metadata = { title: "Personaje" };

/**
 * Lineamientos · Personaje (vpercito). Contenido en ./personaje-content.ts;
 * descargas en ./personaje-pack.ts. El componente que usa el sitio es
 * src/components/vpercito.tsx: esta página lo muestra tal cual.
 */

function Estado({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={
        ok
          ? "rounded-full bg-[var(--feedback-success-bg)] px-2 py-0.5 font-sans text-label-xs font-bold uppercase text-[var(--feedback-success-text)]"
          : "rounded-full bg-[var(--background-subtle)] px-2 py-0.5 font-sans text-label-xs font-bold uppercase text-[var(--text-secondary)]"
      }
    >
      {label}
    </span>
  );
}

export default function PersonajePage() {
  const P = PERSONAJE;
  return (
    <main className="wrap mx-auto max-w-[1217px] pb-24">
      <Crumbs
        trail={["Lineamientos", "Personaje"]}
        note="Primera versión · Octubre 2026"
      />
      <PageHero over="Personaje" title="Conocé a" accent="vpercito." lede={P.resumen}>
        <dl className="mt-8 grid max-w-3xl gap-x-8 gap-y-3 sm:grid-cols-2">
          {P.ficha.map((f) => (
            <div key={f.k} className="grid gap-0.5 border-b border-border pb-3">
              <dt className="font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-eyebrow)]">
                {f.k}
              </dt>
              <dd className="font-sans text-body-sm font-medium">{f.v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <PersonajeDownload />

      <Section
        id="papel"
        toc="Papel"
        over="Papel"
        title="Anfitrión, no protagonista"
        lede="Cuatro reglas que deciden si una pantalla lleva a vpercito o no."
      >
        <ol className="grid gap-4 md:grid-cols-2">
          {P.principios.map((p, n) => (
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
        id="donde"
        toc="Dónde va"
        over="En el sitio"
        title="Dónde va y dónde no"
        lede="Lo aplicado ya está en el sitio; lo pendiente es la lista de trabajo."
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
          <ul className="grid gap-3">
            {P.lugares.map((l) => (
              <li
                key={l.donde}
                className="grid gap-2 rounded-[var(--radius-lg)] border border-border p-4 md:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-sans text-body-md font-bold">{l.donde}</h3>
                  <Estado ok={l.estado === "aplicado"} label={l.estado} />
                </div>
                <p className="font-sans text-body-sm text-[var(--text-secondary)]">
                  <Rich text={l.como} />
                </p>
                {l.copy ? (
                  <p className="border-l-2 border-[var(--brand-action)] pl-3 font-sans text-body-sm font-medium">
                    {l.copy}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          <div>
            <h3 className="mb-4 font-sans text-label-sm font-bold uppercase tracking-widest text-[var(--feedback-error-text)]">
              Nunca
            </h3>
            <ul className="grid gap-3">
              {P.dondeNo.map((e) => (
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
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <section
        id="correo"
        data-toc="En el correo"
        aria-labelledby="correo-title"
        className="mb-4 grid gap-3 rounded-[var(--radius-xl)] border border-border p-5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-8 md:p-6"
      >
        <h2 id="correo-title" className="font-display text-h3 font-black uppercase">
          En el correo
        </h2>
        <p className="font-sans text-body-sm text-[var(--text-secondary)]">
          <Rich text={P.firmas} />
        </p>
      </section>

      <Section
        id="uso"
        toc="Uso"
        over="Uso"
        title="Cómo se pone"
        lede={
          <>
            En el sitio, siempre con el componente <Rich text="`<Vpercito />`" /> (
            <Rich text="`src/components/vpercito.tsx`" />
            ). Así se ve sobre los dos fondos:
          </>
        }
      >
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <figure className="grid gap-3">
            <div className="grid h-72 place-items-center rounded-[var(--radius-xl)] border border-border bg-[var(--color-neutral-50)]">
              <Vpercito size={180} halo />
            </div>
            <figcaption className="font-sans text-body-xs text-[var(--text-secondary)]">
              Claro: halo suave y sombra de contacto.
            </figcaption>
          </figure>
          <figure className="grid gap-3">
            <div className="dark grid h-72 place-items-center rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--color-neutral-950)]">
              <Vpercito size={180} halo />
            </div>
            <figcaption className="font-sans text-body-xs text-[var(--text-secondary)]">
              Oscuro: el halo sky es lo que recorta el cuerpo negro.
            </figcaption>
          </figure>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {P.uso.map((r) => (
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
        id="poses"
        toc="Poses"
        over="Poses"
        title="Una lista, seis por pedir"
        lede={P.pedidoIlustrador}
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {P.poses.map((p) => (
            <li
              key={p.nombre}
              className="grid content-start gap-2 rounded-[var(--radius-lg)] border border-border p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <b className="font-sans text-body-sm font-bold">{p.nombre}</b>
                <Estado
                  ok={p.estado === "lista"}
                  label={p.estado === "lista" ? "lista" : "pedir"}
                />
              </div>
              <span className="font-sans text-body-xs text-[var(--text-secondary)]">
                {p.para}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="corregir"
        toc="Para corregir"
        over="Revisión del sitio"
        title="Pendientes"
        lede="Lo que falta para que vpercito esté donde tiene que estar. Ninguno está cambiado todavía."
      >
        <Findings items={P.pendientes} />
      </Section>
    </main>
  );
}
