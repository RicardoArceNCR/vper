import { Montserrat, IBM_Plex_Mono } from "next/font/google";

/**
 * Tipografía cargada por Next (self-hosted al build).
 *
 * Display (Obviously Wide Blck) NO vive acá: es comercial y se carga con
 * @font-face en brand.css desde /public/fonts/. next/font/google no la
 * tiene, y next/font/local fallaría el build si el .woff2 aún no está.
 *
 * Body/mono sí: Montserrat (pedido de marca VPER) + IBM Plex Mono (sin
 * pedido propio, se hereda el default del design system).
 *
 * Las CSS variables (--typography-family-*) son las que consume
 * theme-bridge (--font-sans / --font-mono). Display se pisa en brand.css
 * sobre --typography-family-display.
 */

export const fontBody = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--typography-family-body",
  display: "swap",
});

export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--typography-family-mono",
  display: "swap",
});
