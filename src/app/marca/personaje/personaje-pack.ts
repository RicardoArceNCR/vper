import { saveBlob } from "../lib/save";
import { makeZip, type ZipEntry } from "../lib/zip";

/**
 * Kit de vpercito. A diferencia del logo (vector, se arma en el navegador),
 * el personaje es un render: los archivos ya existen en
 * /public/images/vpercito/ y acá solo se empaquetan con un LEEME.
 */

const BASE = "/images/vpercito/";

export const PACK_FILES: { file: string; to: string }[] = [
  { file: "vpercito.png", to: "PNG/vpercito.png" },
  { file: "vpercito-512.png", to: "PNG/vpercito-512.png" },
  { file: "vpercito-avatar.png", to: "PNG/vpercito-avatar.png" },
  { file: "vpercito-emoji-128.png", to: "PNG/vpercito-emoji-128.png" },
  ...[240, 480, 720].flatMap((w) => [
    { file: `vpercito-${w}.webp`, to: `WEB/vpercito-${w}.webp` },
    { file: `vpercito-${w}.avif`, to: `WEB/vpercito-${w}.avif` },
  ]),
];

const README = `vpercito, el robot de VPER

Fuente: Marca VPER, /marca/personaje. Fondo transparente salvo el avatar.

QUÉ ARCHIVO VA DÓNDE
  PNG/vpercito.png           presentaciones, Office, piezas grandes (1006 px)
  PNG/vpercito-512.png       documentos, Notion, correo
  PNG/vpercito-avatar.png    avatar cuadrado sobre negro con halo (1024 px)
  PNG/vpercito-emoji-128.png emoji de Slack / Teams
  WEB/                       sitio: AVIF primero, WebP de respaldo (240/480/720)

CUÁNDO SÍ
  404, envío de formularios, estados vacíos, cargas, bienvenida.
  Uno por pantalla, acompañando al titular.

CUÁNDO NO
  Hero, trabajos de clientes, logos de clientes, fotos del equipo,
  en lugar del logo, como burbuja de chat.

REGLAS
  Sobre fondo oscuro, con halo o rim light: el cuerpo negro se pierde.
  Mínimo 96 px de ancho (128 px en emoji).
  No recolorear, no estirar, no teñir con el degradé VPER.
  No habla: sin globos de diálogo. El copy es de VPER.

Poses nuevas: pedirlas a diseño (lista en /marca/personaje).
`;

export async function downloadPersonajePack(): Promise<void> {
  const entries: ZipEntry[] = [];
  for (const f of PACK_FILES) {
    const res = await fetch(BASE + f.file);
    if (!res.ok) throw new Error(`${f.file}: ${res.status}`);
    entries.push({ name: f.to, data: new Uint8Array(await res.arrayBuffer()) });
  }
  entries.push({ name: "LEEME.txt", data: new TextEncoder().encode(README) });
  saveBlob(makeZip(entries), "vpercito-kit.zip");
}
