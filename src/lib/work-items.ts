// Fuente única de proyectos — las TRES superficies leen del MISMO array:
// la vitrina de la home (WorkGallery, los 4 con `homeOrder`), el índice
// completo (app/work) y el detalle (app/work/[slug]). Antes WorkGallery
// tenía sus proyectos hardcodeados dentro del componente; al sumar
// páginas de detalle eso hubiera significado mantener título/categoría/
// imágenes sincronizados a mano en dos lugares. Con esto, un solo lugar
// de verdad — y el índice nuevo no agregó una cuarta lista.
//
// CONTENIDO (actualizado 2026-08-26): los 6 proyectos son reales —
// láminas del cliente, copy en español. Fecha y país quedan pendientes
// donde el material no lo confirma; desde 2026-08-26 eso significa
// campo ausente, no la cadena "pendiente de confirmar" en pantalla. Los
// 3 placeholders (Experiencia digital, Dirección creativa, Contenido
// social) se sacaron el 2026-08-18.
//
// IMÁGENES: cada proyecto real trae su propio set en public/images
// (toma-tola-*, netforemost-*, vida-nica-*, monumental-humidors-*,
// oh-la-lashes-*, wok-*), sin reutilizar fotos de otras secciones.
// Héroes de vitrina/detalle: tope 1024×576. Un 1920 en la card de
// home (~355px) era el recorte de PageSpeed; el detalle a 1024 es
// el mismo techo que ya tenían cuatro de los seis.
//
// VIDEO: el tipo "video" está soportado end-to-end (ver ProjectHero), pero
// ningún proyecto lo usa todavía porque no hay ningún .mp4 real en
// public/ — deuda de contenido, no de código.
//
// CATEGORIES: son los servicios reales de VPER, no categorías inventadas
// como las de la demo original (Brand Strategy, UX/UI Design...), para
// que el tag de cada proyecto corresponda a un servicio que el sitio de
// verdad ofrece. Desde 2026-08-26 la lista NO se repite acá: vive en
// lib/services.ts y el tipo `ServiceName` se deriva de ahí. Este
// comentario listaba seis nombres a mano y ya había quedado desfasado —
// decía "Eventos" cuando el grid hacía rato mostraba "Branding".

import type { ServiceName } from "@/lib/services";

// "span" (full/half/third) se sacó 2026-08-12: ProjectGallery pasó de un
// grid multi-columna con object-cover (recortaba fotos reales) a una sola
// columna con cada imagen a su alto natural — ya no hay nada que "span"
// pudiera controlar. Ver comentario en project-gallery.tsx.
// SECTOR (2026-08-26): el eje que de verdad parte este portafolio. Los
// seis casos son seis sectores distintos, sin solapamiento — a
// diferencia de `categories`, donde "Creatividad" está en los seis y por
// lo tanto no separa nada. Es también el eje que un prospecto usa de
// verdad ("¿han hecho algo de comida?"). Se agrega ahora, con seis
// casos, porque con veinte es arqueología.
export const SECTORS = [
  "Bebidas",
  "Tecnología",
  "Bienes raíces",
  "Puros",
  "Estética",
  "Restaurantes",
] as const;

export type Sector = (typeof SECTORS)[number];

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface WorkItem {
  slug: string;
  title: string;
  subtitle: string;
  // Vocabulario cerrado: los servicios que el sitio realmente ofrece
  // (ver lib/services.ts). Era `string[]` — un typo creaba una categoría
  // nueva y TypeScript aplaudía.
  categories: ServiceName[];
  sector: Sector;
  client: string;
  // Opcionales A PROPÓSITO (2026-08-26). Antes eran obligatorios y los
  // casos sin dato confirmado guardaban la cadena "Fecha pendiente de
  // confirmar", que se imprimía tal cual en la ficha: una nota interna
  // honesta que en pantalla se leía como una agencia que no sabe cuándo
  // hizo su propio trabajo. Ahora el campo que falta simplemente no se
  // renderiza (ver work/[slug]/page.tsx) y el pendiente queda anotado
  // donde corresponde: en el comentario del proyecto.
  date?: string;
  country?: string;
  description: string;
  hero: { type: "image" | "video"; src: string; poster?: string };
  gallery: GalleryImage[];
  // Presencia = el proyecto va en la vitrina de la home; el valor = su
  // posición en el track. Un solo campo en vez de `featured` +
  // `homeOrder` por separado, que se pueden contradecir.
  //
  // POR QUÉ NO `slice(0, 4)`: este array está en orden de llegada, así
  // que cortar por posición dejaría afuera a WOK — el más nuevo y el
  // mejor terminado. La home es curaduría, no cronología.
  homeOrder?: number;
}

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
    // solo el concepto). No entra en "Planeación Estratégica" ni "Digital & Web"
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
    sector: "Bebidas",
    client: "Toma-Tola",
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
      { src: "/images/toma-tola-13.webp", alt: "Toma-Tola — lámina de cierre de presentación (13)" },
    ],
    homeOrder: 2,
  },
  {
    // Segundo proyecto real (2026-08-18). Copy original en inglés,
    // traducido al español (el sitio está en español). Categorías
    // acordadas: Creatividad + Digital & Web.
    slug: "netforemost",
    title: "NETFOREMOST",
    subtitle: "Equipos nativos en IA",
    categories: ["Creatividad", "Digital & Web"],
    sector: "Tecnología",
    client: "NetForemost",
    description:
      "Construye software más rápido con equipos de delivery nativos en IA.\n\nNetForemost ofrece diseño de producto, desarrollo de software, QA y gestión de proyectos para empresas que necesitan los roles, el proceso y la experiencia tecnológica adecuados para alcanzar sus objetivos de software.",
    hero: { type: "image", src: "/images/netforemost-hero.webp" },
    // Galería en el orden original (01–13). El hero de la card es la
    // lámina de marca con wordmark (pedido 2026-08-18), distinta de la
    // -01/-02 de la secuencia.
    gallery: [
      { src: "/images/netforemost-01.webp", alt: "NetForemost — wordmark e isotipo sobre fondo oscuro (01)" },
      { src: "/images/netforemost-02.webp", alt: "NetForemost — hero del sitio, equipos de delivery nativos en IA (02)" },
      { src: "/images/netforemost-03.webp", alt: "NetForemost — paleta de color y tipografía Work Sans / Lato (03)" },
      { src: "/images/netforemost-04.webp", alt: "NetForemost — isotipo N sobre retícula (04)" },
      { src: "/images/netforemost-05.webp", alt: "NetForemost — sistema de logo en cuatro fondos (05)" },
      { src: "/images/netforemost-06.webp", alt: "NetForemost — mockup de app y barra del browser (06)" },
      { src: "/images/netforemost-07.webp", alt: "NetForemost — mockup de laptop con el sitio (07)" },
      { src: "/images/netforemost-08.webp", alt: "NetForemost — isotipo 3D en vidrio (08)" },
      { src: "/images/netforemost-09.webp", alt: "NetForemost — banner construido alrededor de tu stack tecnológico (09)" },
      { src: "/images/netforemost-10.webp", alt: "NetForemost — banner el discovery va antes de cada statement of work (10)" },
      { src: "/images/netforemost-11.webp", alt: "NetForemost — mockup de tarjeta de presentación (11)" },
      { src: "/images/netforemost-12.webp", alt: "NetForemost — retrato desarrollo nativo en IA (12)" },
      { src: "/images/netforemost-13.webp", alt: "NetForemost — cierre de presentación, Gracias (13)" },
    ],
    homeOrder: 4,
  },
  {
    // Tercer proyecto real (2026-08-18). Láminas VIDA_NICA_BRANDING-01 y
    // -03 a -13 (no hay -02). Copy del cliente, con la "у" cirílica del
    // pegado convertida a "y". Categorías: Creatividad (identidad: logo,
    // paleta, tipo Meditative, papelería) + Digital & Web (Facebook, Instagram,
    // stories). El tótem (11) es ATL, una pieza de doce — no alcanza
    // para taguear ATL & BTL. País: Nicaragua está en el copy ("inviertes
    // en Nicaragua", "mercado nicaragüense"), no es una suposición.
    slug: "vida-nica",
    title: "VIDA NICA",
    subtitle: "Bienes raíces",
    categories: ["Creatividad", "Digital & Web"],
    sector: "Bienes raíces",
    client: "Vida Nica",
    country: "Nicaragua",
    description:
      "En Vida Nica Bienes Raíces, transformamos la manera en que inviertes en Nicaragua, ofreciendo oportunidades exclusivas en bienes raíces con un servicio transparente, profesional y personalizado.\n\nNos especializamos en conectar a inversionistas nacionales e internacionales con propiedades de alto valor, asegurando experiencias de compra, venta y alquiler que reflejen confianza, calidad y crecimiento.\n\nNuestra identidad está arraigada en la esencia de Nicaragua: su cultura vibrante, su riqueza natural y su potencial de desarrollo. Con una imagen moderna y sofisticada, brindamos soluciones inmobiliarias estratégicas que garantizan bienestar, rentabilidad y una inversión segura en el mercado nicaragüense.\n\nVida Nica: donde la exclusividad y la confianza construyen tu futuro.",
    hero: { type: "image", src: "/images/vida-nica-hero.webp" },
    // Galería en el orden original del material (01, 03–13). El hero es
    // la -01 (bahía + logo): sirve de card y abre la secuencia, mismo
    // criterio que Toma-Tola.
    gallery: [
      { src: "/images/vida-nica-hero.webp", alt: "Vida Nica — bahía de San Juan del Sur con logo (01)" },
      { src: "/images/vida-nica-03.webp", alt: "Vida Nica — paleta de color y tipografía Meditative (03)" },
      { src: "/images/vida-nica-04.webp", alt: "Vida Nica — variantes de logo: isotipo, horizontal y vertical (04)" },
      { src: "/images/vida-nica-05.webp", alt: "Vida Nica — banner Inversiones seguras en bienes raíces (05)" },
      { src: "/images/vida-nica-06.webp", alt: "Vida Nica — muro de oficina con logo 3D (06)" },
      { src: "/images/vida-nica-07.webp", alt: "Vida Nica — mockup de Facebook e Instagram (07)" },
      { src: "/images/vida-nica-08.webp", alt: "Vida Nica — porta tarjetas de cuero con isotipo (08)" },
      { src: "/images/vida-nica-09.webp", alt: "Vida Nica — sello de goma de la marca (09)" },
      { src: "/images/vida-nica-10.webp", alt: "Vida Nica — stickers de logo (10)" },
      { src: "/images/vida-nica-11.webp", alt: "Vida Nica — tótem digital en plaza (11)" },
      { src: "/images/vida-nica-12.webp", alt: "Vida Nica — papelería corporativa (12)" },
      { src: "/images/vida-nica-13.webp", alt: "Vida Nica — cierre de presentación, Gracias (13)" },
    ],
    homeOrder: 3,
  },
  {
    // Cuarto proyecto real (2026-08-18). Láminas
    // MONUMENTAL_HUMIDORS_BRANDING-01 y -03 a -13 (no hay -02). Copy
    // original en inglés, traducido al español (el sitio está en
    // español). Categorías: Creatividad (identidad: imagotipo, paleta,
    // Pioggia/Gotham, sello 2019) + Audiovisual (fotografía de producto y
    // lifestyle). No hay entregable digital de sitio/app. Fecha: 2019
    // está en el sello de marca (20 / 19). País: el copy habla de
    // artesanos cubanos — Cuba, no una suposición de sede inventada.
    slug: "monumental-humidors",
    title: "MONUMENTAL",
    subtitle: "Humidores",
    categories: ["Creatividad", "Audiovisual"],
    sector: "Puros",
    client: "Monumental Humidors",
    date: "2019",
    country: "Cuba",
    description:
      "Monumental Humidors nació del conocimiento, la experiencia y el magisterio de distinguidos artesanos cubanos, profundamente familiarizados con la cultura y el mundo de los puros premium. Su comprensión de la importancia de preservar correctamente cada pieza dio origen a una marca creada para proteger lo que hace único a un gran puro: su aroma, sabor, calidad y carácter.\n\nCada humidor se elabora con dedicación, precisión y respeto por una tradición que ha trascendido generaciones. Más que un objeto funcional, es una pieza distintiva que reúne artesanía, diseño y excelencia.\n\nNuestro propósito es llevar Monumental Humidors a los amantes y conocedores de puros de todo el mundo, para que disfruten de una experiencia de conservación digna de sus mejores cigarros.",
    hero: { type: "image", src: "/images/monumental-humidors-hero.webp" },
    // Galería en el orden original (01, 03–13). El hero de la card es el
    // pin MH (lámina 11), no la -01 — pedido 2026-08-18.
    gallery: [
      { src: "/images/monumental-humidors-01.webp", alt: "Monumental Humidors — humidor con wordmark de la marca (01)" },
      { src: "/images/monumental-humidors-03.webp", alt: "Monumental Humidors — logo sobre tres fondos de color (03)" },
      { src: "/images/monumental-humidors-04.webp", alt: "Monumental Humidors — paleta de color y tipografía Pioggia / Gotham (04)" },
      { src: "/images/monumental-humidors-05.webp", alt: "Monumental Humidors — variantes de logo: imagotipo, horizontal, vertical y sello (05)" },
      { src: "/images/monumental-humidors-06.webp", alt: "Monumental Humidors — pieza Colección Signature (06)" },
      { src: "/images/monumental-humidors-07.webp", alt: "Monumental Humidors — pieza Proporciones divinas (07)" },
      { src: "/images/monumental-humidors-08.webp", alt: "Monumental Humidors — pieza Inconfundiblemente Monumental (08)" },
      { src: "/images/monumental-humidors-09.webp", alt: "Monumental Humidors — sello dorado de la marca, 2019 (09)" },
      { src: "/images/monumental-humidors-10.webp", alt: "Monumental Humidors — pieza Una tradición de generación en generación (10)" },
      { src: "/images/monumental-humidors-11.webp", alt: "Monumental Humidors — pin MH en la manga de un saco (11)" },
      { src: "/images/monumental-humidors-12.webp", alt: "Monumental Humidors — artesano con camiseta de la marca (12)" },
      { src: "/images/monumental-humidors-13.webp", alt: "Monumental Humidors — cierre de presentación, Gracias (13)" },
    ],
  },
  {
    // Quinto proyecto real (2026-08-18). Láminas OH_LA_LASHES_BRANDING-01
    // y -03 a -13 (no hay -02). Copy del cliente en español. Categorías:
    // Creatividad (identidad, paleta, papelería, merch) + Digital & Web (feed
    // de redes). El mupi/valla (07) es ATL, una pieza de doce. País:
    // Nicaragua — Managua y +505 en la tarjeta, no es una suposición.
    slug: "oh-la-lashes",
    title: "LA LASHES",
    subtitle: "Clínica estética",
    categories: ["Creatividad", "Digital & Web"],
    sector: "Estética",
    client: "Oh! La Lashes",
    country: "Nicaragua",
    description:
      "En Oh! La Lashes tenemos una clara misión: destacar lo más hermoso de ti y garantizar que tu imagen y presencia refleje con claridad toda la belleza que emana desde tu interior.\n\nContamos con una amplia gama de servicios de belleza y estética, personal altamente calificado, certificaciones internacionales y servicio de la más alta calidad.",
    hero: { type: "image", src: "/images/oh-la-lashes-hero.webp" },
    // Galería en el orden original (01, 03–13). El hero de la card es el
    // mockup de redes (lámina 06), no la -01 — pedido 2026-08-18.
    gallery: [
      { src: "/images/oh-la-lashes-01.webp", alt: "Oh! La Lashes — close-up de ojo con logo de la marca (01)" },
      { src: "/images/oh-la-lashes-03.webp", alt: "Oh! La Lashes — variantes de logo en positivo y negativo (03)" },
      { src: "/images/oh-la-lashes-04.webp", alt: "Oh! La Lashes — paleta de color de marca (04)" },
      { src: "/images/oh-la-lashes-05.webp", alt: "Oh! La Lashes — tipografía Passenger Display (05)" },
      { src: "/images/oh-la-lashes-06.webp", alt: "Oh! La Lashes — piezas para redes sociales (06)" },
      { src: "/images/oh-la-lashes-07.webp", alt: "Oh! La Lashes — valla y mupi Realza tu belleza (07)" },
      { src: "/images/oh-la-lashes-08.webp", alt: "Oh! La Lashes — tratamiento en clínica (08)" },
      { src: "/images/oh-la-lashes-09.webp", alt: "Oh! La Lashes — polo, sello y tarjetas (09)" },
      { src: "/images/oh-la-lashes-10.webp", alt: "Oh! La Lashes — tarjetas de presentación (10)" },
      { src: "/images/oh-la-lashes-11.webp", alt: "Oh! La Lashes — visera con logo (11)" },
      { src: "/images/oh-la-lashes-12.webp", alt: "Oh! La Lashes — papelería corporativa (12)" },
      { src: "/images/oh-la-lashes-13.webp", alt: "Oh! La Lashes — cierre de presentación, Gracias (13)" },
    ],
  },
  {
    // Sexto proyecto real (2026-08-26). Láminas WOK BRANDGUIDE-01 y
    // -03 a -13 (no hay -02). Copy del cliente en español; se corrigió
    // el "l" suelto de "han sido l transmitidos" y se espaciaron los
    // guiones de Chuánchéng. Categorías: Creatividad (identidad: logo
    // vertical/horizontal/isotipo, paleta, Gang of Three, ilustración,
    // texturas, merch, empaque) + Audiovisual (fotografía de producto
    // en afiches 10 y 11). Las piezas de redes (08) son Digital & Web, una
    // lámina de doce — no alcanza para el tag, mismo criterio que el
    // tótem de Vida Nica. País: Nicaragua está en el copy ("se comparte
    // con Nicaragua") y en la dirección del empaque (Las Colinas) — no
    // es una suposición.
    slug: "wok",
    title: "WOK",
    subtitle: "Cocina cantonesa",
    categories: ["Creatividad", "Audiovisual"],
    sector: "Restaurantes",
    client: "WOK Cantonese Kitchen",
    country: "Nicaragua",
    description:
      "WOK nace de una herencia familiar con raíces chinas y del deseo de preservar lo mejor de la cocina cantonesa. Durante generaciones, técnicas, sabores y conocimientos han sido transmitidos dentro de la familia, manteniendo viva una tradición que hoy se comparte con Nicaragua.\n\nInspirados en el concepto chino Chuánchéng — recibir, preservar y transmitir un legado —, cada platillo se prepara con respeto, calidad y pasión. Cada platillo es una forma de transmitir cultura, contar una historia y mantener vivo aquello que una familia ha conservado durante generaciones.\n\nPorque para nosotros cocinar no es solamente servir comida. Es compartir nuestro legado.",
    hero: { type: "image", src: "/images/wok-hero.webp" },
    // Galería en el orden original (01, 03–13). El hero de la card es el
    // mockup de interior (lámina 12), no la -01: la portada de mármol
    // queda pálida al recorte 16/10 de la home; el letrero con faroles
    // lee mejor como miniatura, mismo criterio que Monumental (pin) y
    // Oh! La Lashes (redes).
    gallery: [
      { src: "/images/wok-01.webp", alt: "WOK — logo vertical sobre mármol con bambú (01)" },
      { src: "/images/wok-03.webp", alt: "WOK — paleta de color y tipografía Gang of Three (03)" },
      { src: "/images/wok-04.webp", alt: "WOK — variantes de logo: isotipo, horizontal y vertical (04)" },
      { src: "/images/wok-05.webp", alt: "WOK — lámina de texturas de marca (05)" },
      { src: "/images/wok-06.webp", alt: "WOK — sistema de ilustración: neko, wok, baozi, farol, dragón (06)" },
      { src: "/images/wok-07.webp", alt: "WOK — merch, camisetas dragón y maneki-neko (07)" },
      { src: "/images/wok-08.webp", alt: "WOK — piezas para redes: 2x1, abiertos, baozi (08)" },
      { src: "/images/wok-09.webp", alt: "WOK — mockup de caja para llevar (09)" },
      { src: "/images/wok-10.webp", alt: "WOK — afiches Una tradición que continúa / Hecho al wok (10)" },
      { src: "/images/wok-11.webp", alt: "WOK — afiches Hay sabores que te hacen volver / De nuestra familia a tu mesa (11)" },
      { src: "/images/wok-12.webp", alt: "WOK — mockup de interior con letrero y faroles (12)" },
      { src: "/images/wok-13.webp", alt: "WOK — cierre de presentación, Gracias (13)" },
    ],
    homeOrder: 1,
  },
];

export function getWorkItem(slug: string): WorkItem | undefined {
  return workItems.find((item) => item.slug === slug);
}

// Los 4 de la vitrina de la home, en el orden curado por `homeOrder`.
// El índice /work sigue leyendo `workItems` completo: la home es un
// subconjunto de la misma fuente, no una lista aparte.
export function getFeaturedWorkItems(): WorkItem[] {
  return workItems
    .filter(
      (item): item is WorkItem & { homeOrder: number } =>
        item.homeOrder !== undefined,
    )
    .sort((a, b) => a.homeOrder - b.homeOrder);
}

// El orden de EXHIBICIÓN del archivo: más reciente primero. `workItems`
// está en orden de llegada (Toma-Tola fue el primero que se montó, WOK
// el último), que es un dato de mantenimiento — sirve para leer el
// archivo como changelog, no para decidir qué ve un visitante primero.
// Una sola función para que el índice /work y el pager del detalle
// recorran la MISMA secuencia: si el índice mostrara una y el pager
// otra, "siguiente" llevaría a un caso que en la lista estaba antes.
export function getArchiveWorkItems(): WorkItem[] {
  return [...workItems].reverse();
}

// Recorre el archivo COMPLETO, no la vitrina: que la home muestre 4 no
// recorta el pager. Loop: el último apunta al primero, para no dejar un
// callejón sin salida al pie del último caso.
export function getAdjacentWorkItems(slug: string): {
  prev: WorkItem;
  next: WorkItem;
} | null {
  const items = getArchiveWorkItems();
  const i = items.findIndex((item) => item.slug === slug);
  if (i < 0 || items.length < 2) return null;
  const n = items.length;
  return {
    prev: items[(i - 1 + n) % n]!,
    next: items[(i + 1) % n]!,
  };
}
