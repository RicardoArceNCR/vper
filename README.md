# VPER Media (Next.js)

Puerto a Next.js 15 (App Router) del demo de `vper-media-repo` (Vite + React +
Express), construido para mostrarle al cliente el sitio consumiendo el
design system real de VPER — mismo paquete `@misitio/ui` que usa el proyecto
`misitio`.

> Nombres: esta carpeta local se llama `vper-media-next`, pero el repo en
> GitHub y el proyecto en Vercel se llaman `vper` (más corto, sin arrastrar
> "next" al nombre público). Si ves `git@github.com:RicardoArceNCR/vper.git`
> como remoto, es el mismo proyecto — no es un repo distinto ni un error.

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

## Actualizar `@misitio/ui` a una versión nueva

Cuando se agregue/cambie un token en Figma y se taggee una versión nueva del
paquete (ver README de `misitio-ui`):

```bash
pnpm add github:RicardoArceNCR/misitio-ui#vX.Y.Z
```

Igual que en `misitio`: siempre fijar el tag exacto, nunca la rama por
defecto — sin eso se pierde el control de versión que es el motivo de que
el design system sea un paquete y no una copia.

## `vercel.json` — no es boilerplate, no borrar sin leer esto

```json
{
  "installCommand": "git config --global url.\"https://github.com/\".insteadOf \"git@github.com:\" && pnpm install"
}
```

`pnpm` resuelve `@misitio/ui` (`github:owner/repo#tag`) con un `git clone`
real —no un tarball por HTTPS— porque ese paquete tiene script `prepare`.
Ese clone usa por defecto URL SSH (`git@github.com:...`), que falla en el
build de Vercel (sin llave SSH configurada) con `Host key verification
failed`, sin importar que `misitio-ui` sea público. Este `installCommand`
reescribe la URL a HTTPS antes de instalar. Detalle completo y por qué no
hace falta ningún token: README de `misitio-ui`, sección "Desplegar un
consumidor", y `misitio/docs/runbooks/nuevo-proyecto-consumidor-design-system.md`.

## Procedencia de los assets

Las ~98 imágenes en `public/images/` (36 MB) se copiaron tal cual de
`vper-media-repo/client/public/images` — son los mismos archivos, no
versiones nuevas. Si un asset se ve roto o pixelado, comparar primero
contra el original en ese repo antes de asumir que se corrompió en el
puerto.

## Sin CI todavía (a propósito, no un olvido)

No hay `.github/workflows/`. `next.config.ts` ya exige TypeScript y ESLint
limpios en cada build (`ignoreBuildErrors: false`, `ignoreDuringBuilds:
false`, mismo criterio que `misitio`), así que un error real sí tumba el
deploy — pero solo se descubre en el build de Vercel, no antes en un PR.
Aceptable mientras el proyecto sea un demo de una sola persona sin
colaboradores; si eso cambia, replicar `.github/workflows/ci.yml` de
`misitio` es el siguiente paso natural.

## Sin arquitectura `app → modules → core → ui` (a propósito)

`misitio` exige esa separación (`CLAUDE.md`) porque tiene lógica de negocio
real (`core/gamification`) que debe quedar pura y testeable. `vper` hoy es
un sitio de marketing sin backend ni reglas de negocio — todo vive plano en
`src/sections/`, `src/components/`, `src/lib/`. No es que se haya olvidado
la convención: no hay todavía nada que amerite esa frontera. El día que
`vper` sume backend real (el formulario de contacto, por ejemplo, dejando
de ser un `alert()`), ese es el momento de revisar si aplica.

## Pendiente conocido (no bloqueante)

- Las imágenes usan `<img>` planas (puerto fiel del original), no
  `next/image`. Next avisa esto como warning de build, no error — migrar a
  `next/image` es una optimización real de LCP/bandwidth para más adelante,
  no urgente para un demo.
