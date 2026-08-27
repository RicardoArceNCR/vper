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
    desc: "Ideas y conceptos que hacen que una marca sea imposible de ignorar.",
    icon: "/images/service-creatividad.png",
    iconBg: "var(--color-main-200)",
  },
  {
    name: "Branding",
    desc: "Identidad visual, sistemas y piezas que hacen reconocible a la marca en cada punto de contacto.",
    icon: "/images/service-branding.png",
    iconBg: "var(--color-info-300)",
  },
  {
    name: "Digital",
    desc: "Presencia digital, performance y contenido pensado para convertir, no solo para verse bien.",
    icon: "/images/service-digital.png",
    iconBg: "var(--color-leaf-200)",
  },
  {
    name: "Planeación Estratégica",
    desc: "La ruta antes de la ejecución: research, objetivos y el plan que sostiene toda la campaña.",
    icon: "/images/service-planeacion.png",
    iconBg: "var(--color-leaf-200)",
  },
  {
    name: "Audiovisual",
    desc: "Producción de video y fotografía que le da cara y voz a cada historia de marca.",
    icon: "/images/service-audiovisual.png",
    iconBg: "var(--color-main-200)",
  },
  {
    name: "ATL & BTL",
    desc: "Estrategias ATL y BTL que conectan tu marca con la audiencia correcta, en el canal correcto.",
    icon: "/images/service-atl.png",
    iconBg: "var(--color-info-300)",
  },
] as const;

export type Service = (typeof SERVICES)[number];

// El vocabulario cerrado. Lo consume `WorkItem["categories"]`.
export type ServiceName = Service["name"];
