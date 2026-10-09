"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@ui/components/button";
import { cn } from "@ui/lib/utils";
import { FIRMA_DEFAULT, FIRMA_IMAGES, PROPOSALS } from "./proposals";
import { makeZip } from "./zip";

/**
 * Entrega para el desarrollador: las imágenes de las firmas en un ZIP, con la
 * ruta exacta donde publicarlas, y un chequeo de que ya cargan desde la URL
 * pública. Sin esas imágenes publicadas, cualquier firma instalada llega rota.
 */

const FILES = Object.values(FIRMA_IMAGES).map((path) => ({
  path,
  name: path.split("/").pop() ?? path,
}));

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

type Live = "idle" | "checking" | "ok" | "missing";

export default function AssetsPanel({ copyBase }: { copyBase: string }) {
  const used = useMemo(
    () => Object.fromEntries(FILES.map((f) => [f.path, usage(f.path)])),
    [],
  );
  const [meta, setMeta] = useState<
    Record<string, { bytes: number; w: number; h: number }>
  >({});
  const [live, setLive] = useState<Record<string, Live>>({});
  const [zipping, setZipping] = useState<"" | "busy" | "error">("");

  // Peso y medidas reales de cada archivo, leídos del propio sitio.
  useEffect(() => {
    let alive = true;
    Promise.all(
      FILES.map(async (f) => {
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
    for (const f of FILES) {
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
        FILES.map(async (f) => {
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
        ...FILES.map((f) => `  ${f.path}`),
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
      setZipping("");
    } catch {
      setZipping("error");
    }
  };

  const total = Object.values(meta).reduce((n, m) => n + m.bytes, 0);
  const checked = Object.values(live).filter((v) => v === "ok" || v === "missing");
  const missing = Object.values(live).filter((v) => v === "missing").length;

  return (
    <section
      id="imagenes"
      aria-labelledby="imagenes-title"
      className="grid scroll-mt-20 gap-6 rounded-[var(--radius-xl)] border border-border p-5 md:p-8"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="grid max-w-2xl gap-2">
          <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
            Para el desarrollador
          </p>
          <h2 id="imagenes-title" className="font-display text-h3 font-black uppercase">
            Imágenes para publicar
          </h2>
          <p className="font-sans text-body-sm text-[var(--text-secondary)]">
            Las firmas no llevan las imágenes adentro: el correo las descarga de{" "}
            <code className="font-mono text-body-xs break-all">
              {base || "https://vpermedia.com"}/images/firma/
            </code>
            . Hay que subir estos {FILES.length} archivos ahí, con el mismo nombre, antes
            de instalar cualquier firma.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={download} disabled={zipping === "busy"}>
            {zipping === "busy" ? "Armando ZIP…" : "Descargar imágenes (.zip)"}
          </Button>
          <Button variant="outline" onClick={check} disabled={!base}>
            Verificar publicación
          </Button>
        </div>
      </div>

      <p role="status" className="font-sans text-body-xs text-[var(--text-secondary)]">
        {zipping === "error"
          ? "No se pudo armar el ZIP. Recargá la página e intentá de nuevo."
          : checked.length === FILES.length
            ? missing
              ? `${missing} de ${FILES.length} imágenes todavía no están publicadas.`
              : `Las ${FILES.length} imágenes cargan desde ${base}.`
            : total
              ? `${FILES.length} PNG · ${(total / 1024).toFixed(0)} KB en total · incluye un LEEME con las instrucciones.`
              : ""}
      </p>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FILES.map((f) => {
          const m = meta[f.path];
          const st = live[f.path] ?? "idle";
          return (
            <li key={f.path} className="grid min-w-0 content-start gap-2">
              <div className="flex h-20 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-border bg-[var(--color-neutral-200)] p-2">
                <img
                  src={f.path}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <code className="truncate font-mono text-body-xs" title={f.name}>
                {f.name}
              </code>
              <span className="font-sans text-body-xs text-[var(--text-secondary)]">
                {m ? `${m.w}×${m.h} · ${(m.bytes / 1024).toFixed(1)} KB` : "…"}
                {used[f.path]?.length ? ` · ${used[f.path]?.join(", ")}` : ""}
              </span>
              {st !== "idle" ? (
                <span
                  className={cn(
                    "font-sans text-label-xs font-bold uppercase",
                    st === "ok" && "text-[var(--feedback-success-text)]",
                    st === "missing" && "text-[var(--feedback-error-text)]",
                    st === "checking" && "text-[var(--text-secondary)]",
                  )}
                >
                  {st === "ok"
                    ? "Publicada"
                    : st === "missing"
                      ? "No está"
                      : "Verificando…"}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
