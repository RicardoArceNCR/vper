/**
 * Isologo VPER: la casetera con la palabra adentro, en los cuatro colores de la
 * paleta. El toolkit de diseño la rotula ISOLOGO. Es una de las dos familias
 * de la marca, al mismo nivel que el logotipo: la expresiva.
 *
 * A diferencia de los logotipos (marks-data.ts), son ilustraciones a varios
 * colores: no se inlinean ni se recolorean. Se sirven como archivo desde
 * public/images/isologo/ con `<img>`, así sus clases `.cls-N` no chocan entre
 * sí. El hex vive en el SVG que entregó diseño, no en un componente.
 *
 * `media` y `registered` describen el archivo tal como llegó: las cuatro no
 * son iguales. Es una pregunta para diseño ("Para revisar con diseño"), no un
 * aviso para el equipo: la lámina no lo muestra en las muestras ni en el LEEME.
 */

export type IsoKey = "clay" | "amber" | "jade" | "sky";

export interface Isologo {
  key: IsoKey;
  /** Nombre del color en la paleta del portal. */
  name: string;
  src: string;
  /** viewBox del archivo: ancho × alto. */
  size: readonly [number, number];
  /** Trae MEDIA. */
  media: boolean;
  /** Trae ®. */
  registered: boolean;
}

const BASE = "/images/isologo/";

/** Orden de la lámina: el del toolkit no importa, los cuatro valen igual. */
const CLAY: Isologo = {
  key: "clay",
  name: "Clay",
  src: `${BASE}vper-isologo-clay.svg`,
  size: [419.13, 294.44],
  media: true,
  registered: true,
};

/** La que se muestra cuando hay lugar para una sola (miniaturas, reducción). */
export const ISOLOGO_REF = CLAY;

/** Orden de la lámina: primero las dos con MEDIA en pantalla. */
export const ISOLOGOS: readonly Isologo[] = [
  CLAY,
  {
    key: "amber",
    name: "Amber",
    src: `${BASE}vper-isologo-amber.svg`,
    size: [418.7, 276.43],
    media: true,
    registered: false,
  },
  {
    key: "jade",
    name: "Jade",
    src: `${BASE}vper-isologo-jade.svg`,
    size: [413.36, 252.95],
    media: true,
    registered: true,
  },
  {
    key: "sky",
    name: "Sky",
    src: `${BASE}vper-isologo-sky.svg`,
    size: [451.24, 267.95],
    media: false,
    registered: true,
  },
];
