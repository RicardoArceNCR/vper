import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Pill } from "@ui/components/pill";
import ServicesGrid from "@/sections/services-grid";
import { Crumbs, PageHero, Section } from "../lib/ui";
import { Pair, Ramp, ReplayHero, Swatch, TokenName, TypeRow, WidthProbe } from "../live";

/**
 * Lámina del sistema de VPER. Patrón tomado de contracorriente
 * (/marca): cimientos → componentes → composición real, y el
 * nombre del token al lado de cada muestra.
 *
 * Diferencia a propósito: acá NO se copian hex ni px. Cada muestra pinta
 * con `var(--token)` y los componentes de ./live leen lo que computó el
 * navegador. VPER pisa el paquete desde brand.css; una lámina con valores
 * escritos a mano mostraría lo que el archivo dice, no lo que gana.
 */

export const metadata: Metadata = { title: "Sistema" };

const SPACING = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "16",
  "20",
  "24",
] as const;
const RADII = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "full"] as const;
const SHADOWS = ["sm", "md", "lg"] as const;

// nowrap: en 390 el display-hero no entra. Se recorta en vez de partir
// la palabra — la muestra es del tamaño, no del titular. Sin tracking-tight:
// el tracking lo pone el token, y la muestra tiene que mostrar ese.
const display = "font-display font-black uppercase whitespace-nowrap";
const TYPE: { name: string; className: string; sample: ReactNode }[] = [
  {
    name: "text-display-hero",
    className: `${display} text-display-hero`,
    sample: "Crear",
  },
  {
    name: "text-display-xl",
    className: `${display} text-display-xl`,
    sample: "Portafolio",
  },
  {
    name: "text-display-lg",
    className: `${display} text-display-lg`,
    sample: "Servicios",
  },
  { name: "text-display-md", className: `${display} text-display-md`, sample: "Método" },
  {
    name: "text-display-sm",
    className: `${display} text-display-sm`,
    sample: "Hablemos",
  },
  {
    name: "text-h1",
    className: "font-sans text-h1 font-bold",
    sample: "Planeación estratégica",
  },
  {
    name: "text-h2",
    className: "font-sans text-h2 font-bold",
    sample: "Planeación estratégica",
  },
  {
    name: "text-h3",
    className: "font-sans text-h3 font-bold",
    sample: "Planeación estratégica",
  },
  {
    name: "text-h4",
    className: "font-sans text-h4 font-bold",
    sample: "Planeación estratégica",
  },
  {
    name: "text-h5",
    className: "font-sans text-h5 font-bold",
    sample: "Planeación estratégica",
  },
  {
    name: "text-body-lg",
    className: "font-sans text-body-lg font-medium",
    sample: "Las buenas ideas tienen un pequeño problema: nunca se quedan quietas.",
  },
  {
    name: "text-body-md",
    className: "font-sans text-body-md font-medium",
    sample: "Las buenas ideas tienen un pequeño problema: nunca se quedan quietas.",
  },
  {
    name: "text-body-sm",
    className: "font-sans text-body-sm font-medium",
    sample: "Las buenas ideas tienen un pequeño problema: nunca se quedan quietas.",
  },
  {
    name: "text-body-xs",
    className: "font-sans text-body-xs font-medium",
    sample: "Las buenas ideas tienen un pequeño problema: nunca se quedan quietas.",
  },
  {
    name: "text-label-lg",
    className: "font-sans text-label-lg font-bold uppercase",
    sample: "Branding",
  },
  {
    name: "text-label-md",
    className: "font-sans text-label-md font-bold uppercase",
    sample: "Branding",
  },
  {
    name: "text-label-sm",
    className: "font-sans text-label-sm font-bold uppercase",
    sample: "Branding",
  },
  {
    name: "text-label-xs",
    className: "font-sans text-label-xs font-bold uppercase",
    sample: "Branding",
  },
  {
    name: "text-overline-lg",
    className:
      "font-sans text-overline-lg font-bold uppercase text-[var(--text-eyebrow)]",
    sample: "Portafolio",
  },
  {
    name: "text-overline-sm",
    className:
      "font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]",
    sample: "Portafolio",
  },
  // No hay utilidad text-code-md en el bridge: se lee el estilo de brand.css.
  {
    name: "--typography-styles-code-md",
    className:
      "font-mono text-[length:var(--typography-styles-code-md-size)] leading-[var(--typography-styles-code-md-line-height)]",
    sample: "--brand-action",
  },
];


function Sub({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 font-sans text-label-sm font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
      {children}
    </h3>
  );
}

/** Nota al pie de una muestra, para el equipo. */
function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 max-w-2xl font-sans text-body-sm text-[var(--text-secondary)]">
      {children}
    </p>
  );
}

/**
 * El detalle técnico de una sección (nombres de archivo, clases, umbrales):
 * chico y aparte, para que la bajada quede en idioma del equipo.
 */
function DevNote({ children }: { children: ReactNode }) {
  return (
    <aside className="mt-8 max-w-3xl border-l-2 border-[var(--border-default)] pl-4 font-sans text-body-xs text-[var(--text-secondary)]">
      <p className="mb-1 font-sans text-label-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
        Para desarrollo
      </p>
      <div className="grid gap-1">{children}</div>
    </aside>
  );
}

export default function SistemaPage() {
  return (
    <main className="wrap mx-auto max-w-[1217px] pb-24">
      <Crumbs
        trail={["Design system", "Sistema"]}
        note="En revisión · Actualizado oct. 2026"
      />
      <PageHero
        over="Design system"
        title="Con qué está"
        accent="hecho."
        lede="Los colores, las letras y las piezas del sitio, tal como se ven hoy. Tocá un color para copiarlo. Cada muestra trae su nombre técnico para diseño y desarrollo."
      />

      <Section
        id="escalas"
        toc="Escalas"
        over="Tokens · color"
        title="Escalas"
        lede="Las cuatro familias de color de VPER (Amber, Clay, Jade y Sky) y el neutro, de claro a oscuro. El cuadro con aro es el color de marca tal cual; el resto de la escala se arma alrededor de él."
      >
        <div className="grid gap-10">
          <Ramp
            family="main"
            role="Amber"
            anchor={300}
            note="marca, aviso · #FDBF66"
          />
          <Ramp
            family="accent"
            role="Clay"
            anchor={600}
            note="error, cejas · #D55856"
          />
          <Ramp family="leaf" role="Jade" anchor={400} note="éxito · #74BDB7" />
          <Ramp family="info" role="Sky" anchor={500} note="enlaces, foco · #5EB2E3" />
          <Ramp family="neutral" role="Neutral" note="gris puro, sin tinte" />
        </div>
        <DevNote>
          <p>
            Cada familia se ancla en el hex de marca en el stop donde cae su luminancia,
            no en un 500 forzado. Los tokens conservan los nombres del paquete:{" "}
            <TokenName>--color-main-*</TokenName> = Amber,{" "}
            <TokenName>--color-accent-*</TokenName> = Clay,{" "}
            <TokenName>--color-leaf-*</TokenName> = Jade,{" "}
            <TokenName>--color-info-*</TokenName> = Sky. brand.css les mete la escala
            nueva por rol.
          </p>
        </DevNote>
      </Section>

      <Section
        id="marca"
        toc="Marca"
        over="Tokens · roles"
        title="Marca"
        lede="Los colores con un trabajo fijo en la interfaz: botón, enlace, ceja, foco. Cada par muestra su contraste medido en el tema que estés viendo. Si el número sale en rojo, ese par no se lee bien como texto."
      >
        <Sub>Paleta</Sub>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          <Swatch token="--brand-action" label="Amber · acción" anchor />
          <Swatch token="--brand-action-hover" label="Acción hover" />
          <Swatch token="--brand-action-press" label="Acción press" />
          <Swatch token="--brand-strong" label="Amber fuerte" />
          <Swatch token="--brand-sky" label="Sky" anchor />
          <Swatch token="--color-accent-600" label="Clay" anchor />
          <Swatch token="--brand-leaf" label="Jade" anchor />
          <Swatch token="--brand-subtle" label="Amber suave" />
        </div>

        <div className="mt-10">
          <Sub>Pares</Sub>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Pair
              fg="--text-on-brand"
              bg="--brand-action"
              label="Texto sobre la acción"
              sample="¿Nos reunimos?"
            />
            <Pair
              fg="--pill-brand-text"
              bg="--pill-brand-bg"
              label="Pill de marca"
              sample={<span className="text-label-sm uppercase">Destacada</span>}
            />
            <Pair fg="--text-brand" bg="--background-page" label="Texto de marca" />
            <Pair
              fg="--text-eyebrow"
              bg="--background-page"
              label="Ceja"
              sample="PORTAFOLIO"
            />
            <Pair fg="--interaction-link-default" bg="--background-page" label="Enlace" />
            <Pair
              fg="--focus-ring-color"
              bg="--background-page"
              label="Anillo de foco"
              min={3}
            />
            <Pair
              fg="--brand-action"
              bg="--background-page"
              label="Amber como texto"
              min={4.5}
            />
          </div>
          <Note>
            El último par explica una regla: Amber como texto o logo funciona sobre negro
            y falla sobre blanco. En claro, la palabra destacada y el ítem activo del menú
            no van en Amber.
          </Note>
        </div>

        <div className="mt-10">
          <Sub>Mensajes</Sub>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(["success", "warning", "error", "info"] as const).map((k) => (
              <Pair
                key={k}
                fg={`--feedback-${k}-text`}
                bg={`--feedback-${k}-bg`}
                label={
                  { success: "Éxito", warning: "Aviso", error: "Error", info: "Info" }[k]
                }
                sample={<span className="text-body-sm">Mensaje</span>}
              />
            ))}
          </div>
        </div>
        <DevNote>
          <p>
            Umbral WCAG AA: 4.5:1 para texto, 3:1 para el anillo de foco. Se mide contra
            el fondo que resolvió el navegador en el tema activo. El Amber como texto es{" "}
            <TokenName>--brand-main</TokenName>: en claro, usá{" "}
            <TokenName>--text-brand</TokenName>.
          </p>
          <p>
            La pill de marca tiene fondo translúcido (<TokenName>--pill-brand-bg</TokenName>
            ): el número se mide contra el fondo opaco de abajo.
          </p>
        </DevNote>
      </Section>

      <Section
        id="espacio"
        toc="Espacio"
        over="Tokens · espacio"
        title="Espacio"
        lede="Los pasos de espacio para márgenes y separaciones. El largo de cada barra es el paso. No hay medidas sueltas: todo sale de esta lista."
      >
        <ul className="flex flex-wrap items-end gap-x-6 gap-y-4">
          {SPACING.map((step) => (
            <li key={step} className="flex flex-col gap-2">
              <div
                className="bg-[var(--brand-action)]"
                style={{ width: `var(--spacing-${step})`, height: "var(--spacing-6)" }}
              />
              <TokenName>{`--spacing-${step}`}</TokenName>
            </li>
          ))}
        </ul>
        <DevNote>
          <p>
            Escala del paquete. La página usa <TokenName>.wrap</TokenName>: 16px de margen
            en mobile, 32px desde 768.
          </p>
        </DevNote>
      </Section>

      <Section
        id="tipo"
        toc="Tipografía"
        over="Tokens · tipografía"
        title="Tipografía"
        lede="Display en Obviously Wide Black, siempre en mayúsculas. Todo lo demás en Montserrat: títulos en 700, cuerpo en 500, etiquetas y botones en 700. Al lado de cada muestra va su medida real: tamaño / interlineado · espaciado · peso."
      >
        <ul>
          {TYPE.map((t) => (
            <TypeRow key={t.name} name={t.name} className={t.className}>
              {t.sample}
            </TypeRow>
          ))}
          <TypeRow
            name="--brand-font-script"
            className="hero-script-word !text-[length:var(--typography-size-7xl)] !leading-none"
          >
            Crear.
          </TypeRow>
        </ul>
        <Note>
          Yellowtail es solo para el golpe del hero, una palabra. No es un estilo de
          texto.
        </Note>
        <DevNote>
          <p>
            La medida la computa el navegador, no se copia de un comentario. Código no
            tiene utilidad <TokenName>text-code-md</TokenName> en el bridge: se pinta con{" "}
            <TokenName>--typography-styles-code-md-size</TokenName> y su line-height.
          </p>
        </DevNote>
      </Section>

      <Section
        id="superficies"
        toc="Superficies"
        over="Tokens · superficies"
        title="Superficies"
        lede="La escalera de fondos. En oscuro son cuatro niveles: página negra, sección, card y borde. La grilla de servicios invierte la card a propósito: la hunde al negro de la página y la dibuja con el borde."
      >
        <div className="rounded-[var(--radius-lg)] border border-border bg-[var(--background-page)] p-4 md:p-6">
          <TokenName>--background-page</TokenName>
          <div className="mt-3 rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-4 md:p-6">
            <TokenName>--background-subtle · sección</TokenName>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded-[var(--card-radius)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
                <TokenName>--surface-raised + --border-default</TokenName>
                <p className="mt-2 font-sans text-body-sm text-foreground">
                  Card estándar
                </p>
              </div>
              <div className="rounded-[var(--card-radius)] border border-[var(--border-strong)] bg-[var(--surface-accent-bg)] p-4">
                {/* El fondo es oscuro en los dos temas: el texto lee los
                    tokens de oscuro para no caer en gris sobre negro. */}
                <div className="dark">
                  <TokenName>--surface-accent-bg + --border-strong</TokenName>
                  <p className="mt-2 font-sans text-body-sm text-[var(--surface-accent-text)]">
                    Card hundida · servicios
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Pair fg="--text-primary" bg="--background-page" label="Primario" />
          <Pair fg="--text-secondary" bg="--background-page" label="Secundario" />
          <Pair
            fg="--text-tertiary"
            bg="--background-page"
            label="Terciario · párrafos suaves"
          />
          <Pair
            fg="--text-tertiary"
            bg="--background-subtle"
            label="Terciario en sección"
          />
          <Pair
            fg="--surface-raised"
            bg="--background-subtle"
            label="Card vs sección"
            min={1.2}
            sample="▇▇"
          />
          <Pair
            fg="--border-default"
            bg="--surface-raised"
            label="Borde vs card"
            min={1.5}
            sample="▇▇"
          />
          <Pair
            fg="--border-strong"
            bg="--surface-accent-bg"
            label="Borde de la card hundida"
            min={3}
            sample="▇▇"
          />
          <Pair fg="--text-primary" bg="--surface-raised" label="Texto en card" />
        </div>
        <Note>
          Los pares con ▇▇ comparan dos fondos, no texto. Su piso es el que se aprobó en
          la revisión (1.2 card/sección, 1.5 borde/card), no un mínimo de accesibilidad.
        </Note>
        <DevNote>
          <p>
            La card hundida es la de <TokenName>ServicesGrid</TokenName>; solo ella
            consume <TokenName>--surface-accent-bg</TokenName>.
          </p>
        </DevNote>
      </Section>

      <Section
        id="radio"
        toc="Radio y sombra"
        over="Tokens · forma"
        title="Radio y sombra"
        lede="Qué tan redondeadas son las esquinas y cuánta sombra llevan las piezas. El botón es un rectángulo muy redondeado, no una cápsula. Las pills sí son cápsula."
      >
        <ul className="flex flex-wrap gap-6">
          {RADII.map((step) => (
            <li key={step} className="flex flex-col items-center gap-2">
              <div
                className="size-16 border border-[var(--border-strong)] bg-[var(--background-subtle)]"
                style={{ borderRadius: `var(--radius-${step})` }}
              />
              <TokenName>{`--radius-${step}`}</TokenName>
            </li>
          ))}
        </ul>
        <ul className="mt-10 grid gap-6 rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-6 md:grid-cols-3">
          {SHADOWS.map((step) => (
            <li
              key={step}
              className="rounded-[var(--radius-md)] bg-[var(--surface-raised)] p-6"
              style={{ boxShadow: `var(--shadow-${step})` }}
            >
              <TokenName>{`--shadow-${step}`}</TokenName>
            </li>
          ))}
        </ul>
        <DevNote>
          <p>
            El botón pisa <TokenName>--button-radius</TokenName> a xl (16px). Las pills
            usan <TokenName>--pill-radius</TokenName>.
          </p>
        </DevNote>
      </Section>

      <Section
        id="componentes"
        toc="Componentes"
        over="Piezas"
        title="Componentes"
        lede="Las piezas básicas del sitio: botones, campos, pills y cards. Probalas con el mouse y con el teclado: el botón principal se oscurece al pasar encima y el secundario se aclara."
      >
        <Sub>Botón</Sub>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructivo</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Deshabilitado</Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button size="sm">Chico</Button>
          <Button>Medio</Button>
          <Button size="lg">Grande</Button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <Sub>Campo</Sub>
            <div className="grid gap-4">
              <Input placeholder="Nombre" aria-label="Nombre" />
              <Input placeholder="Correo con error" state="error" aria-label="Correo" />
              <Input placeholder="Deshabilitado" disabled aria-label="Deshabilitado" />
            </div>
          </div>
          <div>
            <Sub>Pill</Sub>
            <div className="flex flex-wrap gap-3">
              <Pill>Branding</Pill>
              <Pill variant="brand">Destacada</Pill>
              <Pill size="sm">Producción</Pill>
            </div>
            <div className="mt-8">
              <Sub>Card</Sub>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <p className="font-sans text-body-sm">Quieta.</p>
                </Card>
                <Card interactive>
                  <p className="font-sans text-body-sm">
                    Interactiva: al pasar encima cambian fondo y borde.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <DevNote>
          <p>
            Son los primitivos de <TokenName>src/ui/components</TokenName> (Button, Input,
            Pill, Card), los mismos que se copian al repo de Vite. Hover y foco: el
            primario invierte a oscuro, el secundario a blanco.
          </p>
        </DevNote>
      </Section>

      <Section
        id="efectos"
        toc="Efectos de marca"
        over="Piezas · efectos"
        title="Efectos de marca"
        lede="Los toques que hacen que algo se vea VPER: el titular en gradiente, el anillo de color, la textura y la barra de vidrio. No son piezas nuevas: se suman a una que ya existe."
      >
        <div className="grid gap-10">
          <div>
            <Sub>Titular en gradiente</Sub>
            <div className="@container min-w-0 max-w-3xl">
              <p className="font-display display-title font-black uppercase tracking-tight title-brand-gradient">
                Ideas que no se quedan quietas.
              </p>
              <p className="mt-6 font-display display-title font-black uppercase tracking-tight text-foreground title-solid">
                Proyectos <span className="title-brand-gradient">seleccionados.</span>
              </p>
            </div>
            <Note>
              Recorrido Sky → Clay → Amber. Puede ir en todo el titular o solo en la
              palabra del golpe, como en PORTAFOLIO.
            </Note>
          </div>

          <div>
            <Sub>Anillo de marca</Sub>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="hover-brand-ring hover-brand-ring-rest rounded-[var(--card-radius)]">
                <div className="bg-[var(--surface-raised)] p-6">
                  <p className="font-sans text-body-sm font-bold">
                    En reposo · pasá el mouse
                  </p>
                </div>
              </div>
              <div className="group" data-lit="">
                <div className="hover-brand-ring hover-brand-ring-rest rounded-[var(--card-radius)]">
                  <div className="bg-[var(--surface-raised)] p-6">
                    <p className="font-sans text-body-sm font-bold">Encendida</p>
                  </div>
                </div>
              </div>
              <div className="group grid place-items-center" data-lit="">
                <div className="hover-brand-ring hover-brand-ring-rest hover-brand-ring-thick size-28 rounded-full">
                  <div className="rounded-full bg-[var(--background-page)]" />
                </div>
              </div>
            </div>
            <Note>
              Trazo fino en cards, grueso detrás de las figuras del proceso. Si la persona
              pidió menos movimiento en su sistema, el anillo se queda quieto.
            </Note>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Sub>Textura</Sub>
              <div className="bg-brand-texture grid h-56 place-items-center rounded-[var(--radius-lg)] border border-border [background-attachment:scroll]">
                <span className="font-sans text-label-sm font-bold uppercase">
                  Contacto · servicios
                </span>
              </div>
            </div>
            <div>
              <Sub>Barra de vidrio</Sub>
              <div className="relative h-56 overflow-hidden rounded-[var(--radius-lg)]">
                <img
                  src="/images/hero-tomatola-desktop.webp"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="nav-glass relative flex h-14 items-center justify-between px-4">
                  <span className="font-sans text-label-sm font-bold text-[var(--nav-logo-text)]">
                    VPER
                  </span>
                  <span className="font-sans text-label-xs font-bold uppercase text-[var(--nav-item-default)]">
                    Proyectos · Servicios
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DevNote>
          <p>
            Clases utilitarias de <TokenName>globals.css</TokenName>, no componentes:{" "}
            <TokenName>.title-brand-gradient</TokenName>,{" "}
            <TokenName>.title-solid</TokenName> (con el golpe en un span hijo),{" "}
            <TokenName>.hover-brand-ring</TokenName> (1px; 5px con{" "}
            <TokenName>.hover-brand-ring-thick</TokenName>; encendida con{" "}
            <TokenName>data-lit</TokenName>), <TokenName>.bg-brand-texture</TokenName> y{" "}
            <TokenName>.nav-glass</TokenName>.
          </p>
          <p>
            El anillo se detiene con <TokenName>prefers-reduced-motion</TokenName>.
          </p>
        </DevNote>
      </Section>

      <Section
        id="titulares"
        toc="Titulares"
        over="Piezas · titulares"
        title="Titulares"
        lede="Un titular grande se achica según el ancho de su caja, para que la palabra más larga (SELECCIONADOS) entre siempre sin cortarse. Abajo, el mismo titular en tres anchos de pantalla."
      >
        <div className="flex flex-wrap items-start gap-6">
          {[320, 390, 768].map((w) => (
            <WidthProbe key={w} width={w}>
              <p className="font-display display-title font-black uppercase tracking-tight">
                Seleccionados.
              </p>
              <p className="mt-2 font-display display-title-hero font-extrabold uppercase tracking-tight">
                Excepcionales.
              </p>
            </WidthProbe>
          ))}
        </div>
        <DevNote>
          <p>
            <TokenName>.display-title</TokenName> mide el ancho del contenedor (cqi) y lo
            parte por 13.4, el ancho en em de SELECCIONADOS. Si un titular se sale, el
            problema es la cadena de <TokenName>min-w-0</TokenName>, no el tamaño.
          </p>
        </DevNote>
      </Section>

      <Section
        id="movimiento"
        toc="Movimiento"
        over="Piezas · movimiento"
        title="Movimiento"
        lede="Cómo entra el hero: primero el titular, después la firma en Yellowtail, el texto y los botones. Si la persona pidió menos movimiento en su sistema, todo aparece quieto."
      >
        {/* El hero real es foto oscura en los dos temas: el escenario lee los
            tokens de oscuro (enlace "Repetir entrada", botones). */}
        <div className="dark rounded-[var(--radius-lg)] bg-[var(--color-neutral-950)] p-6 text-[var(--text-primary)] md:p-10">
          <ReplayHero>
            <div className="@container min-w-0">
              <p className="font-display display-title-hero mx-auto flex min-w-0 max-w-3xl flex-col items-center text-center font-extrabold uppercase tracking-tight text-[var(--color-neutral-50)]">
                <span className="hero-enter hero-title-enter w-full min-w-0">
                  Siempre hay algo más grande por
                </span>
                <span className="hero-script-word hero-enter hero-script-enter normal-case">
                  Crear.
                </span>
              </p>
              <p className="hero-enter hero-copy-enter mx-auto mt-4 max-w-md text-center font-sans text-body-sm font-medium text-[var(--color-neutral-300)]">
                Las buenas ideas tienen un pequeño problema: nunca se quedan quietas.
              </p>
              <div className="hero-enter hero-cta-enter mt-6 flex flex-col justify-center gap-4 sm:flex-row">
                <Button variant="secondary">VER REEL</Button>
                <Button>VER PROYECTOS</Button>
              </div>
            </div>
          </ReplayHero>
        </div>
        <DevNote>
          <ul className="grid gap-1 md:grid-cols-2">
            <li>
              <TokenName>.hero-title-enter</TokenName> 0.5s · espera a{" "}
              <TokenName>.hero-ready</TokenName> (foto decodificada)
            </li>
            <li>
              <TokenName>.hero-script-enter</TokenName> scale + blur, 0.22s después
            </li>
            <li>
              <TokenName>.hero-copy-enter</TokenName> 0.4s después del titular
            </li>
            <li>
              <TokenName>.hover-brand-ring</TokenName> giro de 5s, solo en hover o
              data-lit
            </li>
            <li>
              <TokenName>.work-card-index</TokenName> desenfoque por scroll, solo desde
              768
            </li>
            <li>
              Todo se apaga con <TokenName>prefers-reduced-motion</TokenName>
            </li>
          </ul>
        </DevNote>
      </Section>

      <Section
        id="composicion"
        toc="Composición"
        over="En uso"
        title="Composición"
        lede="Una sección real del sitio, sin copiar: si algo de arriba cambia y esto no, la sección se salió del sistema."
      >
        {/* Va dentro de la section: el índice ignora las secciones anidadas,
            así ServicesGrid no entra como entrada propia. */}
        <div className="-mx-4 md:-mx-8">
          <ServicesGrid />
        </div>
      </Section>
    </main>
  );
}
