# VPER Media (Next.js)

Puerto a Next.js 15 (App Router) del demo de `vper-media-repo` (Vite + React +
Express), construido para mostrarle al cliente el sitio consumiendo el
design system real de VPER — mismo paquete `@misitio/ui` que usa el proyecto
`misitio`.

**Handoff al desarrollador del cliente** (preview en Vercel, instalar
`@misitio/ui` en un repo Vite+Tailwind, copiar primitivos y portar
`className` de las secciones):
[`docs/guia-desarrollador.md`](docs/guia-desarrollador.md).

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

## Identidad de marca (overrides locales, no fork de Figma)

Cada sitio consumidor pisa la marca en un archivo propio — acá es
`src/app/brand.css`, cargado **después** del bridge. No se duplica Figma
ni se toca `@misitio/ui`. Eso escala: `misitio`, `vper`, `gobi-cr` cada uno
con su `brand.css`.

| Rol | Valor VPER | Token |
|---|---|---|
| Display | Obviously Wide Blck (self-host) | `--typography-family-display` / `--brand-font-display` |
| Body | Montserrat (`next/font`) | `--typography-family-body` / `--brand-font-body` |
| CTA / brand | `#FDBF66` | `--brand-action` (+ hover/press) |
| Sky / info | `#5EB2E3` | `--brand-sky`; links/focus usan la escala `sky` derivada (600 claro, 400 oscuro), no el hex plano |
| Danger | `#D55856` | `--feedback-error-*` |
| Acento teal | `#74BDB7` | `--brand-leaf`, success |

`brand.css` es el **tablero completo** de tipografía + marca (escalas
size/weight/leading/tracking + todos los estilos display→code + botón +
paleta). Tocá un valor, guardá, mirá. Requiere `@misitio/ui` ≥ `v0.1.3`.

**Obviously Wide Blck:** `public/fonts/ObviouslyWide-Black.woff2` ya trae
acentos (ver `public/fonts/README.md`). Antes de producción, reemplazá ese
archivo por la versión licenciada de Ohno Type.

## Runbook: `brand.css` para un cliente nuevo

Cuando este starter se use para otro cliente (`gobi-cr`, etc.), así se
decide qué entra a `brand.css` y qué no — 4 pasos, verificables sin tener
que confiar en la palabra de quien los corrió:

1. **Overrides semánticos directos primero.** Con los colores del cliente,
   pisá directo los tokens que ya se usan (`--brand-*`, `--feedback-*`,
   `--interaction-*`...) — no escalas todavía. Se encuentran mirando el
   sitio en dark/light, DevTools → Styles, buscando qué token gana.
2. **Auditá alcance antes de "arreglar" nada.** Antes de tocar una escala
   primitiva completa (`--color-familia-NNN`), verificá con grep si algún
   token semántico *reachable* (consumido por un componente que el sitio
   realmente renderiza) depende de ella:
   ```bash
   grep -n "var(--color-<familia>-" node_modules/@misitio/ui/build/tokens*.css
   ```
   Si nada la usa, no la toques — es código muerto: cuesta mantenimiento,
   no cambia un pixel. Así se descartó `gold`/`amarillo`/`ink` acá.
3. **Escala completa solo como red de seguridad, nunca como el fix.** Para
   las familias que sí alimentan algo *reachable*, generá 50→950 manteniendo
   la curva de *lightness* ORIGINAL del design system (ya calibrada para
   contraste) y cambiando solo hue/saturación al color de marca — nunca
   forzando el hex literal en un stop puntual (rompe la monotonía de la
   curva). Esto no reemplaza los overrides directos del paso 1 — es la
   malla debajo para lo que el paso 1 no cubre hoy, o lo que un
   `@misitio/ui` futuro agregue sin que haya que jugar al topo con DevTools
   otra vez.
4. **Verificación objetiva, no "se ve bien".** Antes de cerrar:
   - Confirmá por grep que los overrides directos (paso 1) siguen ganando
     sobre las escalas nuevas (paso 3) — en `vper` hoy es 0 pixeles
     cambiados, comprobable, no una opinión.
   - Calculá el contraste WCAG de los stops que se usarían como texto/ícono
     contra su fondo típico (AA = 4.5:1). Los de `vper` dan 4.84–12.82:1 en
     texto (el focus ring usa el mínimo de UI, 3:1, no el de texto).
   - `tsc`/`build` limpios.
   - Recién ahí, revisión visual en browser — como último paso, no el único.

   Dejá explícito en `brand.css` qué familias quedaron fuera y por qué (ver
   comentario de la sección 3), para que la próxima sesión no tenga que
   re-descubrirlo desde cero.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript strict
- Tailwind v4, tokens vía `@misitio/ui` (orden:
  `tokens.css` → `tokens-dark.css` → `theme-bridge.css` → `brand.css`,
  los cuatro como `@import` dentro de `globals.css` — ver abajo)
- Identidad VPER en `src/app/brand.css` (colores, fuentes, tracking, leading)
- `framer-motion` para las animaciones (carrusel del hero, scroll-driven
  work gallery, fade-ins por sección)
- `Button`/`Input`/`Card` copiados de `misitio` (`src/ui/components/`) —
  mismo patrón `cva` + tokens semánticos, portable 1:1 entre ambos proyectos

## Orden de carga: un solo mecanismo (contrato, no preferencia)

Los cuatro archivos de la cadena de tokens se importan **con `@import`,
dentro de `src/app/globals.css`**. `layout.tsx` importa un solo CSS
(`./globals.css`) y nada más.

Esto contradice a propósito lo que dice hoy el README de `@misitio/ui`
(que prescribe importar `tokens.css` y `tokens-dark.css` desde el entry de
JS). Ese contrato es el que hay que corregir upstream, no este.

**Por qué.** El CSS importado desde un módulo JS lo emite el bundler como
una hoja separada; el importado con `@import` queda dentro de la misma
hoja. Partir la cadena entre los dos mecanismos produce dos `<link>` cuyo
orden relativo decide el bundler. Como tokens y `brand.css` tienen la
misma especificidad (`:root` vs `:root`), gana el que cargue último — y
eso dejaba de estar garantizado.

Ese era el motivo real, nunca diagnosticado hasta 2026-08-18, de que la
rampa de neutros de `brand.css` necesitara `!important` en sus 11 stops:
no era un problema de HMR ni de serving, era la cadena partida en dos.
La verificación de la sesión anterior ("compilar el CSS solo confirma que
el output es correcto") no podía reproducirlo porque arrancaba en
`globals.css`, que no importaba `tokens.css` — o sea, excluía justamente
al archivo que competía.

**Medido en el build real de Next**, no razonado:

| | hojas CSS emitidas | `<link>` en el HTML | `--color-neutral-800` efectivo |
|---|---|---|---|
| Antes (split JS/CSS) | 2 | 2 | `#474747!important` |
| Después (un `@import`) | **1** | **1** | `#474747`, sin `!important` |

Regla práctica que queda: **si `brand.css` necesita `!important` para
ganar, el orden de carga está mal.** No se agrega `!important`, se
arregla la cadena.

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
- `public/fonts/ObviouslyWide-Black.woff2` ya trae acentos; la licencia
  sigue sin ser la de Ohno Type (ver `public/fonts/README.md`). Bloqueante
  solo para el deploy final al cliente, no para seguir iterando en
  local/preview.
- Las secciones 2-4 de `brand.css` (neutros acromáticos + escalas
  amber/clay/jade) son un **stopgap local** de un fix que en realidad le
  corresponde a `@misitio/ui` (bugs reales en los primitivos compartidos,
  no gusto de VPER — ver `misitio/docs/decisions/0012-paleta-primitivos-vper.md`
  y `misitio-ui/docs/fix-primitivos-color.md`). El día que el paquete
  publique la corrección real, actualizar la versión acá y borrar esas
  secciones en vez de mantener dos versiones de la verdad. Contexto de
  sesión completo: `docs/session-handoff-brand-color.md`.
