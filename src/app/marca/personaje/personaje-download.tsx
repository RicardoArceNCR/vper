"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { Button } from "@ui/components/button";
import { cn } from "@ui/lib/utils";
import { Vpercito } from "@/components/vpercito";
import { downloadPersonajePack } from "./personaje-pack";

/** Módulo de descarga, mismo soporte negro que el del logo. */
export default function PersonajeDownload() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const run = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await downloadPersonajePack();
      setMsg({ ok: true, text: "Descargado: vpercito-kit.zip" });
    } catch {
      setMsg({ ok: false, text: "No se pudo armar el ZIP. Probá en Chrome o Edge." });
    } finally {
      setBusy(false);
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
      <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
        <div className="grid min-w-0 gap-5">
          <div className="@container min-w-0">
            <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
              Descargas
            </p>
            <h2
              id="descargas-title"
              className="mt-3 font-display display-title-sm font-black uppercase tracking-tight"
            >
              vpercito, <span className="title-brand-gradient">a mano.</span>
            </h2>
          </div>
          <p className="max-w-xl font-sans text-body-md font-medium text-[var(--color-neutral-300)]">
            PNG transparente para presentaciones y Office, avatar sobre negro, emoji para
            Slack y los archivos web que usa el sitio. Con un LEEME de qué va dónde.
          </p>
          <div className="grid gap-2">
            <Button
              size="lg"
              onClick={run}
              disabled={busy}
              className="w-full sm:w-fit [&_svg]:size-5"
            >
              {busy ? (
                <LoaderCircle aria-hidden className="animate-spin" />
              ) : (
                <Download aria-hidden />
              )}
              {busy ? "Armando el ZIP…" : "Descargar kit (.zip)"}
            </Button>
            <p className="font-mono text-body-xs text-[var(--color-neutral-400)]">
              4 PNG · AVIF + WebP × 3 anchos · LEEME.txt · ~1.6 MB
            </p>
            <p
              role="status"
              className={cn(
                "min-h-5 font-sans text-body-xs font-bold",
                msg?.ok === false
                  ? "text-[var(--feedback-error-text)]"
                  : "text-[var(--feedback-success-text)]",
              )}
            >
              {msg?.text ?? ""}
            </p>
          </div>
        </div>
        <Vpercito
          size={280}
          float
          sizes="(min-width: 1024px) 280px, 200px"
          className="w-[200px] lg:w-[280px]"
        />
      </div>
    </section>
  );
}
