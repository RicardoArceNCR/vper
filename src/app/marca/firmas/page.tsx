import type { Metadata } from "next";
import Link from "next/link";
import FirmasLab from "./firmas-lab";

export const metadata: Metadata = {
  title: "Firmas de correo",
};

/**
 * Recursos · Firmas de correo. Conceptos de dirección creativa y base técnica de
 * ingeniería de correo (./email-html.ts, ./RESTRICCIONES.md). Cada propuesta es el
 * HTML real que se instala en Gmail/Outlook: lo que se ve acá es lo que se copia.
 *
 * Orden de la página = orden del trabajo: kit (lo publica el desarrollador) →
 * taller (datos + propuestas, juntos) → instalación → control técnico (para quien
 * mantiene el sistema; no compite con la elección).
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
      className="grid scroll-mt-20 gap-8 rounded-[var(--radius-xl)] border border-border p-5 md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12"
    >
      <div className="grid content-start gap-2">
        <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
          Instalación
        </p>
        <h2 id="instalar-title" className="font-display text-h2 font-black uppercase">
          Cómo instalarla
        </h2>
        <p className="font-sans text-body-sm text-[var(--text-secondary)]">
          Con el kit ya publicado. Un minuto por persona.
        </p>
      </div>
      <div className="grid gap-4">
        <ol className="grid gap-4 md:grid-cols-3">
          {INSTALL.map((i, n) => (
            <li
              key={i.client}
              className="grid content-start gap-2 rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-4"
            >
              <span className="font-display text-h3 font-black text-[var(--text-brand)]">
                {n + 1}
              </span>
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
      <div className="flex flex-wrap justify-between gap-3 pt-10 font-sans text-body-sm font-medium text-muted-foreground md:pt-16">
        <span>
          <Link href="/marca" className="underline underline-offset-4">
            Marca
          </Link>{" "}
          · Recursos · Firmas de correo
        </span>
        <span>Propuesta de firmas de correo · Octubre 2026</span>
      </div>

      <div className="@container min-w-0 py-10 md:py-16">
        <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
          Ocho propuestas · una bandeja
        </p>
        <h1 className="mt-3 font-display display-title font-black uppercase tracking-tight">
          La firma también <span className="title-brand-gradient">es marca.</span>
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-body-lg font-medium text-muted-foreground">
          Es la pieza de VPER que más se ve y la que menos se diseña: va al pie de cada
          correo. Acá están ocho caminos, desde uno sobrio hasta uno de campaña, armados
          como HTML de correo real. Cambiá los datos, mirá cómo se ven en una bandeja
          clara y en una oscura, y copiá la que quieras instalar.
        </p>
      </div>

      <FirmasLab install={<Install />} why={<Why />} />
    </main>
  );
}
