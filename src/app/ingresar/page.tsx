import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { Logo } from "@/app/marca/logo/marks";
import { MARCA, hasOwner } from "@/app/marca/lib/config";
import { aOwner } from "@/app/marca/lib/owner-copy";
import { isConfigured, isOpenForDev, safeNext } from "@/app/marca/lib/session";
import LoginForm from "./login-form";

/**
 * Ingreso al portal de marca. Vive fuera de /marca a propósito: así no hereda
 * el sidebar ni la navegación del portal, y el middleware no tiene que
 * exceptuarla. Mecanismo en src/app/marca/lib/session.ts.
 */
export const metadata: Metadata = {
  title: `Ingresar · ${MARCA.name}`,
  robots: { index: false, follow: false },
};

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNext((await searchParams).next);
  const configured = isConfigured();
  const devOpen = isOpenForDev();
  if (!configured && !devOpen) {
    // Solo al log del servidor: a quien llega no le sirve el nombre de la variable.
    console.error(
      "[marca] /ingresar cerrado: faltan MARCA_USERS o MARCA_SESSION_SECRET en Vercel.",
    );
  }
  // "Marca VPER" → "Marca" + golpe en gradiente sobre la última palabra.
  const cut = MARCA.name.lastIndexOf(" ");
  const nameHead = MARCA.name.slice(0, cut);
  const nameTail = MARCA.name.slice(cut + 1);

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
          <div className="flex items-center gap-3 text-[var(--text-primary)]">
            <Logo k="h2" className="h-auto w-40" />
            <span className="rounded-[var(--pill-radius)] border border-border px-1.5 py-px font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Equipo
            </span>
          </div>

          <div className="@container grid min-w-0 gap-3">
            <h1 className="font-display text-display-md font-black uppercase tracking-tight">
              {nameHead} <span className="title-brand-gradient">{nameTail}.</span>
            </h1>
            <p className="font-sans text-body-md font-medium text-[var(--text-secondary)]">
              Logo, voz, imagen, personaje, firmas y sistema de VPER&nbsp;Media.
            </p>
          </div>

          {configured ? (
            <LoginForm next={next} />
          ) : devOpen ? (
            <Notice>
              En local y sin <code className="font-mono">MARCA_USERS</code>, el portal
              está abierto.{" "}
              <Link href={next} className="font-bold underline underline-offset-4">
                Entrar
              </Link>
            </Notice>
          ) : (
            <Notice>
              El acceso está cerrado por ahora. Escribí {hasOwner() ? "a " : null}
              {hasOwner() ? (
                <a
                  href={`mailto:${MARCA.owner.email}`}
                  className="font-bold underline underline-offset-4"
                >
                  {MARCA.owner.name}
                </a>
              ) : (
                aOwner()
              )}
              .
            </Notice>
          )}

          <Link
            href="/"
            className="justify-self-start font-sans text-body-sm font-bold text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--text-primary)] hover:underline"
          >
            ← Volver al sitio
          </Link>
        </div>
      </div>

      <footer className="wrap flex justify-center gap-4 py-6 font-sans text-body-sm text-[var(--text-secondary)]">
        <span>VPER&nbsp;Media · Uso&nbsp;interno</span>
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
