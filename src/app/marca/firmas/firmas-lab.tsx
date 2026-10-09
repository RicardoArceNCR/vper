"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { cn } from "@ui/lib/utils";
import { parseColor, toHex, useThemeVersion } from "../live";
import {
  EMAIL_PALETTE,
  PALETTE_TOKENS,
  PALETTE_TOKEN_SCHEME,
  auditSignature,
  isPublicHttpsUrl,
  webHref,
  type PaletteKey,
} from "./email-html";
import AssetsPanel from "./assets-panel";
import DownloadKit from "./download-kit";
import { useFirmaAssets } from "./use-firma-assets";
import { FIRMA_DEFAULT, PROPOSALS, type Firma, type Proposal } from "./proposals";

/**
 * Laboratorio de firmas. Cada propuesta se renderiza como el HTML real que se
 * pega en Gmail/Outlook (no como una maqueta en React): lo que se ve es lo que se
 * copia.
 *
 * Dos URLs base para las imágenes:
 * - preview: el origen de esta página, para que las imágenes carguen ya.
 * - copia: la URL pública del sitio. El destinatario descarga los PNG de ahí, así
 *   que tienen que estar publicados en esa dirección antes de instalar la firma.
 */

const FIELDS: { key: keyof Firma; label: string; placeholder?: string }[] = [
  { key: "nombre", label: "Nombre" },
  { key: "cargo", label: "Cargo (opcional)", placeholder: "Dirección de cuentas" },
  { key: "correo", label: "Correo" },
  { key: "telefono", label: "Teléfono" },
  { key: "web", label: "Sitio" },
  { key: "sedes", label: "Sedes" },
];

const SCHEMES = ["claro", "oscuro"] as const;
type Scheme = (typeof SCHEMES)[number];

const label = "font-sans text-label-xs font-bold uppercase text-[var(--text-secondary)]";

export default function FirmasLab({
  install,
  why,
}: {
  /** Instrucciones de instalación (servidor): van después del taller. */
  install: ReactNode;
  /** Restricciones del correo (servidor): van en el control técnico. */
  why: ReactNode;
}) {
  const [data, setData] = useState<Firma>(FIRMA_DEFAULT);
  const [publicBase, setPublicBase] = useState("https://vpermedia.com");
  const [origin, setOrigin] = useState("");
  const [scheme, setScheme] = useState<Scheme>("claro");
  const radios = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => setOrigin(window.location.origin), []);

  // "vpermedia.com" a secas también vale: se normaliza a https:// antes de usarla.
  const copyBase = publicBase.trim() ? webHref(publicBase) : "";
  const baseOk = isPublicHttpsUrl(copyBase);
  const kit = useFirmaAssets(baseOk ? copyBase : "");

  // Patrón ARIA de radiogroup: una sola parada de tab y flechas para moverse.
  const onRadioKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = SCHEMES.indexOf(scheme);
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    const next = (i + step + SCHEMES.length) % SCHEMES.length;
    const value = SCHEMES[next];
    if (!value) return;
    setScheme(value);
    radios.current[next]?.focus();
  };

  return (
    <div className="grid gap-16 md:gap-24">
      <DownloadKit kit={kit} />

      {/* ── taller: datos fijos a la izquierda, propuestas a la derecha ── */}
      <section
        id="taller"
        data-toc="Taller"
        aria-labelledby="taller-title"
        className="scroll-mt-20"
      >
        <SectionHead
          over="Taller"
          id="taller-title"
          title="Elegí y copiá"
          lede="Escribí los datos una vez: las nueve firmas se actualizan juntas. La primera es la que se usa hoy, para comparar."
        />
        <div className="grid gap-10 xl:grid-cols-[19rem_minmax(0,1fr)] xl:gap-12">
          <aside
            aria-label="Datos de la firma"
            className="grid content-start gap-6 rounded-[var(--radius-xl)] border border-border bg-[var(--background-subtle)] p-5 md:p-6 xl:sticky xl:top-6 xl:max-h-[calc(100dvh-3rem)] xl:overflow-y-auto"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
              {FIELDS.map((f) => (
                <label key={f.key} className="grid gap-1.5">
                  <span className={label}>{f.label}</span>
                  <Input
                    value={data[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setData((d) => ({ ...d, [f.key]: e.target.value }))}
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2 xl:grid-cols-1">
              <label className="grid gap-1.5">
                <span className={label}>URL pública de las imágenes</span>
                <Input
                  value={publicBase}
                  state={baseOk ? "default" : "error"}
                  onChange={(e) => setPublicBase(e.target.value)}
                />
                <span
                  className={cn(
                    "font-sans text-body-xs",
                    baseOk
                      ? "text-[var(--text-secondary)]"
                      : "text-[var(--feedback-error-text)]",
                  )}
                >
                  {baseOk ? (
                    <>
                      Se usa al copiar. Las imágenes tienen que estar publicadas ahí:{" "}
                      <a
                        href="#kit"
                        className="font-bold text-[var(--interaction-link-default)] underline underline-offset-4 hover:text-[var(--interaction-link-hover)]"
                      >
                        kit
                      </a>
                      .
                    </>
                  ) : (
                    "Tiene que ser https y pública (no localhost). Copiar queda desactivado."
                  )}
                </span>
              </label>

              <div className="grid content-start gap-1.5">
                <span id="bandeja-label" className={label}>
                  Bandeja
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="bandeja-label"
                  className="inline-flex w-fit rounded-[var(--pill-radius)] border border-border p-1"
                >
                  {SCHEMES.map((s, i) => (
                    <button
                      key={s}
                      ref={(el) => {
                        radios.current[i] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={scheme === s}
                      tabIndex={scheme === s ? 0 : -1}
                      onClick={() => setScheme(s)}
                      onKeyDown={onRadioKey}
                      className={cn(
                        "rounded-[var(--pill-radius)] px-3 py-1 font-sans text-label-sm font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)]",
                        scheme === s
                          ? "bg-[var(--pill-brand-bg)] text-[var(--pill-brand-text)]"
                          : "text-[var(--text-secondary)] hover:text-foreground",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <span className="font-sans text-body-xs text-[var(--text-secondary)]">
                  Oscuro simula Gmail en iOS, el cliente que más invierte.
                </span>
              </div>
            </div>

            {/* Índice: en escritorio el panel queda fijo, así que también navega. */}
            <nav
              aria-label="Propuestas"
              className="hidden border-t border-border pt-5 xl:block"
            >
              <span className={label}>Propuestas</span>
              <ol className="mt-2 grid gap-0.5">
                {PROPOSALS.map((p, i) => (
                  <li key={p.id}>
                    <a
                      href={`#${p.id}`}
                      className="flex items-baseline gap-2 rounded-[var(--radius-sm)] px-2 py-1 font-sans text-body-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--background-base)] hover:text-foreground"
                    >
                      <span className="w-4 font-mono text-body-xs">{i}</span>
                      <span className="font-bold">{p.name}</span>
                      {p.badge && p.badge !== "Actual" ? (
                        <span className="ml-auto font-sans text-label-xs font-bold uppercase text-[var(--text-brand)]">
                          {p.badge}
                        </span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="grid min-w-0 gap-14">
            {PROPOSALS.map((p, i) => (
              <ProposalCard
                key={p.id}
                n={i}
                p={p}
                data={data}
                previewBase={origin}
                copyBase={baseOk ? copyBase : ""}
                scheme={scheme}
              />
            ))}
          </div>
        </div>
      </section>

      {install}

      {/* ── control técnico: para quien mantiene el sistema, no para quien elige ── */}
      <section
        id="control"
        data-toc="Control técnico"
        aria-labelledby="control-title"
        className="grid scroll-mt-20 gap-10 border-t border-border pt-14"
      >
        <SectionHead
          over="Control técnico"
          id="control-title"
          title="Para quien mantiene"
          lede="La firma no puede leer los tokens del sitio, así que repite sus colores en hex. Acá se verifica que no se desincronicen, se listan los archivos del kit y se explican las restricciones del correo."
        />
        {why}
        <PaletteCheck />
        <AssetsPanel kit={kit} />
      </section>
    </div>
  );
}

function SectionHead({
  over,
  id,
  title,
  lede,
}: {
  over: string;
  id: string;
  title: string;
  lede: string;
}) {
  return (
    <div className="@container mb-8 min-w-0 max-w-3xl md:mb-10">
      <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
        {over}
      </p>
      <h2
        id={id}
        className="mt-3 font-display display-title-sm font-black uppercase tracking-tight"
      >
        {title}
      </h2>
      <p className="mt-4 font-sans text-body-md font-medium text-[var(--text-secondary)]">
        {lede}
      </p>
    </div>
  );
}

/* ───────────────────────────── tarjeta ───────────────────────────── */

type CopyState = "" | "firma" | "html" | "error";

function ProposalCard({
  n,
  p,
  data,
  previewBase,
  copyBase,
  scheme,
}: {
  n: number;
  p: Proposal;
  data: Firma;
  previewBase: string;
  /** "" si la URL pública no es válida: no se puede copiar. */
  copyBase: string;
  scheme: Scheme;
}) {
  // Sin origen todavía (primer render en servidor) no se pinta: si no, las
  // imágenes saldrían a pedirse a la URL pública antes de hidratar.
  const preview = useMemo(
    () => (previewBase ? safeRender(p, data, previewBase) : ""),
    [p, data, previewBase],
  );
  const copyHtml = useMemo(
    () => (copyBase ? safeRender(p, data, copyBase) : ""),
    [p, data, copyBase],
  );
  const issues = useMemo(() => auditSignature(copyHtml), [copyHtml]);
  const imgs = (copyHtml.match(/<img\b/gi) ?? []).length;
  const [copied, setCopied] = useState<CopyState>("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (state: CopyState) => {
    setCopied(state);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(""), 2400);
  };

  const copy = async (kind: "firma" | "html") => {
    if (!copyHtml) return flash("error");
    try {
      if (kind === "html") {
        await navigator.clipboard.writeText(copyHtml);
      } else if ("ClipboardItem" in window && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([copyHtml], { type: "text/html" }),
            "text/plain": new Blob([plainText(data)], { type: "text/plain" }),
          }),
        ]);
      } else if (!copyRich(copyHtml)) {
        // Nunca caer a writeText con el HTML: Gmail mostraría las etiquetas.
        return flash("error");
      }
      flash(kind);
    } catch {
      flash("error");
    }
  };

  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  const isCurrent = p.badge === "Actual";
  const canCopy = Boolean(copyHtml) && errors.length === 0;

  return (
    <article
      id={p.id}
      className="grid scroll-mt-24 gap-6 border-t border-border pt-10 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-10 xl:grid-cols-1 xl:gap-6"
    >
      <div className="grid content-start gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid size-7 place-items-center rounded-full bg-foreground font-sans text-label-sm font-bold text-background">
            {n}
          </span>
          <h3 className="font-display text-h2 font-black uppercase">{p.name}</h3>
          {p.badge ? (
            <span
              className={cn(
                "rounded-[var(--pill-radius)] px-2.5 py-0.5 font-sans text-label-xs font-bold uppercase",
                isCurrent
                  ? "border border-border text-[var(--text-secondary)]"
                  : "bg-[var(--pill-brand-bg)] text-[var(--pill-brand-text)]",
              )}
            >
              {p.badge}
            </span>
          ) : null}
        </div>
        <p className="font-sans text-body-md font-bold">{p.idea}</p>
        <dl className="grid gap-2 font-sans text-body-sm">
          {!isCurrent ? (
            <div>
              <dt className="inline font-bold">Para quién: </dt>
              <dd className="inline text-[var(--text-secondary)]">{p.forWho}</dd>
            </div>
          ) : null}
          <div>
            <dt className="inline font-bold text-[var(--feedback-error-text)]">
              {isCurrent ? "Qué falla: " : "Riesgo: "}
            </dt>
            <dd className="inline text-[var(--text-secondary)]">{p.risk}</dd>
          </div>
        </dl>
        {!isCurrent ? (
          <>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button size="sm" disabled={!canCopy} onClick={() => copy("firma")}>
                {copied === "firma" ? "Copiada" : "Copiar firma"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!canCopy}
                onClick={() => copy("html")}
              >
                {copied === "html" ? "HTML copiado" : "Copiar HTML"}
              </Button>
            </div>
            <p className="font-mono text-body-xs text-[var(--text-secondary)]">
              {copyHtml
                ? `${copyHtml.length.toLocaleString("es")} caracteres · ${imgs} ${imgs === 1 ? "imagen" : "imágenes"} · ${
                    errors.length + warns.length === 0
                      ? "sin problemas"
                      : `${errors.length} errores, ${warns.length} avisos`
                  }`
                : "Sin URL pública válida no hay firma para copiar."}
            </p>
            <p
              role="status"
              className="font-sans text-body-xs text-[var(--feedback-error-text)]"
            >
              {copied === "error" ? (
                "No se pudo copiar la firma con formato. Probá en Chrome o Edge."
              ) : copied === "firma" ? (
                <span className="text-[var(--feedback-success-text)]">
                  Firma copiada. Pegala en el editor de firma de tu correo.
                </span>
              ) : copied === "html" ? (
                <span className="text-[var(--feedback-success-text)]">HTML copiado.</span>
              ) : (
                ""
              )}
            </p>
            {errors.length + warns.length > 0 ? (
              <ul className="grid gap-1 font-sans text-body-xs text-[var(--feedback-error-text)]">
                {[...errors, ...warns].slice(0, 4).map((i) => (
                  <li key={i.code + i.message}>{i.message}</li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}
      </div>
      <Inbox html={preview} scheme={scheme} />
    </article>
  );
}

function safeRender(p: Proposal, d: Firma, base: string): string {
  try {
    return p.render(d, base);
  } catch {
    return "";
  }
}

function plainText(d: Firma): string {
  return [d.nombre, d.cargo, "VPER Media", d.correo, d.telefono, d.web, d.sedes]
    .filter(Boolean)
    .join("\n");
}

/**
 * Copia con formato sin la API async (Safari viejo, Firefox con permisos): se
 * pinta el HTML en un nodo editable oculto, se selecciona y se copia. Devuelve
 * false si el navegador no lo permite.
 */
function copyRich(html: string): boolean {
  const host = document.createElement("div");
  host.contentEditable = "true";
  host.innerHTML = html;
  Object.assign(host.style, { position: "fixed", left: "-9999px", top: "0" });
  document.body.appendChild(host);
  const range = document.createRange();
  range.selectNodeContents(host);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  sel?.removeAllRanges();
  host.remove();
  return ok;
}

/* ─────────────────────────── bandeja simulada ─────────────────────────── */

/** Invierte la luminosidad de un hex conservando el tono (aprox. Gmail iOS). */
function invertLightness(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h =
      max === r
        ? (g - b) / d + (g < b ? 6 : 0)
        : max === g
          ? (b - r) / d + 2
          : (r - g) / d + 4;
    h /= 6;
  }
  const L = 1 - l;
  const q = L < 0.5 ? L * (1 + s) : L + s - L * s;
  const p = 2 * L - q;
  const ch = (t: number) => {
    const x = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  const out = [ch(h + 1 / 3), ch(h), ch(h - 1 / 3)];
  return `#${out
    .map((v) =>
      Math.round(v * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/**
 * Recolorea el HTML de la firma como lo haría una inversión total: cada color
 * declarado (texto, fondo, borde) cambia de luminosidad y las <img> no se tocan,
 * porque los PNG no tienen hex en el markup. Aproximación, no el algoritmo de Gmail.
 */
function darkenHtml(html: string): string {
  return html.replace(/#[0-9a-f]{6}\b/gi, (m) => invertLightness(m));
}

/**
 * Un mensaje abierto, con la firma al pie. El HTML de la firma se inyecta tal cual:
 * lo genera ./proposals con todo el texto escapado. `inert`: es una vista previa;
 * sus enlaces (mailto, tel, sitio) no entran en el orden de tabulación.
 */
function Inbox({ html, scheme }: { html: string; scheme: Scheme }) {
  const dark = scheme === "oscuro";
  const shown = useMemo(() => (dark ? darkenHtml(html) : html), [dark, html]);
  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-[var(--radius-lg)] border",
        dark
          ? "border-[var(--color-neutral-800)] bg-[var(--color-neutral-950)]"
          : "border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)]",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 border-b px-4 py-3 font-sans text-body-xs",
          dark
            ? "border-[var(--color-neutral-800)] text-[var(--color-neutral-400)]"
            : "border-[var(--color-neutral-200)] text-[var(--color-neutral-700)]",
        )}
      >
        <span
          className="size-2.5 rounded-full bg-[var(--color-neutral-400)]"
          aria-hidden
        />
        <span className="truncate">
          Re: Propuesta de campaña · para cliente@empresa.com
        </span>
      </div>
      <div className="overflow-x-auto">
        <div
          className={cn(
            "min-w-fit px-5 py-6",
            dark
              ? "bg-black text-[var(--color-neutral-50)]"
              : "bg-white text-[var(--color-neutral-950)]",
          )}
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          <p>Hola, Andrea:</p>
          <p className="mt-3 max-w-md">
            Te comparto la propuesta con los cambios que hablamos. Quedo atenta a tus
            comentarios.
          </p>
          <p className="mt-3">Saludos,</p>
          <div className="mt-5" inert dangerouslySetInnerHTML={{ __html: shown }} />
        </div>
      </div>
      <p
        className={cn(
          "px-4 py-2 font-sans text-body-xs sm:hidden",
          dark ? "text-[var(--color-neutral-400)]" : "text-[var(--color-neutral-700)]",
        )}
      >
        Deslizá la firma hacia los lados: mide lo mismo que en un correo.
      </p>
    </div>
  );
}

/* ───────────────────────────── paleta ───────────────────────────── */

/**
 * La firma no puede leer tokens, así que usa hex. Esto los compara con lo que
 * computa el navegador. Cada token se lee en el esquema donde vale ese hex
 * (PALETTE_TOKEN_SCHEME): los "light" solo se pueden verificar con el sitio en
 * claro, los "dark" se leen dentro de un nodo .dark.
 */
function PaletteCheck() {
  const v = useThemeVersion();
  const [rows, setRows] = useState<
    { key: PaletteKey; hex: string; got: string | null }[]
  >([]);

  useEffect(() => {
    const htmlDark = document.documentElement.classList.contains("dark");
    const probe = (token: string, inDark: boolean) => {
      const host = document.createElement("div");
      if (inDark) host.className = "dark";
      const el = document.createElement("span");
      el.style.color = `var(${token})`;
      host.appendChild(el);
      host.style.position = "absolute";
      host.style.visibility = "hidden";
      document.body.appendChild(host);
      const c = parseColor(getComputedStyle(el).color);
      host.remove();
      return c ? toHex(c) : null;
    };
    const keys = Object.keys(EMAIL_PALETTE) as PaletteKey[];
    setRows(
      keys.map((key) => {
        const sch = PALETTE_TOKEN_SCHEME[key];
        const readable =
          sch === "both" || sch === "dark" || (sch === "light" && !htmlDark);
        return {
          key,
          hex: EMAIL_PALETTE[key],
          got: readable ? probe(PALETTE_TOKENS[key], sch === "dark") : null,
        };
      }),
    );
  }, [v]);

  const off = rows.filter((r) => r.got !== null && r.got !== r.hex);
  const pending = rows.filter((r) => r.got === null).length;

  return (
    <section aria-label="Paleta de la firma" className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-sans text-label-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          Paleta de la firma vs tokens
        </h3>
        <span
          className={cn(
            "font-mono text-body-xs",
            rows.length === 0
              ? "text-[var(--text-secondary)]"
              : off.length
                ? "text-[var(--feedback-error-text)]"
                : "text-[var(--feedback-success-text)]",
          )}
        >
          {rows.length === 0
            ? "verificando…"
            : off.length
              ? `${off.length} no coinciden`
              : `todo coincide${pending ? ` · ${pending} se verifican en modo claro` : ""}`}
        </span>
      </div>
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {rows.map((r) => (
          <li key={r.key} className="grid min-w-0 gap-1">
            <span
              className="h-8 rounded-[var(--radius-sm)] border border-border"
              style={{ backgroundColor: r.hex }}
            />
            <span className="truncate font-sans text-label-xs font-bold">{r.key}</span>
            <span
              className={cn(
                "truncate font-mono text-body-xs",
                r.got !== null && r.got !== r.hex
                  ? "text-[var(--feedback-error-text)]"
                  : "text-[var(--text-secondary)]",
              )}
              title={PALETTE_TOKENS[r.key]}
            >
              {r.got === null ? "—" : r.got === r.hex ? r.hex : `${r.got} ≠`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
