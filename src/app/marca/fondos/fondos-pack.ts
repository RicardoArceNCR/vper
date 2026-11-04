import { fetchText, rasterize } from "../lib/raster";
import { saveBlob } from "../lib/save";
import { makeZip, type ZipEntry } from "../lib/zip";
import { FONDOS } from "./fondos-data";

/**
 * Kit de fondos: el SVG de diseño tal cual, PNG transparente a 1920 y 3840
 * (tope de canvas en iOS) y JPG a 1920 sobre su soporte sólido para Office y
 * redes (sin soporte, la transparencia sale negra igual, pero sin decidirlo).
 */

const README = `Fondos VPER Media

Fuente: Marca VPER, /marca/fondos. Composiciones de caseteras sobre
transparente. No se repiten en mosaico: se recortan.

ARCHIVOS
  SVG/  vector, para diseño e imprenta
  PNG/  transparente, 1920 y 3840 px de ancho
  JPG/  1920 px sobre negro, para PowerPoint, Keynote, Canva y redes

CUÁL VA DÓNDE
  color   piezas expresivas: portadas de redes, fondos de presentación,
          merch, pantallas de evento
  blanco  piezas sobrias o a una tinta, fondos detrás de texto

REGLAS
  Son textura, no logo: no reemplazan al isologo ni al logotipo.
  Encima no va otro logo ni texto largo sin una placa sólida de por medio.
  Se pueden recortar y escalar; no se recolorean ni se deforman.

El logo está en /marca/logo.
`;

export async function downloadFondosPack(): Promise<void> {
  const enc = new TextEncoder();
  const entries: ZipEntry[] = [];
  const bytes = async (b: Blob) => new Uint8Array(await b.arrayBuffer());
  for (const f of FONDOS) {
    const base = `vper-fondo-caseteras-${f.key}`;
    const svg = await fetchText(f.src);
    entries.push({ name: `SVG/${base}.svg`, data: enc.encode(svg) });
    for (const w of [1920, 3840]) {
      entries.push({
        name: `PNG/${base}-${w}.png`,
        data: await bytes(await rasterize(svg, f.size, w)),
      });
    }
    const jpg = await rasterize(svg, f.size, 1920, {
      type: "image/jpeg",
      background: f.plate.hex,
    });
    entries.push({ name: `JPG/${base}-1920.jpg`, data: await bytes(jpg) });
  }
  entries.push({ name: "LEEME.txt", data: enc.encode(README) });
  saveBlob(makeZip(entries), "vper-fondos.zip");
}
