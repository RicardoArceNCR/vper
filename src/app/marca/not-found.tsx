import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { Button } from "@ui/components/button";
import { Vpercito } from "@/components/vpercito";
import { MARCA } from "./lib/config";

export const metadata: Metadata = { title: "Página no encontrada" };

/**
 * 404 dentro del portal: hereda el layout de /marca (sidebar, menú de mobile,
 * "Salir") y la salida principal vuelve al Inicio del portal, no al sitio.
 * vpercito acompaña como en el 404 público (marca/personaje: va en el 404).
 */
export default function MarcaNotFound() {
  return (
    <main className="wrap mx-auto grid max-w-[1217px] place-items-center pb-24 pt-16 md:pt-24">
      <div className="grid w-full max-w-2xl justify-items-center gap-8 text-center">
        <Vpercito
          size={160}
          float
          eager
          sizes="(min-width: 768px) 160px, 112px"
          className="w-[112px] md:w-[160px]"
        />
        <div className="@container grid w-full min-w-0 gap-4">
          <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
            404 · {MARCA.name}
          </p>
          <h1 className="font-display display-title font-black uppercase tracking-tight">
            Esta página <span className="title-brand-gradient">no está.</span>
          </h1>
          <p className="mx-auto max-w-md font-sans text-body-md font-medium text-[var(--text-secondary)]">
            Puede que se haya movido o que el enlace tenga un error. El menú tiene todo
            lo que hay en {MARCA.name}.
          </p>
        </div>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/marca">
              <Home aria-hidden />
              Ir al inicio de {MARCA.name}
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-[var(--border-strong)]"
          >
            <Link href="/marca/logo">
              Ver el logo
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
