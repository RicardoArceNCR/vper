/**
 * Base técnica para firmas de correo VPER.
 *
 * Funciones puras que devuelven strings HTML. Sin React, sin DOM, sin dependencias:
 * corre igual en el servidor (RSC) que en el cliente.
 *
 * Reglas de este módulo (y de toda propuesta que lo use):
 * - Todo estilo va inline. Gmail borra <style> y class en firmas.
 * - Layout con <table>/<td> y padding en el <td>. Outlook de escritorio (motor de
 *   Word) ignora margin en casi todo y no soporta flex, grid ni position.
 * - Nada de SVG (Gmail y Outlook no lo muestran), nada de background-image CSS
 *   (Outlook lo ignora), nada de data: URIs (Gmail los bloquea).
 * - Imágenes: PNG/JPG en URL https absoluta y pública, al doble de resolución, con
 *   width/height como atributos HTML.
 * - Cada <td> con texto lleva su propia font-family: Outlook no hereda la fuente de
 *   la <table> padre de forma fiable y cae a Times New Roman.
 * - Nada de comentarios condicionales <!--[if mso]>: al copiar desde el navegador y
 *   pegar en el editor de firma se pierden.
 */

/* ───────────────────────────── Escape ───────────────────────────── */

const ESC_MAP: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escapa texto para meterlo como contenido HTML. */
export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESC_MAP[c] ?? c);
}

/**
 * Escapa un valor para un atributo entre comillas dobles. Además de `esc`, codifica
 * saltos de línea y tabs (un \n literal en un atributo lo rompen algunos editores de
 * firma) y descarta el resto de caracteres de control.
 */
export function escAttr(s: string): string {
  return esc(s)
    .replace(/\r\n|\r|\n/g, "&#10;")
    .replace(/\t/g, "&#9;")
    .replace(/\p{Cc}/gu, "");
}

/* ───────────────────────────── Marca ───────────────────────────── */

/** Arial existe en todo cliente; Helvetica cubre Apple. Sin comillas: va en style="". */
export const FONT_STACK = "Arial, Helvetica, sans-serif";

/**
 * Paleta de la firma. Refleja los tokens de `src/app/brand.css`; un correo no puede
 * leer variables CSS, así que acá viven como hex. `PALETTE_TOKENS` permite verificar
 * en vivo que no se desincronicen.
 */
export const EMAIL_PALETTE = {
  /** --text-on-brand. Tinta principal (texto sobre amber y sobre blanco). */
  ink: "#0e0e0e",
  /** --background-page en oscuro (.dark). */
  black: "#000000",
  /** --background-page en claro. */
  white: "#ffffff",
  /** --brand-action (amber/300). Fondos y acentos; no como texto sobre blanco (1.6:1). */
  amber: "#fdbf66",
  /** --text-brand en claro (amber/700, 5.52:1 sobre blanco). */
  amberText: "#8f5f06",
  /** --color-accent-600. Acento clay para superficies y líneas. */
  clay: "#d55856",
  /** --color-accent-700. Clay apto para texto sobre blanco. */
  clayText: "#af403f",
  /** --brand-sky en claro. Decorativo; para texto usar `link`. */
  sky: "#5eb2e3",
  /**
   * --interaction-link-hover en claro (sky/700). Enlaces en claro: sky/600 (#378ebd,
   * --interaction-link-default) da 3.6:1 sobre blanco y no llega a AA.
   */
  link: "#22729c",
  /** --brand-leaf en claro (jade). Decorativo. */
  jade: "#74bdb7",
  /** --color-neutral-700. Texto secundario (cargo, sedes). */
  gray600: "#606060",
  /** --color-neutral-600. Solo decorativo (separadores "·"): 3.95:1 sobre blanco, no es texto. */
  gray500: "#808080",
  /** --color-neutral-200. Divisores. */
  line: "#e6e6e6",
  /** --color-neutral-900. Superficie oscura (tarjeta). */
  card: "#181818",
} as const;

export type PaletteKey = keyof typeof EMAIL_PALETTE;

/** Token CSS que refleja cada clave de `EMAIL_PALETTE`. */
export const PALETTE_TOKENS: Record<PaletteKey, string> = {
  ink: "--text-on-brand",
  black: "--background-page",
  white: "--background-page",
  amber: "--brand-action",
  amberText: "--text-brand",
  clay: "--color-accent-600",
  clayText: "--color-accent-700",
  sky: "--brand-sky",
  link: "--interaction-link-hover",
  jade: "--brand-leaf",
  gray600: "--color-neutral-700",
  gray500: "--color-neutral-600",
  line: "--color-neutral-200",
  card: "--color-neutral-900",
};

/**
 * En qué esquema del sitio el token vale el hex de la paleta. Varios tokens cambian
 * bajo `.dark` (ej. --text-brand pasa a #fdbf66), así que la verificación en vivo debe
 * leer cada uno en el esquema indicado: "light" = :root, "dark" = dentro de `.dark`.
 */
export const PALETTE_TOKEN_SCHEME: Record<PaletteKey, "light" | "dark" | "both"> = {
  ink: "both",
  black: "dark",
  white: "light",
  amber: "both",
  amberText: "light",
  clay: "both",
  clayText: "both",
  sky: "light",
  link: "light",
  jade: "light",
  gray600: "both",
  gray500: "both",
  line: "both",
  card: "both",
};

/* ──────────────────────── Atributos y estilos ──────────────────────── */

export type AttrValue = string | number | boolean | null | undefined;

/** Serializa atributos. `undefined`/`null`/`false` se omiten; `true` es booleano. */
export function attrs(a: Readonly<Record<string, AttrValue>>): string {
  let out = "";
  for (const [k, v] of Object.entries(a)) {
    if (v === undefined || v === null || v === false) continue;
    out += v === true ? ` ${k}` : ` ${k}="${escAttr(String(v))}"`;
  }
  return out;
}

export type CssDecls = Readonly<
  Record<string, string | number | null | undefined | false>
>;
export type Css = string | CssDecls;

/**
 * Une declaraciones CSS (strings "a:b;c:d" u objetos). Lo posterior pisa a lo
 * anterior por propiedad, así los helpers ponen defaults y el que llama los ajusta.
 * Devuelve sin espacios: Gmail corta firmas de más de 10.000 caracteres.
 */
export function css(...parts: ReadonlyArray<Css | null | undefined | false>): string {
  const decls = new Map<string, string>();
  const put = (prop: string, value: string) => {
    const p = prop.trim().toLowerCase();
    const v = value.trim();
    if (p && v) decls.set(p, v);
  };
  for (const part of parts) {
    if (!part) continue;
    if (typeof part === "string") {
      for (const decl of part.split(";")) {
        const i = decl.indexOf(":");
        if (i > 0) put(decl.slice(0, i), decl.slice(i + 1));
      }
    } else {
      for (const [prop, v] of Object.entries(part)) {
        if (v !== null && v !== undefined && v !== false) put(prop, String(v));
      }
    }
  }
  return Array.from(decls, ([p, v]) => `${p}:${v}`).join(";");
}

export interface FontOptions {
  /** px */
  size: number;
  /** px. Por defecto 1.4 × size, redondeado. */
  lineHeight?: number;
  color: string;
  bold?: boolean;
  /** ej. "0.04em". Outlook lo ignora; no depender de él. */
  letterSpacing?: string;
  uppercase?: boolean;
}

/**
 * Declaración tipográfica completa para un <td> o <span> con texto. Line-height en px
 * con `mso-line-height-rule:exactly`: sin esa regla Outlook trata line-height como
 * mínimo y agrega aire extra.
 */
export function font(o: FontOptions): CssDecls {
  return {
    "font-family": FONT_STACK,
    "font-size": `${o.size}px`,
    "line-height": `${o.lineHeight ?? Math.round(o.size * 1.4)}px`,
    "mso-line-height-rule": "exactly",
    color: o.color,
    // "normal" explícito: un <span> sin peso hereda el bold del <td> que lo contiene.
    "font-weight": o.bold ? "bold" : "normal",
    "letter-spacing": o.letterSpacing,
    "text-transform": o.uppercase ? "uppercase" : undefined,
  };
}

/* ───────────────────────────── Tablas ───────────────────────────── */

export type Children = string | readonly string[];
const join = (c: Children): string => (typeof c === "string" ? c : c.join(""));

/** Word agrega espacio a izquierda/derecha de cada tabla; estas dos lo anulan. */
const TABLE_BASE: CssDecls = {
  "border-collapse": "collapse",
  "mso-table-lspace": "0pt",
  "mso-table-rspace": "0pt",
};

export interface TableOptions {
  /** px. Se emite como atributo (Outlook) y como style (resto). */
  width?: number;
  /** Fondo: atributo bgcolor + background-color (ver `darkSafe.bg`). */
  bgcolor?: string;
  style?: Css;
}

/**
 * <table role="presentation"> con espaciado en cero. Sin `align` a propósito: en una
 * tabla, align="left|right" la hace flotar en Outlook y otros; alinear desde el <td>.
 */
export function table(opts: TableOptions, rows: Children): string {
  const style = css(
    TABLE_BASE,
    opts.width !== undefined && { width: `${opts.width}px` },
    opts.bgcolor && { "background-color": opts.bgcolor },
    opts.style,
  );
  const a = attrs({
    role: "presentation",
    width: opts.width,
    cellpadding: 0,
    cellspacing: 0,
    border: 0,
    bgcolor: opts.bgcolor,
    style,
  });
  return `<table${a}>${join(rows)}</table>`;
}

export function tr(cells: Children): string {
  return `<tr>${join(cells)}</tr>`;
}

export interface TdAttrs {
  /** px. Atributo + style width. */
  width?: number;
  /** px. Solo atributo; el alto real lo da el contenido o el padding. */
  height?: number;
  align?: "left" | "center" | "right";
  /** Por defecto "top": el navegador centra y el correo suele querer arriba. */
  valign?: "top" | "middle" | "bottom";
  bgcolor?: string;
  colspan?: number;
}

/**
 * Celda. `style` suele ser `css(font(...), { padding: "0 0 4px 0" })`; `content` es
 * HTML ya escapado (pasar texto por `esc`).
 */
export function td(style: Css | null, content: string, a: TdAttrs = {}): string {
  const s = css(
    a.bgcolor && { "background-color": a.bgcolor },
    a.width !== undefined && { width: `${a.width}px` },
    a.align && { "text-align": a.align },
    style,
  );
  const at = attrs({
    width: a.width,
    height: a.height,
    align: a.align,
    valign: a.valign ?? "top",
    bgcolor: a.bgcolor,
    colspan: a.colspan,
    style: s || undefined,
  });
  return `<td${at}>${content}</td>`;
}

/* ─────────────────────────── Imagen y enlace ─────────────────────────── */

export interface ImgOptions {
  /** URL https absoluta (ver `assetUrl`). */
  src: string;
  /** Obligatorio: es lo único que se ve con imágenes bloqueadas (Outlook por defecto). */
  alt: string;
  /** Tamaño mostrado en px (el PNG debe medir el doble). */
  width: number;
  height: number;
  style?: Css;
  /** Si se pasa, la imagen va envuelta en un enlace. */
  href?: string;
}

/**
 * - width/height como atributos: Outlook los usa para escalar (y en pantallas con
 *   escalado de Windows al 125/150 % es lo único que respeta). Se repiten en style
 *   para clientes que ignoran el atributo.
 * - display:block: elimina el hueco de 3–4 px bajo la imagen (alineación a baseline).
 * - border/outline/text-decoration: Outlook e IE pintan borde azul si va en un <a>.
 * - font-* en la imagen estiliza el alt cuando las imágenes están bloqueadas.
 */
export function img(o: ImgOptions): string {
  const style = css(
    {
      display: "block",
      border: "0",
      outline: "none",
      "text-decoration": "none",
      "-ms-interpolation-mode": "bicubic",
      width: `${o.width}px`,
      height: `${o.height}px`,
      "font-family": FONT_STACK,
      "font-size": "12px",
    },
    o.style,
  );
  const tag = `<img${attrs({
    src: o.src,
    alt: o.alt,
    width: o.width,
    height: o.height,
    border: 0,
    style,
  })}>`;
  if (!o.href) return tag;
  const aStyle = "text-decoration:none;border:0;outline:none";
  return `<a${attrs({ href: safeHref(o.href), style: aStyle })}>${tag}</a>`;
}

export interface LinkOptions {
  href: string;
  /** Texto plano: se escapa acá. */
  text: string;
  color: string;
  /** Tipografía u otros estilos del <a> (ej. `font(...)`). */
  style?: Css;
  underline?: boolean;
}

/**
 * Enlace de texto con el color en el <a> y repetido en un <span> interno. Varios
 * clientes pisan el color del <a> (Outlook con su azul de hipervínculo, Gmail en
 * algunos casos, iOS al autodetectar teléfonos y correos); el <span> gana porque es
 * el elemento más interno con color propio.
 */
export function link(o: LinkOptions): string {
  const deco = o.underline ? "underline" : "none";
  const aStyle = css({ color: o.color, "text-decoration": deco }, o.style);
  const spanStyle = css({ color: o.color, "text-decoration": deco });
  return (
    `<a${attrs({ href: safeHref(o.href), style: aStyle })}>` +
    `<span${attrs({ style: spanStyle })}>${esc(o.text)}</span></a>`
  );
}

/** Solo https/http/mailto/tel. Sin esquema → web. Cualquier otro esquema → "#". */
function safeHref(href: string): string {
  const h = href.trim();
  if (/^(https?:|mailto:|tel:)/i.test(h)) return h;
  if (/^[a-z][a-z0-9+.-]*:/i.test(h)) return "#";
  return webHref(h);
}

/* ─────────────────────── Espaciadores y divisores ─────────────────────── */

/**
 * Celda de alto exacto. Outlook (Word) toma el alto de la línea de texto de la celda,
 * no el atributo height: con font-size 0 aplica su mínimo y una fila de 1–8 px crece.
 * El patrón fiable es font-size 1px + line-height igual al alto + regla "exactly".
 */
function fixedHeightCell(height: number, extra: { colspan?: number; bgcolor?: string }) {
  const style = css(extra.bgcolor && { "background-color": extra.bgcolor }, {
    height: `${height}px`,
    "font-size": "1px",
    "line-height": `${height}px`,
    "mso-line-height-rule": "exactly",
  });
  const a = attrs({
    height,
    colspan: extra.colspan,
    bgcolor: extra.bgcolor,
    "aria-hidden": "true",
    style,
  });
  // &nbsp;: Outlook y Gmail colapsan una celda vacía a 0 px.
  return `<td${a}>&nbsp;</td>`;
}

/**
 * Fila de alto fijo. Devuelve un <tr>: va entre filas de una tabla. `colspan` si la
 * tabla tiene varias columnas.
 */
export function spacer(height: number, colspan?: number): string {
  return tr(fixedHeightCell(height, { colspan }));
}

/**
 * Columna de ancho fijo: separa celdas en horizontal. Devuelve un <td>.
 * font-size/line-height 0 para que el &nbsp; no imponga alto a la fila; min-width
 * evita que Gmail app y Apple Mail la aplasten cuando falta ancho.
 */
export function vSpacer(width: number): string {
  const style = css({
    width: `${width}px`,
    "min-width": `${width}px`,
    "font-size": "0",
    "line-height": "0",
  });
  return `<td${attrs({ width, "aria-hidden": "true", style })}>&nbsp;</td>`;
}

export interface DividerOptions {
  /** px, por defecto 1. */
  thickness?: number;
  /** px. Si se omite ocupa todo el ancho de la celda. */
  width?: number;
  colspan?: number;
}

/**
 * Línea horizontal. Devuelve un <tr>. Es una celda pintada (bgcolor + background-color),
 * no <hr> ni border-top: <hr> lo dibuja cada cliente distinto y Outlook le suma margen.
 */
export function divider(color: string, o: DividerOptions = {}): string {
  const t = o.thickness ?? 1;
  if (o.width === undefined) {
    return tr(fixedHeightCell(t, { colspan: o.colspan, bgcolor: color }));
  }
  const rule = table({ width: o.width }, tr(fixedHeightCell(t, { bgcolor: color })));
  return tr(td(null, rule, { colspan: o.colspan }));
}

/**
 * Línea vertical. Devuelve un <td> que va entre dos celdas de la misma fila y toma
 * todo el alto de la fila. Si tiene que ser más corta que el contenido de al lado,
 * envolver ese contenido en una tabla anidada con su propio padding vertical.
 */
export function vDivider(color: string, thickness = 1): string {
  return td(
    { "min-width": `${thickness}px`, "font-size": "1px", "line-height": "1px" },
    "&nbsp;",
    { width: thickness, bgcolor: color },
  );
}

/* ───────────────────────────── URLs ───────────────────────────── */

/**
 * `tel:` normalizado a E.164: "+505 8815-4889" → "tel:+50588154889". Si el número no
 * empieza con "+" ni "00", se antepone `defaultCallingCode` (Nicaragua por defecto;
 * "" para no anteponer nada). Devuelve "" si no hay dígitos.
 */
export function telHref(phone: string, defaultCallingCode = "505"): string {
  const t = phone.trim();
  const digits = t.replace(/\D/g, "");
  // Menos de 7 dígitos no es un teléfono ("ext 12" daría tel:+50512).
  if (digits.length < 7) return "";
  if (t.startsWith("+")) return `tel:+${digits}`;
  if (digits.startsWith("00")) return `tel:+${digits.slice(2)}`;
  return `tel:+${defaultCallingCode}${digits}`;
}

export function mailtoHref(email: string): string {
  const address = email
    .trim()
    .replace(/^mailto:/i, "")
    .replace(/\s+/g, "");
  return `mailto:${address}`;
}

/** Asegura https://: "vpermedia.com" → "https://vpermedia.com"; http:// → https://. */
export function webHref(url: string): string {
  const u = url.trim();
  if (/^https:\/\//i.test(u)) return u;
  if (/^http:\/\//i.test(u)) return `https://${u.slice(7)}`;
  if (u.startsWith("//")) return `https:${u}`;
  return `https://${u}`;
}

/** Texto visible de una URL: sin esquema ni barra final ("vpermedia.com"). */
export function displayUrl(url: string): string {
  return url
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

/**
 * Une la URL base del sitio con un path de /public. Las imágenes de una firma tienen
 * que ser URLs absolutas y públicas: el destinatario las descarga del servidor.
 * Si `path` ya es absoluta se devuelve tal cual.
 */
export function assetUrl(base: string, path: string): string {
  const p = path.trim();
  if (/^https?:\/\//i.test(p)) return p;
  const b = base.trim().replace(/\/+$/, "");
  if (!/^https?:\/\/[^/]/i.test(b)) {
    throw new Error(`assetUrl: la base debe ser una URL http(s) absoluta: "${base}"`);
  }
  return `${b}/${p.replace(/^\/+/, "").replace(/ /g, "%20")}`;
}

/**
 * true si la URL es https y no apunta a una máquina local. Sirve para avisar en la
 * página que una firma copiada desde localhost tendrá las imágenes rotas.
 */
export function isPublicHttpsUrl(url: string): boolean {
  const m = /^https:\/\/([^/:?#]+)/i.exec(url.trim());
  const host = m?.[1]?.toLowerCase();
  if (!host) return false;
  return !(
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".localhost") ||
    /^(127\.|10\.|192\.168\.|0\.0\.0\.0$|172\.(1[6-9]|2\d|3[01])\.)/.test(host)
  );
}

/* ───────────────────────────── Envoltura ───────────────────────────── */

/** Ancho por defecto de la firma: entra en el panel de lectura y en un móvil apaisado. */
export const SIGNATURE_WIDTH = 480;
/** Tope: más ancho que esto obliga a scroll horizontal en el panel de Outlook. */
export const SIGNATURE_MAX_WIDTH = 600;
/** Gmail rechaza firmas de más de 10.000 caracteres de HTML. */
export const GMAIL_SIGNATURE_MAX_CHARS = 10_000;

export interface WrapOptions {
  /** px, por defecto `SIGNATURE_WIDTH`. Se limita a `SIGNATURE_MAX_WIDTH`. */
  width?: number;
  /**
   * Fondo de la firma, por defecto blanco. `null` para transparente: solo si la
   * propuesta tampoco fija colores de texto oscuros (ver `darkSafe`).
   */
  bgcolor?: string | null;
}

/**
 * Envoltura final. Es un fragmento: sin <html>/<body>/<head>, porque el editor de firma
 * lo inserta dentro del cuerpo del mensaje.
 *
 * En la <table>:
 * - role="presentation": los lectores de pantalla no anuncian filas/columnas.
 * - cellpadding/cellspacing/border="0": defaults de 1–2 px que Outlook (Word) aplica y
 *   que no se pueden quitar con CSS (no soporta border-spacing).
 * - border-collapse:collapse: quita las rendijas entre celdas en WebKit y Gmail.
 * - mso-table-lspace/rspace:0pt: Word agrega espacio a los lados de cada tabla.
 * - width como atributo y style: Outlook usa el atributo; el resto, el style.
 * - bgcolor + background-color: ver `darkSafe.bg`.
 *
 * En el <td> raíz:
 * - font-family de base para texto suelto que no pase por `font()`.
 * - -webkit/-ms-text-size-adjust:100%: iOS y Windows Phone agrandan el texto chico.
 * - text-align:left explícito: si se pega dentro de un bloque centrado, no lo hereda.
 */
export function wrapSignature(inner: string, opts: WrapOptions = {}): string {
  const width = Math.min(opts.width ?? SIGNATURE_WIDTH, SIGNATURE_MAX_WIDTH);
  const bg = opts.bgcolor === undefined ? EMAIL_PALETTE.white : opts.bgcolor;
  const cell = td(
    {
      "font-family": FONT_STACK,
      "text-align": "left",
      "-webkit-text-size-adjust": "100%",
      "-ms-text-size-adjust": "100%",
    },
    inner,
    { align: "left", bgcolor: bg ?? undefined },
  );
  return table({ width, bgcolor: bg ?? undefined }, tr(cell));
}

/* ───────────────────────────── Modo oscuro ───────────────────────────── */

/**
 * Qué hace cada cliente en modo oscuro con una firma. Ninguno de los mecanismos de
 * control (meta color-scheme, @media prefers-color-scheme, [data-ogsc]) está
 * disponible en una firma: no hay <head> ni <style>. Así que la firma no se adapta;
 * se diseña para sobrevivir a la inversión.
 */
export const DARK_MODE_CLIENTS = [
  {
    client: "Gmail web",
    behavior: "Sin cambios: el panel del mensaje queda claro aunque el tema sea oscuro.",
  },
  {
    client: "Gmail app (iOS)",
    behavior:
      "Inversión total: fondos claros pasan a oscuros y oscuros a claros; el texto " +
      "invierte luminosidad conservando aprox. el tono. Las imágenes NO se tocan.",
  },
  {
    client: "Gmail app (Android)",
    behavior:
      "Inversión parcial: solo oscurece fondos claros y aclara texto oscuro; deja " +
      "fondos ya oscuros. Imágenes intactas.",
  },
  {
    client: "Outlook escritorio (Windows)",
    behavior:
      "Inversión parcial: recolorea fondos claros y texto oscuro. Imágenes intactas. " +
      "El usuario puede alternar el fondo del mensaje con un botón.",
  },
  {
    client: "Outlook.com / Outlook nuevo",
    behavior:
      "Inversión parcial: igual que Windows; reescribe colores en atributos " +
      "data-ogsc/data-ogsb, que sin <style> no se pueden aprovechar.",
  },
  {
    client: "Apple Mail / iOS Mail",
    behavior:
      "Sin meta color-scheme (una firma no puede aportarla) no invierte colores " +
      "declarados, pero oscurece lo que no tiene fondo: texto oscuro explícito sobre " +
      "fondo transparente queda ilegible. Por eso la firma declara siempre fondo.",
  },
] as const;

/**
 * Estrategia recomendada para modo oscuro:
 *
 * 1. Declarar color de texto Y color de fondo, nunca uno sin el otro. Una firma con
 *    texto #0e0e0e y fondo transparente desaparece en Apple Mail oscuro. Con fondo
 *    blanco declarado (default de `wrapSignature`), Apple Mail la muestra como tarjeta
 *    clara legible, y Gmail/Outlook invierten fondo y texto juntos.
 * 2. Fondo con atributo `bgcolor` además de `background-color`: Outlook Word lee el
 *    atributo y Outlook.com ha llegado a descartar el style; con ambos se cubren.
 * 3. Logo como PNG con fondo propio sólido horneado (no transparente). Ningún cliente
 *    invierte imágenes, así que un logo negro transparente sobre una celda blanca
 *    queda negro sobre gris oscuro cuando la celda se invierte. Con placa sólida (por
 *    ejemplo ink sobre amber, que contrasta contra blanco y contra negro) el logo se
 *    ve igual en todos los clientes.
 * 4. Si el logo va sobre una celda de color, la celda con bgcolor del MISMO color que
 *    el fondo del PNG (`darkSafe.plate`): en claro no se ve la costura y con imágenes
 *    bloqueadas el alt queda sobre la placa.
 * 5. No confiar en el color exacto de texto de marca en oscuro: Gmail iOS lo aclara.
 *    El significado no puede depender solo del color.
 */
export const darkSafe = {
  /** Atributo + style de fondo para pasar a `td`/`table` (bgcolor ya hace ambos). */
  bg(color: string): { bgcolor: string; style: CssDecls } {
    return { bgcolor: color, style: { "background-color": color } };
  },

  /**
   * Placa sólida alrededor de un contenido (normalmente el `img` del logo). Devuelve
   * una tabla anidada, así se puede poner dentro de cualquier celda. `color` debe ser
   * el mismo que el fondo horneado del PNG.
   */
  plate(content: string, o: { color: string; padding?: string; width?: number }): string {
    return table(
      { width: o.width, bgcolor: o.color },
      tr(td(o.padding ? { padding: o.padding } : null, content, { bgcolor: o.color })),
    );
  },
} as const;

/* ───────────────────────────── Auditoría ───────────────────────────── */

export interface SignatureIssue {
  level: "error" | "warn";
  code: string;
  message: string;
}

/**
 * Chequeo estático del HTML final contra las reglas de este archivo. No reemplaza
 * mirar la firma en los clientes, pero atrapa lo que rompe en silencio.
 */
export function auditSignature(html: string): SignatureIssue[] {
  const issues: SignatureIssue[] = [];
  const add = (level: SignatureIssue["level"], code: string, message: string) =>
    issues.push({ level, code, message });

  if (!html.trim()) {
    add("error", "empty", "La firma salió vacía: revisá la URL pública de las imágenes.");
    return issues;
  }
  if (/\shref="(https?:\/\/|mailto:|tel:)?"/i.test(html)) {
    add("warn", "empty-href", "Hay un enlace sin destino (campo vacío).");
  }
  if (html.length > GMAIL_SIGNATURE_MAX_CHARS) {
    add("error", "size", `${html.length} caracteres: Gmail acepta hasta 10.000.`);
  } else if (html.length > GMAIL_SIGNATURE_MAX_CHARS * 0.8) {
    add("warn", "size", `${html.length} caracteres: cerca del tope de Gmail (10.000).`);
  }
  if (/<style[\s>]/i.test(html)) add("error", "style-tag", "<style>: Gmail lo elimina.");
  if (/\sclass\s*=/i.test(html)) add("error", "class", "class=: Gmail las elimina.");
  if (/<svg[\s>]/i.test(html) || /\.svg(["?#])/i.test(html)) {
    add("error", "svg", "SVG: Gmail y Outlook no lo muestran.");
  }
  if (/[;"\s]margin(-[a-z]+)?\s*:/i.test(html)) {
    add("warn", "margin", "margin: Outlook lo ignora; usar padding en <td>.");
  }
  if (/background(-image)?\s*:[^;"]*url\(/i.test(html)) {
    add("error", "bg-image", "background-image: Outlook no lo muestra.");
  }
  if (/display\s*:\s*(flex|grid)|position\s*:/i.test(html)) {
    add("error", "layout", "flex/grid/position: Outlook no los soporta.");
  }
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = /\ssrc="([^"]*)"/i.exec(tag)?.[1] ?? "";
    if (src.startsWith("data:")) {
      add("error", "img-data", "Imagen data: URI: Gmail la bloquea.");
    } else if (!isPublicHttpsUrl(src)) {
      add("error", "img-src", `Imagen sin URL https pública: ${src || "(vacía)"}`);
    } else if (/\.vercel\.app\//i.test(src)) {
      add(
        "warn",
        "img-preview",
        "Imágenes en un preview de Vercel: si tiene protección, no cargan.",
      );
    }
    if (!/\swidth="\d+"/i.test(tag) || !/\sheight="\d+"/i.test(tag)) {
      add("warn", "img-size", `Imagen sin width/height como atributo: ${src}`);
    }
    if (!/\salt="/i.test(tag)) add("warn", "img-alt", `Imagen sin alt: ${src}`);
  }
  return issues;
}
