/**
 * Fondos de marca: composiciones de caseteras que entregó diseño
 * (public/images/fondos/). Sobre transparente y sin repetición: se recortan,
 * no se ponen en mosaico.
 */

export type FondoKey = "color" | "blanco";

export interface Fondo {
  key: FondoKey;
  name: string;
  src: string;
  size: readonly [number, number];
  use: string;
  /** Soporte con el que se muestra y se exporta a JPG (hex: sale a un archivo). */
  plate: { label: string; hex: string; className: string };
}

const BASE = "/images/fondos/";

export const FONDOS: readonly Fondo[] = [
  {
    key: "color",
    name: "Caseteras a color",
    src: `${BASE}vper-fondo-caseteras-color.svg`,
    size: [2760.22, 1446.05],
    use: "Piezas expresivas: portadas de redes, fondos de presentación, merch, pantallas de evento.",
    plate: { label: "negro", hex: "#000000", className: "bg-[var(--color-neutral-950)]" },
  },
  {
    key: "blanco",
    name: "Caseteras en blanco y negro",
    src: `${BASE}vper-fondo-caseteras-blanco.svg`,
    size: [2688.22, 1440.89],
    use: "Piezas sobrias y a una tinta: impresos en blanco y negro, fondos detrás de texto, documentos.",
    plate: { label: "negro", hex: "#000000", className: "bg-[var(--color-neutral-950)]" },
  },
];
