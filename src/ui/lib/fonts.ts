import localFont from "next/font/local";

/**
 * Tipografía de cuerpo y mono, self-hosted con next/font/local.
 *
 * 2026-10-09: se dejó next/font/google. El build de Vercel empezó a fallar en
 * `next/font` (loader.js de Google: "Cannot read properties of null (reading
 * '1')"): Google Fonts devolvió una URL de archivo sin extensión y el loader de
 * Next 15.5 no la sabe leer. El build dependía de una red y un formato ajenos;
 * con los archivos en el repo ya no. Bonus para el port a Vite: el
 * desarrollador copia public/fonts/ y listo.
 *
 * Archivos (OFL-1.1, corte latin = U+0000-00FF + puntuación, igual al subset
 * "latin" que se le pedía a Google; vía Fontsource 5.3.0):
 * - Montserrat variable (wght 100–900): un archivo cubre 400–900.
 * - IBM Plex Mono 400 y 500 (sin pedido propio, default del design system).
 *
 * Display (Obviously Wide Blck) y script (Yellowtail) NO van acá: viven con
 * @font-face en brand.css desde /public/fonts/ (ver public/fonts/README.md).
 *
 * Las CSS variables (--typography-family-*) son las que consume theme-bridge
 * (--font-sans / --font-mono).
 */

export const fontBody = localFont({
  src: "../../../public/fonts/Montserrat-Variable-latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--typography-family-body",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const fontMono = localFont({
  src: [
    { path: "../../../public/fonts/IBMPlexMono-Regular-latin.woff2", weight: "400" },
    { path: "../../../public/fonts/IBMPlexMono-Medium-latin.woff2", weight: "500" },
  ],
  style: "normal",
  variable: "--typography-family-mono",
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "monospace"],
});
