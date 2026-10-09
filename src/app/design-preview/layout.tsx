import type { Metadata } from "next";
import Link from "next/link";
import PreviewNav from "./preview-nav";

/**
 * Herramienta interna del estudio, como `/lab`: noindex y fuera de
 * `src/sections/`, para que el port a Vite (docs/guia-desarrollador.md)
 * no la arrastre. Mismo nombre de ruta que en contracorriente y
 * hablemos-de-centroamerica, para que las tres láminas se encuentren
 * en el mismo lugar.
 */
export const metadata: Metadata = {
  title: "Sistema — VPER",
  robots: { index: false, follow: false },
};

export default function DesignPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <Link
            href="/design-preview"
            className="hidden font-sans text-label-sm font-bold tracking-widest text-muted-foreground hover:text-foreground sm:block"
          >
            VPER · NO ESTÁ EN EL SITIO
          </Link>
          <PreviewNav />
        </div>
      </header>
      {children}
    </div>
  );
}
