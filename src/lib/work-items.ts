// Fuente única de proyectos — la home (WorkGallery) y el detalle
// (app/work/[slug]) leen del MISMO array. Antes WorkGallery tenía estos 4
// proyectos hardcodeados dentro del componente; al sumar páginas de
// detalle eso hubiera significado mantener título/categoría/imágenes
// sincronizados a mano en dos lugares. Con esto, un solo lugar de verdad.
//
// CONTENIDO — estado mixto, a propósito (actualizado 2026-08-12):
// - "toma-tola" (primer proyecto) es real: fotografía real del cliente
//   (public/images/TOMA TOLA BRANDING-*.jpg), copy real pegado tal cual
//   por el cliente, país confirmado por el sello de empaque. Solo la
//   fecha queda pendiente (ver campo "date").
// - Los otros 3 proyectos siguen siendo placeholder — mismo relleno
//   explícito de la sesión anterior (texto Lorem Ipsum, "client" con
//   "Cliente confidencial 0N" en vez de una marca real: inventar un
//   nombre de empresa real ahí sería una afirmación falsa sobre esa
//   empresa, no relleno inocuo). Reemplazar caso por caso a medida que
//   entre material real de cada uno, como ya pasó con el primero.
//
// IMÁGENES: el sitio solo trae ~28 fotos reales en public/images para los
// proyectos placeholder (no son infinitas), así que su galería reutiliza
// imágenes de otras secciones (servicios/proceso/hero) en vez de inventar
// rutas que no existen. "toma-tola" no tiene este problema — tiene su
// propio set de fotos reales, sin reutilizar nada de otras secciones.
//
// VIDEO: el tipo "video" está soportado end-to-end (ver ProjectHero), pero
// ningún proyecto lo usa todavía porque no hay ningún .mp4 real en
// public/ — deuda de contenido, no de código.
//
// CATEGORIES: se remapearon a los 6 servicios reales de VPER (ATL & BTL,
// Creatividad, Digital, Planeación Estratégica, Audiovisual, Eventos —
// ver ServicesGrid) en vez de las categorías inventadas que tenía antes
// esta demo (Brand Strategy, UX/UI Design, etc.), para que el tag de cada
// proyecto corresponda a un servicio que el sitio realmente ofrece.

// "span" (full/half/third) se sacó 2026-08-12: ProjectGallery pasó de un
// grid multi-columna con object-cover (recortaba fotos reales) a una sola
// columna con cada imagen a su alto natural — ya no hay nada que "span"
// pudiera controlar. Ver comentario en project-gallery.tsx.
export interface GalleryImage {
  src: string;
  alt: string;
}

export interface WorkItem {
  slug: string;
  title: string;
  subtitle: string;
  categories: string[];
  client: string;
  date: string;
  country: string;
  description: string;
  hero: { type: "image" | "video"; src: string; poster?: string };
  gallery: GalleryImage[];
}

const LOREM =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.";

export const workItems: WorkItem[] = [
  {
    // Primer proyecto real de este portafolio (2026-08-12) — reemplaza el
    // placeholder "brand-strategy". Fotografía de producto real (public/
    // images/TOMA TOLA BRANDING-*.jpg, aportada por el cliente), copy real
    // (no Lorem Ipsum) tomado tal cual del mensaje del cliente.
    //
    // Categoría — se pidió explícitamente que la eligiera yo: "Creatividad"
    // como categoría principal (identidad visual, sistema de color/
    // tipografía — visible en la lámina de marca, y el desarrollo de las 4
    // variantes de producto) + "Audiovisual" como secundaria (todo lo
    // entregado acá es producción fotográfica de producto/lifestyle, no
    // solo el concepto). No entra en "Planeación Estratégica" ni "Digital"
    // porque no hay research/plan de medios ni entregable digital visible
    // en el material que se compartió — si más adelante se suma esa parte
    // del proyecto, se le agrega esa categoría también.
    //
    // País: "Estados Unidos" no es una suposición — está impreso en el
    // sello del empaque real (TOMA TOLA BRANDING-10.jpg: "Distributed by
    // El Tigre Tomato Brew, LLC — Tampa, FL 33615 — Product of USA").
    // Fecha: sin dato confirmado en el material — queda pendiente, ver
    // nota al final del archivo.
    slug: "toma-tola",
    title: "TOMATO BREW",
    subtitle: "Toma-Tola",
    categories: ["Creatividad", "Audiovisual"],
    client: "Toma-Tola",
    date: "Fecha pendiente de confirmar",
    country: "Estados Unidos",
    description:
      "Toma Tola nació de una pregunta sencilla: ¿por qué el jugo de tomate debería sentirse como una opción secundaria? Queríamos crear algo que funcionara como un verdadero ingrediente esencial en la cocina, no como una bebida de una sola dimensión. Por eso lo elaboramos como una receta, con vegetales, lima fresca, hierbas y un final limpio y sabroso. Producido en pequeños lotes, lo perfeccionamos como lo harías en casa: ajustar, equilibrar y repetir. El objetivo siempre fue ofrecer sabor auténtico, ingredientes simples y un producto que quisieras tener siempre a mano. Así, Toma Tola se convirtió en tomate elevado a otro nivel, creado para ir mucho más allá del vaso.\n\nA medida que la marca creció, desarrollamos distintas versiones sin perder nuestra esencia. Simply Delicious ofrece un sabor suave, sabroso y sin picante; Low Sodium Simply Delicious mantiene ese mismo perfil con menos sodio; Originally Delicious es nuestra versión clásica, equilibrada y llena de sabor; y Deliciously Hot aporta un toque más intenso para quienes disfrutan el picante. Podés disfrutar Toma Tola solo, con hielo, en cócteles, marinados, sopas o en cualquier preparación que necesite una base sabrosa.",
    hero: { type: "image", src: "/images/toma-tola-hero.webp" },
    // Galería en el mismo orden en que llegó el material (BRANDING-01 a
    // -13, sin el -02 porque no existe ese archivo) — pedido explícito
    // 2026-08-12: nada de curaduría/reordenamiento de mi parte. La -01 se
    // reutiliza acá (mismo archivo que el hero) porque antes solo vivía
    // como miniatura y quedaba afuera de la galería — ahora también abre
    // la secuencia completa.
    gallery: [
      { src: "/images/toma-tola-hero.webp", alt: "Toma-Tola — lata Deliciously Hot sobre fondo verde (01)" },
      { src: "/images/toma-tola-03.webp", alt: "Toma-Tola — paleta de color y tipografía de marca (03)" },
      { src: "/images/toma-tola-04.webp", alt: "Toma-Tola — línea de 4 variantes con wordmark Tomato Brew (04)" },
      { src: "/images/toma-tola-05.webp", alt: "Toma-Tola — variante del wordmark Tomato Brew con 3 latas (05)" },
      { src: "/images/toma-tola-06.webp", alt: "Toma-Tola — grupo de latas en ángulo (06)" },
      { src: "/images/toma-tola-07.webp", alt: "Toma-Tola — detalle macro de latas apiladas (07)" },
      { src: "/images/toma-tola-08.webp", alt: "Toma-Tola — formato frasco 32oz, dos sabores (08)" },
      { src: "/images/toma-tola-09.webp", alt: "Toma-Tola — formato frasco 8oz, dos etiquetas (09)" },
      { src: "/images/toma-tola-10.webp", alt: "Toma-Tola — ficha de ingredientes y sello del distribuidor (10)" },
      { src: "/images/toma-tola-11.webp", alt: "Toma-Tola — valla publicitaria, pines, posavasos y detalle de lata (11)" },
      { src: "/images/toma-tola-12.webp", alt: "Toma-Tola — collage de marca en uso: consumo, cooler, gorra, sitio web (12)" },
      { src: "/images/toma-tola-13.webp", alt: "Toma-Tola — lámina de cierre de presentación, \"Thank you very much\" (13)" },
    ],
  },
  {
    slug: "digital-experience",
    title: "EXPERIENCIA DIGITAL",
    subtitle: "Diseño web",
    categories: ["Digital"],
    client: "Cliente confidencial 02",
    date: "2025",
    country: "Costa Rica",
    description: LOREM,
    hero: { type: "image", src: "/images/40ff27b92e607e79304651fa3b9a20a866f6de72.webp" },
    gallery: [
      { src: "/images/bd37aae033ded0a3b41c58503bb285e902309d1a.webp", alt: "Experiencia digital — pieza 1" },
      { src: "/images/b8e5aa2cb8161a86beb964887f7eb868f1d146d4.webp", alt: "Experiencia digital — pieza 2" },
      { src: "/images/adc9ad8b7b6c369aad2235798753d32219fc2b03.webp", alt: "Experiencia digital — pieza 3" },
      { src: "/images/c2340cc4f028e5db1828d110a96850a40aa470c9.webp", alt: "Experiencia digital — pieza 4" },
      { src: "/images/4c17b7789867c053637f12fd5d98f584ecb0e308.webp", alt: "Experiencia digital — pieza 5" },
      { src: "/images/269f572522c2b8e4702ecc91fe307b35854fb64c.webp", alt: "Experiencia digital — pieza 6" },
    ],
  },
  {
    slug: "creative-direction",
    title: "DIRECCIÓN CREATIVA",
    subtitle: "Lanzamiento de producto",
    categories: ["Creatividad", "Audiovisual"],
    client: "Cliente confidencial 03",
    date: "2024",
    country: "Panamá",
    description: LOREM,
    hero: { type: "image", src: "/images/5bffb580299f4f3ea634dea64bef359a203e92fd.webp" },
    gallery: [
      { src: "/images/55d2a969fc609eaedfdf9745ba9dcd543cde9836.webp", alt: "Dirección creativa — pieza 1" },
      { src: "/images/614bb68043c305dc176a286eb6a45bbc1daf6c2c.webp", alt: "Dirección creativa — pieza 2" },
      { src: "/images/727d2809dc3e7714eec8b7598155acb0ee852f32.webp", alt: "Dirección creativa — pieza 3" },
      { src: "/images/1031bf7c59810c75b1e729e6881a5931e8d03819.webp", alt: "Dirección creativa — pieza 4" },
      { src: "/images/36bc2da07d386d06bb24293e2aac95fd81bdb5dc.webp", alt: "Dirección creativa — pieza 5" },
      { src: "/images/645801bdbd0b05382051f8fac1b00ac24d6c1340.webp", alt: "Dirección creativa — pieza 6" },
    ],
  },
  {
    slug: "social-content",
    title: "CONTENIDO SOCIAL",
    subtitle: "Estrategia de contenido",
    categories: ["Digital", "Eventos"],
    client: "Cliente confidencial 04",
    date: "2024",
    country: "Nicaragua",
    description: LOREM,
    hero: { type: "image", src: "/images/66b5fc4b0db29f5c76c0bf7fcb9487e5b2a19f0c.webp" },
    gallery: [
      { src: "/images/82bbaf1eb527f137627b5fd0b0f70dda88cacec0.webp", alt: "Contenido social — pieza 1" },
      { src: "/images/9353bfe8e9365a790af56f3356bd07903b8f2724.webp", alt: "Contenido social — pieza 2" },
      { src: "/images/a338897be47fb06799af096e1a29aeb038648149.webp", alt: "Contenido social — pieza 3" },
      { src: "/images/bd37aae033ded0a3b41c58503bb285e902309d1a.webp", alt: "Contenido social — pieza 4" },
      { src: "/images/b8e5aa2cb8161a86beb964887f7eb868f1d146d4.webp", alt: "Contenido social — pieza 5" },
      { src: "/images/adc9ad8b7b6c369aad2235798753d32219fc2b03.webp", alt: "Contenido social — pieza 6" },
    ],
  },
];

export function getWorkItem(slug: string): WorkItem | undefined {
  return workItems.find((item) => item.slug === slug);
}
