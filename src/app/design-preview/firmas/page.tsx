import type { Metadata } from "next";
import Link from "next/link";
import FirmasLab from "./firmas-lab";

export const metadata: Metadata = {
  title: "Firmas de correo — VPER",
  robots: { index: false, follow: false },
};

/**
 * Lámina de firmas de correo. Conceptos de dirección creativa y base técnica de
 * ingeniería de correo (./email-html.ts, ./RESTRICCIONES.md). Cada propuesta es el
 * HTML real que se instala en Gmail/Outlook: lo que se ve acá es lo que se copia.
 */
export default function FirmasPage() {
  return (
    <main className="wrap mx-auto max-w-[1217px] pb-24">
      <div className="flex flex-wrap justify-between gap-3 pt-10 font-sans text-body-sm font-medium text-muted-foreground md:pt-16">
        <span>
          <Link href="/design-preview" className="underline underline-offset-4">
            Sistema
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

      <FirmasLab />

      <section className="mt-20 grid gap-8 border-t border-border pt-14 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-h3 font-black uppercase">Cómo instalarla</h2>
          <ol className="mt-4 grid list-decimal gap-3 pl-5 font-sans text-body-sm text-muted-foreground">
            <li>
              <b className="text-foreground">Gmail:</b> Copiar firma → engranaje → Ver
              toda la configuración → General → Firma → Crear nueva → pegar → elegirla
              para mensajes nuevos y respuestas → Guardar cambios, abajo de todo.
            </li>
            <li>
              <b className="text-foreground">Outlook clásico:</b> abrir esta página en
              Edge o Chrome → Copiar firma → Archivo → Opciones → Correo → Firmas → Nueva
              → pegar.
            </li>
            <li>
              <b className="text-foreground">Outlook web o nuevo:</b> Configuración →
              Cuentas → Firmas → pegar → Guardar.
            </li>
            <li>
              Pegar siempre desde el navegador. “Copiar HTML” es para quien la instale por
              código; pegado en Gmail muestra las etiquetas.
            </li>
          </ol>
        </div>
        <div>
          <h2 className="font-display text-h3 font-black uppercase">
            Por qué se ven así
          </h2>
          <ul className="mt-4 grid gap-3 font-sans text-body-sm text-muted-foreground">
            <li>
              El correo no carga fuentes web: el texto va en Arial y todo lo que lleva
              Obviously Wide o Yellowtail es una imagen.
            </li>
            <li>
              Ningún cliente invierte imágenes en modo oscuro. Por eso cada logo es un PNG
              con su fondo incluido: un logo negro transparente desaparece en Gmail para
              iOS.
            </li>
            <li>
              Sin SVG, sin gradientes CSS y sin bordes redondeados: Outlook no los dibuja.
              El filete de Banda y el círculo de Respuesta son PNG.
            </li>
            <li>
              Los enlaces van en sky/700: el sky del sitio no llega al contraste mínimo
              sobre blanco. El clay de las cejas, igual, baja a clay/700.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
