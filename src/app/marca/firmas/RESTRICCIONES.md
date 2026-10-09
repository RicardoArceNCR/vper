# Firmas de correo: restricciones

Las helpers de `email-html.ts` ya cumplen esto; `auditSignature(html)` revisa lo
automatizable.

## Compatibilidad

| Recurso                             | Gmail     | Outlook Win (Word)  | Outlook web/nuevo | Apple/iOS Mail |
| ----------------------------------- | --------- | ------------------- | ----------------- | -------------- |
| `<style>`, `class`                  | Se borran | Se pierden al pegar | Se borran         | Sí             |
| SVG                                 | No        | No                  | No                | Sí             |
| `margin`; `padding` fuera de `<td>` | Sí        | No                  | Sí                | Sí             |
| `padding` en `<td>`, `bgcolor`      | Sí        | Sí                  | Sí                | Sí             |
| `background-image` CSS              | Parcial   | No                  | Sí                | Sí             |
| `border-radius`                     | Sí        | No (queda recto)    | Sí                | Sí             |
| Webfonts                            | No        | No (cae a Times)    | No                | Sí             |
| `max-width`, flex, grid             | Parcial   | No                  | Parcial           | Sí             |
| `line-height` px + regla `exactly`  | Sí        | Sí                  | Sí                | Sí             |

**Modo oscuro.** Gmail web: no cambia nada. Gmail iOS: invierte todo. Gmail Android y
Outlook (Windows, web, nuevo): inversión parcial de fondos claros y texto oscuro. Apple
Mail: respeta colores declarados y oscurece lo transparente. Ningún cliente invierte
imágenes. Una firma no puede declarar `color-scheme` ni media queries: se diseña para
sobrevivir a la inversión, no para adaptarse.

## Imágenes

- PNG (JPG para fotos) a **2x** del tamaño mostrado: logo de 120×40 → archivo de
  240×80, con `width="120" height="40"` en el HTML.
- **≤ 30 KB por imagen**, ≤ 80 KB en total. Outlook clásico las incrusta como adjunto
  (`image001.png`) en cada mensaje enviado.
- URL **https absoluta y pública** (`assetUrl`). Nada de `localhost`, previews de Vercel
  con protección, redirecciones ni `data:`.
- Logo con fondo sólido horneado, no transparente: ink sobre amber se lee sobre blanco y
  sobre negro. Siempre `alt` útil: Outlook bloquea imágenes por defecto.

## Ancho

480 px por defecto (`SIGNATURE_WIDTH`), **600 px máximo**: más ancho obliga a scroll
horizontal en Outlook y en móvil. Gmail rechaza más de **10.000 caracteres** de HTML.

## Instalación

**Gmail (web):** "Copiar firma" → Gmail → engranaje → Ver toda la configuración →
General → Firma → Crear nueva → pegar dentro del editor → en "Valores predeterminados de
firma" elegirla para nuevos y respuestas → **Guardar cambios** (abajo de todo). La app
móvil usa su propia firma en texto plano.

**Outlook clásico (Windows):** abrir la página en Edge o Chrome → "Copiar firma" →
Archivo → Opciones → Correo → Firmas… → Nueva → pegar → asignarla a nuevos y respuestas
→ Aceptar. **Outlook web / nuevo:** Configuración → Cuentas → Firmas → pegar → Guardar.

Pegar siempre desde el navegador, nunca desde Word ni desde un editor de código.

## Los 5 errores más comunes

1. **Imágenes rotas para el destinatario:** URL local, privada o con login. En tu bandeja
   se ven porque están en caché.
2. **Logo transparente oscuro:** desaparece en modo oscuro (Gmail app, Outlook).
3. **Texto oscuro sin fondo declarado:** ilegible en Apple Mail oscuro.
4. **Pegar el código como texto:** Gmail muestra las etiquetas. Instalar con "Copiar
   firma" (enriquecido), no con "Copiar HTML".
5. **PNG a 1x o sin `width`/`height`:** borroso en retina, o enorme en Outlook con
   escalado de Windows al 125/150 %.
