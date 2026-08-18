export const NAV_ITEMS = [
  { label: "PROYECTOS", id: "work" },
  { label: "SERVICIOS", id: "services" },
  { label: "NUESTRO PROCESO", id: "process" },
  { label: "NOSOTROS", id: "aboutus" },
] as const;

export const NAV_SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export const FOOTER_NAV_ITEMS = [...NAV_ITEMS, { label: "CONTACTO", id: "contact" }];
