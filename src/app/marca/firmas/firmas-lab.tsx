"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLInputTypeAttribute,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { cn } from "@ui/lib/utils";
import { copyText, parseColor, toHex, useThemeVersion } from "../live";
import {
  EMAIL_PALETTE,
  PALETTE_TOKENS,
  PALETTE_TOKEN_SCHEME,
  auditSignature,
  isPublicHttpsUrl,
  isValidEmail,
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

type Field = {
  key: keyof Firma;
  label: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  autoComplete: string;
  inputMode?: "email" | "tel" | "url";
  required?: boolean;
};

const FIELDS: Field[] = [
  {
    key: "nombre",
    label: "Nombre",
    placeholder: "Nombre y apellido",
    autoComplete: "name",
    required: true,
  },
  {
    key: "cargo",
    label: "Cargo (opcional)",
    placeholder: "Dirección de cuentas",
    autoComplete: "organization-title",
  },
  {
    key: "correo",
    label: "Correo",
    placeholder: "nombre@vpermedia.com",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
    required: true,
  },
  {
    key: "telefono",
    label: "Teléfono (opcional)",
    placeholder: "+505 0000 0000",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
  },
  {
    key: "web",
    label: "Sitio",
    placeholder: "vpermedia.com",
    type: "url",
    autoComplete: "url",
    inputMode: "url",
  },
  {
    key: "sedes",
    label: "Sedes",
    placeholder: "Panamá · Nicaragua",
    autoComplete: "off",
  },
];

const fieldId = (k: keyof Firma) => `firma-${k}`;

/* ─────────────────────────── validación ─────────────────────────── */

type FieldMsg = { level: "error" | "warn"; text: string };
type FieldMsgs = Partial<Record<keyof Firma, FieldMsg>>;

/**
 * Errores bloquean la copia; avisos no. Nombre y correo son obligatorios porque
 * todas las firmas los muestran (o enlazan); el resto puede quedar vacío.
 */
function validateFirma(d: Firma): FieldMsgs {
  const out: FieldMsgs = {};
  if (!d.nombre.trim()) out.nombre = { level: "error", text: "Escribí tu nombre." };

  const mail = d.correo.trim();
  if (!mail) out.correo = { level: "error", text: "Escribí tu correo." };
  else if (!isValidEmail(mail))
    out.correo = {
      level: "error",
      text: "Revisá el correo: tiene que ser como nombre@vpermedia.com.",
    };
  else if (!/@vpermedia\.com$/i.test(mail))
    out.correo = {
      level: "warn",
      text: "No termina en @vpermedia.com. Si es tu correo de trabajo, está bien.",
    };

  const phone = d.telefono.trim();
  if (phone) {
    const digits = phone.replace(/\D/g, "").length;
    if (!/^[+(]?[\d\s().-]+$/.test(phone) || digits < 7 || digits > 15)
      out.telefono = {
        level: "error",
        text: "Revisá el teléfono: solo números, espacios y +, entre 7 y 15 dígitos.",
      };
  }

  const site = d.web.trim();
  if (
    site &&
    (/\s/.test(site) || !/^(https?:\/\/)?[^/\s]+\.[a-z]{2,}(\/.*)?$/i.test(site))
  )
    out.web = {
      level: "error",
      text: "Revisá el sitio: tiene que ser como vpermedia.com.",
    };

  return out;
}

/* ─────────────────────────── persistencia ─────────────────────────── */

/** Solo en este navegador. Datos de la persona + esquema de la vista previa. */
const STORE_KEY = "vper-marca-firma";
const PERSONAL: (keyof Firma)[] = ["nombre", "cargo", "correo", "telefono"];

function readStore(): { data?: Firma; scheme?: Scheme } {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return {};
    const v = JSON.parse(raw) as { data?: Partial<Firma>; scheme?: string };
    const scheme = SCHEMES.find((x) => x === v.scheme);
    const d = v.data;
    const data =
      d && typeof d === "object"
        ? (Object.fromEntries(
            (Object.keys(FIRMA_DEFAULT) as (keyof Firma)[]).map((k) => [
              k,
              typeof d[k] === "string" ? d[k] : FIRMA_DEFAULT[k],
            ]),
          ) as unknown as Firma)
        : undefined;
    return { data, scheme };
  } catch {
    return {};
  }
}

function writeStore(data: Firma, scheme: Scheme) {
  try {
    const blank = PERSONAL.every((k) => !data[k].trim());
    // Sin datos propios no se guarda nada personal: al volver aparece el ejemplo.
    window.localStorage.setItem(
      STORE_KEY,
      JSON.stringify(
        blank || sameAs(data, FIRMA_DEFAULT) ? { scheme } : { data, scheme },
      ),
    );
  } catch {
    /* almacenamiento bloqueado: la página sigue funcionando sin recordar */
  }
}

function clearStore() {
  try {
    window.localStorage.removeItem(STORE_KEY);
  } catch {
    /* nada que borrar */
  }
}

const sameAs = (a: Firma, b: Firma) =>
  (Object.keys(b) as (keyof Firma)[]).every((k) => a[k] === b[k]);

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
  const [loaded, setLoaded] = useState(false);
  const radios = useRef<(HTMLButtonElement | null)[]>([]);
  const firstField = useRef<HTMLInputElement | null>(null);

  useEffect(() => setOrigin(window.location.origin), []);

  // Se lee después de hidratar (el servidor no conoce localStorage).
  useEffect(() => {
    const saved = readStore();
    if (saved.data) setData(saved.data);
    if (saved.scheme) setScheme(saved.scheme);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeStore(data, scheme);
  }, [data, scheme, loaded]);

  const msgs = useMemo(() => validateFirma(data), [data]);
  const invalid = FIELDS.filter((f) => msgs[f.key]?.level === "error");
  const isExample = sameAs(data, FIRMA_DEFAULT);
  const hasOwn = PERSONAL.some((k) => data[k].trim()) && !isExample;

  const clearData = () => {
    clearStore();
    setData((d) => ({ ...d, nombre: "", cargo: "", correo: "", telefono: "" }));
    firstField.current?.focus();
  };

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
    <div className="grid gap-14 md:gap-20">
      {/* ── taller: datos fijos a la izquierda, propuestas a la derecha ── */}
      <section
        id="taller"
        data-toc="Taller"
        aria-labelledby="taller-title"
        className="scroll-mt-20"
      >
        <SectionHead
          over="Paso 1"
          id="taller-title"
          title="Elegí y copiá"
          lede="Escribí tus datos una vez y las ocho firmas se actualizan juntas. Si no sabés cuál usar: Estándar para los correos nuevos y Respuestas para los hilos."
        />
        <div className="grid gap-10 xl:grid-cols-[19rem_minmax(0,1fr)] xl:gap-12">
          <aside
            aria-label="Datos de la firma"
            className="grid content-start gap-6 rounded-[var(--radius-xl)] border border-border bg-[var(--background-subtle)] p-5 md:p-6 xl:sticky xl:top-6 xl:max-h-[calc(100dvh-3rem)] xl:overflow-y-auto"
          >
            {isExample ? (
              <div
                role="note"
                className="grid gap-2 rounded-[var(--radius-lg)] border border-[var(--feedback-warning-border)] bg-[var(--feedback-warning-bg)] p-4"
              >
                <p className="font-sans text-body-sm font-bold text-[var(--feedback-warning-text)]">
                  Estos son datos de ejemplo: escribí los tuyos.
                </p>
                <button
                  type="button"
                  onClick={clearData}
                  className="w-fit font-sans text-body-xs font-bold text-[var(--feedback-warning-text)] underline underline-offset-4"
                >
                  Empezar con los campos vacíos
                </button>
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
              {FIELDS.map((f, i) => {
                const m = msgs[f.key];
                const msgId = `${fieldId(f.key)}-msg`;
                return (
                  <div key={f.key} className="grid content-start gap-1.5">
                    <label htmlFor={fieldId(f.key)} className={label}>
                      {f.label}
                    </label>
                    <Input
                      ref={i === 0 ? firstField : undefined}
                      id={fieldId(f.key)}
                      name={f.key}
                      type={f.type ?? "text"}
                      autoComplete={f.autoComplete}
                      inputMode={f.inputMode}
                      spellCheck={
                        f.type === "email" || f.type === "url" ? false : undefined
                      }
                      required={f.required}
                      value={data[f.key]}
                      placeholder={f.placeholder}
                      state={m?.level === "error" ? "error" : "default"}
                      aria-describedby={m ? msgId : undefined}
                      onChange={(e) =>
                        setData((d) => ({ ...d, [f.key]: e.target.value }))
                      }
                    />
                    {m ? (
                      <span
                        id={msgId}
                        className={cn(
                          "font-sans text-body-xs",
                          m.level === "error"
                            ? "text-[var(--feedback-error-text)]"
                            : "text-[var(--feedback-warning-text)]",
                        )}
                      >
                        {m.text}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {hasOwn ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-sans text-body-xs text-[var(--text-secondary)]">
                  Se guardan solo en este navegador.
                </span>
                <Button size="sm" variant="outline" onClick={clearData}>
                  Borrar mis datos
                </Button>
              </div>
            ) : null}

            <div className="grid gap-4 border-t border-border pt-5">
              <div className="grid content-start gap-1.5">
                <span id="bandeja-label" className={label}>
                  Vista previa
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
                  Oscuro muestra cómo la ve alguien con Gmail en iPhone, que le cambia los
                  colores.
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
                      <span className="w-4 font-mono text-body-xs">{i + 1}</span>
                      <span className="font-bold">{p.name}</span>
                      {p.badge ? (
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
                invalid={invalid.map((f) => ({ id: fieldId(f.key), label: f.label }))}
                example={isExample}
              />
            ))}
          </div>
        </div>
      </section>

      {install}

      <DownloadKit
        kit={kit}
        publicBase={publicBase}
        onPublicBaseChange={setPublicBase}
        baseOk={baseOk}
      />

      {/* ── control técnico: para quien mantiene el sistema, no para quien elige ── */}
      <section
        id="control"
        data-toc="Control técnico"
        aria-labelledby="control-title"
        className="grid scroll-mt-20 gap-10 border-t border-border pt-14 md:pt-20"
      >
        <SectionHead
          over="Para el desarrollador · control técnico"
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
  invalid,
  example,
}: {
  n: number;
  p: Proposal;
  data: Firma;
  previewBase: string;
  /** "" si la URL pública no es válida: no se puede copiar. */
  copyBase: string;
  scheme: Scheme;
  /** Campos con error: bloquean la copia. */
  invalid: { id: string; label: string }[];
  /** Los datos son los de ejemplo: se avisa, no se bloquea. */
  example: boolean;
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
    if (!copyHtml || invalid.length) return flash("error");
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
  const canCopy = Boolean(copyHtml) && errors.length === 0 && invalid.length === 0;

  return (
    <article
      id={p.id}
      className="grid scroll-mt-24 gap-6 border-t border-border pt-10 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-10 xl:grid-cols-1 xl:gap-6"
    >
      <div className="grid content-start gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid size-7 place-items-center rounded-full bg-foreground font-sans text-label-sm font-bold text-background">
            {n + 1}
          </span>
          <h3 className="font-display text-h2 font-black uppercase">{p.name}</h3>
          {p.badge ? (
            <span className="rounded-[var(--pill-radius)] bg-[var(--pill-brand-bg)] px-2.5 py-0.5 font-sans text-label-xs font-bold uppercase text-[var(--pill-brand-text)]">
              {p.badge}
            </span>
          ) : null}
        </div>
        <p className="font-sans text-body-md font-bold">{p.idea}</p>
        <dl className="grid gap-2 font-sans text-body-sm">
          <div>
            <dt className="inline font-bold">Para quién: </dt>
            <dd className="inline text-[var(--text-secondary)]">{p.forWho}</dd>
          </div>
          <div>
            <dt className="inline font-bold">A tener en cuenta: </dt>
            <dd className="inline text-[var(--text-secondary)]">{p.risk}</dd>
          </div>
        </dl>
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
          {invalid.length ? (
            <p className="font-sans text-body-xs text-[var(--feedback-error-text)]">
              No se puede copiar: revisá{" "}
              {invalid.map((f, i) => (
                <span key={f.id}>
                  {i ? (i === invalid.length - 1 ? " y " : ", ") : ""}
                  <a href={`#${f.id}`} className="font-bold underline underline-offset-4">
                    {f.label.replace(/ \(opcional\)$/, "")}
                  </a>
                </span>
              ))}{" "}
              en tus datos.
            </p>
          ) : !copyHtml ? (
            <p className="font-sans text-body-xs text-[var(--feedback-error-text)]">
              Todavía no se puede copiar: falta configurar dónde están publicadas las
              imágenes.{" "}
              <a href="#kit" className="font-bold underline underline-offset-4">
                Lo resuelve el desarrollador
              </a>
              .
            </p>
          ) : errors.length + warns.length > 0 ? (
            <p className="font-mono text-body-xs text-[var(--text-secondary)]">
              {`${copyHtml.length.toLocaleString("es")} caracteres · ${imgs} ${imgs === 1 ? "imagen" : "imágenes"} · ${errors.length} errores, ${warns.length} avisos`}
            </p>
          ) : example ? (
            <p className="font-sans text-body-xs text-[var(--feedback-warning-text)]">
              Tiene los datos de ejemplo: escribí los tuyos antes de copiar.
            </p>
          ) : null}
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
          {!invalid.length && errors.length + warns.length > 0 ? (
            <ul className="grid gap-1 font-sans text-body-xs text-[var(--feedback-error-text)]">
              {[...errors, ...warns].slice(0, 4).map((i) => (
                <li key={i.code + i.message}>{i.message}</li>
              ))}
            </ul>
          ) : null}
        </>
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
      <div
        className={cn(
          "px-4 py-6 sm:px-5",
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
        <FitSignature html={shown} dark={dark} />
      </div>
    </div>
  );
}

/**
 * La firma a su ancho real (400–520 px) no entra en un teléfono. Se mide su ancho
 * natural y, si no cabe, se achica entera con transform (el alto del contenedor se
 * ajusta a mano, porque transform no cambia la caja). Solo la vista previa: el HTML
 * que se copia es el mismo de siempre.
 */
function FitSignature({ html, dark }: { html: string; dark: boolean }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, w: 0, h: 0 });

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      const w = i.offsetWidth;
      const h = i.offsetHeight;
      const avail = o.clientWidth;
      const scale = w && avail ? Math.min(1, avail / w) : 1;
      setFit((f) => (f.scale === scale && f.w === w && f.h === h ? f : { scale, w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [html]);

  const scaled = fit.scale < 0.999;
  return (
    <div className="mt-5">
      <div
        ref={outer}
        className="w-full overflow-hidden"
        style={scaled ? { height: Math.ceil(fit.h * fit.scale) } : undefined}
      >
        <div
          ref={inner}
          inert
          className="w-max"
          style={
            scaled
              ? { transform: `scale(${fit.scale})`, transformOrigin: "top left" }
              : undefined
          }
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      {scaled ? (
        <p
          className={cn(
            "mt-3 font-sans text-body-xs",
            dark ? "text-[var(--color-neutral-400)]" : "text-[var(--color-neutral-700)]",
          )}
        >
          {`Achicada al ${Math.round(fit.scale * 100)} % para que entre en la pantalla: en el correo mide ${fit.w} px de ancho.`}
        </p>
      ) : null}
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
            <button
              type="button"
              onClick={() => copyText(r.hex)}
              title={`Copiar ${r.hex}`}
              aria-label={`${r.key}: copiar ${r.hex}`}
              className="h-8 cursor-copy rounded-[var(--radius-sm)] border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)]"
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
