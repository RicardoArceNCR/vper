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

Van por `next/font/google` en `src/ui/lib/fonts.ts` — no van aquí.
