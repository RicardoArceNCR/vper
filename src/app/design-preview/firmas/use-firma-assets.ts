"use client";

import { useEffect, useMemo, useState } from "react";
import { FIRMA_DEFAULT, FIRMA_IMAGES, PROPOSALS } from "./proposals";
import { makeZip } from "./zip";

/**
 * Estado compartido del kit de imágenes: lo usan el módulo de descarga (arriba)
 * y la lista de archivos (abajo), así una verificación se ve en los dos.
 */

export const FIRMA_FILES = Object.values(FIRMA_IMAGES).map((path) => ({
  path,
  name: path.split("/").pop() ?? path,
}));

export type LiveState = "idle" | "checking" | "ok" | "missing";
export type FileMeta = { bytes: number; w: number; h: number };

/** Qué propuestas usan cada imagen: se deduce del HTML, no se mantiene a mano. */
function usage(path: string): string[] {
  return PROPOSALS.filter((p) => {
    try {
      return p.render(FIRMA_DEFAULT, "https://vpermedia.com").includes(path);
    } catch {
      return false;
    }
  }).map((p) => p.name);
}

export function useFirmaAssets(copyBase: string) {
  const used = useMemo(
    () => Object.fromEntries(FIRMA_FILES.map((f) => [f.path, usage(f.path)])),
    [],
  );
  const [meta, setMeta] = useState<Record<string, FileMeta>>({});
  const [live, setLive] = useState<Record<string, LiveState>>({});
  const [zipping, setZipping] = useState<"" | "busy" | "done" | "error">("");

  // Peso y medidas reales de cada archivo, leídos del propio sitio.
  useEffect(() => {
    let alive = true;
    Promise.all(
      FIRMA_FILES.map(async (f) => {
        const blob = await fetch(f.path).then((r) => r.blob());
        const bmp = await createImageBitmap(blob);
        const out = [f.path, { bytes: blob.size, w: bmp.width, h: bmp.height }] as const;
        bmp.close();
        return out;
      }),
    )
      .then((rows) => alive && setMeta(Object.fromEntries(rows)))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const base = copyBase.replace(/\/+$/, "");

  // Un <img> puede leer otro dominio sin CORS: si carga, el archivo está publicado.
  const check = () => {
    if (!base) return;
    for (const f of FIRMA_FILES) {
      setLive((s) => ({ ...s, [f.path]: "checking" }));
      const img = new Image();
      img.onload = () => setLive((s) => ({ ...s, [f.path]: "ok" }));
      img.onerror = () => setLive((s) => ({ ...s, [f.path]: "missing" }));
      img.src = `${base}${f.path}?v=${Date.now()}`;
    }
  };

  const download = async () => {
    setZipping("busy");
    try {
      const entries = await Promise.all(
        FIRMA_FILES.map(async (f) => {
          const res = await fetch(f.path);
          if (!res.ok) throw new Error(`${f.path}: ${res.status}`);
          const buf: ArrayBuffer = await res.arrayBuffer();
          return { name: `images/firma/${f.name}`, data: new Uint8Array(buf) };
        }),
      );
      const readme = [
        "Imágenes de las firmas de correo de VPER Media",
        "",
        `Publicar la carpeta images/firma/ en la raíz del sitio, de modo que cada archivo`,
        `quede en ${base || "https://vpermedia.com"}/images/firma/<nombre>.`,
        "",
        "- No cambiar los nombres ni la carpeta: las firmas ya instaladas apuntan a esas URLs.",
        "- No recomprimir ni redimensionar: están a 2x para pantallas retina.",
        "- Tienen que ser públicas (sin login, sin protección de preview) y por https.",
        "- Si se reemplaza una imagen, usar un nombre nuevo: Gmail guarda copia de la anterior.",
        "",
        "Archivos:",
        ...FIRMA_FILES.map((f) => `  ${f.path}`),
        "",
      ].join("\n");
      const blob = makeZip([
        ...entries,
        { name: "LEEME.txt", data: new TextEncoder().encode(readme) },
      ]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vper-firmas-imagenes.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setZipping("done");
    } catch {
      setZipping("error");
    }
  };

  const total = Object.values(meta).reduce((n, m) => n + m.bytes, 0);
  const states = FIRMA_FILES.map((f) => live[f.path] ?? "idle");
  const ok = states.filter((s) => s === "ok").length;
  const missing = states.filter((s) => s === "missing").length;
  const checking = states.some((s) => s === "checking");
  const checked = ok + missing === FIRMA_FILES.length;

  return {
    files: FIRMA_FILES,
    used,
    meta,
    live,
    base,
    total,
    zipping,
    ok,
    missing,
    checking,
    checked,
    download,
    check,
  };
}

export type FirmaAssets = ReturnType<typeof useFirmaAssets>;
