import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/sections/header";
import Footer from "@/sections/footer";
import ProjectHero from "@/components/project-hero";
import ProjectGallery from "@/components/project-gallery";
import { Pill } from "@ui/components/pill";
import { workItems, getWorkItem } from "@/lib/work-items";

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

  return (
    // Textura de fondo fija (pedido 2026-08-12): bg-background de base +
    // bg-image encima — son propiedades CSS distintas (background-color vs
    // -image), no colisionan. bg-fixed la deja pegada al viewport mientras
    // el contenido scrollea encima, como watermark. El asset ya es
    // extremadamente oscuro (negro casi sobre negro) así que no compite
    // con el texto — no hace falta bajarle opacity aparte.
    <div className="min-h-screen bg-background bg-[url('/images/bg-vper-pattern.webp')] bg-fixed bg-cover bg-center text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col overflow-x-clip">
      <Header />

      <main className="flex-1 pt-28 pb-24 md:pb-32">
        <div className="wrap px-0 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-12 lg:gap-16 items-start">
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
          <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto flex flex-col gap-6 lg:pr-2 lg:pb-12">
            <div className="flex flex-wrap gap-2 px-4 md:px-0">
              {item.categories.map((category) => (
                <Pill key={category}>{category}</Pill>
              ))}
            </div>

            <ProjectHero hero={item.hero} title={item.title} />

            <div className="px-4 md:px-0">
              <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-3">
                {item.title}
              </h1>
              <span className="text-xs font-bold tracking-widest text-primary uppercase block mb-6">
                {item.subtitle}
              </span>

              {/* Cliente/fecha/país sube antes de la descripción (2026-08-12,
                  pedido explícito): son los datos que un visitante quiere
                  primero, no después de leer todo el copy — y en mobile
                  (donde este aside deja de ser sticky y todo se apila en
                  una sola columna) esto también evita que el lector tenga
                  que pasar el bloque de texto largo antes de llegar a la
                  galería, no solo en desktop. */}
              <dl className="grid grid-cols-3 gap-4 pb-6 mb-6 border-b border-border">
                <div>
                  <dt className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">
                    Cliente
                  </dt>
                  <dd className="text-sm font-bold text-foreground">{item.client}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">
                    Fecha
                  </dt>
                  <dd className="text-sm font-bold text-foreground">{item.date}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">
                    País
                  </dt>
                  <dd className="text-sm font-bold text-foreground">{item.country}</dd>
                </div>
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
      </main>

      <Footer />
    </div>
  );
}
