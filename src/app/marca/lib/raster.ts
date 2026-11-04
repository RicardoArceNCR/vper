/**
 * Rasteriza un SVG (texto) a PNG o JPG en el navegador. Lo usan los paquetes
 * de logo, isologo y fondos.
 *
 * - El `<img>` se carga con ancho y alto explícitos y enteros: con las medidas
 *   decimales del archivo, Firefox puede dibujarlo en blanco o a 1×.
 * - `background` pinta un soporte sólido antes del dibujo (obligatorio en JPG:
 *   sin él la transparencia sale negra).
 * - `plate` hace un cuadrado del color dado con el arte al 62 % del lado
 *   (avatar / ícono).
 * - Ancho tope 3840: Safari en iOS corta el canvas cerca de 16,7 MP.
 */

export const MAX_RASTER_WIDTH = 3840;

export async function rasterize(
  svgText: string,
  [w, h]: readonly [number, number],
  width: number,
  opts: {
    type?: "image/png" | "image/jpeg";
    quality?: number;
    background?: string;
    plate?: string;
  } = {},
): Promise<Blob> {
  const { type = "image/png", quality = 0.85, background, plate } = opts;
  const out = Math.min(Math.round(width), MAX_RASTER_WIDTH);
  const url = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml" }));
  try {
    const img = new Image(out, Math.round((out * h) / w));
    img.decoding = "async";
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d no disponible");
    if (plate) {
      canvas.width = canvas.height = out;
      ctx.fillStyle = plate;
      ctx.fillRect(0, 0, out, out);
      const mw = out * 0.62;
      const mh = (mw * h) / w;
      ctx.drawImage(img, (out - mw) / 2, (out - mh) / 2, mw, mh);
    } else {
      canvas.width = out;
      canvas.height = Math.round((out * h) / w);
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    return await new Promise<Blob>((ok, fail) =>
      canvas.toBlob((b) => (b ? ok(b) : fail(new Error("toBlob"))), type, quality),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Trae un archivo de /public como texto (los SVG de diseño). */
export async function fetchText(src: string): Promise<string> {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`${src}: ${res.status}`);
  return res.text();
}
