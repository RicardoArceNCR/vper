import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { Logo } from "@/app/marca/logo/marks";
import { isOpenForDev, marcaPassword, safeNext } from "@/app/marca/lib/session";
import LoginForm from "./login-form";

/**
 * Ingreso al portal de marca. Vive fuera de /marca a propósito: así no hereda
 * el sidebar ni la navegación del portal, y el middleware no tiene que
 * exceptuarla. Mecanismo en src/app/marca/lib/session.ts.
 */
export const metadata: Metadata = {
  title: "Ingresar · Marca VPER",
  robots: { index: false, follow: false },
};

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNext((await searchParams).next);
  const configured = Boolean(marcaPassword());
  const devOpen = isOpenForDev();

  return (
    <main className="relative grid min-h-dvh grid-rows-[auto_1fr_auto] bg-background text-foreground">
      <div
        aria-hidden
        className="h-1"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--brand-sky) 0%, var(--color-accent-600) 42%, var(--brand-action) 100%)",
        }}
      />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="wrap grid place-items-center py-16">
        <div className="@container grid w-full min-w-0 max-w-sm gap-8">
          <div className="grid gap-3 text-[var(--text-primary)]">
            <Logo k="h2" className="h-auto w-40" />
            <span className="flex items-center gap-2 font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Marca
              <span className="rounded-[var(--pill-radius)] border border-border px-1.5 py-px">
                Uso interno
              </span>
            </span>
          </div>

          <div className="grid gap-3">
            <h1 className="font-display display-title-sm font-black uppercase tracking-tight">
              Portal de <span className="title-brand-gradient">marca.</span>
            </h1>
            <p className="font-sans text-body-md font-medium text-[var(--text-secondary)]">
              Logo, sistema, voz, imagen y firmas de VPER Media. Si no tenés la
              contraseña, pedísela a quien te pasó el enlace.
            </p>
          </div>

          {configured ? (
            <LoginForm next={next} />
          ) : devOpen ? (
            <Notice>
              En local y sin <code className="font-mono">MARCA_PASSWORD</code>, el portal
              está abierto.{" "}
              <Link href={next} className="font-bold underline underline-offset-4">
                Entrar
              </Link>
            </Notice>
          ) : (
            <Notice>
              El portal está cerrado: falta configurar{" "}
              <code className="font-mono">MARCA_PASSWORD</code> en Vercel.
            </Notice>
          )}
        </div>
      </div>

      <footer className="wrap flex justify-between gap-4 py-6 font-sans text-body-sm text-[var(--text-secondary)]">
        <Link href="/" className="underline-offset-4 hover:underline">
          ← vpermedia.com
        </Link>
        <span>VPER Media · Uso interno</span>
      </footer>
    </main>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-[var(--radius-lg)] border border-border bg-[var(--background-subtle)] p-4 font-sans text-body-sm">
      {children}
    </p>
  );
}
