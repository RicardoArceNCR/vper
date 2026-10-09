"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { cn } from "@ui/lib/utils";

/**
 * Navegación de Marca VPER, en las tres capas de un portal de marca: Sistema
 * (design system), Logo (lineamientos) y Recursos (lo que se baja o se instala:
 * firmas hoy; plantillas, fondos o kits después). Recursos es un menú para que la
 * barra no crezca con cada pieza nueva.
 */

const MAIN = [
  { href: "/marca/sistema", label: "Sistema" },
  { href: "/marca/logo", label: "Logo" },
] as const;

const RESOURCES = [
  {
    href: "/marca/firmas",
    label: "Firmas de correo",
    hint: "Ocho propuestas, listas para Gmail y Outlook",
  },
] as const;

const OUT = [
  { href: "/marca", label: "Inicio de Marca" },
  { href: "/lab/proceso", label: "Lab 3D" },
  { href: "/", label: "Sitio" },
] as const;

const item =
  "relative font-sans text-body-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)] rounded-[var(--radius-xs)]";
const idle = "text-[var(--nav-item-default)] hover:text-[var(--nav-item-hover)]";
// Mismo criterio que el nav del sitio: activo = texto primario + subrayado, no
// amber (amber sobre blanco no pasa contraste).
const active =
  "text-[var(--text-primary)] after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:bg-[var(--text-primary)]";

export default function MarcaNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const inResources = RESOURCES.some((r) => pathname.startsWith(r.href));

  // Se cierra al navegar, con Escape (y el foco vuelve al botón) y con un clic afuera.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <nav aria-label="Marca" className="flex min-w-0 items-center gap-4 md:gap-6">
      {MAIN.map((l) => {
        const on = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={on ? "page" : undefined}
            className={cn(item, on ? active : idle)}
          >
            {l.label}
          </Link>
        );
      })}

      <div ref={wrap} className="relative">
        <button
          ref={button}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            item,
            "inline-flex items-center gap-1",
            inResources ? active : idle,
          )}
        >
          Recursos
          <ChevronDown
            aria-hidden
            className={cn("size-3.5 transition-transform", open && "rotate-180")}
          />
        </button>
        <ul
          id={menuId}
          hidden={!open}
          className="absolute right-0 top-[calc(100%+0.75rem)] z-40 grid w-72 gap-1 max-sm:fixed max-sm:inset-x-4 max-sm:top-14 max-sm:w-auto rounded-[var(--radius-lg)] border border-border bg-[var(--surface-raised)] p-2 shadow-[var(--shadow-lg)] md:left-1/2 md:right-auto md:-translate-x-1/2"
        >
          {RESOURCES.map((r) => {
            const on = pathname.startsWith(r.href);
            return (
              <li key={r.href}>
                <Link
                  href={r.href}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "grid gap-0.5 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)]",
                    on && "bg-[var(--background-subtle)]",
                  )}
                >
                  <span className="font-sans text-body-sm font-bold text-[var(--text-primary)]">
                    {r.label}
                  </span>
                  <span className="font-sans text-body-xs text-[var(--text-secondary)]">
                    {r.hint}
                  </span>
                </Link>
              </li>
            );
          })}
          {/* En mobile, Lab 3D y Sitio no entran en la barra: viven acá. */}
          <li aria-hidden className="my-1 h-px bg-border sm:hidden" />
          {OUT.map((l) => (
            <li key={l.href} className="sm:hidden">
              <Link
                href={l.href}
                className="block rounded-[var(--radius-md)] px-3 py-2 font-sans text-body-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--background-subtle)] hover:text-[var(--text-primary)]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />

      {/* En escritorio el inicio de Marca es el nombre de la izquierda. */}
      {OUT.filter((l) => l.href !== "/marca").map((l) => (
        <Link key={l.href} href={l.href} className={cn(item, idle, "hidden sm:inline")}>
          {l.label}
        </Link>
      ))}
      <ThemeToggle />
    </nav>
  );
}
