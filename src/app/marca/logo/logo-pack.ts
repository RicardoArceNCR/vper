import { saveBlob } from "../lib/save";
import { fetchText, rasterize } from "../lib/raster";
import { makeZip, type ZipEntry } from "../lib/zip";
import { ISOLOGOS, type IsoKey } from "./isologo-data";
import { MARKS, type MarkKey } from "./marks-data";

/**
 * Paquete descargable del logo, armado en el navegador. Los logotipos salen de
 * los mismos trazos que dibujan la lámina (marks-data.ts): no hay binarios
 * guardados que se puedan desfasar. El isologo es ilustración a color: se
 * empaqueta el SVG de diseño tal cual (public/images/isologo/) más su PNG.
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
  { slug: string; name: string; alias: string; pngWidth: number }
> = {
  h1: {
    slug: "logotipo-horizontal",
    name: "Logotipo horizontal",
    alias: "Bloque",
    pngWidth: 2400,
  },
  h2: {
    slug: "logotipo-linea",
    name: "Logotipo en línea",
    alias: "Línea",
    pngWidth: 3000,
  },
  v: {
    slug: "logotipo-vertical",
    name: "Logotipo vertical",
    alias: "Columna",
    pngWidth: 1600,
  },
  iso: { slug: "favicon", name: "Favicon", alias: "Monograma", pngWidth: 1024 },
};

/** Qué se puede bajar por separado: el isologo (los cuatro colores) o un logotipo. */
export type PackKey = "isologo" | MarkKey;

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

/** PNG transparente del logotipo al ancho pedido. */
function logoPng(k: MarkKey, ink: Ink, width: number, plate?: string): Promise<Blob> {
  return rasterize(logoSvg(k, ink), MARKS[k].viewBox, width, { plate });
}

const README = `Logo VPER Media

Fuente: Marca VPER, /marca/logo. SVG (vector) y PNG (fondo transparente).

CUÁL ES CUÁL
  Dos familias del mismo nivel:
  Logotipo             la firma. Identifica a la agencia en web, correo,
                       documentos y a cualquier tamaño.
  Isologo              la marca expresiva: la casetera con VPER adentro, en
                       cuatro colores (clay, amber, jade, sky). Siempre a color.

  ¿NO SABÉS CUÁL? El logotipo horizontal en negro (en blanco sobre oscuro).

  Logotipo horizontal  VPER® sobre MEDIA. (antes "Bloque")
  Logotipo vertical    VP / ER® / MEDIA. (antes "Columna")
  Logotipo en línea    VPER® MEDIA en una línea. (antes "Línea")
  Favicon              VP / ER, sin MEDIA. Hace de isotipo: VPER no tiene un
                       símbolo sin letras. (antes "Monograma")

QUÉ VERSIÓN VA DÓNDE
  Logotipo horizontal  por defecto: documentos, co-branding, video, una tinta
  Isologo              redes, portadas, presentaciones, merch, piezas a color
                       (preferí clay o jade: son las completas, con MEDIA y ®)
  Logotipo en línea    sitio, firma de correo, pie, barras bajas
  Logotipo vertical    stories, impresos verticales, sellos
  Favicon              favicon, avatar, marca de agua (también sobre placa amber)

ISOLOGO
  Va sobre blanco, negro o claros neutros. No sobre su mismo color
  (la amber sobre amber) ni sobre fotos cargadas.
  Mínimo 120 px de ancho: más chico, pasar al logotipo o al favicon.
  No se recolorea, no se le quita el contorno, no se separa la palabra
  de la casetera.

TINTAS DEL LOGOTIPO
  negro   sobre blanco o sobre amber
  blanco  sobre negro o sobre foto oscura
  amber   solo sobre negro (sobre blanco no se lee: 1.6:1)

MÍNIMOS DEL LOGOTIPO (por debajo, cambiar de versión en vez de achicar)
  Favicon 16 px de alto · Vertical 48 px de alto
  Horizontal 120 px de ancho · En línea 120 px de ancho

ÁREA DE RESPETO
  x = el alto de MEDIA, libre alrededor de los logotipos.
  En el logotipo en línea es su alto; en el favicon, media fila de VP/ER.

NO
  deformar, rotar, contornear, agregar sombras ni recomponer las piezas.
  Si falta una versión, pedirla a diseño.

Los fondos de caseteras están aparte, en /marca/fondos.
`;

const KEYS_ALL: PackKey[] = ["isologo", ...KEYS];

export function packName(only?: PackKey, color?: IsoKey): string {
  if (!only) return "vper-logo.zip";
  if (only === "isologo") return color ? `vper-isologo-${color}.zip` : "vper-isologo.zip";
  return `vper-${LOGO_FILES[only].slug}.zip`;
}

/**
 * ZIP con las versiones pedidas (todas por defecto) y un LEEME. `color` limita
 * el isologo a una casetera.
 */
export async function downloadLogoPack(only?: PackKey, color?: IsoKey): Promise<void> {
  const enc = new TextEncoder();
  const keys = only ? [only] : KEYS_ALL;
  const entries: ZipEntry[] = [];
  const bytes = async (b: Blob) => new Uint8Array(await b.arrayBuffer());

  for (const k of keys) {
    if (k === "isologo") {
      for (const iso of ISOLOGOS.filter((i) => !color || i.key === color)) {
        const base = `vper-isologo-${iso.key}`;
        const svg = await fetchText(iso.src);
        entries.push({ name: `SVG/${base}.svg`, data: enc.encode(svg) });
        for (const width of [1024, 2048]) {
          const png = await rasterize(svg, iso.size, width);
          entries.push({ name: `PNG/${base}-${width}.png`, data: await bytes(png) });
        }
      }
      continue;
    }
    const f = LOGO_FILES[k];
    for (const ink of INKS) {
      const base = `vper-${f.slug}-${ink}`;
      entries.push({ name: `SVG/${base}.svg`, data: enc.encode(logoSvg(k, ink)) });
      const png = await logoPng(k, ink, f.pngWidth);
      entries.push({ name: `PNG/${base}.png`, data: await bytes(png) });
    }
    if (k === "iso") {
      const plate = await logoPng("iso", "negro", 1024, LOGO_INKS.amber);
      entries.push({
        name: "PNG/vper-favicon-placa-amber.png",
        data: await bytes(plate),
      });
    }
  }
  entries.push({ name: "LEEME.txt", data: enc.encode(README) });

  saveBlob(makeZip(entries), packName(only, color));
}
