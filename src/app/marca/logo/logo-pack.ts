import { saveBlob } from "../lib/save";
import { makeZip, type ZipEntry } from "../lib/zip";
import { MARKS, type MarkKey } from "./marks-data";

/**
 * Paquete descargable del logo, armado en el navegador desde los mismos trazos
 * que dibujan la lámina (marks-data.ts). No hay binarios del logo guardados que
 * se puedan desfasar: si cambia el SVG fuente y se regeneran los trazos, el ZIP
 * sale nuevo.
 *
 * Tintas: un archivo exportado no puede leer variables CSS, así que van en hex.
 * Son los tokens de brand.css que la lámina usa para cada soporte.
 */
export const LOGO_INKS = {
  /** --background-page en oscuro: el negro de la página y del ticker. */
  negro: "#000000",
  /** --background-page en claro. */
  blanco: "#ffffff",
  /** --brand-action (amber/300). Solo sobre negro: sobre blanco da 1.6:1. */
  amber: "#fdbf66",
} as const;

export type Ink = keyof typeof LOGO_INKS;

export const LOGO_FILES: Record<
  MarkKey,
  { slug: string; name: string; pngWidth: number }
> = {
  h1: { slug: "bloque", name: "Bloque", pngWidth: 2400 },
  h2: { slug: "linea", name: "Línea", pngWidth: 3000 },
  v: { slug: "columna", name: "Columna", pngWidth: 1600 },
  iso: { slug: "monograma", name: "Monograma", pngWidth: 1024 },
};

const KEYS = Object.keys(LOGO_FILES) as MarkKey[];
const INKS = Object.keys(LOGO_INKS) as Ink[];

/** SVG autónomo: viewBox ajustado al trazo, sin estilos ni clases, color en el fill. */
export function logoSvg(k: MarkKey, ink: Ink): string {
  const m = MARKS[k];
  const [w, h] = m.viewBox;
  const fill = LOGO_INKS[ink];
  const paths = m.strokes.map(([, d]) => `  <path fill="${fill}" d="${d}"/>`).join("\n");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n` +
    `  <title>VPER Media</title>\n${paths}\n</svg>\n`
  );
}

/** PNG con fondo transparente al ancho pedido, rasterizado desde el SVG. */
async function logoPng(
  k: MarkKey,
  ink: Ink,
  width: number,
  plate?: string,
): Promise<Blob> {
  const [w, h] = MARKS[k].viewBox;
  const svg = new Blob([logoSvg(k, ink)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svg);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d no disponible");
    if (plate) {
      // Placa cuadrada (avatar/ícono): el monograma ocupa el 62 % del lado.
      canvas.width = canvas.height = width;
      ctx.fillStyle = plate;
      ctx.fillRect(0, 0, width, width);
      const mw = width * 0.62;
      const mh = (mw * h) / w;
      ctx.drawImage(img, (width - mw) / 2, (width - mh) / 2, mw, mh);
    } else {
      canvas.width = width;
      canvas.height = Math.round((width * h) / w);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    return await new Promise<Blob>((ok, fail) =>
      canvas.toBlob((b) => (b ? ok(b) : fail(new Error("toBlob"))), "image/png"),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

const README = `Logo VPER Media

Cuatro versiones del mismo dibujo, en tres tintas, en SVG (vector) y PNG
(fondo transparente). Fuente: Marca VPER, /marca/logo.

QUÉ VERSIÓN VA DÓNDE
  Línea      sitio, firma de correo, documentos, pie
  Bloque     portadas, presentaciones, cierre de video
  Columna    stories, merch, impresos verticales
  Monograma  favicon, avatar, marca de agua (va también sobre placa amber)

TINTAS
  negro   sobre blanco o sobre amber
  blanco  sobre negro o sobre foto oscura
  amber   solo sobre negro (sobre blanco no se lee: 1.6:1)

MÍNIMOS (por debajo, cambiar de versión en vez de achicar)
  Monograma 16 px de alto · Columna 48 px de alto
  Bloque 120 px de ancho  · Línea 120 px de ancho

ÁREA DE RESPETO
  Bloque y Columna: el alto de MEDIA alrededor. Línea: su propio alto.
  Monograma: media fila.

NO
  deformar, rotar, contornear, agregar sombras ni recomponer las piezas.
  Si falta una versión, pedirla a diseño.

SVG para web e imprenta; PNG para Office, redes y donde no entre un SVG.
`;

/** ZIP con las versiones pedidas (todas por defecto) y un LEEME. */
export async function downloadLogoPack(only?: MarkKey): Promise<void> {
  const enc = new TextEncoder();
  const keys = only ? [only] : KEYS;
  const entries: ZipEntry[] = [];

  for (const k of keys) {
    const f = LOGO_FILES[k];
    for (const ink of INKS) {
      const base = `vper-${f.slug}-${ink}`;
      entries.push({ name: `SVG/${base}.svg`, data: enc.encode(logoSvg(k, ink)) });
      const png = await logoPng(k, ink, f.pngWidth);
      entries.push({
        name: `PNG/${base}.png`,
        data: new Uint8Array(await png.arrayBuffer()),
      });
    }
  }
  if (!only || only === "iso") {
    const plate = await logoPng("iso", "negro", 1024, LOGO_INKS.amber);
    entries.push({
      name: "PNG/vper-monograma-placa-amber.png",
      data: new Uint8Array(await plate.arrayBuffer()),
    });
  }
  entries.push({ name: "LEEME.txt", data: enc.encode(README) });

  const name = only ? `vper-logo-${LOGO_FILES[only].slug}.zip` : "vper-logo.zip";
  saveBlob(makeZip(entries), name);
}
