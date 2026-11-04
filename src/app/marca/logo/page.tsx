import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Pair } from "../live";
import { Crumbs, PageHero, Section } from "../lib/ui";
import { ISOLOGOS, ISOLOGO_REF } from "./isologo-data";
import LogoDownload from "./logo-download";
import { Logo, ratio } from "./marks";
import { MARKS, type MarkKey } from "./marks-data";
import s from "./logo.module.css";

export const metadata: Metadata = {
  title: "Logo",
  robots: { index: false, follow: false },
};

/**
 * Lámina de logo. Patrón de hablemos-de-centroamerica
 * (/marca/logo): las versiones en los mismos fondos, prueba de
 * reducción y aplicaciones reales lado a lado.
 *
 * Diferencia: allá se elegía entre seis propuestas. Acá está lo que
 * entregó diseño en el toolkit (TOOLKIT VPER MEDIA.ai): el ISOLOGO (la
 * casetera, en cuatro colores) y el LOGOTIPO en sus versiones, y la pregunta es cuál va dónde. Los nombres visibles son los
 * del toolkit; los internos de la primera lámina (Bloque, Línea, Columna,
 * Monograma) quedan como «antes …» para el equipo.
 *
 * Los mockups (pestaña, teléfono, correo) imitan interfaces ajenas: sus
 * medidas están en logo.module.css y no son escalones del DS a propósito.
 * Los colores sí salen de tokens.
 */

const KEYS: MarkKey[] = ["h1", "h2", "v", "iso"];

const VERSION: Record<
  MarkKey,
  {
    /** Rótulo del toolkit de diseño: es lo que la gente busca. */
    name: string;
    /** Nombre interno de la primera lámina, para el equipo. */
    alias: string;
    file: string;
    use: string;
    works: string[];
    suffers: string[];
  }
> = {
  h1: {
    name: "Logotipo horizontal",
    alias: "Bloque",
    file: "logo-horizontal-1.svg",
    use: "La firma por defecto: si no sabés cuál usar, bajá esta, en negro (o en blanco sobre oscuro). Documentos, co-branding, cierre de video, impresión a una tinta.",
    works: [
      "Es la versión con más presencia.",
      "MEDIA se lee como firma, no como apellido.",
    ],
    suffers: ["En una barra baja, MEDIA queda a un cuarto del alto y se pierde."],
  },
  h2: {
    name: "Logotipo en línea",
    alias: "Línea",
    file: "logo-horizontal-2.svg",
    use: "Header del sitio, firma de correo, pie, documentos.",
    works: [
      "Entra en una barra de 56–64 px sin achicar el resto.",
      "Es el mismo dibujo que logo-vper-media.svg, el que ya usa el header.",
    ],
    suffers: ["Bajo 160 px de ancho el ® mide 5 px y es un punto."],
  },
  v: {
    name: "Logotipo vertical",
    alias: "Columna",
    file: "logo-vertical.svg",
    use: "Stories, merch, sellos, perfiles cuadrados.",
    works: ["Es casi cuadrado (1.06:1): llena un formato vertical sin aire muerto."],
    suffers: ["Bajo 48 px de alto, MEDIA se empasta."],
  },
  iso: {
    name: "Favicon",
    alias: "Monograma",
    file: "favicon.svg",
    use: "Favicon, avatar, ícono de app, marca de agua.",
    works: [
      "Es el vertical sin MEDIA ni ®: el mismo dibujo, así que la familia se reconoce.",
      "Hace de isotipo: VPER no tiene un símbolo sin letras, y el VP/ER es lo que cumple ese papel.",
      "A 16 px se sigue leyendo VP/ER como una forma.",
    ],
    suffers: ["Solo dice VPER. Necesita que la marca ya esté presentada en otro lado."],
  },
};

/** Superficies fijas de la lámina: no dependen del tema, son el soporte. */
const SURFACES = [
  [s.onBlack, "Negro"],
  [s.onWhite, "Blanco"],
  [s.onAmber, "Amber"],
] as const;

/**
 * El toolkit no declara una versión principal: isologo y logotipo son dos
 * familias del mismo nivel. «Por defecto» marca solo la descarga segura para
 * quien no sabe cuál usar (funciona a una tinta y en chico), no una jerarquía.
 */
function PorDefecto() {
  return (
    <span className="inline-flex w-fit items-center rounded-[var(--pill-radius)] bg-[var(--brand-action)] px-2.5 py-0.5 font-sans text-label-xs font-bold uppercase text-[var(--text-on-brand)]">
      Por defecto
    </span>
  );
}

function Tag({ k }: { k: MarkKey }) {
  return (
    <span className="inline-flex w-fit items-center rounded-[var(--pill-radius)] bg-[var(--pill-brand-bg)] px-2.5 py-0.5 font-sans text-label-xs font-bold uppercase text-[var(--pill-brand-text)]">
      {VERSION[k].name}
    </span>
  );
}

/* ───────────────────────── aplicaciones ───────────────────────── */

const APPS: { title: string; k: MarkKey[]; tests: string; mock: ReactNode }[] = [
  {
    title: "Favicon",
    k: ["iso"],
    tests:
      "Pestaña del navegador a 16 px, en claro y en oscuro. Es el tamaño más chico al que va a vivir la marca. El sitio ya lo usa, sobre una placa amber.",
    mock: (
      <div className="grid gap-3">
        {[s.chromeLight, s.chromeDark].map((tone) => (
          <div key={tone} className={`${s.browser} ${tone}`}>
            <div className={s.tabs}>
              <div className={s.tab}>
                {/* Como app/icon.svg: el monograma casi a sangre sobre la placa amber. */}
                <span className={s.favicon}>
                  <Logo k="iso" pad={0.07} decorative />
                </span>
                <span>VPER Media — Siempre hay algo…</span>
              </div>
              <div className={`${s.tab} ${s.tabGhost}`}>
                <span>Nueva pestaña</span>
              </div>
            </div>
            <div className={s.addr}>vpermedia.com/work</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Avatar en redes",
    k: ["iso"],
    tests:
      "Recorte circular a 40 px en el feed y a 96 px en el perfil. El favicon es casi cuadrado y entra en el círculo con aire.",
    mock: (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`${s.feed} ${s.chromeLight}`}>
          <div className={`${s.avatar} ${s.onAmber}`} style={{ width: 40, height: 40 }}>
            <Logo k="iso" pad={0.5} decorative />
          </div>
          <div className="min-w-0">
            <b>vpermedia</b> <i>· 2 h</i>
            <p>Detrás de cámaras: así se armó la campaña de Toma Tola.</p>
          </div>
        </div>
        <div className={`${s.profile} ${s.chromeDark}`}>
          <div className={`${s.avatar} ${s.onBlack}`} style={{ width: 96, height: 96 }}>
            <Logo k="iso" pad={0.5} decorative />
          </div>
          <div>
            <b>VPER Media</b>
            <span>Agencia creativa · Managua</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Header del sitio",
    k: ["h2"],
    tests:
      "La barra real: 64 px en desktop y 56 px en un teléfono de 390. El logotipo en línea entra sin achicar el nav.",
    mock: (
      <div className="grid gap-3">
        <div className={`${s.siteBar} ${s.onBlack}`}>
          <Logo k="h2" style={{ width: 150, height: "auto" }} />
          {/* Solo los ítems que entran: el resto del nav real no cabe en la maqueta. */}
          <nav aria-hidden className={s.siteNav}>
            <span>Proyectos</span>
            <span>Servicios</span>
          </nav>
          <span className={s.siteCta}>¿Nos reunimos?</span>
        </div>
        <div className={s.phone}>
          <div className={`${s.phoneBar} ${s.onBlack}`}>
            <Logo k="h2" style={{ width: 120, height: "auto" }} />
            <span className={s.burger} aria-hidden>
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className={s.phoneHero}>
            <img
              src="/images/hero-tomatola-mobile.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Post de caso",
    k: ["h2"],
    tests:
      "Formato 4:5 sobre foto. El logo va chico, en una esquina, y compite con el titular y con la imagen.",
    mock: (
      <div className={s.post45}>
        <img
          src="/images/hero-tomatola-mobile.webp"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className={s.postShade} />
        <div className={s.postBody}>
          <span className={s.postEyebrow}>Caso</span>
          <p className={s.postTitle}>Toma Tola</p>
          <Logo k="h2" className={s.postMark} />
        </div>
      </div>
    ),
  },
  {
    title: "Cierre de reel",
    k: ["h1"],
    tests:
      "Cierre vertical 9:16 sobre negro. Acá se prueba la propuesta de llevar el recorrido de los titulares (sky → clay → amber) al logo, solo en video.",
    mock: (
      <div className="grid grid-cols-2 gap-3">
        <div className={s.reel}>
          <Logo k="h1" fill="btl" className={s.reelMark} />
          <span className={s.reelLine}>Siempre hay algo más grande por</span>
          <span className={s.reelScript}>Crear.</span>
        </div>
        <div className={s.reel}>
          <Logo k="h1" className={`${s.reelMark} text-[var(--color-neutral-50)]`} />
          <span className={s.reelLine}>Siempre hay algo más grande por</span>
          <span className={s.reelScript}>Crear.</span>
        </div>
      </div>
    ),
  },
  {
    title: "Firma de correo",
    k: ["h2"],
    tests:
      "120 px de ancho en el cuerpo de un correo blanco. Es el tamaño más chico al que va el logotipo en línea.",
    mock: (
      <div className={`${s.mail} ${s.chromeLight}`}>
        <div className={s.mailHead}>
          <b>Propuesta de campaña</b>
          <span>VPER Media · para mí</span>
        </div>
        <div className={s.mailBody}>
          <i />
          <i />
          <i style={{ width: "60%" }} />
        </div>
        <div className={s.signature}>
          <b>Nombre Apellido</b>
          <span>Dirección de cuentas</span>
          <Logo k="h2" style={{ width: 120, height: "auto", marginTop: 10 }} />
        </div>
      </div>
    ),
  },
  {
    title: "Portada de presentación",
    k: ["h1"],
    tests:
      "Diapositiva 16:9, que en una sala se ve a pantalla completa y en un correo a 300 px de ancho.",
    mock: (
      // `dark`: la textura sigue al tema; la portada es siempre negra.
      <div className={`dark ${s.slide} bg-brand-texture`}>
        <Logo k="h1" className={s.slideMark} />
        <div className={s.slideFoot}>
          <span>Propuesta creativa</span>
          <span>Octubre 2026</span>
        </div>
      </div>
    ),
  },
  {
    title: "Tarjeta de presentación",
    k: ["v", "h2"],
    tests:
      "85 × 55 mm. Frente en amber con el vertical; dorso en negro con el de una línea. Las dos caras usan versiones distintas a propósito.",
    mock: (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`${s.card} ${s.onAmber}`}>
          <Logo k="v" className={s.cardV} />
        </div>
        <div className={`${s.card} ${s.onBlack} ${s.cardBack}`}>
          <div>
            <b>Nombre Apellido</b>
            <span>Dirección creativa</span>
          </div>
          <div>
            <span>nombre@vpermedia.com</span>
            <Logo k="h2" className={s.cardLine} />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Una tinta",
    k: ["h2", "iso"],
    tests:
      "Negro sobre blanco, como en prensa o un sello, y blanco sobre foto como marca de agua. Sin color no hay acento que ayude.",
    mock: (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`${s.press} ${s.onWhite}`}>
          <Logo k="h2" style={{ width: "70%", height: "auto" }} />
        </div>
        <div className={s.watermark}>
          <img
            src="/images/hero-tabaco-mobile.webp"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <Logo k="iso" className={s.watermarkMark} />
        </div>
      </div>
    ),
  },
];

/* ───────────────────────── reducción ───────────────────────── */

/** El isologo, por ancho: abajo de 120 px MEDIA y el ® dejan de leerse. */
const ISO_SIZES = [64, 96, 120, 160, 240];

/** Cada fila mide por el lado que limita a esa versión: alto o ancho. */
const SCALE: { label: string; k: MarkKey; by: "alto" | "ancho"; sizes: number[] }[] = [
  { label: "Favicon · alto", k: "iso", by: "alto", sizes: [16, 24, 32, 48, 96] },
  { label: "Vertical · alto", k: "v", by: "alto", sizes: [32, 48, 64, 96, 128] },
  { label: "Horizontal · ancho", k: "h1", by: "ancho", sizes: [64, 96, 120, 160, 200] },
  { label: "En línea · ancho", k: "h2", by: "ancho", sizes: [96, 120, 160, 240] },
];

/* ───────────────────────── usos incorrectos ───────────────────────── */

const DONTS: { label: string; why: string; node: ReactNode }[] = [
  {
    label: "Deformar",
    why: "Ni ancho ni alto por separado. Siempre en proporción.",
    node: (
      <Logo
        k="h2"
        decorative
        style={{ width: "76%", height: "auto" }}
        className={s.stretch}
      />
    ),
  },
  {
    label: "Rotar",
    why: "El logotipo no va en diagonal ni de costado.",
    node: <Logo k="h2" decorative className={s.rotate} />,
  },
  {
    label: "Amber sobre blanco",
    why: "1.6:1. Amber es tinta solo sobre negro; sobre claro, el logo va en negro.",
    node: (
      <div className={`${s.dontBox} ${s.onWhite}`}>
        <Logo k="h2" decorative className="w-full text-[var(--brand-action)]" />
      </div>
    ),
  },
  {
    label: "Contorno",
    why: "El logo es un bloque lleno. En contorno el ® y los ojos de la P y la R se cierran.",
    node: <Logo k="h2" decorative className={s.outline} />,
  },
  {
    label: "Sombra o brillo",
    why: "Sobre foto se resuelve con una capa oscura detrás, no con efectos sobre el logo.",
    node: <Logo k="h2" decorative className={s.shadow} />,
  },
  {
    label: "Recolorear el isologo",
    why: "La casetera va en sus cuatro colores de paleta, tal cual. Ni otros tonos ni el cuerpo en un color y la pantalla en otro.",
    node: (
      <img
        src={ISOLOGO_REF.src}
        alt=""
        className={s.recolor}
        loading="lazy"
        decoding="async"
      />
    ),
  },
  {
    label: "Recomponer",
    why: "No se arma una versión nueva moviendo piezas. Si falta una, se pide a diseño.",
    node: (
      // MEDIA (los cinco trazos de abajo) alineada a la izquierda.
      <svg viewBox={`0 0 ${MARKS.h1.viewBox.join(" ")}`} className="w-full" aria-hidden>
        {MARKS.h1.strokes.map(([, d], i) => (
          <path
            key={d.slice(0, 40)}
            d={d}
            fill="currentColor"
            transform={i < 5 ? "translate(-122.9 0)" : undefined}
          />
        ))}
      </svg>
    ),
  },
];

export default function LogoPage() {
  return (
    <main className="wrap mx-auto max-w-[1217px] pb-24">
      <Crumbs trail={["Lineamientos", "Logo"]} note="Propuesta · Actualizado oct. 2026" />
      <PageHero
        over="Logo · versiones y descargas"
        title="Cuál va"
        accent="dónde."
        lede="El logo de VPER vive en lugares muy distintos: una portada, la barra del sitio, una pestaña de 16 px, un avatar redondo. VPER tiene dos familias del mismo nivel: el logotipo es la firma, el isologo es la marca expresiva."
      >
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
          <a
            href="#v-isologo"
            className="group col-span-2 grid min-w-0 gap-2 md:col-span-1"
          >
            <div className={`${s.tile} ${s.tileWide} ${s.onWhite}`}>
              <img src={ISOLOGO_REF.src} alt="" className={s.isoTile} decoding="async" />
            </div>
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-label-sm font-bold uppercase group-hover:underline">
                Isologo
              </span>
            </span>
            <span className="font-sans text-body-xs text-[var(--text-secondary)]">
              La casetera · 4 colores
            </span>
          </a>
          {KEYS.map((k) => (
            <a key={k} href={`#v-${k}`} className="group grid min-w-0 gap-2">
              <div className={`${s.tile} ${s.onBlack}`}>
                <Logo
                  k={k}
                  decorative
                  style={{ width: k === "h2" ? "78%" : k === "h1" ? "70%" : "46%" }}
                />
              </div>
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-label-sm font-bold uppercase group-hover:underline">
                  {VERSION[k].name}
                </span>
                {k === "h1" ? <PorDefecto /> : null}
              </span>
              <span className="font-sans text-body-xs text-[var(--text-secondary)]">
                antes «{VERSION[k].alias}»
              </span>
            </a>
          ))}
        </div>
        <aside
          id="terminos"
          aria-labelledby="terminos-title"
          className="mt-8 grid max-w-3xl gap-2 rounded-[var(--radius-lg)] border border-border bg-[var(--surface-raised)] p-5"
        >
          <h2 id="terminos-title" className="font-sans text-h4 font-bold">
            ¿Buscás el isologo, el logotipo o el isotipo?
          </h2>
          <p className="font-sans text-body-sm text-[var(--text-secondary)]">
            VPER tiene dos familias del mismo nivel. El{" "}
            <b className="text-foreground">logotipo</b> (horizontal, vertical y en una
            línea) es la firma: identifica a la agencia en web, correo, documentos y a
            cualquier tamaño. El <b className="text-foreground">isologo</b> (las cuatro
            caseteras) es la marca expresiva: protagoniza piezas, fondos y redes, siempre
            a color y a 120 px o más. VPER no tiene un isotipo sin letras: el{" "}
            <b className="text-foreground">favicon</b> (VP/ER) hace ese papel en avatares,
            pestañas y marcas de agua. ¿No sabés cuál usar? El logotipo horizontal en
            negro.
          </p>
        </aside>
      </PageHero>

      <LogoDownload />

      {/* ── versiones ── */}
      <Section
        id="versiones"
        toc="Versiones"
        over="Las versiones"
        title="El isologo y sus logotipos"
        lede="Las dos familias: el isologo a color y el logotipo en sus tres formas, más el favicon, cada uno sobre los tres soportes de la marca: negro, blanco y amber. Sobre negro el logotipo va blanco; sobre blanco y amber, negro."
        className="border-t-0"
      >
        <div className="grid gap-12">
          <article
            id="v-isologo"
            className="grid scroll-mt-20 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10"
          >
            <div className="grid content-start gap-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-h2 font-black uppercase">Isologo</h3>
              </div>
              <p className="font-sans text-label-sm font-bold uppercase text-[var(--text-eyebrow)]">
                La casetera · clay, amber, jade y sky
              </p>
              <p className="font-sans text-body-md font-bold">
                La marca expresiva. Redes, portadas, presentaciones, merch, fondos, piezas
                BTL a color. Mientras diseño unifica las cuatro, preferí la clay o la
                jade: son las completas.
              </p>
              <ul className={s.pros}>
                <li>
                  Es lo que hace reconocible a VPER: la palabra vive dentro del aparato.
                </li>
                <li>El contorno negro grueso la separa de casi cualquier fondo.</li>
                <li className={s.con}>
                  Abajo de 120 px de ancho MEDIA y el ® no se leen: ahí va el logotipo o
                  el favicon.
                </li>
                <li className={s.con}>
                  No va sobre su mismo color (la amber sobre amber) ni sobre fotos
                  cargadas.
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {ISOLOGOS.map((iso) => (
                <figure key={iso.key} className="m-0 grid gap-2">
                  <div className={`${s.sw} ${s.onWhite}`}>
                    <img
                      src={iso.src}
                      alt={`Isologo VPER en ${iso.name}`}
                      className={s.isoImg}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption className="flex flex-wrap gap-x-2 font-sans text-label-xs font-bold uppercase text-[var(--text-tertiary)]">
                    <span>{iso.name}</span>
                    {!iso.media ? <span className={s.flag}>sin MEDIA</span> : null}
                    {!iso.registered ? <span className={s.flag}>sin ®</span> : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </article>
          {KEYS.map((k) => {
            const v = VERSION[k];
            return (
              <article
                key={k}
                id={`v-${k}`}
                className="grid scroll-mt-20 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10"
              >
                <div className="grid content-start gap-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-h2 font-black uppercase">
                      {v.name}
                    </h3>
                    {k === "h1" ? <PorDefecto /> : null}
                    <code className="font-mono text-body-xs text-[var(--text-tertiary)]">
                      {v.file} · {ratio(k).toFixed(2)}:1
                    </code>
                  </div>
                  <p className="font-sans text-label-sm font-bold uppercase text-[var(--text-eyebrow)]">
                    antes «{v.alias}»
                  </p>
                  <p className="font-sans text-body-md font-bold">{v.use}</p>
                  <ul className={s.pros}>
                    {v.works.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                    {v.suffers.map((t) => (
                      <li key={t} className={s.con}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {SURFACES.map(([tone, label]) => (
                    <figure key={label} className="m-0 grid gap-2">
                      <div className={`${s.sw} ${tone}`}>
                        <Logo
                          k={k}
                          style={{
                            width:
                              k === "h2"
                                ? "92%"
                                : k === "h1"
                                  ? "84%"
                                  : k === "v"
                                    ? "50%"
                                    : "44%",
                            height: "auto",
                          }}
                        />
                      </div>
                      <figcaption className="font-sans text-label-xs font-bold uppercase text-[var(--text-tertiary)]">
                        {label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* ── color ── */}
      <Section
        id="color"
        toc="Color"
        over="Color"
        title="Tres tintas, cuatro pares"
        lede="El logo no tiene que cumplir el contraste de un texto, pero sí leerse. La medida es la misma que en el sistema: el par en rojo no llega a 3:1 y no se usa."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Pair
            fg="--color-neutral-50"
            bg="--color-neutral-950"
            label="Blanco sobre negro"
            min={3}
            sampleClassName="min-w-0"
            sample={<Logo k="h2" className="h-auto w-40 max-w-full" />}
          />
          <Pair
            fg="--color-neutral-950"
            bg="--color-neutral-50"
            label="Negro sobre blanco"
            min={3}
            sampleClassName="min-w-0"
            sample={<Logo k="h2" className="h-auto w-40 max-w-full" />}
          />
          <Pair
            fg="--color-neutral-950"
            bg="--brand-action"
            label="Negro sobre amber"
            min={3}
            sampleClassName="min-w-0"
            sample={<Logo k="h2" className="h-auto w-40 max-w-full" />}
          />
          <Pair
            fg="--brand-action"
            bg="--color-neutral-950"
            label="Amber sobre negro"
            min={3}
            sampleClassName="min-w-0"
            sample={<Logo k="h2" className="h-auto w-40 max-w-full" />}
          />
          <Pair
            fg="--color-neutral-50"
            bg="--brand-action"
            label="No · blanco sobre amber"
            min={3}
            sampleClassName="min-w-0"
            sample={<Logo k="h2" className="h-auto w-40 max-w-full" />}
          />
          <Pair
            fg="--brand-action"
            bg="--color-neutral-50"
            label="No · amber sobre blanco"
            min={3}
            sampleClassName="min-w-0"
            sample={<Logo k="h2" className="h-auto w-40 max-w-full" />}
          />
        </div>
      </Section>

      {/* ── reducción ── */}
      <Section
        id="reduccion"
        toc="Reducción"
        over="Prueba de reducción"
        title="Qué queda cuando se achica"
        lede="A tamaño real en pantalla, sin escalar la imagen. La última columna del logotipo en línea es el mismo sin ®, para ver cuánto ayuda quitarlo en tamaños chicos — es una pregunta para el cliente, no una versión entregada."
      >
        <ul className={s.scale}>
          <li className={s.scaleRow}>
            <h3 className={s.scaleLabel}>Isologo · ancho</h3>
            <ul className={s.scaleItems}>
              {ISO_SIZES.map((px) => (
                <li key={px}>
                  <img
                    src={ISOLOGO_REF.src}
                    alt=""
                    width={px}
                    height={Math.round((px * ISOLOGO_REF.size[1]) / ISOLOGO_REF.size[0])}
                    loading="lazy"
                    decoding="async"
                  />
                  <small>{px}</small>
                </li>
              ))}
            </ul>
          </li>
          {SCALE.map((row) => (
            <li key={row.label} className={s.scaleRow}>
              <h3 className={s.scaleLabel}>{row.label}</h3>
              <ul className={s.scaleItems}>
                {row.sizes.map((px) => (
                  <li key={px}>
                    <Logo
                      k={row.k}
                      style={
                        row.by === "alto"
                          ? { height: px, width: "auto" }
                          : { width: px, height: "auto" }
                      }
                    />
                    <small>{px}</small>
                  </li>
                ))}
                {row.k === "h2" ? (
                  <li>
                    <Logo
                      k="h2"
                      registered={false}
                      style={{ width: 96, height: "auto" }}
                    />
                    <small>96 sin ®</small>
                  </li>
                ) : null}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl font-sans text-body-sm text-muted-foreground">
          Mínimos propuestos: isologo 120 px de ancho, favicon 16 px de alto, logotipo
          vertical 48 px de alto, horizontal y en línea 120 px de ancho. Por debajo de
          eso, se cambia de versión en vez de achicar.
        </p>
      </Section>

      {/* ── área de respeto ── */}
      <Section
        id="respeto"
        toc="Área de respeto"
        over="Área de respeto"
        title="El aire que viene con el logo"
        lede="Nada entra en la línea punteada. La unidad x, el cuadrado sky de la esquina, es el alto de MEDIA: en el logotipo en línea coincide con su alto. El favicon no tiene MEDIA y ahí x es media fila de VP/ER. Es para los logotipos; el isologo trae su aire en el contorno negro. Propuesta del estudio, para confirmar con diseño."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {KEYS.map((k) => (
            <figure key={k} className="m-0 grid min-w-0 gap-2">
              <div className={`${s.clearBox} ${s.onBlack}`}>
                <Logo k={k} clear />
              </div>
              <figcaption className="font-sans text-label-xs font-bold uppercase text-[var(--text-tertiary)]">
                {VERSION[k].name}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ── aplicaciones ── */}
      <Section
        id="aplicaciones"
        toc="Aplicaciones"
        over="Aplicaciones"
        title="Nueve lugares donde se decide"
        lede="Cada contexto con la versión que le corresponde. Los textos, nombres y correos son de ejemplo."
      >
        <div className="grid gap-14">
          {APPS.map((app) => (
            <article
              key={app.title}
              className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10"
            >
              <div className="grid content-start gap-3">
                <h3 className="font-display text-h3 font-black uppercase">{app.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {app.k.map((k) => (
                    <Tag key={k} k={k} />
                  ))}
                </div>
                <p className="font-sans text-body-sm font-medium text-muted-foreground">
                  {app.tests}
                </p>
              </div>
              <div className="min-w-0">{app.mock}</div>
            </article>
          ))}
        </div>
      </Section>

      {/* ── usos incorrectos ── */}
      <Section
        id="no"
        toc="Usos incorrectos"
        over="Usos incorrectos"
        title="Lo que no se hace"
        lede="Siete errores comunes cuando el logo pasa por otras manos: imprentas, proveedores, plantillas de redes."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DONTS.map((d) => (
            <figure key={d.label} className="m-0 grid gap-3">
              <div className={`${s.dont} ${s.onBlack}`}>
                <span className={s.cross} aria-hidden />
                {d.node}
              </div>
              <figcaption className="grid gap-1">
                <b className="font-sans text-body-sm font-bold">{d.label}</b>
                <span className="font-sans text-body-sm text-muted-foreground">
                  {d.why}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ── cierre ── */}
      <section
        id="siguiente"
        data-toc="Qué va dónde"
        className="scroll-mt-24 border-t border-border py-14 md:py-20"
      >
        <div className={`${s.verdict} ${s.onBlack}`}>
          <div className="grid content-start gap-6">
            <p className="font-sans text-overline-sm font-bold uppercase text-[var(--color-accent-500)]">
              Qué versión va dónde
            </p>
            <dl className={s.where}>
              <dt>Isologo</dt>
              <dd>Marca expresiva. Redes, portadas, merch, piezas a color.</dd>
              <dt>Horizontal</dt>
              <dd>Por defecto. Documentos, co-branding, cierre de video, una tinta.</dd>
              <dt>En línea</dt>
              <dd>Sitio, correo, pie, barras bajas.</dd>
              <dt>Vertical</dt>
              <dd>Stories, impresos verticales, sellos.</dd>
              <dt>Favicon</dt>
              <dd>Hace de isotipo: pestaña, avatar, marca de agua.</dd>
            </dl>
          </div>
          <div className="grid content-start gap-8">
            <div>
              <h3 className="font-sans text-h4 font-bold">Para revisar con diseño</h3>
              <ul className={s.list}>
                <li>
                  El toolkit no marca jerarquía, así que la lámina presenta isologo y
                  logotipo como dos familias del mismo nivel, con el logotipo horizontal
                  en negro como descarga por defecto. Si diseño declara una versión
                  principal, se cambia acá.
                </li>
                <li>
                  Definir una casetera de referencia. La lámina recomienda la clay y la
                  jade porque son las únicas completas, con MEDIA y ®.
                </li>
                <li>
                  Las caseteras no son iguales: la sky no trae MEDIA y la amber trae un
                  punto en lugar del ®. ¿Son variantes a propósito o hay que corregirlas?
                </li>
                <li>
                  La casetera sky y el fondo a color usan <code>#89C9CD</code>, un verde
                  agua fuera de la paleta (jade es <code>#74BDB7</code>). Pedir los
                  archivos corregidos.
                </li>
                <li>
                  El toolkit dice «RECURSOS VPER MERDIA»: corregir la lámina antes de
                  compartirla.
                </li>
                <li>
                  Falta el isologo a una tinta (blanco y negro) para sellos, grabados e
                  impresión de un color.
                </li>
                <li>
                  El logotipo en línea aparece en el toolkit en «Recursos», sin rótulo.
                  Confirmar que es una versión oficial.
                </li>
                <li>
                  En el logotipo horizontal, MEDIA está centrada sobre VPER más el ®, no
                  sobre las cuatro letras: queda corrida a la derecha un 3 % del ancho.
                  Confirmar si es a propósito.
                </li>
                <li>
                  Los cuatro SVG traen el color en un <code>&lt;style&gt;</code> con la
                  clase <code>.cls-1</code> y negro <code>#010101</code>. Pedir la
                  exportación con <code>currentColor</code> y sin estilos, para
                  inlinearlos sin choques.
                </li>
                <li>
                  El ® en tamaños chicos: ¿hay una versión sin ® aprobada para usos
                  menores a 120 px?
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-sans text-h4 font-bold">Siguiente paso en el sitio</h3>
              <ul className={s.list}>
                <li>
                  Favicon conectado (octubre 2026): el VP/ER sobre una placa amber en{" "}
                  <code>app/icon.svg</code> y <code>app/apple-icon.png</code>. La placa
                  hace que se lea igual en pestañas claras y oscuras.
                </li>
                <li>
                  El header ya usa el logotipo en línea (<code>logo-vper-media.svg</code>
                  ). Si diseño aprueba <code>logo-horizontal-2.svg</code> como la fuente,
                  se regeneran los trazos de <code>lib/vper-wordmark.ts</code> desde ahí.
                </li>
                <li>
                  Ver en el cliente si el recorrido BTL en el logo entra como acento de
                  video.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
