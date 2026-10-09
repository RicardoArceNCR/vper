# Fuentes self-hosted (VPER)

## Obviously Wide Blck

`ObviouslyWide-Black.woff2` — Wide Black con Latin-1 / acentos
(áéíóúüñ, ¿¡). El peso que usa el sitio.

- Preview local: sirve para **DISEÑO**, **JOSÉ**, **CONTÁCTANOS**, etc.
- La copia vino marcada como uso personal (exFont / iFonts), no como
  licencia de Ohno Type. Antes de producción, reemplazá este `.woff2`
  por el archivo oficial (mismo nombre). `brand.css` no cambia.

## Yellowtail Regular

`Yellowtail-Regular.woff2` — script del hero (`Crear.`). OFL, corte
latin (ASCII). No va por `next/font`: el preview se porta a Vite y
la familia vive en `brand.css` (`--brand-font-script`).

## Montserrat / IBM Plex Mono

Self-hosted desde 2026-10-09 (antes `next/font/google`, que rompió el build
de Vercel). Los carga `next/font/local` en `src/ui/lib/fonts.ts`; no van en
`brand.css`. OFL-1.1, corte latin, vía Fontsource 5.3.0.

- `Montserrat-Variable-latin.woff2` — variable, wght 100–900.
- `IBMPlexMono-Regular-latin.woff2` y `IBMPlexMono-Medium-latin.woff2`.

En el port a Vite: `@font-face` con estos archivos, `font-weight: 100 900`
para la variable.
