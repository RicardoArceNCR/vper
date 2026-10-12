"use client";

import { Check, Download, LoaderCircle, SearchCheck } from "lucide-react";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { cn } from "@ui/lib/utils";
import type { FirmaAssets } from "./use-firma-assets";

/**
 * Módulo del kit: tarea del desarrollador, una sola vez, antes de que el equipo
 * instale. Va después de la instalación (la página se ordena por persona: primero
 * quien elige e instala, después quien mantiene) y en el soporte negro de la marca
 * (`dark`: se ve igual con el sitio en claro). Acá vive también la URL pública que
 * usan las firmas al copiarse. La lista detallada de archivos queda al final.
 */
export default function DownloadKit({
  kit,
  publicBase,
  onPublicBaseChange,
  baseOk,
}: {
  kit: FirmaAssets;
  publicBase: string;
  onPublicBaseChange: (value: string) => void;
  baseOk: boolean;
}) {
  const where = `${kit.base || "https://vpermedia.com"}/images/firma/`;

  const steps = [
    {
      n: "1",
      title: "Descargá el kit",
      body: `${kit.files.length} PNG y un LEEME con las reglas.`,
    },
    { n: "2", title: "Subilo al sitio", body: where },
    { n: "3", title: "Verificá", body: "Que las imágenes carguen desde la URL pública." },
  ];

  const n = kit.files.length;
  const status: { tone: "ok" | "warn" | "error"; text: string } | null =
    kit.zipping === "error"
      ? {
          tone: "error",
          text: "No se pudo armar el ZIP. Recargá la página e intentá de nuevo.",
        }
      : kit.checked
        ? kit.missing
          ? {
              tone: "error",
              text: `${kit.missing} de ${n} imágenes no están publicadas en ${kit.checkedBase}.${
                kit.unknown ? ` Otras ${kit.unknown} no se pudieron comprobar.` : ""
              }`,
            }
          : kit.unknown
            ? {
                tone: "warn",
                text: `No se pudo comprobar ${kit.unknown} de ${n}: sin conexión o el servidor no respondió. Probá de nuevo.`,
              }
            : {
                tone: "ok",
                text: `Listo: las ${n} imágenes cargan desde ${kit.checkedBase}.`,
              }
        : kit.checking
          ? { tone: "warn", text: `Verificando en ${kit.checkedBase}…` }
          : kit.zipping === "done"
            ? { tone: "ok", text: "Kit descargado: vper-firmas-imagenes.zip" }
            : null;

  return (
    <section
      id="kit"
      data-toc="Kit de imágenes"
      aria-labelledby="kit-title"
      className="scroll-mt-20 border-t border-border pt-14 md:pt-20"
    >
      <div className="dark relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-50)]">
        {/* Filete con el recorrido de los titulares: la misma huella que la firma Banda. */}
        <div
          aria-hidden
          className="h-1 w-full"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--brand-sky) 0%, var(--color-accent-600) 42%, var(--brand-action) 100%)",
          }}
        />
        <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
          <div className="grid min-w-0 gap-5">
            <div className="@container min-w-0">
              <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
                Para el desarrollador · una sola vez
              </p>
              <h2
                id="kit-title"
                className="mt-3 font-display display-title-sm font-black uppercase tracking-tight"
              >
                Kit de <span className="title-brand-gradient">imágenes.</span>
              </h2>
            </div>
            <p className="max-w-xl font-sans text-body-md font-medium text-[var(--color-neutral-300)]">
              Las firmas no llevan las imágenes adentro: cada correo las descarga del
              sitio. Hay que publicarlas antes de que el equipo instale su firma; si no,
              el destinatario ve cuadros rotos.
            </p>
            <label className="grid max-w-xl gap-1.5">
              <span className="font-sans text-label-xs font-bold uppercase text-[var(--color-neutral-400)]">
                URL pública de las imágenes
              </span>
              <Input
                type="url"
                name="url-publica"
                autoComplete="url"
                inputMode="url"
                spellCheck={false}
                value={publicBase}
                state={baseOk ? "default" : "error"}
                aria-describedby="kit-url-msg"
                onChange={(e) => onPublicBaseChange(e.target.value)}
              />
              <span
                id="kit-url-msg"
                className={cn(
                  "font-sans text-body-xs",
                  baseOk
                    ? "text-[var(--color-neutral-400)]"
                    : "text-[var(--feedback-error-text)]",
                )}
              >
                {baseOk
                  ? "Las firmas copiadas apuntan acá. Si la cambiás, verificá de nuevo."
                  : "Tiene que ser https y pública (no localhost). Mientras tanto nadie puede copiar su firma."}
              </span>
            </label>
            <ol className="grid gap-3 sm:grid-cols-3">
              {steps.map((s) => (
                <li
                  key={s.n}
                  className="grid min-w-0 content-start gap-1 rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4"
                >
                  <span className="font-display text-h3 font-black text-[var(--brand-action)]">
                    {s.n}
                  </span>
                  <b className="font-sans text-body-sm font-bold">{s.title}</b>
                  <span
                    className={cn(
                      "font-sans text-body-xs text-[var(--color-neutral-400)]",
                      s.n === "2" && "break-all font-mono",
                    )}
                  >
                    {s.body}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid min-w-0 gap-4 rounded-[var(--radius-lg)] bg-[var(--color-neutral-900)] p-5 md:p-6">
            <ul aria-hidden className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {kit.files.map((f) => (
                <li
                  key={f.path}
                  className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-neutral-800)] p-4"
                >
                  <img
                    src={f.path}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                  />
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              onClick={kit.download}
              disabled={kit.zipping === "busy"}
              className="w-full [&_svg]:size-5"
            >
              {kit.zipping === "busy" ? (
                <LoaderCircle aria-hidden className="animate-spin" />
              ) : (
                <Download aria-hidden />
              )}
              {kit.zipping === "busy" ? "Armando el ZIP…" : "Descargar kit (.zip)"}
            </Button>
            <p className="text-center font-mono text-body-xs text-[var(--color-neutral-400)]">
              {kit.files.length} PNG ·{" "}
              {kit.total ? `${Math.round(kit.total / 1024)} KB` : "…"} · LEEME.txt
            </p>
            <Button
              variant="outline"
              onClick={kit.check}
              disabled={!kit.base || kit.checking}
              className="w-full"
            >
              {kit.checked && !kit.missing && !kit.unknown ? (
                <Check aria-hidden />
              ) : (
                <SearchCheck aria-hidden />
              )}
              {kit.checking ? "Verificando…" : "Verificar publicación"}
            </Button>
            <p
              role="status"
              className={cn(
                "min-h-5 text-center font-sans text-body-xs font-bold",
                status?.tone === "ok" && "text-[var(--feedback-success-text)]",
                status?.tone === "warn" && "text-[var(--feedback-warning-text)]",
                status?.tone === "error" && "text-[var(--feedback-error-text)]",
              )}
            >
              {status?.text ?? ""}
            </p>
            <a
              href="#imagenes"
              className="text-center font-sans text-body-xs text-[var(--color-neutral-400)] underline underline-offset-4 hover:text-[var(--color-neutral-50)]"
            >
              Ver los {kit.files.length} archivos, uno por uno
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
