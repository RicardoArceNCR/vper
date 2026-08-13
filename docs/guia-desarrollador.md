# Guía para el desarrollador — design system VPER Media

Ricardo implementa el diseño en este repo (`vper` / `vper-media-next`),
Next.js + Tailwind v4, y lo publica en Vercel para que el cliente lo vea.

Vos trabajás en **tu** repo (Vite + React + Tailwind v4, del estilo de
`vper-media-repo`). No adoptás este Next.js. Lo usás como referencia:
instalás el design system, **revisás** cómo está armado acá, copiás los
primitivos, y portás las clases de las secciones a tus archivos.

Las clases de Tailwind + las CSS variables **sí viajan** entre Next y Vite.
Lo que no viaja es lo específico de Next (`next/link`, `next/font`,
`"use client"`, App Router).

---

## Tres piezas

| Pieza | Qué es | Qué hacés vos |
|---|---|---|
| Preview Vercel | El diseño acordado, ya renderizado | Lo mirás. Fuente de verdad visual. |
| `@misitio/ui` | Paquete de **tokens CSS** (no React) | Lo instalás por tag en tu repo. |
| Este repo (`vper`) | Cómo se usan esos tokens en componentes y secciones | Lo revisás. Copiás primitivos. Portás `className` de las secciones. |

`import { Button } from '@misitio/ui'` **no existe**. El paquete hoy publica
solo CSS. Los componentes viven en este repo y se copian.

El nombre `@misitio/ui` es el del paquete compartido
([`RicardoArceNCR/misitio-ui`](https://github.com/RicardoArceNCR/misitio-ui)).
No es un leftover de otro cliente.

---

## 1. Ver el diseño

En Vercel: la URL del proyecto `vper` (producción o preview de PR).

En local, si querés inspeccionar código y DevTools juntos:

```bash
git clone git@github.com:RicardoArceNCR/vper.git
cd vper
pnpm install   # Node ≥ 22
pnpm dev       # http://localhost:3000
```

Tu sitio Vite sigue en el puerto que uses (`5173`, etc.). Lo útil es tener
**los dos abiertos**: Vercel/este repo a la izquierda, tu implementación a
la derecha.

---

## 2. Instalar el design system en tu repo

Siempre un **tag**. Sin tag, `pnpm` toma la rama por defecto y se pierde
el versionado.

```bash
pnpm add github:RicardoArceNCR/misitio-ui#v0.1.3
```

### Orden de carga (contrato)

En el entry (en `vper-media-repo` es `client/src/main.tsx`):

```tsx
import "@misitio/ui/tokens.css";      // 1. :root (claro)
import "@misitio/ui/tokens-dark.css"; // 2. .dark
import "./index.css";                 // 3. tailwind + bridge + marca
```

En `index.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@import "@misitio/ui/theme-bridge.css";
@import "./brand.css"; /* identidad VPER; copiar desde este repo */
```

Ese orden no es sugerencia. `theme-bridge.css` mapea tokens a clases
Tailwind (`text-body-sm`, `bg-background`, `font-display`, …). Sin el
bridge, las clases de este repo no resuelven.

Si hoy importás el fork local:

```tsx
import "../../design-system/tokens/build/tokens.css";
```

reemplazalo por el paquete y **borrá** `design-system/tokens/` cuando el
sitio compile. Ese árbol es una copia que ya puede divergir. Los cambios
siguientes entran por Figma → tag nuevo de `@misitio/ui` → bump acá.

`theme-bridge.css` **sí** va en tu repo: tenés Tailwind v4. (No aplica
solo si el destino fuera CSS Modules sin Tailwind.)

Marca VPER: copiá `src/app/brand.css` de este repo a tu `client/src/` (o
equivalente) y cargalo **después** del bridge. Ahí están fuentes, paleta
y escalas de este cliente. No se toca el paquete para cambiar un color
de VPER.

Fuentes: este repo carga Montserrat / IBM Plex Mono con `next/font`. En
Vite usá `@font-face` (Obviously Wide ya está así en `brand.css`) o el
equivalente que uses. Las CSS variables (`--typography-family-body`, etc.)
tienen que quedar definidas igual; el nombre de la familia es lo que el
bridge consume.

---

## 3. Cómo leer este repo (no copiar el sitio entero)

Mapa útil:

```
src/ui/components/     primitivos — copiar el archivo
src/ui/lib/utils.ts    cn() — copiar junto a los primitivos
src/sections/          el sitio — revisar className, portar a tus secciones
src/app/brand.css      marca VPER — copiar
src/app/layout.tsx     orden de imports de tokens — replicar en main.tsx
src/app/globals.css    tailwind + bridge — replicar en index.css
```

Tus archivos en un repo tipo `vper-media-repo` ya son el espejo:

| Acá (Next) | Allá (Vite) |
|---|---|
| `src/ui/components/button.tsx` | `client/src/components/ui/button.tsx` |
| `src/sections/hero.tsx` | `client/src/sections/Hero.tsx` |
| `src/app/brand.css` | (no está; hay que copiarlo) |
| `next/link` | `wouter` o `<a>` |
| `"use client"` | no existe; se borra |

---

## 4. Extraer: dos recetas distintas

### Primitivos — copiar el archivo, no extraer clases a mano

`Button`, `Card`, `Input`, `Pill` **son** las clases: viven dentro de
`cva(...)`. Extraer strings a mano es más frágil que copiar 40–60 líneas
que ya apuntan a `--button-*` / `--card-*` / `--input-*` / `--pill-*`.

Copiar desde este repo:

```
src/ui/components/button.tsx
src/ui/components/card.tsx
src/ui/components/input.tsx
src/ui/components/pill.tsx
src/ui/lib/utils.ts
```

hacia tu `client/src/components/ui/` (y `lib/utils.ts` si el `cn()` de allá
no extiende `tailwind-merge` con la type scale). Reemplazan el Button
shadcn/scaffold, no conviven dos.

Dependencias que esos archivos esperan (tu repo tipo `vper-media-repo` ya
las tiene):

```bash
pnpm add class-variance-authority clsx tailwind-merge @radix-ui/react-slot
```

Ajustar imports: acá es `@ui/components/button`; allá suele ser
`@/components/ui/button`. El alias no importa mientras sea consistente.

Uso (igual en ambos lados):

```tsx
<Button variant="default">Contact us</Button>
<Button variant="outline" size="sm">Work</Button>
<Pill variant="base">Branding</Pill>
```

### Secciones — revisar y portar `className`

No pegues `src/sections/header.tsx` entero en Vite: trae `next/link` y
`"use client"`. Abrí el archivo acá y el tuyo, y llevate **el markup y las
clases**.

Ejemplo (Hero). Esto es el diseño, y es portable:

```tsx
<section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
  <div className="absolute inset-0 bg-background/60 z-20" />
  <h1 className="font-display font-extrabold tracking-tight max-w-5xl leading-[0.95] mb-8 text-foreground">
    …
  </h1>
  <p className="text-body-sm md:text-body-lg text-muted-foreground dark:text-foreground max-w-2xl font-medium mb-12">
    …
  </p>
</section>
```

Qué significa cada familia de clases (para no copiar a ciegas):

| Clase | De dónde sale | Qué hace |
|---|---|---|
| `bg-background`, `text-foreground`, `text-muted-foreground` | `theme-bridge.css` | color semántico |
| `text-body-sm`, `text-body-lg`, `text-label-sm` | bridge (type scale) | tamaño + line-height del DS |
| `font-display`, `font-sans` | bridge ← `--typography-family-*` | familia |
| `bg-[var(--nav-bg)]`, `border-[var(--nav-border)]` | token crudo | cuando no hay utilidad Tailwind |
| `wrap` | `index.css` / `globals.css` del **sitio** | padding lateral; copiar la utility |
| `h-16`, `gap-8`, `flex`, `z-50` | Tailwind estándar | layout; viaja solo |

Qué **sí** copiar de una sección:

- el `className` completo de cada nodo
- `style={{ fontSize: "clamp(var(--typography-styles-…))" }}` si está
- tokens en arbitrary values (`bg-[var(--nav-bg)]`)
- la utility `.wrap` y `.animate-ticker` desde `globals.css`

Qué **no** copiar / hay que reescribir:

| En este repo | En el tuyo (Vite) |
|---|---|
| `"use client";` | borrar |
| `import Link from "next/link"` | `wouter` o `<a href>` |
| `next/font` (`src/ui/lib/fonts.ts`) | `@font-face` / plugin Vite |
| `next/navigation`, `generateStaticParams` | tu router (`wouter`) |
| `className={fontBody.variable}` en `<html>` | definir las CSS variables de fuente en CSS |

Criterio: si al pegar un archivo el compilador pide un módulo `next/…`,
eso no es design system, es framework. Se reescribe. Si pide
`@misitio/ui` o una clase `text-body-sm`, el paquete o el bridge no
están cargados.

---

## 5. Checklist

1. Preview de Vercel abierto (referencia visual).
2. Este repo clonado o con acceso de lectura (referencia de código).
3. `pnpm add github:RicardoArceNCR/misitio-ui#v0.1.3` en **tu** repo.
4. Orden de imports en `main.tsx` + `theme-bridge` + `brand.css`.
5. Borrar el fork `design-system/tokens/` cuando compile.
6. Copiar los 4 primitivos + `cn()`.
7. Sección por sección: diff de `className` contra `src/sections/` de acá.
   El Hero de `vper-media-repo` y el de acá ya son casi el mismo archivo;
   el trabajo es alinear lo que Ricardo cambió después (header `h-16`,
   `brand.css`, `Pill`, etc.).
8. Verificar light/dark. El toggle de acá escribe `.dark` + `localStorage`;
   el tuyo puede seguir usando `ThemeContext` si termina en la misma clase
   `.dark` en `<html>`.
9. Formulario de contacto: acá es un `alert()`. Backend es tuyo.
10. `ObviouslyWide-Black.woff2` en este repo es **demo**. Licencia real
    antes de producción.

Actualizar tokens más adelante:

```bash
pnpm add github:RicardoArceNCR/misitio-ui#vX.Y.Z
```

Nunca editar `node_modules/@misitio/ui`. Si falta un token, se pide en
Figma o se pisa `--brand-*` en `brand.css`.

---

## 6. ¿Esto es compatible?

Sí, con este split:

- **Tokens:** instalables. Tu stack (Vite + Tailwind v4 + React 19) es el
  consumidor para el que está pensado el paquete, igual que este Next.
- **Primitivos:** copy-paste del `.tsx`. Mismas deps (`cva`, Radix Slot).
- **Secciones:** no copy-paste ciego. Revisar este repo y portar clases;
  reescribir solo lo de Next.
- **Preview:** Vercel es para el cliente. Tu deploy (Hostinger, Vite
  `dist/`, u otro) es el producto.

No es compatible si se espera que `npm i @misitio/ui` suelte el Header.
El paquete no trae componentes. Este repo es el catálogo de cómo se usan.
