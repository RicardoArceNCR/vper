import type { Metadata } from "next";
import Header from "@/sections/header";
import Footer from "@/sections/footer";
import SectionHeader from "@/components/section-header";
import WorkCard from "@/components/work-card";
import { getArchiveWorkItems } from "@/lib/work-items";

// El ARCHIVO (2026-08-26). Convive con work/[slug] sin pelear: en App
// Router una ruta estática gana sobre la dinámica hermana, así que /work
// entra acá y /work/wok al [slug].
//
// POR QUÉ EXISTE: la home es una vitrina de cuatro y su track sticky no
// escala — cada card mide hasta 620px sobre un runway clampado a 450vh.
// Listar es otro trabajo, con otra forma. Hasta ahora las páginas de
// proyecto eran huérfanas de navegación: se llegaba por el track o por
// el pager, nunca por un padre. Esta página es ese padre.
//
// LO QUE ESTA PÁGINA NO TIENE, A PROPÓSITO:
//   · Filtros. Con seis piezas y la taxonomía actual serían teatro:
//     "Creatividad" está en los seis casos, y Branding, Planeación y
//     ATL & BTL no tienen ninguno — un chip "Planeación (0)" se ve peor
//     que no tener filtros. Un grid de seis se barre con la vista. El
//     día que paguen, el eje es `sector` (ya está en el modelo), no el
//     servicio: es el único que parte el set.
//   · Un segundo carrusel sticky. La firma de la home es la home.
//   · Rutas /work/creatividad. SSG de combinaciones para seis items.
//
// FONDO: liso, sin la textura de marca que sí lleva work/[slug]
// (revisado en pantalla 2026-08-27). La idea era que archivo y detalle
// se leyeran como una zona, pero acá la textura compite: son seis
// miniaturas a todo color contra un patrón que también tiene forma, y el
// grid pierde el aire que necesita para leerse como una lista. En el
// detalle funciona porque la columna de texto ocupa el ancho y la
// galería va a una sola columna. Menos superficie de imagen, la textura
// respira; más, estorba.

export const metadata: Metadata = {
  title: "Proyectos — VPER Media",
  description:
    "El portafolio completo de VPER Media: identidad, empaque, campaña y producción para marcas de bebidas, tecnología, bienes raíces, estética y restaurantes.",
};

export default function WorkIndexPage() {
  const items = getArchiveWorkItems();
  const sectors = new Set(items.map((item) => item.sector)).size;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col overflow-x-clip">
      <Header />

      <main className="flex-1 pt-28 pb-24 md:pb-32">
        <div className="wrap min-w-0 mb-12 md:mb-16">
          <SectionHeader
            eyebrow="PORTAFOLIO"
            title="TODOS LOS PROYECTOS."
            description={`${items.length} casos completos en ${sectors} sectores distintos: identidad, empaque, campaña y producción de principio a fin.`}
          />
        </div>

        {/* Dos columnas es el techo a propósito: a tres, la card baja de
            ~300px y el recorte 16/9 deja las láminas de marca
            ilegibles. El archivo lista, pero sigue siendo un portafolio
            visual. */}
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {items.map((item, i) => (
            <WorkCard key={item.slug} item={item} variant="index" priority={i < 2} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
