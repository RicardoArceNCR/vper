"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FIRMA_DEFAULT, FIRMA_IMAGES, PROPOSALS } from "./proposals";
import { saveBlob } from "../lib/save";
import { makeZip } from "../lib/zip";

/**
 * Estado compartido del kit de imágenes: lo usan el módulo de descarga (arriba)
 * y la lista de archivos (abajo), así una verificación se ve en los dos.
 */

export const FIRMA_FILES = Object.values(FIRMA_IMAGES).map((path) => ({
  path,
  name: path.split("/").pop() ?? path,
}));

/**
 * "missing": el servidor respondió pero la imagen no está (404, otra cosa).
 * "unknown": no se pudo comprobar (sin red, el servidor no respondió en 8 s).
 */
export type LiveState = "idle" | "checking" | "ok" | "missing" | "unknown";

/** Tiempo máximo por imagen antes de dar la verificación por no concluyente. */
const CHECK_TIMEOUT_MS = 8000;

/**
 * Un <img> puede leer otro dominio sin CORS: si carga, el archivo está publicado.
 * Si falla, un fetch no-cors distingue "el servidor contestó" (falta el archivo)
 * de "no hubo respuesta" (red caída, DNS, timeout): ahí no se sabe.
 */
function probe(url: string): Promise<Exclude<LiveState, "idle" | "checking">> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return Promise.resolve("unknown");
  }
  return new Promise((resolve) => {
    let done = false;
    const finish = (s: Exclude<LiveState, "idle" | "checking">) => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      img.onload = img.onerror = null;
      resolve(s);
    };
    const timer = window.setTimeout(() => {
      img.src = "";
      finish("unknown");
    }, CHECK_TIMEOUT_MS);
    const img = new Image();
    img.onload = () => finish("ok");
    img.onerror = () => {
      const ctrl = new AbortController();
      const left = window.setTimeout(() => ctrl.abort(), CHECK_TIMEOUT_MS);
      fetch(url, { mode: "no-cors", cache: "no-store", signal: ctrl.signal })
        .then(() => finish("missing"))
        .catch(() => finish("unknown"))
        .finally(() => window.clearTimeout(left));
    };
    img.src = url;
  });
}
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

  // El resultado vale para una base: si la URL cambia, se descarta (y cualquier
  // verificación en curso para la base anterior deja de escribir).
  const [checkedBase, setCheckedBase] = useState("");
  const run = useRef(0);
  useEffect(() => {
    run.current += 1;
    setLive({});
    setCheckedBase("");
  }, [base]);

  const check = () => {
    if (!base) return;
    const id = ++run.current;
    const stamp = Date.now();
    setCheckedBase(base);
    setLive(Object.fromEntries(FIRMA_FILES.map((f) => [f.path, "checking" as const])));
    for (const f of FIRMA_FILES) {
      void probe(`${base}${f.path}?v=${stamp}`).then((st) => {
        if (run.current !== id) return;
        setLive((s) => ({ ...s, [f.path]: st }));
      });
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
        "- Las -v2 (oct. 2026) suman el área de respeto del logo. Dejar publicadas también",
        "  las versiones sin -v2: las firmas instaladas antes las siguen pidiendo.",
        "",
        "Archivos:",
        ...FIRMA_FILES.map((f) => `  ${f.path}`),
        "",
      ].join("\n");
      const blob = makeZip([
        ...entries,
        { name: "LEEME.txt", data: new TextEncoder().encode(readme) },
      ]);
      saveBlob(blob, "vper-firmas-imagenes.zip");
      setZipping("done");
    } catch {
      setZipping("error");
    }
  };

  const total = Object.values(meta).reduce((n, m) => n + m.bytes, 0);
  const states = FIRMA_FILES.map((f) => live[f.path] ?? "idle");
  const ok = states.filter((s) => s === "ok").length;
  const missing = states.filter((s) => s === "missing").length;
  const unknown = states.filter((s) => s === "unknown").length;
  const checking = states.some((s) => s === "checking");
  const checked =
    Boolean(checkedBase) &&
    checkedBase === base &&
    ok + missing + unknown === FIRMA_FILES.length;

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
    unknown,
    checking,
    checkedBase,
    checked,
    download,
    check,
  };
}

export type FirmaAssets = ReturnType<typeof useFirmaAssets>;
