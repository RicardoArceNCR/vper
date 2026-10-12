import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { Button } from "@ui/components/button";
import { Vpercito } from "@/components/vpercito";
import Header from "@/sections/header";

export const metadata: Metadata = { title: "Página no encontrada — VPER Media" };

// Convención de Next (app/not-found.tsx). Copy: guía de voz
// (marca/voz/voz-content.ts, "404"). vpercito reemplaza al ícono de alerta:
// la guía pide un guiño acá, no una alarma — por eso la ceja dice "404" y no
// "Error". El titular manda y el robot acompaña (marca/personaje): display-title
// en el h1, robot a 200 px como techo. Header para que quien se perdió tenga
// salida; el footer sobra.
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-background text-foreground">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 pt-28 pb-16">
        <div className="grid w-full max-w-2xl justify-items-center gap-8 text-center">
          <Vpercito
            size={200}
            float
            eager
            sizes="(min-width: 768px) 200px, 128px"
            className="w-[128px] md:w-[200px]"
          />

          <div className="@container grid w-full min-w-0 gap-4">
            <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
              404
            </p>
            <h1 className="font-display display-title font-black uppercase tracking-tight">
              Esta página <span className="title-brand-gradient">se nos escapó.</span>
            </h1>
            <p className="mx-auto max-w-md font-sans text-body-md font-medium text-[var(--text-secondary)]">
              Las buenas ideas nunca se quedan quietas; por lo visto, esta página tampoco.
            </p>
          </div>

          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/">
                <Home aria-hidden />
                Volver al inicio
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-[var(--border-strong)]"
            >
              <Link href="/work">
                Ver proyectos
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
