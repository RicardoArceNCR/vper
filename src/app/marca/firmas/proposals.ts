/**
 * Propuestas de firma de correo VPER. Cada una es una función pura
 * `(datos, base) => HTML`. Conceptos: dirección creativa (sesión de especialistas,
 * octubre 2026). Base técnica y reglas: ./email-html.ts y ./RESTRICCIONES.md.
 *
 * Los hex viven en EMAIL_PALETTE (un correo no lee variables CSS); la página
 * verifica en vivo que coincidan con los tokens. La única excepción es "Hoy", que
 * reproduce la firma actual tal como está, con sus colores fuera de sistema.
 *
 * Los PNG de public/images/firma/ se generaron desde los SVG del logo a 2x, con el
 * fondo horneado: ningún cliente invierte imágenes en modo oscuro.
 */
import {
  EMAIL_PALETTE as P,
  FONT_STACK,
  assetUrl,
  css,
  darkSafe,
  displayUrl,
  esc,
  font,
  img,
  link,
  mailtoHref,
  spacer,
  table,
  td,
  telHref,
  tr,
  vDivider,
  vSpacer,
  webHref,
  wrapSignature,
} from "./email-html";

export interface Firma {
  nombre: string;
  /** Opcional: la firma actual no lo tiene. */
  cargo: string;
  correo: string;
  telefono: string;
  web: string;
  sedes: string;
}

export const FIRMA_DEFAULT: Firma = {
  nombre: "Massiel Narváez",
  cargo: "",
  correo: "massiel@vpermedia.com",
  telefono: "+505 8815 4889",
  web: "vpermedia.com",
  sedes: "Panamá · Nicaragua",
};

export interface Proposal {
  id: string;
  name: string;
  idea: string;
  forWho: string;
  risk: string;
  /** Etiqueta destacada en la lámina. */
  badge?: "Estándar" | "Respuestas" | "Campañas" | "Actual";
  render: (d: Firma, base: string) => string;
}

/* ─────────────────────────── piezas comunes ─────────────────────────── */

/**
 * Imágenes que usan las firmas. Viven en public/images/firma/ y tienen que estar
 * publicadas en la URL pública del sitio con estos mismos nombres (la página de
 * firmas las descarga juntas en un ZIP para el desarrollador).
 */
export const FIRMA_IMAGES = {
  placaBlanca: "/images/firma/bloque-negro-placa-blanca@2x.png",
  sello: "/images/firma/sello-columna-amber@2x.png",
  banda: "/images/firma/banda-gradiente@2x.png",
  ficha: "/images/firma/ficha-bloque-negro@2x.png",
  franjaCrear: "/images/firma/franja-crear@2x.png",
  lineaAmber: "/images/firma/linea-amber-negro@2x.png",
  monograma: "/images/firma/monograma-circulo-amber@2x.png",
  banner: "/images/firma/banner-caso@2x.png",
} as const;

const IMG = FIRMA_IMAGES;

const ALT = "VPER Media";

/** Ceja estilo sitio: 11px, bold, mayúsculas, tracking 1.6px. */
const ceja = (color: string) =>
  font({
    size: 11,
    lineHeight: 14,
    color,
    bold: true,
    uppercase: true,
    letterSpacing: "1.6px",
  });

const sep = (color: string = P.gray500) =>
  `<span style="${css({ color })}">&nbsp;&nbsp;·&nbsp;&nbsp;</span>`;

const mail = (d: Firma, color: string, size = 13) =>
  d.correo
    ? link({
        href: mailtoHref(d.correo),
        text: d.correo,
        color,
        style: font({ size, color }),
      })
    : "";
const tel = (d: Firma, color: string, size = 13) => {
  if (!d.telefono) return "";
  const href = telHref(d.telefono);
  // Sin un número válido no hay enlace: se escribe tal cual.
  if (!href)
    return `<span style="${css(font({ size, color }))}">${esc(d.telefono)}</span>`;
  return link({ href, text: d.telefono, color, style: font({ size, color }) });
};
const web = (d: Firma, color: string, size = 13) =>
  d.web
    ? link({
        href: webHref(d.web),
        text: displayUrl(d.web),
        color,
        style: font({ size, color }),
      })
    : "";

/** Destino del logo: el sitio, o ninguno si el campo está vacío (nunca "https://"). */
const siteHref = (d: Firma) => (d.web.trim() ? webHref(d.web) : undefined);

/** Une piezas no vacías con un separador. */
const joinWith = (parts: string[], s: string) => parts.filter(Boolean).join(s);

/** Fila de texto: un <tr> con un <td> tipográfico. */
const row = (style: string, html: string, pad = "0") =>
  html ? tr(td(css(style, { padding: pad }), html)) : "";

const f = (o: Parameters<typeof font>[0]) => css(font(o));

/* ─────────────────────────── propuestas ─────────────────────────── */

const hoy: Proposal = {
  id: "hoy",
  name: "Hoy",
  badge: "Actual",
  idea: "La firma que se usa ahora, reconstruida para comparar.",
  forWho: "—",
  risk: "Tres azules y un rojo sin sistema, sin logo, y el sitio subrayado en negrita compite con el nombre.",
  render: (d) => {
    // Colores tal cual la firma actual: fuera del sistema a propósito.
    const red = "#cc5b57";
    const blue = "#1155cc";
    const u = { "text-decoration": "underline" };
    return wrapSignature(
      table({}, [
        row(f({ size: 26, lineHeight: 30, color: red, bold: true }), esc(d.nombre)),
        row(
          f({ size: 18, lineHeight: 24, color: blue }),
          link({
            href: mailtoHref(d.correo),
            text: d.correo,
            color: blue,
            underline: true,
          }),
        ),
        row(
          f({ size: 18, lineHeight: 24, color: "#000000" }),
          d.telefono
            ? `Tel ${link({ href: telHref(d.telefono) || "#", text: d.telefono, color: blue })}`
            : "",
        ),
        row(
          f({ size: 18, lineHeight: 24, color: blue, bold: true }),
          link({
            href: webHref(d.web),
            text: `www.${displayUrl(d.web)}`,
            color: blue,
            style: u,
            underline: true,
          }),
        ),
        spacer(18),
        row(
          css(font({ size: 18, lineHeight: 24, color: P.sky, bold: true }), {
            "font-style": "italic",
          }),
          esc(d.sedes.replace(/\s*·\s*/g, "-")),
        ),
      ]),
      { width: 420 },
    );
  },
};

const esencial: Proposal = {
  id: "esencial",
  name: "Esencial",
  idea: "Dos columnas sobrias. El logo pone la marca; el color queda en un solo acento.",
  forWho: "Administración, finanzas, clientes corporativos o de gobierno.",
  risk: "La más genérica. En modo oscuro el logo queda como una placa blanca: legible, pero no diseñada para ese modo.",
  render: (d, base) => {
    const left = table({}, [
      row(f({ size: 16, lineHeight: 20, color: P.ink, bold: true }), esc(d.nombre)),
      row(f({ size: 13, lineHeight: 18, color: P.gray600 }), esc(d.cargo), "2px 0 0"),
      spacer(8),
      row(f({ size: 13, lineHeight: 20, color: P.ink }), mail(d, P.link)),
      row(f({ size: 13, lineHeight: 20, color: P.ink }), tel(d, P.ink)),
      row(f({ size: 13, lineHeight: 20, color: P.ink }), web(d, P.link)),
      spacer(6),
      row(css(ceja(P.clayText)), esc(d.sedes)),
    ]);
    return wrapSignature(
      table(
        {},
        tr([
          td({ padding: "0 20px 0 0" }, left),
          vDivider(P.line),
          td(
            { padding: "0 0 0 20px" },
            img({
              src: assetUrl(base, IMG.placaBlanca),
              alt: ALT,
              width: 144,
              height: 56,
              href: siteHref(d),
            }),
            { valign: "middle" },
          ),
        ]),
      ),
      { width: 480 },
    );
  },
};

const sello: Proposal = {
  id: "sello",
  name: "Sello",
  badge: "Estándar",
  idea: "Un bloque amber cuadrado como sello junto al nombre. La marca entra por el color, no por el tamaño del logo.",
  forWho: "Todo el equipo.",
  risk: "Repetida en un hilo largo, el amber cansa. Por eso va en pareja con Respuesta.",
  render: (d, base) => wrapSignature(selloBody(d, base), { width: 470 }),
};

function selloBody(d: Firma, base: string): string {
  const text = table({}, [
    row(css(ceja(P.clayText)), "VPER® Media"),
    row(
      f({ size: 18, lineHeight: 22, color: P.ink, bold: true }),
      esc(d.nombre),
      "4px 0 0",
    ),
    row(f({ size: 13, lineHeight: 18, color: P.gray600 }), esc(d.cargo), "2px 0 0"),
    spacer(8),
    row(
      f({ size: 12, lineHeight: 18, color: P.ink }),
      joinWith([mail(d, P.link, 12), tel(d, P.ink, 12)], sep()),
    ),
    row(
      f({ size: 12, lineHeight: 18, color: P.gray600 }),
      joinWith([web(d, P.link, 12), esc(d.sedes)], sep()),
    ),
  ]);
  return table(
    {},
    tr([
      // La celda crece con el texto (cargo, nombre largo). Si se pinta la celda, en
      // modo oscuro el amber invertido asoma marrón arriba y abajo del PNG: la placa
      // mide exactamente 96×96 y la celda queda sin fondo.
      td(
        null,
        darkSafe.plate(
          img({
            src: assetUrl(base, IMG.sello),
            alt: ALT,
            width: 96,
            height: 96,
            href: siteHref(d),
            style: font({ size: 12, color: P.ink, bold: true }),
          }),
          { color: P.amber, width: 96 },
        ),
        { width: 96, valign: "middle" },
      ),
      vSpacer(16),
      td(null, text, { valign: "middle" }),
    ]),
  );
}

const ceja3: Proposal = {
  id: "ceja",
  name: "Ceja",
  idea: "Solo texto, armada como una sección del sitio: ceja arriba y filete clay. Con imágenes bloqueadas se ve igual.",
  forWho:
    "Producción y cuentas que escriben a clientes corporativos, donde Outlook bloquea imágenes.",
  risk: "Sin logo puede leerse demasiado simple: toda la marca depende de una palabra en texto.",
  render: (d) => {
    const body = table({}, [
      row(css(ceja(P.clayText)), esc(d.cargo || "VPER® Media")),
      row(
        f({ size: 20, lineHeight: 24, color: P.ink, bold: true }),
        esc(d.nombre),
        "4px 0 6px",
      ),
      row(f({ size: 13, lineHeight: 20, color: P.ink }), mail(d, P.link)),
      row(
        f({ size: 13, lineHeight: 20, color: P.ink }),
        joinWith([tel(d, P.ink), web(d, P.link)], sep()),
      ),
      row(
        f({ size: 12, lineHeight: 18, color: P.gray600 }),
        joinWith([d.cargo ? "VPER® Media" : "", esc(d.sedes)], " — "),
        "4px 0 0",
      ),
    ]);
    return wrapSignature(
      table(
        {},
        tr(td({ "border-left": `3px solid ${P.clay}`, padding: "2px 0 2px 14px" }, body)),
      ),
      { width: 400 },
    );
  },
};

const banda: Proposal = {
  id: "banda",
  name: "Banda",
  idea: "El gradiente de los titulares (sky → clay → amber) como un filete de 4 px. La huella de VPER en la bandeja.",
  forWho: "Dirección y equipo creativo.",
  risk: "Tres columnas en un móvil de 360 px se escalan y el texto de 12 px baja a ~9 px.",
  render: (d, base) => {
    // Dos columnas (texto | ficha): con tres, un correo largo aplastaba el nombre.
    const text = table({}, [
      row(f({ size: 16, lineHeight: 20, color: P.ink, bold: true }), esc(d.nombre)),
      row(f({ size: 12, lineHeight: 16, color: P.gray600 }), esc(d.cargo), "2px 0 0"),
      spacer(8),
      row(f({ size: 12, lineHeight: 18, color: P.ink }), mail(d, P.link, 12)),
      row(
        f({ size: 12, lineHeight: 18, color: P.ink }),
        joinWith([tel(d, P.ink, 12), web(d, P.link, 12)], sep()),
      ),
      row(css(ceja(P.clayText)), esc(d.sedes), "6px 0 0"),
    ]);
    return wrapSignature(
      table({ width: 480 }, [
        tr(
          td(
            { "font-size": "1px", "line-height": "4px" },
            img({ src: assetUrl(base, IMG.banda), alt: "", width: 480, height: 4 }),
            { colspan: 3 },
          ),
        ),
        spacer(14, 3),
        tr([
          td(null, text),
          vSpacer(16),
          // Placa de 110×48 y celda sin fondo: la fila es más alta que la ficha.
          td(
            null,
            darkSafe.plate(
              img({
                src: assetUrl(base, IMG.ficha),
                alt: ALT,
                width: 110,
                height: 48,
                href: siteHref(d),
                style: font({ size: 12, color: P.white, bold: true }),
              }),
              { color: P.black, width: 110 },
            ),
            { width: 110, valign: "middle", align: "right" },
          ),
        ]),
      ]),
      { width: 480 },
    );
  },
};

const crear: Proposal = {
  id: "crear",
  name: "Crear.",
  idea: "La firma completa el lema del sitio: “Siempre hay algo más grande por” en texto, y “Crear.” en Yellowtail amber, como en el hero.",
  forWho: "Comercial y nuevos negocios: el primer correo a un cliente.",
  risk: "El lema en cada correo se gasta rápido. Y la franja es imagen: con imágenes bloqueadas queda solo el alt.",
  render: (d, base) => {
    const top = table({}, [
      row(
        f({ size: 16, lineHeight: 20, color: P.ink, bold: true }),
        joinWith(
          [
            esc(d.nombre),
            d.cargo
              ? `<span style="${f({ size: 13, color: P.gray600 })}">${esc(d.cargo)}</span>`
              : "",
          ],
          sep(),
        ),
      ),
      row(
        f({ size: 12, lineHeight: 18, color: P.ink }),
        joinWith([mail(d, P.link, 12), tel(d, P.ink, 12), web(d, P.link, 12)], sep()),
        "4px 0 0",
      ),
      row(css(ceja(P.clayText)), esc(d.sedes), "4px 0 0"),
    ]);
    // Una sola imagen con fondo negro horneado: con el lema en texto vivo, Gmail
    // iOS invertía la franja a blanco y dejaba "Crear." y el logo como dos
    // parches negros. El texto queda completo en el alt.
    const strip = img({
      src: assetUrl(base, IMG.franjaCrear),
      alt: "Siempre hay algo más grande por crear. VPER Media",
      width: 480,
      height: 44,
      href: siteHref(d),
      style: font({ size: 13, color: P.white, bold: true }),
    });
    return wrapSignature(
      table({ width: 480 }, [tr(td(null, top)), spacer(12), tr(td(null, strip))]),
      {
        width: 480,
      },
    );
  },
};

const negativo: Proposal = {
  id: "negativo",
  name: "Negativo",
  idea: "Toda la firma es una tarjeta negra como el sitio, con el logo amber de punta a punta. Se siente agencia, no oficina.",
  forWho: "Dirección creativa, pitches y contacto con marcas.",
  risk: "Pesa en los hilos (~150 px de negro por respuesta). Y en Gmail para iOS la tarjeta se invierte a blanca y el logo queda como una franja negra: probalo en modo oscuro.",
  render: (d, base) => {
    // Ceja en amber, no en clay: clay sobre negro cumple (5.4:1), pero cuando Gmail
    // iOS invierte la tarjeta baja a 2.9:1. Amber invertido queda oscuro sobre blanco.
    // Cargo y sedes en filas separadas: con el mismo "·" no se distinguían.
    const left = table({}, [
      row(css(ceja(P.amber)), esc(d.cargo || d.sedes)),
      row(
        f({ size: 18, lineHeight: 22, color: P.white, bold: true }),
        esc(d.nombre),
        "4px 0 0",
      ),
      d.cargo ? row(css(ceja(P.line)), esc(d.sedes), "6px 0 0") : "",
    ]);
    const right = table({}, [
      row(f({ size: 13, lineHeight: 20, color: P.line }), mail(d, P.sky)),
      row(f({ size: 13, lineHeight: 20, color: P.line }), tel(d, P.line)),
      row(f({ size: 13, lineHeight: 20, color: P.line }), web(d, P.sky)),
    ]);
    return wrapSignature(
      table({ width: 480, bgcolor: P.black }, [
        tr(
          td(
            { padding: "24px 24px 0" },
            img({
              src: assetUrl(base, IMG.lineaAmber),
              alt: ALT,
              width: 432,
              height: 34,
              href: siteHref(d),
              style: font({ size: 16, color: P.amber, bold: true }),
            }),
            { bgcolor: P.black, colspan: 2 },
          ),
        ),
        tr([
          td({ padding: "18px 12px 24px 24px" }, left, {
            bgcolor: P.black,
            valign: "bottom",
          }),
          td({ padding: "18px 24px 24px 12px" }, right, {
            bgcolor: P.black,
            valign: "bottom",
            align: "right",
          }),
        ]),
      ]),
      { width: 480, bgcolor: P.black },
    );
  },
};

const respuesta: Proposal = {
  id: "respuesta",
  name: "Respuesta",
  badge: "Respuestas",
  idea: "Dos líneas y el monograma como avatar. Para respuestas, hilos largos y móvil.",
  forWho: "Todo el equipo, en pareja con la estándar.",
  risk: "Omite el correo porque ya está en el remitente: si alguien reenvía el mensaje, se pierde.",
  render: (d, base) =>
    wrapSignature(
      table(
        {},
        tr([
          td(
            null,
            img({
              src: assetUrl(base, IMG.monograma),
              alt: ALT,
              width: 48,
              height: 48,
              href: siteHref(d),
            }),
            { width: 48, valign: "middle" },
          ),
          vSpacer(12),
          td(
            null,
            table({}, [
              row(
                f({ size: 14, lineHeight: 20, color: P.ink, bold: true }),
                `${esc(d.nombre)}<span style="${f({ size: 12, color: P.gray600 })}">${sep()}${esc(d.cargo || "VPER® Media")}</span>`,
              ),
              row(
                f({ size: 12, lineHeight: 18, color: P.gray600 }),
                joinWith([tel(d, P.gray600, 12), web(d, P.link, 12)], sep()),
              ),
            ]),
            { valign: "middle" },
          ),
        ]),
      ),
      { width: 360 },
    ),
};

const cartelera: Proposal = {
  id: "cartelera",
  name: "Cartelera",
  badge: "Campañas",
  idea: "Sello más un banner intercambiable: un caso, un lanzamiento o un evento, con titular en Obviously Wide y botón.",
  forWho: "Eventos, lanzamientos y campañas, por tiempo limitado.",
  risk: "Un banner vencido es peor que ninguno: cada uno con fecha de baja y archivo nuevo (Gmail cachea la URL).",
  render: (d, base) =>
    wrapSignature(
      table({ width: 480 }, [
        tr(td(null, selloBody(d, base))),
        spacer(16),
        tr(
          td(
            null,
            img({
              src: assetUrl(base, IMG.banner),
              alt: "Nuevo caso: Toma Tola. Ver caso en vpermedia.com",
              width: 480,
              height: 120,
              href: d.web.trim()
                ? `${webHref(d.web).replace(/\/+$/, "")}/work/toma-tola`
                : undefined,
              style: font({ size: 13, color: P.white, bold: true }),
            }),
            { bgcolor: P.black },
          ),
        ),
      ]),
      { width: 480 },
    ),
};

export const PROPOSALS: readonly Proposal[] = [
  hoy,
  sello,
  respuesta,
  esencial,
  ceja3,
  banda,
  crear,
  negativo,
  cartelera,
];

/** Para la página: la tipografía de la firma, para mostrarla junto a la del sitio. */
export const SIGNATURE_FONT = FONT_STACK;
