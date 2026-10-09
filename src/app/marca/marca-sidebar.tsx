"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { cn } from "@ui/lib/utils";
import { Logo } from "./logo/marks";
import { MARCA_GROUPS, MARCA_HOME, MARCA_OUT, isActive, type NavItem } from "./lib/nav";
import { useToc, type Toc } from "./lib/use-toc";

/**
 * Sidebar de escritorio (lg+). Tres cosas a la vez:
 * 1. Dónde estoy: las tres capas del portal, con la página activa marcada.
 * 2. Qué hay en esta página: el índice de la página activa, armado desde sus
 *    <section id> de primer nivel, con la sección visible resaltada al scrollear.
 * 3. Salidas: tema, laboratorio y sitio.
 *
 * El índice no se mantiene a mano: lee el DOM. Una sección nueva con id y h2
 * aparece sola; `data-toc` pisa el texto cuando el h2 es largo o no existe.
 */

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)]";

function Item({
  item,
  active,
  toc,
  current,
}: {
  item: NavItem;
  active: boolean;
  toc: Toc;
  current: string;
}) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 font-sans text-body-sm font-bold transition-colors",
          focus,
          active
            ? "bg-[var(--background-subtle)] text-[var(--text-primary)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--background-subtle)] hover:text-[var(--text-primary)]",
        )}
      >
        {/* Barra de marca: amber es decoración acá, no texto, así que vale en claro. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-[var(--brand-action)] transition-opacity",
            active ? "opacity-100" : "opacity-0",
          )}
        />
        <Icon
          aria-hidden
          className={cn(
            "size-4 shrink-0",
            active ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]",
          )}
        />
        <span className="min-w-0 truncate">{item.label}</span>
      </Link>

      {active && toc.length > 0 ? (
        <ol
          aria-label={`En ${item.label}`}
          className="mb-2 ml-[1.15rem] mt-1 grid border-l border-border"
        >
          {toc.map((t) => {
            const on = t.id === current;
            return (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  aria-current={on ? "location" : undefined}
                  className={cn(
                    "-ml-px block border-l py-1 pl-4 pr-2 font-sans text-body-xs transition-colors",
                    focus,
                    on
                      ? "border-[var(--text-primary)] font-bold text-[var(--text-primary)]"
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {t.label}
                </a>
              </li>
            );
          })}
        </ol>
      ) : null}
    </li>
  );
}

export default function MarcaSidebar() {
  const pathname = usePathname();
  const { toc, current } = useToc(pathname);

  return (
    <aside
      aria-label="Marca VPER"
      className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-background lg:flex"
    >
      <div
        aria-hidden
        className="h-1 shrink-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--brand-sky) 0%, var(--color-accent-600) 42%, var(--brand-action) 100%)",
        }}
      />

      <Link
        href={MARCA_HOME.href}
        className={cn("grid gap-2 px-6 pb-5 pt-6 text-[var(--text-primary)]", focus)}
      >
        <Logo k="h2" className="h-auto w-36" />
        <span className="flex items-center gap-2 font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          Marca
          <span className="rounded-[var(--pill-radius)] border border-border px-1.5 py-px">
            Uso interno
          </span>
        </span>
      </Link>

      <nav aria-label="Marca" className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
        <ul className="grid gap-0.5">
          <Item
            item={MARCA_HOME}
            active={isActive(pathname, MARCA_HOME.href)}
            toc={toc}
            current={current}
          />
        </ul>
        {MARCA_GROUPS.map((g) => (
          <div key={g.label} className="mt-5">
            <p className="mb-1.5 px-3 font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-eyebrow)]">
              {g.label}
            </p>
            <ul className="grid gap-0.5">
              {g.items.map((it) => (
                <Item
                  key={it.href}
                  item={it}
                  active={isActive(pathname, it.href)}
                  toc={toc}
                  current={current}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="grid shrink-0 gap-1 border-t border-border px-3 py-4">
        {MARCA_OUT.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center justify-between rounded-[var(--radius-md)] px-3 py-1.5 font-sans text-body-sm font-bold text-[var(--text-secondary)] transition-colors hover:bg-[var(--background-subtle)] hover:text-[var(--text-primary)]",
              focus,
            )}
          >
            {l.label}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        ))}
        <div className="flex items-center justify-between px-3 pt-1">
          <span className="font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            Tema
          </span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
