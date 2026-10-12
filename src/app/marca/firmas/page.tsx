import type { Metadata } from "next";
import { Crumbs, Numeral } from "../lib/ui";
import FirmasLab from "./firmas-lab";

export const metadata: Metadata = {
  title: "Firmas de correo",
};

/**
 * Recursos · Firmas de correo. Conceptos de dirección creativa y base técnica de
 * ingeniería de correo (./email-html.ts, ./RESTRICCIONES.md). Cada propuesta es el
 * HTML real que se instala en Gmail/Outlook: lo que se ve acá es lo que se copia.
 *
 * Orden de la página = por persona: primero quien elige e instala (taller →
 * instalación), después quien mantiene (kit de imágenes → control técnico). El
 * kit se publica una vez antes de que el equipo instale, pero no es tarea del
 * equipo: por eso va abajo, con un enlace desde la entrada.
 */

const INSTALL = [
  {
    client: "Gmail",
    steps:
      "Copiar firma → engranaje → Ver toda la configuración → General → Firma → Crear nueva → pegar → elegirla para mensajes nuevos y respuestas → Guardar cambios, abajo de todo.",
  },
  {
    client: "Outlook clásico",
    steps:
      "Abrir esta página en Edge o Chrome → Copiar firma → Archivo → Opciones → Correo → Firmas → Nueva → pegar.",
  },
  {
    client: "Outlook web o nuevo",
    steps: "Configuración → Cuentas → Firmas → pegar → Guardar.",
  },
] as const;

const WHY = [
  "El correo no carga fuentes web: el texto va en Arial y todo lo que lleva Obviously Wide o Yellowtail es una imagen.",
  "Ningún cliente invierte imágenes en modo oscuro. Por eso cada logo es un PNG con su fondo incluido: un logo negro transparente desaparece en Gmail para iOS.",
  "Sin SVG, sin gradientes CSS y sin bordes redondeados: Outlook no los dibuja. El filete de Banda y el círculo de Respuesta son PNG.",
  "Los enlaces van en sky/700 y las cejas en clay/700, igual que el sitio en claro: los tonos más luminosos no llegan al contraste mínimo sobre blanco.",
] as const;

function Install() {
  return (
    <section
      id="instalar"
      data-toc="Instalación"
      aria-labelledby="instalar-title"
      className="scroll-mt-20 border-t border-border pt-14 md:pt-20"
    >
      {/* Mismo encabezado que las demás secciones (SectionHead en ./firmas-lab). */}
      <div className="@container mb-8 min-w-0 max-w-3xl md:mb-10">
        <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
          Paso 2
        </p>
        <h2
          id="instalar-title"
          className="mt-3 font-display display-title-sm font-black uppercase tracking-tight"
        >
          Cómo instalarla
        </h2>
        <p className="mt-4 font-sans text-body-md font-medium text-[var(--text-secondary)]">
          Pegala en tu correo. Toma un minuto.
        </p>
      </div>
      <div className="grid gap-4">
        <ol className="grid gap-4 md:grid-cols-3">
          {INSTALL.map((i, n) => (
            <li
              key={i.client}
              className="grid content-start gap-2 rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-4"
            >
              <Numeral n={n + 1} />
              <b className="font-sans text-body-sm font-bold">{i.client}</b>
              <span className="font-sans text-body-xs text-[var(--text-secondary)]">
                {i.steps}
              </span>
            </li>
          ))}
        </ol>
        <p className="font-sans text-body-xs text-[var(--text-secondary)]">
          Pegar siempre desde el navegador. “Copiar HTML” es para quien la instale por
          código: pegado en Gmail muestra las etiquetas.
        </p>
      </div>
    </section>
  );
}

function Why() {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
      <h3 className="font-sans text-label-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
        Por qué se ven así
      </h3>
      <ul className="grid gap-3 font-sans text-body-sm text-[var(--text-secondary)] sm:grid-cols-2">
        {WHY.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
    </div>
  );
}

export default function FirmasPage() {
  return (
    <main className="wrap mx-auto max-w-[1217px] pb-24">
      <Crumbs
        trail={["Recursos", "Firmas de correo"]}
        note="Propuesta · Actualizado oct. 2026"
      />

      <div className="@container min-w-0 py-10 md:py-16">
        <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
          Firmas de correo · ocho propuestas
        </p>
        <h1 className="mt-3 font-display display-title font-black uppercase tracking-tight">
          Elegí tu <span className="title-brand-gradient">firma.</span>
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-body-lg font-medium text-muted-foreground">
          Escribí tus datos, mirá las ocho propuestas en una bandeja clara y en una
          oscura, y copiá la tuya. Lo que ves es exactamente lo que se pega en Gmail u
          Outlook.
        </p>
        <p className="mt-3 max-w-2xl font-sans text-body-sm text-[var(--text-secondary)]">
          ¿Mantenés el sitio? El kit de imágenes y el control técnico están{" "}
          <a href="#kit" className="font-bold underline underline-offset-4">
            al final
          </a>
          .
        </p>
      </div>

      <FirmasLab install={<Install />} why={<Why />} />
    </main>
  );
}
