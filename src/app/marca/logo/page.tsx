import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Pair } from "../live";
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
 * Diferencia: allá se elegía entre seis propuestas. Acá hay UN logo en
 * cuatro versiones que entregó diseño, y la pregunta es otra: cuál va
 * dónde. Por eso cada aplicación usa la versión que le toca, no las
 * cuatro en columna.
 *
 * Los mockups (pestaña, teléfono, correo) imitan interfaces ajenas: sus
 * medidas están en logo.module.css y no son escalones del DS a propósito.
 * Los colores sí salen de tokens.
 */

const KEYS: MarkKey[] = ["h1", "h2", "v", "iso"];

const VERSION: Record<
  MarkKey,
  { name: string; file: string; use: string; works: string[]; suffers: string[] }
> = {
  h1: {
    name: "Bloque",
    file: "logo-horizontal-1.svg",
    use: "Portadas, presentaciones, cierre de video, cualquier lugar con aire.",
    works: [
      "Es la versión con más presencia.",
      "MEDIA se lee como firma, no como apellido.",
    ],
    suffers: ["En una barra baja, MEDIA queda a un cuarto del alto y se pierde."],
  },
  h2: {
    name: "Línea",
    file: "logo-horizontal-2.svg",
    use: "Header del sitio, firma de correo, pie, documentos.",
    works: [
      "Entra en una barra de 56–64 px sin achicar el resto.",
      "Es el mismo dibujo que logo-vper-media.svg, el que ya usa el header.",
    ],
    suffers: ["Bajo 160 px de ancho el ® mide 5 px y es un punto."],
  },
  v: {
    name: "Columna",
    file: "logo-vertical.svg",
    use: "Stories, merch, sellos, perfiles cuadrados.",
    works: ["Es casi cuadrado (1.06:1): llena un formato vertical sin aire muerto."],
    suffers: ["Bajo 48 px de alto, MEDIA se empasta."],
  },
  iso: {
    name: "Monograma",
    file: "favicon.svg",
    use: "Favicon, avatar, ícono de app, marca de agua.",
    works: [
      "Es la columna sin MEDIA ni ®: el mismo dibujo, así que la familia se reconoce.",
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

function Head({
  over,
  title,
  children,
}: {
  over: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="@container mb-8 min-w-0 max-w-3xl md:mb-12">
      <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
        {over}
      </p>
      <h2 className="mt-3 font-display display-title-sm font-black uppercase tracking-tight">
        {title}
      </h2>
      <div className="mt-4 font-sans text-body-md font-medium text-muted-foreground">
        {children}
      </div>
    </div>
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
      "Pestaña del navegador a 16 px, en claro y en oscuro. Es el tamaño más chico al que va a vivir la marca. Hoy el sitio no tiene favicon conectado.",
    mock: (
      <div className="grid gap-3">
        {[s.chromeLight, s.chromeDark].map((tone) => (
          <div key={tone} className={`${s.browser} ${tone}`}>
            <div className={s.tabs}>
              <div className={s.tab}>
                <Logo k="iso" decorative style={{ width: 16, height: 13 }} />
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
      "Recorte circular a 40 px en el feed y a 96 px en el perfil. El monograma es casi cuadrado y entra en el círculo con aire.",
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
      "La barra real: 64 px en desktop y 56 px en un teléfono de 390. La línea entra sin achicar el nav.",
    mock: (
      <div className="grid gap-3">
        <div className={`${s.siteBar} ${s.onBlack}`}>
          <Logo k="h2" style={{ width: 150, height: "auto" }} />
          <nav aria-hidden className={s.siteNav}>
            <span>Proyectos</span>
            <span>Servicios</span>
            <span>Nuestro proceso</span>
            <span>Nosotros</span>
          </nav>
          <span className={s.siteCta}>Agenda una cita</span>
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
      "120 px de ancho en el cuerpo de un correo blanco. Es el tamaño más chico al que va la línea.",
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
      "85 × 55 mm. Frente en amber con la columna; dorso en negro con la línea. Las dos caras usan versiones distintas a propósito.",
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
            <Logo k="h2" style={{ width: 110, height: "auto" }} />
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
    why: "La línea no va en diagonal ni de costado.",
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
    <main className="pb-24">
      {/* ── cabecera ── */}
      <section className="wrap mx-auto max-w-[1217px] pt-10 md:pt-16">
        <div className="flex flex-wrap justify-between gap-3 font-sans text-body-sm font-medium text-muted-foreground">
          <span>
            <Link href="/marca" className="underline underline-offset-4">
              Marca
            </Link>{" "}
            · Lineamientos · Logo
          </span>
          <span>Propuesta de uso del logo · Octubre 2026</span>
        </div>
        <div className="@container mt-10 min-w-0 md:mt-16">
          <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
            Cuatro versiones · una palabra
          </p>
          <h1 className="mt-3 font-display display-title font-black uppercase tracking-tight">
            Cuál va <span className="title-brand-gradient">dónde.</span>
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-body-lg font-medium text-muted-foreground">
            El logo de VPER vive en lugares muy distintos: la barra del sitio, una pestaña
            de 16 px, un avatar redondo, el cierre de un reel. Estas son las cuatro
            versiones que entregó diseño, probadas en los mismos contextos para decidir
            cuál usar en cada uno.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {KEYS.map((k) => (
            <a key={k} href={`#v-${k}`} className="group grid gap-2">
              <div className={`${s.tile} ${s.onBlack}`}>
                <Logo
                  k={k}
                  decorative
                  style={{ width: k === "h2" ? "78%" : k === "h1" ? "70%" : "46%" }}
                />
              </div>
              <span className="font-sans text-label-sm font-bold uppercase group-hover:underline">
                {VERSION[k].name}
              </span>
            </a>
          ))}
        </div>
      </section>

      <div className="wrap mx-auto max-w-[1217px]">
        {/* ── versiones ── */}
        <section id="versiones" className={s.section}>
          <Head over="Las versiones" title="Cuatro formas del mismo dibujo">
            Cada versión sobre los tres soportes de la marca: negro, blanco y amber. Sobre
            negro el logo va blanco; sobre blanco y amber, negro.
          </Head>
          <div className="grid gap-12">
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
                      <code className="font-mono text-body-xs text-[var(--text-tertiary)]">
                        {v.file} · {ratio(k).toFixed(2)}:1
                      </code>
                    </div>
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
        </section>

        {/* ── color ── */}
        <section id="color" className={s.section}>
          <Head over="Color" title="Tres tintas, cuatro pares">
            El logo no tiene que cumplir el contraste de un texto, pero sí leerse. La
            medida es la misma que en el sistema: el par en rojo no llega a 3:1 y no se
            usa.
          </Head>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Pair
              fg="--color-neutral-50"
              bg="--color-neutral-950"
              label="Blanco sobre negro"
              min={3}
              sample={<Logo k="h2" className="w-40" />}
            />
            <Pair
              fg="--color-neutral-950"
              bg="--color-neutral-50"
              label="Negro sobre blanco"
              min={3}
              sample={<Logo k="h2" className="w-40" />}
            />
            <Pair
              fg="--color-neutral-950"
              bg="--brand-action"
              label="Negro sobre amber"
              min={3}
              sample={<Logo k="h2" className="w-40" />}
            />
            <Pair
              fg="--brand-action"
              bg="--color-neutral-950"
              label="Amber sobre negro"
              min={3}
              sample={<Logo k="h2" className="w-40" />}
            />
            <Pair
              fg="--color-neutral-50"
              bg="--brand-action"
              label="No · blanco sobre amber"
              min={3}
              sample={<Logo k="h2" className="w-40" />}
            />
            <Pair
              fg="--brand-action"
              bg="--color-neutral-50"
              label="No · amber sobre blanco"
              min={3}
              sample={<Logo k="h2" className="w-40" />}
            />
          </div>
        </section>

        {/* ── reducción ── */}
        <section id="reduccion" className={s.section}>
          <Head over="Prueba de reducción" title="Qué queda cuando se achica">
            A tamaño real en pantalla, sin escalar la imagen. La última columna de la
            línea es la misma sin ®, para ver cuánto ayuda quitarlo en tamaños chicos — es
            una pregunta para el cliente, no una versión entregada.
          </Head>
          <div className="overflow-x-auto">
            <table className={s.scale}>
              <tbody>
                <tr>
                  <th>Monograma · alto</th>
                  {[16, 24, 32, 48, 96].map((px) => (
                    <td key={px}>
                      <Logo k="iso" style={{ height: px, width: "auto" }} />
                      <small>{px}</small>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Columna · alto</th>
                  {[32, 48, 64, 96, 128].map((px) => (
                    <td key={px}>
                      <Logo k="v" style={{ height: px, width: "auto" }} />
                      <small>{px}</small>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Bloque · ancho</th>
                  {[64, 96, 120, 160, 200].map((px) => (
                    <td key={px}>
                      <Logo k="h1" style={{ width: px, height: "auto" }} />
                      <small>{px}</small>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Línea · ancho</th>
                  {[96, 120, 160, 240].map((px) => (
                    <td key={px}>
                      <Logo k="h2" style={{ width: px, height: "auto" }} />
                      <small>{px}</small>
                    </td>
                  ))}
                  <td>
                    <Logo
                      k="h2"
                      registered={false}
                      style={{ width: 96, height: "auto" }}
                    />
                    <small>96 sin ®</small>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-2xl font-sans text-body-sm text-muted-foreground">
            Mínimos propuestos: monograma 16 px de alto, columna 48 px de alto, bloque 120
            px de ancho, línea 120 px de ancho. Por debajo de eso, se cambia de versión en
            vez de achicar.
          </p>
        </section>

        {/* ── área de respeto ── */}
        <section id="respeto" className={s.section}>
          <Head over="Área de respeto" title="El aire que viene con el logo">
            Nada entra en la línea punteada. La unidad x está dibujada en la esquina: en
            el bloque y la columna es el alto de MEDIA; en la línea, su propio alto; en el
            monograma, media fila. Es una propuesta del estudio, para confirmar con
            diseño.
          </Head>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {KEYS.map((k) => (
              <figure key={k} className="m-0 grid gap-2">
                <div className={`${s.sw} ${s.onBlack}`}>
                  <Logo
                    k={k}
                    clear
                    style={{ width: k === "h2" ? "100%" : "80%", height: "auto" }}
                  />
                </div>
                <figcaption className="font-sans text-label-xs font-bold uppercase text-[var(--text-tertiary)]">
                  {VERSION[k].name}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── aplicaciones ── */}
        <section id="aplicaciones" className={s.section}>
          <Head over="Aplicaciones" title="Nueve lugares donde se decide">
            Cada contexto con la versión que le corresponde. Los textos, nombres y correos
            son de ejemplo.
          </Head>
          <div className="grid gap-14">
            {APPS.map((app) => (
              <article
                key={app.title}
                className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10"
              >
                <div className="grid content-start gap-3">
                  <h3 className="font-display text-h3 font-black uppercase">
                    {app.title}
                  </h3>
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
        </section>

        {/* ── usos incorrectos ── */}
        <section id="no" className={s.section}>
          <Head over="Usos incorrectos" title="Lo que no se hace">
            Seis errores comunes cuando el logo pasa por otras manos: imprentas,
            proveedores, plantillas de redes.
          </Head>
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
        </section>

        {/* ── cierre ── */}
        <section id="siguiente" className={s.section}>
          <div className={`${s.verdict} ${s.onBlack}`}>
            <div className="grid content-start gap-6">
              <p className="font-sans text-overline-sm font-bold uppercase text-[var(--color-accent-500)]">
                Qué versión va dónde
              </p>
              <dl className={s.where}>
                <dt>Línea</dt>
                <dd>Sitio, correo, documentos, pie.</dd>
                <dt>Bloque</dt>
                <dd>Portadas, presentaciones, cierre de video.</dd>
                <dt>Columna</dt>
                <dd>Stories, merch, impresos verticales.</dd>
                <dt>Monograma</dt>
                <dd>Favicon, avatar, marca de agua.</dd>
              </dl>
            </div>
            <div className="grid content-start gap-8">
              <div>
                <h3 className="font-sans text-h4 font-bold">Para revisar con diseño</h3>
                <ul className={s.list}>
                  <li>
                    En el bloque, MEDIA está centrada sobre VPER más el ®, no sobre las
                    cuatro letras: queda corrida a la derecha un 3 % del ancho. Confirmar
                    si es a propósito.
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
                <h3 className="font-sans text-h4 font-bold">
                  Siguiente paso en el sitio
                </h3>
                <ul className={s.list}>
                  <li>
                    Conectar el monograma como favicon (<code>app/icon.svg</code> y un{" "}
                    <code>apple-icon.png</code>). Hoy el sitio no tiene ninguno.
                  </li>
                  <li>
                    El header ya usa la línea (<code>logo-vper-media.svg</code>). Si
                    diseño aprueba <code>logo-horizontal-2.svg</code> como la fuente, se
                    regeneran los trazos de <code>lib/vper-wordmark.ts</code> desde ahí.
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
      </div>
    </main>
  );
}
