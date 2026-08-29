# AGENTS.md — vper

Sitio de marketing de VPER Media. Next.js 15 (App Router) + Tailwind v4,
consumiendo el design system `@misitio/ui` — el mismo paquete que usa
`misitio`. La carpeta local se llama `vper-media-next`; el repo en GitHub y
el proyecto en Vercel se llaman `vper`. Es el mismo proyecto.

Fuente única para todos los agentes. Cursor, Codex, Copilot, Zed y Windsurf
leen este archivo de forma nativa; Claude Code no, por eso existe
`CLAUDE.md` con un import de una línea.

## Invariantes

- **No se toca `@misitio/ui` desde acá, ni se forkean los tokens de Figma.**
  La marca se pisa en `src/app/brand.css`, cargado **después** del bridge.
  Ese archivo es el tablero completo: tipografía, escalas, paleta y botón.
- **Orden de carga de CSS — contrato, no sugerencia.** En `layout.tsx`:
  `@misitio/ui/tokens.css` → `tokens-dark.css` → `./globals.css`. Y dentro
  de `globals.css`, `@import "@misitio/ui/theme-bridge.css"` después de
  Tailwind. Cambiar el orden rompe la marca en silencio.
- **El paquete se fija por tag** (`github:RicardoArceNCR/misitio-ui#v0.1.x`),
  nunca por rama. `vercel.json` reescribe la URL SSH a HTTPS antes de
  `pnpm install`: sin eso el build de Vercel falla con
  `Host key verification failed`, repo público o no.
- **Las secciones full-viewport y los títulos display tienen trampas
  conocidas.** Están en `.cursor/rules/` — Cursor las carga sola por
  `globs`. Si usás otro agente, leelas antes de tocar `src/sections/`.
- **`next/image` no se usa acá, y la regla `no-img-element` está apagada**
  en `eslint.config.mjs` con el motivo escrito al lado. El sitio final lo
  arma el cliente en Vite (`docs/guia-desarrollador.md` pide portar
  `src/sections/` tal cual) y `next/image` no existe fuera de Next: cada
  `<Image />` sería un des-port manual del otro lado. Lo que la regla busca
  ya está resuelto a mano — `FadeInImage` fija `loading`, `fetchPriority` y
  `decoding`, y los assets ya son WebP. Si alguna vez se usa `next/image`,
  se borra la regla en el mismo cambio.
- Una fuente de display ancha (Obviously Wide) ensancha cualquier flex o
  grid que no tenga `min-w-0`. El síntoma casi nunca aparece en el titular,
  sino en el texto de al lado. El wordmark SVG (238×19) es el mismo caso:
  `h-* w-auto` no es un icono, pide ~12.5 veces el alto.

## Antes de cerrar

```bash
pnpm quality        # tsc --noEmit + lint + build
```

Y mirarlo en el navegador: esto es un sitio de marketing, el gate real son
los ojos. Decí siempre el breakpoint cuando pidas verificar algo —
"mobile 390 con la barra del navegador visible" es verificable, "se ve
bien" no.

No hay tests ni gates de arquitectura acá, a propósito. Esos
(dependency-cruiser, knip, vitest) viven en `misitio`.

**`format:check` existe pero todavía NO está en `pnpm quality`.** El repo
arrancó sin configuración de Prettier, así que hay 17 archivos con formato
viejo — deuda pre-existente, no regresión. `.prettierrc.json` ya está
(mismo estilo que `misitio`: 90 columnas, comillas dobles, `trailingComma`
all) para que **lo nuevo salga consistente**. El reformateo masivo de los
17 y el alta de `prettier-plugin-tailwindcss` van juntos en un commit
dedicado — el plugin reordena todas las clases de Tailwind, así que
mezclarlo con cambios de contenido haría el diff ilegible. Cuando eso pase,
`format:check` entra a la cadena.

## Dónde vive la documentación

Este repo se mantiene liviano a propósito. Las reglas genéricas —del
starter y del design system— viven en `misitio` (`docs/patterns/`,
`docs/decisions/`). Acá queda solo lo específico de VPER: este archivo, el
`README.md` y `docs/guia-desarrollador.md` (el handoff al desarrollador del
cliente).

**Inglés / i18n:** el cliente se lo pidió al desarrollador del sitio final
(Vite). El reparto está en `misitio` ADR 0019: el estudio entrega copy
aprobado, diccionario plano (cero imports de Next) y el diseño mirado en
los dos idiomas — el riesgo real es **vertical** (hero `h-dvh`, no el
ancho de Obviously Wide). El mecanismo (`app/[locale]/`, `next-intl`,
`hreflang`) no se construye acá: se tira en el port. El ADR 0018 es el
mecanismo del starter, no de este preview.
