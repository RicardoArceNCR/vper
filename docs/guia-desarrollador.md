# Design system VPER Media — guía para Heriberto

Esta guía es para implementar el sitio de VPER Media en **tu** repositorio
(Vite + React + Tailwind v4). Ricardo arma el diseño en este repo (Next.js)
y lo publica en Vercel para que el cliente lo revise. Vos no adoptás este
Next.js: lo usás como referencia, instalás el paquete de tokens en tu
proyecto, copiás los componentes primitivos y portás las secciones.

---

## 1. Qué estás recibiendo

Hay tres piezas. No es una sola librería de React.

| Pieza | Qué es | Qué hacés vos |
|---|---|---|
| Preview en Vercel | El diseño acordado, ya renderizado | Lo mirás. Es la fuente de verdad visual. |
| `@misitio/ui` | Paquete npm de **tokens CSS** (colores, tipo, spacing, `--button-*`, etc.) | Lo instalás por tag en tu repo. |
| Este repo (`vper`) | Cómo se usan esos tokens en componentes y secciones | Lo revisás. Copiás primitivos. Portás `className` de las secciones. |

`import { Button } from "@misitio/ui"` **no existe**. El paquete hoy publica
solo CSS. Los componentes React viven en este repo y se copian a mano.

El nombre del paquete es `@misitio/ui`. El repo público es
[github.com/RicardoArceNCR/misitio-ui](https://github.com/RicardoArceNCR/misitio-ui).
Este repo de referencia (el sitio VPER) en GitHub se llama `vper`:
[github.com/RicardoArceNCR/vper](https://github.com/RicardoArceNCR/vper).

---

## 2. Cómo funciona el design system

Todo parte de **Figma** (variables de color, tipo, spacing, componentes).
Eso se exporta y se convierte en CSS custom properties. Vos nunca editás
ese CSS a mano: lo consumís.

```
Figma (variables)
    → paquete @misitio/ui  (tokens.css + tokens-dark.css + theme-bridge.css)
        → brand.css        (identidad VPER: fuentes, paleta, overrides)
            → componentes  (Button, Card, Input, Pill — clases Tailwind)
                → secciones (Hero, Header, Footer… — layout del sitio)
```

### Capas de tokens

1. **Primitivos** — la paleta cruda (`--color-neutral-50` … `--color-neutral-950`,
   spacing, radius). No los uses directo en un componente si hay un
   semántico equivalente.
2. **Semánticos** — intención: `--text-primary`, `--background-page`,
   `--brand-action`, `--feedback-error-*`. Cambian entre claro y oscuro.
3. **Componente** — un control concreto: `--button-primary-bg`,
   `--card-radius`, `--input-border-focus`, `--pill-base-text`, `--nav-bg`.

Un `Button` no dice `#FDBF66`. Dice `var(--button-primary-bg)`, que apunta
a `--brand-action`, que en VPER se pisa en `brand.css`.

### El bridge (Tailwind v4)

`theme-bridge.css` traduce esos tokens a **clases** de Tailwind:

| Escribís | Resuelve a |
|---|---|
| `bg-background` | `var(--background-page)` |
| `text-foreground` | `var(--text-primary)` |
| `text-muted-foreground` | texto secundario |
| `text-body-sm`, `text-body-lg`, `text-label-sm` | type scale del DS |
| `font-display` / `font-sans` | `--typography-family-display` / `--typography-family-body` |

Sin el bridge, esas clases no existen. Las clases estándar de layout
(`flex`, `h-16`, `z-50`, `gap-8`) sí: las da Tailwind solo.

Cuando no hay utilidad, se usa el token crudo:

```tsx
className="bg-[var(--nav-bg)] border-[var(--nav-border)]"
```

### Light / dark

`tokens.css` define `:root` (claro). `tokens-dark.css` redefine los mismos
nombres bajo `.dark`. Si `<html>` tiene la clase `dark`, todo el árbol
cambia. El toggle de este repo lee/escribe `localStorage` (`vper-theme`) y
pone `.dark` **antes** del primer paint para no parpadear.

### Qué no es el design system

- Las **secciones** (Hero, Header, Footer) son el sitio VPER, no el paquete.
- `brand.css` es la marca de **este** cliente. Vive en el sitio, no en el
  paquete.
- Next.js (`next/link`, `next/font`, `"use client"`, App Router) es el
  framework de este preview. Tu Vite no lo necesita.

---

## 3. Requisitos en tu proyecto

- Node ≥ 22
- pnpm (o npm/yarn; los ejemplos usan pnpm)
- React 18 o 19
- **Tailwind CSS v4** (con `@tailwindcss/vite` o PostCSS)
- `tw-animate-css`

Si tu proyecto todavía tiene una carpeta local `design-system/tokens/`
que genera `tokens.css`, esa copia se **reemplaza** por el paquete. No
conviven: divergen.

---

## 4. Ver el diseño

### En Vercel

Pedile a Ricardo la URL de producción (o un preview de PR) del proyecto
`vper`. Ese HTML es lo que el cliente ya vio.

### En local, para leer el código

```bash
git clone git@github.com:RicardoArceNCR/vper.git
cd vper
pnpm install
pnpm dev
```

Abre `http://localhost:3000`. Lo útil es tener **los dos** abiertos: el
preview (Vercel o este `pnpm dev`) a un lado, tu implementación al otro.

Este repo es Next.js. Tu repo sigue siendo Vite. No hace falta que tu
sitio corra en el puerto 3000.

---

## 5. Instalar el paquete

Siempre un **tag**. Sin tag, el instalador toma la rama por defecto y se
pierde el control de versión.

```bash
pnpm add github:RicardoArceNCR/misitio-ui#v0.1.3
```

Eso deja en `package.json` algo así:

```json
"@misitio/ui": "github:RicardoArceNCR/misitio-ui#v0.1.3"
```

El paquete expone tres archivos CSS:

| Import | Qué contiene |
|---|---|
| `@misitio/ui/tokens.css` | `:root` — modo claro |
| `@misitio/ui/tokens-dark.css` | `.dark` — modo oscuro |
| `@misitio/ui/theme-bridge.css` | mapeo a Tailwind v4 (`@theme inline`) |

No edites nada dentro de `node_modules/@misitio/ui`.

### Si el install falla en CI / Vercel

`pnpm` a veces clona el paquete por SSH (`git@github.com:…`) y el build
 explota con `Host key verification failed`. Este repo lo resuelve con
`vercel.json`:

```json
{
  "installCommand": "git config --global url.\"https://github.com/\".insteadOf \"git@github.com:\" && pnpm install"
}
```

Copiá eso a tu proyecto **solo si** desplegás en un CI sin llaves SSH.
Un `vite build` local o un host estático no lo necesita.

---

## 6. Cablear los CSS (orden de carga)

El orden es un contrato. Si lo alterás, se rompe el theming entero, no un
botón suelto.

### En el entry de tu app

En Vite suele ser `src/main.tsx` o `client/src/main.tsx`. Equivale a
`src/app/layout.tsx` de este repo.

```tsx
import "@misitio/ui/tokens.css";      // 1. claro
import "@misitio/ui/tokens-dark.css"; // 2. oscuro
import "./index.css";                 // 3. Tailwind + bridge + marca
```

Si hoy tenés algo como:

```tsx
import "../../design-system/tokens/build/tokens.css";
```

reemplazalo por los dos imports del paquete. Cuando el sitio compile y se
vea bien, **borrá** la carpeta local `design-system/tokens/`.

### En tu CSS global

Equivale a `src/app/globals.css` de este repo. Ejemplo para Vite:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@import "@misitio/ui/theme-bridge.css";
@import "./brand.css";
```

`theme-bridge.css` **sí** va: tu proyecto usa Tailwind v4. Sin él,
`text-body-sm` y `bg-background` no resuelven.

### Marca VPER — `brand.css`

Copiá `src/app/brand.css` de este repo a tu proyecto (por ejemplo
`src/brand.css`) y cargalo **después** del bridge, como arriba.

Ahí está la identidad de VPER: Obviously Wide (display), Montserrat
(body), paleta ámbar/sky/teal, escalas de color. No se toca el paquete
para cambiar un color de este cliente: se pisa en `brand.css`.

Same specificity, gana el último archivo. Por eso el orden importa.

### Fuentes

Este repo carga Montserrat e IBM Plex Mono con `next/font` y deja las
variables `--typography-family-body` y `--typography-family-mono` en
`<html>`. En Vite eso no existe.

Tenés que definir las **mismas** CSS variables. Obviously Wide ya viene
con `@font-face` en `brand.css` (archivo en `/public/fonts/` o `/fonts/`
según tu Vite). Para body/mono, un ejemplo:

```css
@font-face {
  font-family: "Montserrat";
  src: url("/fonts/Montserrat-Variable.woff2") format("woff2");
  font-weight: 400 900;
  font-style: normal;
  font-display: swap;
}

:root {
  --typography-family-body: "Montserrat", sans-serif;
  --typography-family-mono: "IBM Plex Mono", ui-monospace, monospace;
}
```

O el loader de Google Fonts / plugin que uses, siempre que esas variables
queden definidas. El bridge lee esos nombres, no cómo se descargó el
archivo.

`public/fonts/ObviouslyWide-Black.woff2` en este repo es una versión
**demo** (charset limitado, licencia no apta para producción). Sustituí
el archivo por la versión licenciada antes de publicar.

### Utility `.wrap` (copiar)

Tailwind v4 reserva el nombre `container`. Este sitio usa `.wrap` para el
padding lateral. Copiá esto a tu CSS global:

```css
@layer components {
  .wrap {
    width: 100%;
    padding-left: var(--spacing-8);
    padding-right: var(--spacing-8);
  }
}
```

La cinta de logos usa `.animate-ticker`. Está al final de
`src/app/globals.css`; copiala si portás esa sección.

---

## 7. Qué revisar en este repo

No copies el sitio entero. Revisá estas rutas:

```
src/app/layout.tsx              orden de imports de tokens
src/app/globals.css             Tailwind + bridge + .wrap
src/app/brand.css               marca VPER — copiar
src/ui/lib/utils.ts             cn() — copiar junto a los primitivos
src/ui/components/button.tsx    copiar archivo
src/ui/components/card.tsx      copiar archivo
src/ui/components/input.tsx     copiar archivo
src/ui/components/pill.tsx      copiar archivo
src/sections/                   el sitio — revisar className, portar
src/components/section-header.tsx
src/components/project-hero.tsx
src/components/project-gallery.tsx
src/components/theme-toggle.tsx   referencia de .dark + localStorage
src/app/work/[slug]/page.tsx      página de detalle (usa Pill)
```

### Secciones del home (en orden)

| Archivo en este repo | Qué es |
|---|---|
| `src/sections/header.tsx` | Nav sticky, logo, menú mobile, CTA |
| `src/sections/hero.tsx` | Carrusel full-screen + titulares + botones |
| `src/sections/logo-ticker.tsx` | Cinta de logos (`.animate-ticker`) |
| `src/sections/work-gallery.tsx` | Grilla de proyectos |
| `src/sections/services-grid.tsx` | Servicios |
| `src/sections/process-section.tsx` | Proceso |
| `src/sections/about-us.tsx` | About |
| `src/sections/contact-section.tsx` | Formulario (hoy es un `alert()`, el backend es tuyo) |
| `src/sections/footer.tsx` | Footer |

Cómo se ensamblan: `src/app/page.tsx`.

---

## 8. Copiar componentes primitivos

Estos cuatro **son** las clases: viven dentro de `cva(...)`. Extraer
strings a mano es más frágil que copiar el archivo.

### Archivos

Desde este repo:

```
src/ui/components/button.tsx
src/ui/components/card.tsx
src/ui/components/input.tsx
src/ui/components/pill.tsx
src/ui/lib/utils.ts
```

Hacia tu proyecto, por ejemplo:

```
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/input.tsx
src/components/ui/pill.tsx
src/lib/utils.ts
```

Reemplazan el Button/Card/Input de scaffold (shadcn u otro). No convivan
dos Buttons.

### Dependencias

```bash
pnpm add class-variance-authority clsx tailwind-merge @radix-ui/react-slot
```

`@radix-ui/react-slot` solo lo usa `Button` (`asChild`).

### Ajustar imports

Acá los primitivos importan:

```tsx
import { cn } from "@ui/lib/utils";
```

y el resto del sitio:

```tsx
import { Button } from "@ui/components/button";
```

En tu repo suele ser `@/lib/utils` y `@/components/ui/button`. Cambiá las
rutas al copiar. El alias no importa mientras sea consistente.

`utils.ts` **sí** hay que copiarlo (o fusionarlo): `tailwind-merge` trata
`text-body-sm` y `text-[var(--text-secondary)]` como el mismo grupo
`text-*` y se come el font-size. El `cn()` de este repo extiende
`font-size` con la type scale (`display-hero`, `body-sm`, `label-sm`, …).
Si usás el `cn()` genérico de shadcn, esas clases se pisan entre sí.

### API

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";

<Button variant="default" size="lg">VIEW WORK</Button>
<Button variant="secondary" size="lg">SCHEDULE A CALL</Button>
<Button variant="outline" size="sm">Work</Button>
<Button variant="ghost">…</Button>
<Button variant="destructive">…</Button>

<Card>…</Card>
<Card interactive>…</Card>

<Input placeholder="Email" />
<Input state="error" />

<Pill variant="base">Branding</Pill>
<Pill variant="brand" size="sm">Destacado</Pill>
```

Tokens que cada uno consume (para saber qué revisar en DevTools):

| Componente | Tokens |
|---|---|
| `Button` | `--button-primary-*`, `--button-secondary-*`, `--button-ghost-*`, `--button-danger-*`, `--button-disabled-*`, `--button-radius`, `--button-size-*-height`, `--button-size-*-padding-x`, `--button-font-weight`, `--button-letter-spacing`, `--focus-ring-*` |
| `Card` | `--card-bg`, `--card-text`, `--card-border`, `--card-radius`, `--card-padding`, `--card-shadow`, `--card-bg-hover`, `--card-border-hover` |
| `Input` | `--input-bg`, `--input-text`, `--input-border`, `--input-placeholder`, `--input-padding-*`, `--input-border-hover`, `--input-border-focus`, `--input-bg-focus`, `--input-*-disabled`, `--input-border-error` |
| `Pill` | `--pill-radius`, `--pill-base-bg/text/border`, `--pill-brand-bg/text`, `--pill-md-padding-x`, `--pill-sm-padding-x` |

---

## 9. Copiar o portar secciones

No pegues `src/sections/header.tsx` entero en Vite: trae `next/link` y
`"use client"`. Abrí el archivo de acá y el tuyo, y llevate **el markup y
las clases**.

### Qué sí copiar de una sección

- El `className` completo de cada nodo
- `style={{ fontSize: "clamp(var(--typography-styles-…))" }}` si está
- Arbitrary values con tokens (`bg-[var(--nav-bg)]`)
- La utility `.wrap` y `.animate-ticker` (desde `globals.css`)
- El uso de `<Button>`, `<Card>`, `<Pill>` (ya copiados)

### Qué reescribir (es framework, no diseño)

| En este repo | En el tuyo (Vite) |
|---|---|
| `"use client";` | borrar |
| `import Link from "next/link"` | tu router (`<a href>`, Wouter, React Router, …) |
| `next/font` (`src/ui/lib/fonts.ts`) | `@font-face` (sección 6) |
| `next/navigation`, `generateStaticParams`, `notFound()` | tu router / páginas |
| `className={fontBody.variable}` en `<html>` | las CSS variables de fuente en CSS |

Criterio rápido:

- El compilador pide un módulo `next/…` → no es design system. Se reescribe.
- Una clase `text-body-sm` no tiene efecto → falta `theme-bridge.css` o
  el orden de imports.
- Un `var(--button-primary-bg)` queda vacío → el paquete no está
  cargado, o `brand.css` / el bridge van en el orden incorrecto.

### Cómo leer un `className` (para no copiar a ciegas)

Ejemplo real del Hero (`src/sections/hero.tsx`):

```tsx
<section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
  <div className="absolute inset-0 bg-background/60 z-20" />

  <div className="relative z-30 wrap text-center px-4 flex flex-col items-center justify-center h-full pt-16">
    <h1
      className="font-display font-extrabold tracking-tight max-w-5xl leading-[0.95] mb-8 text-foreground"
      style={{
        fontSize:
          "clamp(var(--typography-styles-display-sm-size), 3.5vw + 0.5rem, var(--typography-styles-display-hero-size))",
      }}
    >
      NO HACEMOS MARKETING, HACEMOS QUE TENGA SENTIDO.
    </h1>

    <p className="text-body-sm md:text-body-lg text-muted-foreground dark:text-foreground max-w-2xl font-medium mb-12">
      Campaigns, content and experiences that convert.
    </p>

    <Button variant="secondary" size="lg">SCHEDULE A CALL</Button>
    <Button variant="default" size="lg">VIEW WORK</Button>
  </div>
</section>
```

| Clase | Origen | Qué hace |
|---|---|---|
| `relative`, `h-screen`, `flex`, `z-20`, `pt-16` | Tailwind estándar | layout; viaja solo |
| `bg-background`, `text-foreground`, `text-muted-foreground` | bridge | color semántico |
| `text-body-sm`, `text-body-lg` | bridge (type scale) | tamaño + line-height del DS |
| `font-display` | bridge ← `--typography-family-display` | Obviously Wide, pisada en `brand.css` |
| `wrap` | CSS del sitio | padding lateral |
| `clamp(var(--typography-styles-display-sm-size), …)` | token de tipo | tamaño fluido del titular |
| `<Button variant="default">` | primitivo copiado | no reimplementar el botón en la sección |

Mismo método para Header, Footer, Work, etc.: lado a lado, nodo por nodo,
llevarse el `className`. El Header de este repo usa `h-16` en reposo
(antes era más alto); si el tuyo todavía tiene otro valor, alinealo a
este archivo.

### Página de detalle de trabajo

`src/app/work/[slug]/page.tsx` usa `Pill`, `ProjectHero` y
`ProjectGallery`. En Vite eso es una ruta de tu router, no un archivo
`page.tsx` de App Router. Copiá los componentes de
`src/components/project-*.tsx` y el uso de `Pill`; reescribí
`generateStaticParams` / `notFound()` con lo que uses para datos y 404.

---

## 10. Dark mode

Este preview arranca en **oscuro** (así estaba el original de VPER).

El script en `layout.tsx` hace, antes del primer paint:

```js
var t = localStorage.getItem("vper-theme") || "dark";
if (t === "dark") document.documentElement.classList.add("dark");
```

`ThemeToggle` (`src/components/theme-toggle.tsx`) lee/escribe esa clave y
la clase `.dark`. Si tu app ya tiene un `ThemeContext`, no hace falta
copiarlo: alcanza con que termine poniendo `.dark` en `<html>`. Los
tokens de `tokens-dark.css` se aplican solos.

---

## 11. Qué no hacer

- No esperes que `pnpm add @misitio/ui` te suelte el Header. El paquete
  no trae componentes React.
- No edites `node_modules/@misitio/ui` ni regeneres tokens a mano.
- No vuelvas a copiar el pipeline de Figma adentro de tu repo. Un tag
  nuevo del paquete es el update.
- No uses `text-4xl` / `text-[39px]` para titulares del DS: el token no
  participa y `brand.css` no va a poder corregirlo. Preferí
  `text-display-*`, `text-h*`, `text-body-*`, `text-label-*`.
- No copies `"use client"` ni `next/link` a Vite.
- No mantengas un Button shadcn y el Button de este repo a la vez.

---

## 12. Checklist

1. Preview de Vercel (o `pnpm dev` de este repo) abierto.
2. Acceso de lectura a [github.com/RicardoArceNCR/vper](https://github.com/RicardoArceNCR/vper).
3. En **tu** repo: `pnpm add github:RicardoArceNCR/misitio-ui#v0.1.3`.
4. Imports en el entry: `tokens.css` → `tokens-dark.css` → tu CSS global.
5. En el CSS global: Tailwind → `tw-animate-css` → `dark` variant →
   `theme-bridge.css` → `brand.css`.
6. Copiar `src/app/brand.css`. Definir `--typography-family-body` /
   `--typography-family-mono` sin `next/font`. Copiar `.wrap`.
7. Borrar `design-system/tokens/` local cuando compile y se vea bien.
8. Copiar los 4 primitivos + `utils.ts`. Ajustar imports.
9. Sección por sección: diff de `className` contra `src/sections/`.
10. Light y dark: la clase `.dark` en `<html>` tiene que existir.
11. Formulario de contacto: acá es un `alert()`. El backend es tuyo.
12. Reemplazar el `.woff2` demo de Obviously Wide antes de producción.

---

## 13. Actualizar el paquete más adelante

Cuando Ricardo publique un tag nuevo (tokens nuevos desde Figma):

```bash
pnpm add github:RicardoArceNCR/misitio-ui#vX.Y.Z
```

Si un token no alcanza, se pide en Figma o se pisa `--brand-*` (u otro
semántico) en `brand.css`. No se forkear el paquete.

---

## 14. Si algo no se ve igual que en Vercel

1. DevTools → el nodo → Styles. ¿Aparece `var(--button-primary-bg)` y
   tiene valor, o está tachado / vacío?
2. ¿`tokens.css` y `theme-bridge.css` están en el orden de la sección 6?
3. ¿`brand.css` carga **después** del bridge?
4. ¿`<html>` tiene `.dark` cuando estás en oscuro?
5. ¿La clase es `text-body-sm` (type scale) o `text-4xl` (Tailwind
   genérico, el DS no participa)?
6. ¿Copiaste `cn()` con la type scale extendida?
7. ¿Quedó un `next/link` o un `"use client"` que Vite no entiende, y el
   archivo ni siquiera monta?
