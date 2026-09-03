import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/sections/header";
import Footer from "@/sections/footer";
import ProjectHero from "@/components/project-hero";
import ProjectGallery from "@/components/project-gallery";
import ProjectPager from "@/components/project-pager";
import { Pill } from "@ui/components/pill";
import { workItems, getWorkItem, getAdjacentWorkItems } from "@/lib/work-items";

// Next 15: params llega como Promise en Server Components (Async Request
// APIs) — hay que await-earlo, no es opcional ni retrocompatible con el
// patrón síncrono de Next 14.
type Props = { params: Promise<{ slug: string }> };

// SSG real: un HTML estático por proyecto en build time, mismo criterio
// que ya tiene la home (ver README, "Next.js 15 (App Router)... SSG real").
export function generateStaticParams() {
  return workItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) return {};

  return {
    title: `${item.title} — VPER Media`,
    description: item.description.replace(/\n+/g, " ").slice(0, 155),
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) notFound();
  const adjacent = getAdjacentWorkItems(slug);

  // Ficha de metadata. `date` y `country` son opcionales desde
  // 2026-08-26: el par que no tiene valor no se renderiza, en vez de
  // imprimir "Fecha pendiente de confirmar" — una nota interna honesta
  // que en pantalla se leía como una agencia que no sabe cuándo hizo su
  // propio trabajo. Se arma acá y no en el JSX para que el filtro tenga
  // un tipo que TypeScript pueda estrechar de verdad.
  const facts: [string, string | undefined][] = [
    ["Cliente", item.client],
    ["Sector", item.sector],
    ["Fecha", item.date],
    ["País", item.country],
  ];
  const shownFacts = facts.filter(
    (fact): fact is [string, string] => Boolean(fact[1]),
  );

  return (
    // Textura de fondo (pedido 2026-08-12; recortes claro/oscuro y
    // mobile/desktop desde 2026-09-02). Ver --brand-section-texture.
    <div className="min-h-screen bg-background bg-brand-texture text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col overflow-x-clip">
      <Header />

      <main className="flex-1 pt-28 pb-24 md:pb-32">
        <div className="wrap px-0 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-12 lg:gap-16 items-start min-w-0">
          {/* Columna izquierda: sticky en desktop (despeja el header con
              top-24 — el header mide 64px sin scroll / 56px scrolleado
              desde 2026-08-12, 24 = 96px cubre los dos casos con aire),
              apilada normal en mobile.
              lg:max-h+overflow-y-auto: un sticky sin esto se queda pegado
              en la misma posición mientras la columna de la galería (más
              alta) scrollea — si el contenido de este aside es más alto
              que el viewport, la parte de abajo (cola de la descripción)
              queda inalcanzable hasta que termina de pasar TODA la
              galería. Con max-height + scroll propio, el aside sigue
              "pegado" en pantalla pero el texto de adentro scrollea
              independiente — se puede leer completo en cualquier momento.
              El scrollbar fino ya está estilado global (ver globals.css),
              no hace falta repetirlo acá. lg:pb-12: sin esto el texto
              llega justo hasta el borde del área con scroll y se ve
              "cortado" en vez de simplemente terminado — es el margen de
              seguridad para que la última línea respire antes del límite
              real del contenedor. */}
          <aside className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto flex flex-col gap-6 lg:pr-2 lg:pb-12">
            {/* Vuelta al listado (2026-08-26). Hasta que existió /work
                el detalle no tenía padre: el logo iba a la home y el
                pager al caso siguiente, así que la única forma de "ver
                los otros" era salirse del portafolio. Va arriba y no
                solo al pie porque es una salida, no un siguiente paso —
                se necesita justo cuando el caso no era el que buscabas. */}
            <div className="px-4 md:px-0">
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 text-overline-sm font-bold text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring-color)] focus-visible:rounded-sm"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                TODOS LOS PROYECTOS
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 px-4 md:px-0">
              {item.categories.map((category) => (
                <Pill key={category}>{category}</Pill>
              ))}
            </div>

            {item.hero.type === "video" ? (
              <ProjectHero hero={item.hero} title={item.title} />
            ) : null}

            <div className="@container min-w-0 px-4 md:px-0">
              <h1 className="font-display display-title font-black tracking-tight max-w-full mb-3">
                {item.title}
              </h1>
              <span className="text-xs font-bold tracking-widest text-[var(--text-eyebrow)] uppercase block mb-6">
                {item.subtitle}
              </span>

              {/* Cliente/fecha/país sube antes de la descripción (2026-08-12,
                  pedido explícito): son los datos que un visitante quiere
                  primero, no después de leer todo el copy — y en mobile
                  (donde este aside deja de ser sticky y todo se apila en
                  una sola columna) esto también evita que el lector tenga
                  que pasar el bloque de texto largo antes de llegar a la
                  galería, no solo en desktop. */}
              {/* flex-wrap y no grid-cols-3: el número de pares cambia
                  entre proyectos (3 o 4, según haya fecha y país). Un
                  grid de 3 columnas con 4 items deja una fila huérfana. */}
              <dl className="flex flex-wrap gap-x-8 gap-y-4 pb-6 mb-6 border-b border-border min-w-0">
                {shownFacts.map(([label, value]) => (
                  <div
                    key={label}
                    className="min-w-0 basis-[calc(50%-1rem)] sm:basis-auto sm:min-w-[7rem]"
                  >
                    <dt className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">
                      {label}
                    </dt>
                    <dd className="text-sm font-bold text-foreground break-words">{value}</dd>
                  </div>
                ))}
              </dl>

              {/* description admite párrafos separados por \n\n (ver
                  work-items.ts) — el copy real de Toma-Tola viene en 2
                  párrafos, los placeholder Lorem son 1 solo. */}
              <div className="flex flex-col gap-4">
                {item.description.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </aside>

          <ProjectGallery images={item.gallery} />
        </div>

        {adjacent ? <ProjectPager prev={adjacent.prev} next={adjacent.next} /> : null}
      </main>

      <Footer />
    </div>
  );
}
