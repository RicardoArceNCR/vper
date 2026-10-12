/**
 * Datos del portal Marca VPER que se muestran en varias pantallas (login,
 * Inicio, sidebar, menú móvil). Una sola fuente: si cambia el dueño o la
 * versión, se cambia acá.
 *
 * PENDIENTE: completar `owner` con el nombre y el correo reales de quien
 * mantiene la marca. Mientras esté vacío, las pantallas muestran un texto
 * genérico ("el equipo de VPER Media") en vez de un contacto.
 */
export const MARCA = {
  /** Nombre único del portal, en todas las pantallas. */
  name: "Marca VPER",
  version: "1.0",
  /** Mes de la última actualización, como se muestra. */
  updated: "Octubre 2026",
  owner: {
    name: "",
    role: "",
    email: "",
  },
} as const;

/** true cuando hay un contacto real cargado. */
export const hasOwner = () => Boolean(MARCA.owner.name && MARCA.owner.email);

/** "Massiel (massiel@…)" o el genérico, para frases como "Pedísela a …". */
export const ownerLabel = () =>
  hasOwner() ? `${MARCA.owner.name} (${MARCA.owner.email})` : "el equipo de VPER Media";
