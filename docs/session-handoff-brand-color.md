# vper-media-next — handoff: identidad de marca y fix de color (2026-08-11/12)

> Resumen de sesión, no reemplaza la documentación real, que ya vive en
> el repo: `README.md` (secciones "Identidad de marca" y "Runbook: brand.css
> para un cliente nuevo") y `src/app/brand.css` (comentarios inline en
> cada sección). Esto es para dar contexto rápido a quien no estuvo en la
> sesión.

## Qué se hizo

1. Identidad de marca VPER completa en `src/app/brand.css`: tipografía
   (Obviously Wide Blck demo + Montserrat + IBM Plex Mono), paleta de
   marca (gold/sky/danger/teal), y una red de seguridad de escalas de
   color completas para que ningún componente futuro filtre un color sin
   relación con la marca.
2. Se detectó que el neutral compartido de `@misitio/ui` rompe su propia
   familia cálida en los pasos 800-950 (salta a azul) — bug real del
   paquete, verificado directo contra `misitio-ui/source/primitivos.json`,
   no gusto de VPER. Se corrigió localmente y después se reemplazó por
   la propuesta de paleta completa (amber/sky/clay/jade + neutral
   acromático).
3. Se encontraron y cerraron 2 tokens semánticos huérfanos que apuntaban
   a primitivos crudos sin relación con la marca (`--text-brand-accent`,
   `--button-danger-bg-press`).
4. Todo verificado compilando el CSS con el motor real de Tailwind
   (`@tailwindcss/postcss` + `lightningcss`), no solo revisando en
   DevTools — confirmado que el output no tiene rastro de los valores
   viejos antes de darlo por bueno.

## Estado: funcionalmente cerrado, con una deuda documentada y con dueño

`vper` renderiza correctamente. Lo que queda abierto no es un bug de
`vper` — es que esto vive como override local (`brand.css`, secciones
2-4) en vez de en el design system compartido, que es donde debería
vivir la corrección real:

- Decisión + consecuencias: `misitio/docs/decisions/0012-paleta-primitivos-vper.md`
  (estado: propuesta, no aceptada todavía — quedan puntos abiertos).
- Brief técnico de implementación (rampas completas, mapeo semántico,
  orden de pasos en Figma/Style Dictionary): `misitio-ui/docs/fix-primitivos-color.md`.

## Para el próximo proyecto (gobi-cr u otro)

Dos escenarios:

- **Si el ADR 0012 ya se implementó en `@misitio/ui`:** el proyecto nuevo
  no necesita nada de esto — actualiza a la versión del paquete que tenga
  la paleta corregida y listo. No copiar `brand.css` de `vper`.
- **Si todavía no:** usar `vper/src/app/brand.css` como plantilla de
  partida (no copiar los valores de color tal cual, son de la marca VPER
  — sí copiar la estructura: familias, neutros, escalas de seguridad,
  paleta de marca, tipografía) y seguir el runbook de 4 pasos que ya está
  en `README.md` de este repo.
