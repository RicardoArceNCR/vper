"use client";

import { useState, type ReactNode } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { Button } from "@ui/components/button";
import { cn } from "@ui/lib/utils";
import { Logo } from "./marks";
import type { MarkKey } from "./marks-data";
import Link from "next/link";
import { ISOLOGOS, type IsoKey } from "./isologo-data";
import { LOGO_FILES, downloadLogoPack, packName, type PackKey } from "./logo-pack";

/**
 * Módulo de descarga del logo (isologo + logotipos). Es lo primero que se busca en un portal de marca,
 * así que va arriba de la lámina, en el soporte negro (`dark`: igual en claro).
 */

const KEYS = Object.keys(LOGO_FILES) as MarkKey[];

/** `busy`: "all", una versión, o "isologo-<color>" para una sola casetera. */
type State = { busy: string | null; error: boolean; done: string };

export default function LogoDownload() {
  const [st, setSt] = useState<State>({ busy: null, error: false, done: "" });

  const run = async (only?: PackKey, color?: IsoKey) => {
    setSt({ busy: color ? `isologo-${color}` : (only ?? "all"), error: false, done: "" });
    try {
      await downloadLogoPack(only, color);
      setSt({ busy: null, error: false, done: packName(only, color) });
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
            El isologo en sus cuatro colores y los logotipos horizontal, vertical y en
            línea, más el favicon, en negro, blanco y amber. SVG para web e imprenta, PNG
            transparente para Office y redes, y un LEEME con qué versión va dónde.
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
            <button
              type="button"
              onClick={() => run("h1")}
              disabled={st.busy !== null}
              className="w-fit rounded-[var(--radius-xs)] text-left font-sans text-body-sm font-bold text-[var(--color-neutral-50)] underline underline-offset-4 hover:text-[var(--brand-action)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] disabled:opacity-50"
            >
              ¿No sabés cuál? Bajá el logotipo horizontal
            </button>
            <p className="font-mono text-body-xs text-[var(--color-neutral-400)]">
              Isologo × 4 colores · 4 logotipos × 3 tintas · SVG + PNG · LEEME.txt
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
            <p className="font-sans text-body-xs text-[var(--color-neutral-300)]">
              ¿Buscás los fondos de caseteras? Están en{" "}
              <Link
                href="/marca/fondos"
                className="font-bold text-[var(--color-neutral-50)] underline underline-offset-4"
              >
                Fondos
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="@container min-w-0">
          <ul className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
            <Card
              wide
              name="Isologo"
              note="4 colores · tocá uno para bajarlo solo"
              busy={st.busy}
              disabled={st.busy !== null}
              onRun={() => run("isologo")}
              k="isologo"
            >
              <div className="grid w-full grid-cols-4 gap-2">
                {ISOLOGOS.map((iso) => (
                  <button
                    key={iso.key}
                    type="button"
                    onClick={() => run("isologo", iso.key)}
                    disabled={st.busy !== null}
                    aria-label={`Descargar solo el isologo ${iso.name}`}
                    className="grid min-w-0 justify-items-center gap-1 rounded-[var(--radius-md)] p-1.5 transition-colors hover:bg-[var(--color-neutral-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] disabled:opacity-50"
                  >
                    <img
                      src={iso.src}
                      alt=""
                      className="h-14 w-auto max-w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="inline-flex items-center gap-1 font-sans text-label-xs font-bold uppercase text-[var(--color-neutral-300)]">
                      {st.busy === `isologo-${iso.key}` ? (
                        <LoaderCircle aria-hidden className="size-3 animate-spin" />
                      ) : (
                        <Download aria-hidden className="size-3" />
                      )}
                      {iso.name}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
            {KEYS.map((k) => (
              <Card
                key={k}
                name={LOGO_FILES[k].name}
                note={
                  k === "h1"
                    ? "Por defecto · negro, blanco y amber"
                    : "Negro, blanco y amber"
                }
                busy={st.busy}
                disabled={st.busy !== null}
                onRun={() => run(k)}
                k={k}
              >
                <Logo
                  k={k}
                  decorative
                  style={{
                    width: k === "h2" ? "92%" : k === "h1" ? "74%" : "auto",
                    height: k === "v" || k === "iso" ? "100%" : "auto",
                  }}
                />
              </Card>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Card({
  k,
  name,
  note,
  wide = false,
  busy,
  disabled,
  onRun,
  children,
}: {
  k: PackKey;
  name: string;
  note: string;
  wide?: boolean;
  busy: State["busy"];
  disabled: boolean;
  onRun: () => void;
  children: ReactNode;
}) {
  return (
    <li
      className={cn(
        "grid min-w-0 content-between gap-3 rounded-[var(--radius-lg)] bg-[var(--color-neutral-900)] p-4",
        wide && "@sm:col-span-2",
      )}
    >
      <div className={cn("grid place-items-center", wide ? "min-h-20" : "h-20")}>
        {children}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="grid min-w-0">
          <span className="flex min-w-0 items-center gap-2">
            <b className="truncate font-sans text-body-sm font-bold">{name}</b>
          </span>
          <span className="truncate font-sans text-body-xs text-[var(--color-neutral-400)]">
            {note}
          </span>
        </span>
        <button
          type="button"
          onClick={onRun}
          disabled={disabled}
          aria-label={`Descargar solo ${name}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-sm)] px-1.5 py-1 font-sans text-label-xs font-bold uppercase text-[var(--color-neutral-300)] transition-colors hover:bg-[var(--color-neutral-800)] hover:text-[var(--color-neutral-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] disabled:opacity-50"
        >
          {busy === k ? (
            <LoaderCircle aria-hidden className="size-3.5 animate-spin" />
          ) : (
            <Download aria-hidden className="size-3.5" />
          )}
          .zip
        </button>
      </div>
    </li>
  );
}
