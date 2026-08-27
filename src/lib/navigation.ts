// El nav dejó de ser "cuatro anclas de la home" (2026-08-26).
//
// POR QUÉ: al aparecer el índice /work hay DOS puertas al portafolio con
// dos intenciones distintas, y meterlas en el mismo link las rompe a las
// dos. El botón del hero ("VER PROYECTOS") scrollea a la vitrina — un
// gesto de "mirá esto de paso". El item del nav lleva al archivo
// completo — "quiero ver todo lo que hicieron". Si "PROYECTOS" siguiera
// siendo /#work, alguien parado en el archivo que lo toca se iría a la
// home; si el hero apuntara a /work, la vitrina sticky dejaría de tener
// para qué existir.
//
// De ahí los dos campos:
//   sectionId → el item se ilumina con el scroll-spy, pero SOLO en la
//               home (useActiveSection sondea el DOM de esa página).
//   match     → el item se ilumina por pathname, en cualquier página.
// Un item tiene uno u otro, nunca los dos.
export interface NavItem {
  label: string;
  href: string;
  sectionId?: string;
  match?: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "PROYECTOS", href: "/work", match: "/work" },
  { label: "SERVICIOS", href: "/#services", sectionId: "services" },
  { label: "NUESTRO PROCESO", href: "/#process", sectionId: "process" },
  { label: "NOSOTROS", href: "/#aboutus", sectionId: "aboutus" },
];

// Solo los que la sonda de scroll puede encontrar en la home.
export const NAV_SECTION_IDS: readonly string[] = NAV_ITEMS.flatMap((item) =>
  item.sectionId ? [item.sectionId] : [],
);

export const FOOTER_NAV_ITEMS: readonly NavItem[] = [
  ...NAV_ITEMS,
  { label: "CONTACTO", href: "/#contact", sectionId: "contact" },
];

// ¿Este item del nav está activo, parados en `pathname` y con la sonda
// de scroll devolviendo `activeSection`? Vive acá y no en Header para
// que el footer (u otro consumidor futuro) no reimplemente la regla.
export function isNavItemActive(
  item: NavItem,
  pathname: string,
  activeSection: string | null,
): boolean {
  if (item.match) {
    return pathname === item.match || pathname.startsWith(`${item.match}/`);
  }
  return pathname === "/" && activeSection === item.sectionId;
}
