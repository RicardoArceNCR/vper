import type { Metadata } from "next";
import MarcaMobileNav from "./marca-mobile-nav";
import MarcaSidebar from "./marca-sidebar";
import { CopyToast } from "./live";
import { isOpenForDev } from "./lib/session";

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
 * Uso interno: noindex, con contraseña (src/middleware.ts) y fuera de `src/sections/` para que el port a Vite
 * (docs/guia-desarrollador.md) no la arrastre. /design-preview redirige acá
 * (next.config.ts).
 */
export const metadata: Metadata = {
  title: { default: "Marca VPER", template: "%s · Marca VPER" },
  robots: { index: false, follow: false },
};

export default function MarcaLayout({ children }: { children: React.ReactNode }) {
  // "Salir" se muestra siempre, salvo en el modo local abierto: el mismo criterio
  // que usa el middleware para no pedir contraseña. Las rutas de /marca se
  // prerenderizan, así que esto se evalúa al compilar; por eso NO depende de
  // MARCA_USERS (que puede no estar en el build) sino de NODE_ENV, que en
  // `next build` siempre es "production" → en producción, "Salir" siempre está.
  const protegido = !isOpenForDev();
  return (
    <div className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      {/* Primer foco de la página: salta el sidebar y el menú. El envoltorio es
          fixed para que el enlace, al hacerse visible, no entre a la grilla. */}
      <div className="fixed left-4 top-4 z-50">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:block focus:rounded-[var(--radius-md)] focus:bg-[var(--button-primary-bg)] focus:px-4 focus:py-2 focus:font-sans focus:text-body-sm focus:font-bold focus:text-[var(--button-primary-text)] focus:shadow-[var(--shadow-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:ring-offset-2 focus:ring-offset-[var(--focus-ring-offset)]"
        >
          Saltar al contenido
        </a>
      </div>
      <MarcaSidebar protegido={protegido} />
      <div className="min-w-0">
        {/* Mobile y tablet: barra arriba. En escritorio la reemplaza el sidebar. */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md lg:hidden">
          <MarcaMobileNav protegido={protegido} />
        </header>
        {/* Destino del "Saltar al contenido". Cada página trae su propio <main>:
            el id va en este envoltorio para no duplicarlo. */}
        <div id="contenido" tabIndex={-1} className="outline-none">
          {children}
        </div>
      </div>
      <CopyToast />
    </div>
  );
}
