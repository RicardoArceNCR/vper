# VPER Media (Next.js)

Puerto a Next.js 15 (App Router) del demo de `vper-media-repo` (Vite + React +
Express), construido para mostrarle al cliente el sitio consumiendo el
design system real de VPER — mismo paquete `@misitio/ui` que usa el proyecto
`misitio`.

## Por qué existe este proyecto

`vper-media-repo` (Vite + Express, scaffold de Manus AI) era un demo válido,
pero tenía dos problemas de fondo:

1. Vendorizaba su propia copia de los tokens de Figma (`design-system/tokens/`)
   en vez de consumir `@misitio/ui` — copia que ya estaba desactualizada
   (le faltaban paletas `amarillo`/`gold`/`ink` y usaba fuentes viejas).
2. Al ser un sitio de marketing/agencia, Next.js (SSR/SSG + SEO real) tiene
   ventajas concretas sobre una SPA client-only.

Este proyecto resuelve ambos: consume `@misitio/ui` igual que `misitio` y
`gobi-cr` (mismo mecanismo, sin fork de Figma ni de pipeline — ver nota de
decisión más abajo), y usa App Router con generación estática real
(`next build` ya pre-renderiza `/` como contenido estático).

## Decisión de marca (importante, para no repetir la pregunta)

Los tokens `--brand-font-display/-body/-mono` en `@misitio/ui` hoy resuelven
a las fuentes de `misitio` (League Gothic/Red Hat Display/IBM Plex Mono), no
a la identidad original de VPER Media (Hanley Pro Block vía Typekit +
Montserrat). Se decidió **no** hacer fork del Figma ni del pipeline
`figma-to-sd.py` para esto — la app usa las fuentes de `misitio` por ahora.
Si el cliente real de VPER insiste en su identidad original, el fix es
local: pisar `--brand-font-display`/`-body`/`-mono` en `globals.css` +
cargar Typekit en `layout.tsx`, sin tocar Figma ni el paquete compartido.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript strict
- Tailwind v4, tokens vía `@misitio/ui` (mismo orden de carga que `misitio`:
  `tokens.css` → `tokens-dark.css` → `theme-bridge.css`)
- `framer-motion` para las animaciones (carrusel del hero, scroll-driven
  work gallery, fade-ins por sección)
- `Button`/`Input`/`Card` copiados de `misitio` (`src/ui/components/`) —
  mismo patrón `cva` + tokens semánticos, portable 1:1 entre ambos proyectos

## Diferencias reales vs. el demo original (no solo el framework)

- Se restauró la animación `.animate-ticker` de `LogoTicker` — existía en
  `vper-media-original-cliente` pero se había perdido en una refactorización
  posterior de `vper-media-repo` (el ticker quedaba estático).
- Sin `ThemeContext`/Provider: el anti-FOUC ya lo resuelve un script inline
  en `layout.tsx` (mismo truco que `misitio`), así que `ThemeToggle` solo
  lee/escribe la clase `.dark` + `localStorage` directamente.
- `NotFound.tsx` + `wouter` → convención nativa de Next (`app/not-found.tsx`).
- El formulario de contacto sigue siendo un `alert()` de mentira — no había
  integración real que portar (era un placeholder también en el original).

## Comandos

```bash
pnpm dev      # servidor de desarrollo
pnpm build    # build de producción (SSG real de la home)
pnpm check    # tsc --noEmit
pnpm lint     # eslint (next/core-web-vitals + next/typescript + prettier)
```

## Pendiente conocido (no bloqueante)

- Las imágenes usan `<img>` planas (puerto fiel del original), no
  `next/image`. Next avisa esto como warning de build, no error — migrar a
  `next/image` es una optimización real de LCP/bandwidth para más adelante,
  no urgente para un demo.
