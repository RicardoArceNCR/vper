import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Pill } from "@ui/components/pill";
import ServicesGrid from "@/sections/services-grid";
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

const SECTIONS = [
  ["escalas", "Escalas"],
  ["marca", "Marca"],
  ["espacio", "Espacio"],
  ["tipo", "Tipografía"],
  ["superficies", "Superficies"],
  ["radio", "Radio y sombra"],
  ["componentes", "Componentes"],
  ["efectos", "Efectos de marca"],
  ["titulares", "Titulares"],
  ["movimiento", "Movimiento"],
  ["composicion", "Composición"],
] as const;

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
// la palabra — la muestra es del tamaño, no del titular.
const display = "font-display font-black uppercase tracking-tight whitespace-nowrap";
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
  { name: "text-code-md", className: "font-mono text-code-md", sample: "--brand-action" },
];

function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-14 md:py-20">
      <div className="@container mb-8 min-w-0 max-w-3xl md:mb-10">
        <h2 className="font-display display-title-sm font-black uppercase tracking-tight">
          {title}
        </h2>
        <p className="mt-4 font-sans text-body-md font-medium text-muted-foreground">
          {lede}
        </p>
      </div>
      {children}
    </section>
  );
}

function Sub({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 font-sans text-label-sm font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
      {children}
    </h3>
  );
}

export default function SistemaPage() {
  return (
    <main className="wrap mx-auto max-w-[1217px] pb-24">
      <div className="py-12 md:py-20">
        <p className="font-sans text-overline-sm font-bold uppercase text-[var(--text-eyebrow)]">
          Marca · Design system
        </p>
        <div className="@container min-w-0">
          <h1 className="mt-3 font-display display-title font-black uppercase tracking-tight title-brand-gradient">
            Sistema.
          </h1>
        </div>
        <p className="mt-6 max-w-2xl font-sans text-body-lg font-medium text-muted-foreground">
          @misitio/ui más brand.css, resuelto por el navegador. Cada hex, tamaño y
          contraste de esta página se lee en vivo: si un override deja de ganar, se ve acá
          antes que en una sección. Usá el sol o la luna arriba para cambiar de tema.
        </p>
        <nav aria-label="Secciones" className="mt-8 flex flex-wrap gap-2">
          {SECTIONS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-[var(--pill-radius)] border border-border px-3 py-1 font-sans text-label-sm font-bold uppercase text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <Section
        id="escalas"
        title="Escalas"
        lede={
          <>
            Cada familia se ancla en el hex de marca en el stop donde cae su luminancia,
            no en un 500 forzado. El stop con aro es ese hex. Los nombres siguen siendo
            los del paquete (main, accent, leaf, info): brand.css les mete la escala nueva
            por rol.
          </>
        }
      >
        <div className="grid gap-10">
          <Ramp
            family="main"
            role="Amber"
            anchor={300}
            note="main · marca, aviso · #FDBF66"
          />
          <Ramp
            family="accent"
            role="Clay"
            anchor={600}
            note="accent · error, cejas · #D55856"
          />
          <Ramp family="leaf" role="Jade" anchor={400} note="leaf · éxito · #74BDB7" />
          <Ramp
            family="info"
            role="Sky"
            anchor={500}
            note="info · enlaces, foco · #5EB2E3"
          />
          <Ramp family="neutral" role="Neutral" note="acromático, croma 0" />
        </div>
      </Section>

      <Section
        id="marca"
        title="Marca"
        lede="Los roles que usa la interfaz, y el contraste de cada par medido contra el fondo real del tema activo. Un par en rojo no llega al mínimo para texto (4.5:1, o 3:1 para el anillo de foco)."
      >
        <Sub>Paleta</Sub>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          <Swatch token="--brand-action" label="action" anchor />
          <Swatch token="--brand-action-hover" label="action hover" />
          <Swatch token="--brand-action-press" label="action press" />
          <Swatch token="--brand-strong" label="strong" />
          <Swatch token="--brand-sky" label="sky" anchor />
          <Swatch token="--color-accent-600" label="clay" anchor />
          <Swatch token="--brand-leaf" label="teal" anchor />
          <Swatch token="--brand-subtle" label="subtle" />
        </div>

        <div className="mt-10">
          <Sub>Pares</Sub>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Pair
              fg="--text-on-brand"
              bg="--brand-action"
              label="Texto sobre la acción"
              sample="Agenda"
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
          <p className="mt-4 max-w-2xl font-sans text-body-sm text-muted-foreground">
            El último par es la razón de una regla: amber como texto o logo funciona sobre
            negro y falla sobre blanco. En claro, la palabra destacada y el item activo
            del nav no van en <TokenName>--brand-main</TokenName>.
          </p>
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
      </Section>

      <Section
        id="espacio"
        title="Espacio"
        lede="Escala del paquete. El largo de la barra es el token. La página usa .wrap: 16px de margen en mobile, 32px desde 768."
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
      </Section>

      <Section
        id="tipo"
        title="Tipografía"
        lede={
          <>
            Display en Obviously Wide Black, siempre en mayúsculas. Todo lo demás en
            Montserrat: títulos en 700, cuerpo en 500, etiquetas y botones en 700. La
            columna del medio es lo que computó el navegador: tamaño / interlineado ·
            tracking · peso.
          </>
        }
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
        <p className="mt-4 max-w-2xl font-sans text-body-sm text-muted-foreground">
          Yellowtail es solo para el golpe del hero, una palabra. No es un estilo de
          texto.
        </p>
      </Section>

      <Section
        id="superficies"
        title="Superficies"
        lede="La escalera de fondos. En oscuro son cuatro niveles: página negra, sección, card y borde. ServicesGrid invierte la card a propósito: se hunde al negro de la página y la forma la dibuja el borde fuerte."
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
                <TokenName>--surface-accent-bg + --border-strong</TokenName>
                <p className="mt-2 font-sans text-body-sm text-[var(--surface-accent-text)]">
                  Card hundida · ServicesGrid
                </p>
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
            label="Terciario · párrafos muted"
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
        <p className="mt-4 max-w-2xl font-sans text-body-sm text-muted-foreground">
          Los pares con ▇▇ comparan dos fondos, no texto. Su umbral es el piso que se
          aprobó en la revisión (1.2 card/sección, 1.5 borde/card), no un mínimo de
          accesibilidad.
        </p>
      </Section>

      <Section
        id="radio"
        title="Radio y sombra"
        lede={
          <>
            El botón pisa <TokenName>--button-radius</TokenName> a xl (16px): rectángulo
            muy redondeado, no cápsula. Las pills sí son cápsula.
          </>
        }
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
      </Section>

      <Section
        id="componentes"
        title="Componentes"
        lede="Los primitivos de src/ui/components, los mismos que se copian al repo de Vite. Hover y foco con mouse y teclado: el primario invierte a oscuro, el secundario a blanco."
      >
        <Sub>Button</Sub>
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
            <Sub>Input</Sub>
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
                    Interactiva: hover cambia fondo y borde.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="efectos"
        title="Efectos de marca"
        lede="Las clases de globals.css que hacen que algo se vea VPER. Viven como utilidades, no como componentes: se ponen en una pieza existente."
      >
        <div className="grid gap-10">
          <div>
            <Sub>.title-brand-gradient · .title-solid</Sub>
            <div className="@container min-w-0 max-w-3xl">
              <p className="font-display display-title font-black uppercase tracking-tight title-brand-gradient">
                Ideas que no se quedan quietas.
              </p>
              <p className="mt-6 font-display display-title font-black uppercase tracking-tight text-foreground title-solid">
                Proyectos <span className="title-brand-gradient">seleccionados.</span>
              </p>
            </div>
            <p className="mt-4 max-w-2xl font-sans text-body-sm text-muted-foreground">
              Recorrido sky → clay → amber. Con <TokenName>.title-solid</TokenName> en el
              h2 el golpe va en un span hijo, como en PORTAFOLIO.
            </p>
          </div>

          <div>
            <Sub>.hover-brand-ring</Sub>
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
                    <p className="font-sans text-body-sm font-bold">
                      Encendida · data-lit
                    </p>
                  </div>
                </div>
              </div>
              <div className="group grid place-items-center" data-lit="">
                <div className="hover-brand-ring hover-brand-ring-rest hover-brand-ring-thick size-28 rounded-full">
                  <div className="rounded-full bg-[var(--background-page)]" />
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-2xl font-sans text-body-sm text-muted-foreground">
              Trazo de 1px en cards, 5px detrás de las figuras del proceso. Con
              reduced-motion el anillo se queda quieto.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Sub>.bg-brand-texture</Sub>
              <div className="bg-brand-texture grid h-56 place-items-center rounded-[var(--radius-lg)] border border-border [background-attachment:scroll]">
                <span className="font-sans text-label-sm font-bold uppercase">
                  Contacto · servicios
                </span>
              </div>
            </div>
            <div>
              <Sub>.nav-glass</Sub>
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
      </Section>

      <Section
        id="titulares"
        title="Titulares"
        lede={
          <>
            <TokenName>.display-title*</TokenName> mide el ancho del contenedor (cqi) y lo
            parte por 13.4, el ancho en em de SELECCIONADOS. La palabra más larga de cada
            titular tiene que entrar en la caja sin recortarse. Si se sale, el problema es
            la cadena de <TokenName>min-w-0</TokenName>, no el tamaño.
          </>
        }
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
      </Section>

      <Section
        id="movimiento"
        title="Movimiento"
        lede="La coreografía de entrada del hero: la Wide, después la firma en Yellowtail, el copy y los CTA. Todo se apaga con prefers-reduced-motion."
      >
        <div className="rounded-[var(--radius-lg)] bg-[var(--color-neutral-950)] p-6 md:p-10">
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
                Copy de apoyo, 0.4s después.
              </p>
              <div className="hero-enter hero-cta-enter mt-6 flex justify-center">
                <Button>Agenda una cita</Button>
              </div>
            </div>
          </ReplayHero>
        </div>
        <ul className="mt-6 grid gap-2 font-sans text-body-sm text-muted-foreground md:grid-cols-2">
          <li>
            <TokenName>.hero-title-enter</TokenName> 0.5s · espera a{" "}
            <TokenName>.hero-ready</TokenName> (foto decodificada)
          </li>
          <li>
            <TokenName>.hero-script-enter</TokenName> scale + blur, 0.22s después
          </li>
          <li>
            <TokenName>.hover-brand-ring</TokenName> giro de 5s, solo en hover o data-lit
          </li>
          <li>
            <TokenName>.work-card-index</TokenName> desenfoque por scroll, solo desde 768
          </li>
        </ul>
      </Section>

      <section
        id="composicion"
        className="scroll-mt-20 border-t border-border pt-14 md:pt-20"
      >
        <div className="@container mb-8 min-w-0 max-w-3xl">
          <h2 className="font-display display-title-sm font-black uppercase tracking-tight">
            Composición
          </h2>
          <p className="mt-4 font-sans text-body-md font-medium text-muted-foreground">
            Una sección real del sitio, sin copiar: si algo de arriba cambia y esto no, la
            sección se salió del sistema.
          </p>
        </div>
      </section>
      <div className="-mx-4 md:-mx-8">
        <ServicesGrid />
      </div>
    </main>
  );
}
