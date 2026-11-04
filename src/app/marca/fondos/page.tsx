import type { Metadata } from "next";
import Link from "next/link";
import { Crumbs, PageHero, Section } from "../lib/ui";
import { FONDOS } from "./fondos-data";
import FondosDownload from "./fondos-download";

export const metadata: Metadata = {
  title: "Fondos",
  robots: { index: false, follow: false },
};

/**
 * Recursos · Fondos. Las composiciones de caseteras del toolkit de diseño
 * (public/images/fondos/). Viven aparte del logo a propósito: son material
 * gráfico, no identificador, y no tienen reducción ni área de respeto.
 */

const REGLAS: { titulo: string; regla: string }[] = [
  {
    titulo: "Son textura, no logo",
    regla:
      "No reemplazan al isologo ni al logotipo. Una pieza con fondo de caseteras lleva igual su logo, en un lugar despejado.",
  },
  {
    titulo: "Placa para el texto",
    regla:
      "Encima no va otro logo ni texto largo directo. Si hace falta, sobre una placa sólida negra o blanca.",
  },
  {
    titulo: "Se recortan, no se repiten",
    regla:
      "No son mosaico: no se ponen uno al lado del otro. Se escalan y se recortan para llenar el formato.",
  },
  {
    titulo: "Tal cual",
    regla:
      "No se recolorean, no se deforman ni se les agregan efectos. Si hace falta otra versión, se pide a diseño.",
  },
];

export default function FondosPage() {
  return (
    <main className="wrap mx-auto max-w-[1217px] pb-24">
      <Crumbs trail={["Recursos", "Fondos"]} note="Propuesta · Actualizado nov. 2026" />
      <PageHero
        over="Recursos · Fondos"
        title="Caseteras de"
        accent="fondo."
        lede="Dos composiciones del toolkit de diseño, hechas con el isologo: una a color y una en blanco y negro. Para portadas, presentaciones y piezas de redes."
      />

      <div className="mt-6 md:mt-8">
        <FondosDownload />
      </div>

      <Section
        id="fondos"
        toc="Los fondos"
        over="Los fondos"
        title="Cuál va dónde"
        lede="Los dos van sobre negro, como en el toolkit. El de color, para piezas expresivas; el blanco y negro, para piezas sobrias o a una tinta."
        className="border-t-0"
      >
        <div className="grid gap-10">
          {FONDOS.map((f) => (
            <figure key={f.key} className="m-0 grid gap-4">
              <div
                className={`overflow-hidden rounded-[var(--radius-xl)] p-4 md:p-8 ${f.plate.className}`}
              >
                <img
                  src={f.src}
                  alt={`Fondo VPER: ${f.name.toLowerCase()}`}
                  className="h-auto w-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="grid max-w-2xl gap-1">
                <b className="font-sans text-h4 font-bold">{f.name}</b>
                <span className="font-sans text-body-sm text-[var(--text-secondary)]">
                  {f.use}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="reglas" toc="Reglas" over="Reglas" title="Cómo se usan">
        <ul className="grid gap-4 md:grid-cols-2">
          {REGLAS.map((r) => (
            <li
              key={r.titulo}
              className="grid content-start gap-2 rounded-[var(--radius-xl)] border border-border p-5"
            >
              <h3 className="font-sans text-h5 font-bold">{r.titulo}</h3>
              <p className="font-sans text-body-sm text-[var(--text-secondary)]">
                {r.regla}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="pendiente"
        toc="Para revisar"
        over="Para revisar con diseño"
        title="Antes de darlos por cerrados"
      >
        <ul className="grid max-w-3xl list-disc gap-2 pl-5 font-sans text-body-sm text-[var(--text-secondary)]">
          <li>
            El fondo a color usa <code>#89C9CD</code>, un verde agua fuera de la paleta
            (jade es <code>#74BDB7</code>). Pedir el archivo corregido.
          </li>
          <li>
            Los dos traen un rectángulo invisible de 1920 × 1090 que sobró de la mesa de
            trabajo, y miden distinto (2688 y 2760 de ancho). Pedir la misma mesa para los
            dos, en 16:9.
          </li>
          <li>
            ¿Hace falta una versión en mosaico (que se repita sin cortes) para merch o
            papelería?
          </li>
        </ul>
        <p className="mt-8 font-sans text-body-sm font-medium text-[var(--text-secondary)]">
          ¿Buscás el isologo o el logotipo?{" "}
          <Link
            href="/marca/logo"
            className="rounded-[var(--radius-xs)] font-bold text-[var(--interaction-link-default)] underline underline-offset-4 hover:text-[var(--interaction-link-hover)]"
          >
            Están en Logo
          </Link>
          .
        </p>
      </Section>
    </main>
  );
}
