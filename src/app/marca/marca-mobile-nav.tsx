"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { cn } from "@ui/lib/utils";
import { Logo } from "./logo/marks";
import { MARCA_GROUPS, MARCA_HOME, MARCA_OUT, isActive, type NavItem } from "./lib/nav";
import { useToc } from "./lib/use-toc";

/**
 * Navegación de Marca VPER bajo lg (celular y tablet). Es el sidebar plegado:
 * - Fila 1: marca (vuelve al inicio), tema y menú. El menú abre las tres capas
 *   completas, con la misma estructura que el sidebar.
 * - Fila 2: "En esta página", con la sección que se está leyendo. Las láminas
 *   miden 15–20 pantallas en un celular; sin índice, navegar es scrollear.
 * Un panel a la vez. Se cierran al navegar, con Escape o tocando afuera.
 */

type Panel = "menu" | "toc" | null;

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)]";

function MenuLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors",
        focus,
        active ? "bg-[var(--background-subtle)]" : "hover:bg-[var(--background-subtle)]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-2 left-0 w-[3px] rounded-full bg-[var(--brand-action)]",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon aria-hidden className="size-4 shrink-0 text-[var(--text-tertiary)]" />
      <span className="grid min-w-0">
        <span className="font-sans text-body-sm font-bold text-[var(--text-primary)]">
          {item.label}
        </span>
        <span className="truncate font-sans text-body-xs text-[var(--text-secondary)]">
          {item.hint}
        </span>
      </span>
    </Link>
  );
}

export default function MarcaMobileNav() {
  const pathname = usePathname();
  const { toc, current } = useToc(pathname);
  const [panel, setPanel] = useState<Panel>(null);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const tocId = useId();
  const currentLabel = toc.find((t) => t.id === current)?.label ?? toc[0]?.label ?? "";

  useEffect(() => setPanel(null), [pathname]);
  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setPanel(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [panel]);

  const toggle = (p: Exclude<Panel, null>) => setPanel((cur) => (cur === p ? null : p));

  return (
    <div ref={root} className="relative">
      <div className="wrap flex h-14 items-center justify-between gap-3">
        <Link
          href={MARCA_HOME.href}
          className={cn("flex items-center gap-2.5 text-[var(--text-primary)]", focus)}
        >
          <Logo k="h2" className="h-auto w-24" />
          <span className="border-l border-border pl-2.5 font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            Marca
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={panel === "menu"}
            aria-controls={menuId}
            onClick={() => toggle("menu")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-2 font-sans text-label-sm font-bold uppercase text-[var(--text-primary)] transition-colors hover:bg-[var(--background-subtle)]",
              focus,
            )}
          >
            {panel === "menu" ? (
              <X aria-hidden className="size-4" />
            ) : (
              <Menu aria-hidden className="size-4" />
            )}
            Menú
          </button>
        </div>
      </div>

      {toc.length > 0 ? (
        <button
          type="button"
          aria-expanded={panel === "toc"}
          aria-controls={tocId}
          onClick={() => toggle("toc")}
          className={cn(
            "wrap flex w-full items-center gap-2 border-t border-border py-2 text-left",
            focus,
          )}
        >
          <span className="shrink-0 font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            En esta página
          </span>
          <span className="min-w-0 flex-1 truncate font-sans text-body-sm font-bold text-[var(--text-primary)]">
            {currentLabel}
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-4 shrink-0 transition-transform",
              panel === "toc" && "rotate-180",
            )}
          />
        </button>
      ) : null}

      {/* Menú: las tres capas, igual que el sidebar. */}
      <div
        id={menuId}
        hidden={panel !== "menu"}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-6rem)] overflow-y-auto border-b border-border bg-background shadow-[var(--shadow-lg)]"
      >
        <nav aria-label="Marca VPER" className="wrap grid gap-4 py-4">
          <MenuLink item={MARCA_HOME} active={isActive(pathname, MARCA_HOME.href)} />
          {MARCA_GROUPS.map((g) => (
            <div key={g.label} className="grid gap-1">
              <p className="px-3 font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-eyebrow)]">
                {g.label}
              </p>
              {g.items.map((it) => (
                <MenuLink key={it.href} item={it} active={isActive(pathname, it.href)} />
              ))}
            </div>
          ))}
          <div className="grid gap-1 border-t border-border pt-3">
            {MARCA_OUT.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2 font-sans text-body-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--background-subtle)] hover:text-[var(--text-primary)]",
                  focus,
                )}
              >
                {l.label}
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Índice de la página. */}
      <div
        id={tocId}
        hidden={panel !== "toc"}
        className="absolute inset-x-0 top-full max-h-[60dvh] overflow-y-auto border-b border-border bg-background shadow-[var(--shadow-lg)]"
      >
        <ol className="wrap grid py-2">
          {toc.map((t) => {
            const on = t.id === current;
            return (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  onClick={(e) => {
                    // El header de mobile mide ~95 px: el scroll-margin de las
                    // secciones (80 px) dejaría el título debajo. Se calcula acá.
                    const el = document.getElementById(t.id);
                    const header = root.current?.getBoundingClientRect().bottom ?? 0;
                    if (el) {
                      e.preventDefault();
                      const y =
                        el.getBoundingClientRect().top + window.scrollY - header - 12;
                      window.scrollTo({ top: y, behavior: "smooth" });
                      history.replaceState(null, "", `#${t.id}`);
                    }
                    setPanel(null);
                  }}
                  aria-current={on ? "location" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 font-sans text-body-sm transition-colors hover:bg-[var(--background-subtle)]",
                    focus,
                    on
                      ? "font-bold text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)]",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      on ? "bg-[var(--brand-action)]" : "bg-[var(--border-strong)]",
                    )}
                  />
                  {t.label}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
