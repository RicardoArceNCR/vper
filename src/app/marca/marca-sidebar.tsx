"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LogOut } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { cn } from "@ui/lib/utils";
import { Logo } from "./logo/marks";
import { MARCA_GROUPS, MARCA_HOME, MARCA_OUT, isActive, type NavItem } from "./lib/nav";
import { salir } from "./lib/auth-actions";
import { MARCA, hasOwner } from "./lib/config";
import { aOwner } from "./lib/owner-copy";
import { focusSection, useToc, type Toc } from "./lib/use-toc";

/**
 * Sidebar de escritorio (lg+). Tres cosas a la vez:
 * 1. Dónde estoy: las tres capas del portal, con la página activa marcada.
 * 2. Qué hay en esta página: el índice de la página activa, armado desde sus
 *    <section id> de primer nivel, con la sección visible resaltada al scrollear.
 * 3. Salidas: sitio, tema y cerrar sesión; versión y a quién escribir.
 *
 * El índice no se mantiene a mano: lee el DOM. Una sección nueva con id y h2
 * aparece sola; `data-toc` pisa el texto cuando el h2 es largo o no existe.
 */

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)]";

/** Movimiento del hover: tokens del DS (150ms, ease-enter). Sin él con reduce motion. */
const motion =
  "duration-[var(--motion-duration-normal)] ease-enter motion-reduce:transition-none";

/** Hover y foco de teclado se ven igual: el foco suma el anillo. */
const lift =
  "hover:bg-[var(--background-subtle)] hover:text-[var(--text-primary)] focus-visible:bg-[var(--background-subtle)] focus-visible:text-[var(--text-primary)]";

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
  const list = useRef<HTMLOListElement>(null);
  // El índice tiene scroll propio: la sección que se lee no se esconde abajo.
  useEffect(() => {
    const ol = list.current;
    const on = ol?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!ol || !on) return;
    const top = on.offsetTop - ol.offsetTop;
    if (top < ol.scrollTop) ol.scrollTop = top;
    else if (top + on.offsetHeight > ol.scrollTop + ol.clientHeight)
      ol.scrollTop = top + on.offsetHeight - ol.clientHeight;
  }, [current]);
  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-1.5 font-sans text-body-sm font-bold transition-[background-color,color]",
          motion,
          focus,
          active
            ? "bg-[var(--brand-subtle)] text-[var(--text-primary)]"
            : cn("text-[var(--text-secondary)]", lift),
        )}
      >
        {/* Barra: activa, amber de marca a todo el alto (decoración, no texto: vale
            en claro). En hover/foco, un riel neutro que crece desde el centro hasta
            la mitad — se ve, pero no compite con la página activa. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-1.5 left-0 w-[3px] rounded-full transition-[scale]",
            motion,
            active
              ? "bg-[var(--brand-action)]"
              : "scale-y-0 bg-[var(--text-tertiary)] group-hover:scale-y-50 group-focus-visible:scale-y-50",
          )}
        />
        <Icon
          aria-hidden
          className={cn(
            "size-4 shrink-0 transition-[color,translate]",
            motion,
            active
              ? "translate-x-0.5 text-[var(--text-primary)]"
              : "text-[var(--text-tertiary)] group-hover:translate-x-0.5 group-hover:text-[var(--text-primary)] group-focus-visible:translate-x-0.5 group-focus-visible:text-[var(--text-primary)] motion-reduce:translate-x-0",
          )}
        />
        <span
          className={cn(
            "min-w-0 truncate transition-[translate]",
            motion,
            active
              ? "translate-x-0.5"
              : "group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:translate-x-0",
          )}
        >
          {item.label}
        </span>
      </Link>

      {active && toc.length > 0 ? (
        // Scroll propio, con el alto que deja libre el resto del sidebar (~43rem:
        // marca, 10 ítems, grupos y pie), entre 5 y 14rem. Con las 12 secciones de
        // Sistema, un índice entero empujaba fuera de pantalla el resto del menú
        // (1440×900 y 768 de alto). Si el menú crece mucho, el nav scrollea igual.
        <ol
          ref={list}
          aria-label={`En ${item.label}`}
          className="relative mb-2 ml-[1.15rem] mt-1 grid max-h-[clamp(5rem,calc(100dvh-43rem),14rem)] overflow-y-auto overscroll-contain border-l border-border"
        >
          {toc.map((t) => {
            const on = t.id === current;
            return (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  // El ancla nativa hace el scroll; después, el foco a la sección.
                  onClick={() => requestAnimationFrame(() => focusSection(t.id))}
                  aria-current={on ? "location" : undefined}
                  className={cn(
                    "-ml-px block border-l py-1 pl-4 pr-2 font-sans text-body-xs transition-[border-color,color]",
                    motion,
                    focus,
                    on
                      ? "border-[var(--text-primary)] font-bold text-[var(--text-primary)]"
                      : "border-transparent text-[var(--text-secondary)] hover:border-[var(--text-tertiary)] hover:text-[var(--text-primary)] focus-visible:border-[var(--text-tertiary)] focus-visible:text-[var(--text-primary)]",
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

/** `protegido`: hay que mostrar "Salir" (todo menos el modo local abierto). */
export default function MarcaSidebar({ protegido }: { protegido: boolean }) {
  const pathname = usePathname();
  const { toc, current } = useToc(pathname);

  return (
    <aside
      aria-label={MARCA.name}
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
        className={cn("grid gap-2 px-6 pb-4 pt-5 text-[var(--text-primary)]", focus)}
      >
        <Logo k="h2" className="h-auto w-36" />
        <span className="flex items-center gap-2 font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          {MARCA.name}
          <span className="rounded-[var(--pill-radius)] border border-border px-1.5 py-px">
            Equipo
          </span>
        </span>
      </Link>

      <nav aria-label={`Secciones de ${MARCA.name}`} className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <ul className="grid gap-0.5">
          <Item
            item={MARCA_HOME}
            active={isActive(pathname, MARCA_HOME.href)}
            toc={toc}
            current={current}
          />
        </ul>
        {MARCA_GROUPS.map((g) => (
          <div key={g.label} className="mt-4">
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

      <div className="grid shrink-0 gap-2 border-t border-border px-3 py-3">
        {/* Sitio, tema y Salir en una fila: el alto se lo queda el menú. */}
        <div className="flex items-center gap-1">
          {MARCA_OUT.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "group flex min-w-0 flex-1 items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-1.5 font-sans text-body-sm font-bold text-[var(--text-secondary)] transition-[background-color,color]",
                lift,
                motion,
                focus,
              )}
            >
              {l.label}
              <ArrowUpRight
                aria-hidden
                className={cn(
                  "size-4 transition-[translate]",
                  motion,
                  "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 motion-reduce:translate-none",
                )}
              />
            </Link>
          ))}
          <ThemeToggle />
          {protegido ? (
            <form action={salir}>
              <button
                type="submit"
                className={cn(
                  "flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-1.5 font-sans text-body-sm font-bold text-[var(--text-secondary)] transition-[background-color,color]",
                  lift,
                  motion,
                  focus,
                )}
              >
                Salir
                <LogOut aria-hidden className="size-4" />
              </button>
            </form>
          ) : null}
        </div>
        <p className="px-3 font-sans text-body-xs text-[var(--text-secondary)]">
          v{MARCA.version} · {MARCA.updated}
          <br />
          {hasOwner() ? (
            <>
              Dueño: {MARCA.owner.name} ·{" "}
              <a
                href={`mailto:${MARCA.owner.email}`}
                className={cn("underline underline-offset-2", focus)}
              >
                {MARCA.owner.email}
              </a>
            </>
          ) : (
            <>¿Algo mal? Escribile {aOwner()}.</>
          )}
        </p>
      </div>
    </aside>
  );
}
