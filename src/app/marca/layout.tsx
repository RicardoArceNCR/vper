import type { Metadata } from "next";
import MarcaMobileNav from "./marca-mobile-nav";
import MarcaSidebar from "./marca-sidebar";

/**
 * Marca VPER: el portal de marca del sitio. Tres capas, como en los portales
 * de marca de empresas grandes (lineamientos, design system y recursos), con
 * una diferencia: se arma con el mismo código que el sitio, así que nunca
 * documenta un color o un tamaño distinto al que el sitio usa.
 *
 *   /marca          Sistema: tokens y componentes, leídos en vivo.
 *   /marca/logo     Lineamientos: versiones, color, reducción, aplicaciones.
 *   /marca/firmas   Recursos: firmas de correo y su kit de imágenes.
 *
 * Uso interno: noindex, y fuera de `src/sections/` para que el port a Vite
 * (docs/guia-desarrollador.md) no la arrastre. /design-preview redirige acá
 * (next.config.ts).
 */
export const metadata: Metadata = {
  title: { default: "Marca VPER", template: "%s · Marca VPER" },
  robots: { index: false, follow: false },
};

export default function MarcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <MarcaSidebar />
      <div className="min-w-0">
        {/* Mobile y tablet: barra arriba. En escritorio la reemplaza el sidebar. */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md lg:hidden">
          <MarcaMobileNav />
        </header>
        {children}
      </div>
    </div>
  );
}
