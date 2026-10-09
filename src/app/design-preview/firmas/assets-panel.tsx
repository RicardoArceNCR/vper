"use client";

import { Button } from "@ui/components/button";
import { cn } from "@ui/lib/utils";
import type { FirmaAssets } from "./use-firma-assets";

/**
 * Lista detallada del kit: cada PNG con su medida, su peso, qué firmas lo usan
 * y si ya carga desde la URL pública. La descarga destacada vive en
 * ./download-kit.tsx, arriba de la página; acá queda una copia discreta.
 */
export default function AssetsPanel({ kit }: { kit: FirmaAssets }) {
  const { files, meta, live, used, base } = kit;
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
            . Hay que subir estos {files.length} archivos ahí, con el mismo nombre, antes
            de instalar cualquier firma.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={kit.download}
            disabled={kit.zipping === "busy"}
          >
            Descargar kit (.zip)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={kit.check}
            disabled={!base || kit.checking}
          >
            Verificar publicación
          </Button>
        </div>
      </div>

      <p className="font-sans text-body-xs text-[var(--text-secondary)]">
        {kit.checked
          ? kit.missing
            ? `${kit.missing} de ${files.length} imágenes todavía no están publicadas.`
            : `Las ${files.length} imágenes cargan desde ${base}.`
          : kit.total
            ? `${files.length} PNG · ${(kit.total / 1024).toFixed(0)} KB en total.`
            : ""}
      </p>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {files.map((f) => {
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
