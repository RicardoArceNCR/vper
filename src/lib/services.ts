// Fuente única de servicios. Vivían hardcodeados dentro de ServicesGrid;
// se mueven acá porque work-items.ts necesita el MISMO vocabulario para
// tipar `categories`.
//
// POR QUÉ: hasta 2026-08-26 `categories` era `string[]`, o sea cualquier
// cadena. La lista ya se había desincronizado sin que nada avisara — el
// comentario de work-items.ts decía que las categorías se remapearon a
// los seis servicios y cerraba con "Eventos", pero el grid que se
// renderiza hoy no tiene Eventos: tiene Branding. Con `ServiceName`
// derivado de este array, renombrar o sacar un servicio rompe el build
// en vez de romper la página en silencio. Y es la precondición para que
// un filtro por servicio sea confiable el día que exista: sin
// vocabulario cerrado, cualquier chip es decorativo.
//
// CAPITALIZACIÓN: los nombres se guardan en capitalización normal
// ("Planeación Estratégica"), no en mayúsculas. El grid las sube con
// `uppercase` en CSS (mismos glifos, mismo ancho medido, cero cambio
// visual) y la pill del proyecto las muestra tal cual. Un solo dato para
// los dos usos, en vez de dos cadenas que se pueden desincronizar.
export const SERVICES = [
  {
    name: "Creatividad",
    desc: "Las ideas pueden cambiar una conversación, una percepción o una marca entera. Creamos con esa ambición.",
    icon: "/images/service-creatividad.png",
    iconBg: "var(--color-main-200)",
  },
  {
    name: "Branding",
    desc: "Construimos marcas con personalidad propia. De esas que reconocés antes de terminar de verlas.",
    icon: "/images/service-branding.png",
    iconBg: "var(--color-info-300)",
  },
  {
    // Un slot, no una séptima card: el cliente pidió sumar desarrollo web
    // al slide Digital (2026-08-29). El & sigue el patrón de ATL & BTL.
    name: "Digital & Web",
    desc: "Desarrollo web, contenido, medios y datos moviéndose a la velocidad de la gente. Porque el mundo digital cambia todos los días. Nosotros también.",
    icon: "/images/service-digital.png",
    iconBg: "var(--color-leaf-200)",
  },
  {
    name: "Planeación Estratégica",
    desc: "Encontramos el problema detrás del problema. Después ponemos estrategia, criterio y una buena cantidad de preguntas sobre la mesa.",
    icon: "/images/service-planeacion.png",
    iconBg: "var(--color-leaf-200)",
  },
  {
    name: "Audiovisual",
    desc: "Convertimos ideas en historias que se ven, se escuchan y se sienten. Porque algunas cosas simplemente necesitan cobrar vida.",
    icon: "/images/service-audiovisual.png",
    iconBg: "var(--color-main-200)",
  },
  {
    name: "ATL & BTL",
    desc: "Ponemos las ideas donde realmente pueden pasar cosas: medios, calles, eventos, experiencias y cualquier lugar donde esté la gente.",
    icon: "/images/service-atl.png",
    iconBg: "var(--color-info-300)",
  },
] as const;

export type Service = (typeof SERVICES)[number];

// El vocabulario cerrado. Lo consume `WorkItem["categories"]`.
export type ServiceName = Service["name"];
