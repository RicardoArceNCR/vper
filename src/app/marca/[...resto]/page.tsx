import { notFound } from "next/navigation";

/**
 * Cualquier ruta de /marca que no existe cae acá y dispara el 404 del portal
 * (marca/not-found.tsx), con el sidebar y el menú de Marca VPER. Sin esto, Next
 * usa el 404 público (app/not-found.tsx) y "Volver al inicio" saca del portal:
 * un not-found.tsx anidado solo atiende los notFound() de su segmento, no las
 * URLs sin página.
 */
export default function MarcaNoExiste() {
  notFound();
}
