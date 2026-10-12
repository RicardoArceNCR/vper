import { ownerLabel } from "./config";

/**
 * "a Massiel (massiel@…)" o "al equipo de VPER Media": la preposición ya
 * contraída, para frases como "Pedísela {aOwner()}". `ownerLabel()` sola daría
 * "a el equipo" con el texto genérico.
 */
export function aOwner(): string {
  // "VPER Media" no se parte al final de una línea.
  const who = ownerLabel().replace("VPER Media", "VPER\u00a0Media");
  return who.startsWith("el ") ? `al ${who.slice(3)}` : `a ${who}`;
}
