"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { Button } from "@ui/components/button";
import { cn } from "@ui/lib/utils";
import { Logo } from "./marks";
import type { MarkKey } from "./marks-data";
import { LOGO_FILES, downloadLogoPack } from "./logo-pack";

/**
 * Módulo de descarga del logo. Es lo primero que se busca en un portal de marca,
 * así que va arriba de la lámina, en el soporte negro (`dark`: igual en claro).
 */

const KEYS = Object.keys(LOGO_FILES) as MarkKey[];

type State = { busy: MarkKey | "all" | null; error: boolean; done: string };

export default function LogoDownload() {
  const [st, setSt] = useState<State>({ busy: null, error: false, done: "" });

  const run = async (only?: MarkKey) => {
    setSt({ busy: only ?? "all", error: false, done: "" });
    try {
      await downloadLogoPack(only);
      setSt({
        busy: null,
        error: false,
        done: only ? `vper-logo-${LOGO_FILES[only].slug}.zip` : "vper-logo.zip",
      });
    } catch {
      setSt({ busy: null, error: true, done: "" });
    }
  };

  return (
    <section
      id="descargas"
      data-toc="Descargas"
      aria-labelledby="descargas-title"
      className="dark relative scroll-mt-20 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-50)]"
    >
      <div
        aria-hidden
        className="h-1 w-full"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--brand-sky) 0%, var(--color-accent-600) 42%, var(--brand-action) 100%)",
        }}
      />
      <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
        <div className="grid min-w-0 gap-5">
          <div className="@container min-w-0">
            <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
              Descargas
            </p>
            <h2
              id="descargas-title"
              className="mt-3 font-display display-title-sm font-black uppercase tracking-tight"
            >
              El logo, <span className="title-brand-gradient">listo.</span>
            </h2>
          </div>
          <p className="max-w-xl font-sans text-body-md font-medium text-[var(--color-neutral-300)]">
            Las cuatro versiones en negro, blanco y amber. SVG para web e imprenta, PNG
            transparente para Office y redes, el monograma sobre placa amber para
            avatares, y un LEEME con qué versión va dónde.
          </p>
          <div className="grid gap-2">
            <Button
              size="lg"
              onClick={() => run()}
              disabled={st.busy !== null}
              className="w-full sm:w-fit [&_svg]:size-5"
            >
              {st.busy === "all" ? (
                <LoaderCircle aria-hidden className="animate-spin" />
              ) : (
                <Download aria-hidden />
              )}
              {st.busy === "all" ? "Armando el ZIP…" : "Descargar todo (.zip)"}
            </Button>
            <p className="font-mono text-body-xs text-[var(--color-neutral-400)]">
              4 versiones × 3 tintas · SVG + PNG · LEEME.txt
            </p>
            <p
              role="status"
              className={cn(
                "min-h-5 font-sans text-body-xs font-bold",
                st.error
                  ? "text-[var(--feedback-error-text)]"
                  : "text-[var(--feedback-success-text)]",
              )}
            >
              {st.error
                ? "No se pudo armar el ZIP. Probá en Chrome o Edge."
                : st.done
                  ? `Descargado: ${st.done}`
                  : ""}
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3">
          {KEYS.map((k) => (
            <li
              key={k}
              className="grid min-w-0 content-between gap-3 rounded-[var(--radius-lg)] bg-[var(--color-neutral-900)] p-4"
            >
              <div className="grid h-20 place-items-center">
                <Logo
                  k={k}
                  decorative
                  style={{
                    width: k === "h2" ? "92%" : k === "h1" ? "74%" : "auto",
                    height: k === "v" || k === "iso" ? "100%" : "auto",
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <b className="truncate font-sans text-body-sm font-bold">
                  {LOGO_FILES[k].name}
                </b>
                <button
                  type="button"
                  onClick={() => run(k)}
                  disabled={st.busy !== null}
                  aria-label={`Descargar solo ${LOGO_FILES[k].name}`}
                  className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-sm)] px-1.5 py-1 font-sans text-label-xs font-bold uppercase text-[var(--color-neutral-300)] transition-colors hover:bg-[var(--color-neutral-800)] hover:text-[var(--color-neutral-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] disabled:opacity-50"
                >
                  {st.busy === k ? (
                    <LoaderCircle aria-hidden className="size-3.5 animate-spin" />
                  ) : (
                    <Download aria-hidden className="size-3.5" />
                  )}
                  .zip
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
