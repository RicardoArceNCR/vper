import {
  Bot,
  Box,
  Download,
  Home,
  Image,
  Mail,
  Package,
  MessageSquareQuote,
  Palette,
  Shapes,
  type LucideIcon,
} from "lucide-react";

/**
 * Mapa de Marca VPER: una sola fuente para el sidebar de escritorio y la barra
 * de mobile. Ordenado por uso: primero lo que consulta todo el equipo
 * (lineamientos), después lo que se baja (recursos) y al final lo de diseño y
 * desarrollo. Una pieza nueva se suma acá y aparece en los dos.
 *
 * Un ítem con ancla (`/marca/logo#descargas`) es un atajo a una sección: nunca
 * se marca como página activa (ver `isActive`).
 */

export interface NavItem {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: readonly NavItem[];
}

export const MARCA_HOME: NavItem = {
  href: "/marca",
  label: "Inicio",
  hint: "Qué hay en Marca VPER",
  icon: Home,
};

export const MARCA_GROUPS: readonly NavGroup[] = [
  {
    label: "Lineamientos",
    items: [
      {
        href: "/marca/logo",
        label: "Logo",
        hint: "Versiones, color, reducción y descargas",
        icon: Shapes,
      },
      {
        href: "/marca/voz",
        label: "Voz y tono",
        hint: "Cómo escribe VPER, con ejemplos del sitio",
        icon: MessageSquareQuote,
      },
      {
        href: "/marca/imagen",
        label: "Imagen",
        hint: "Fotografía e iconografía",
        icon: Image,
      },
      {
        href: "/marca/personaje",
        label: "Personaje",
        hint: "vpercito: dónde va, cómo se usa y su kit",
        icon: Bot,
      },
    ],
  },
  {
    label: "Recursos",
    items: [
      {
        href: "/marca/firmas",
        label: "Firmas de correo",
        hint: "Ocho propuestas, listas para Gmail y Outlook",
        icon: Mail,
      },
      {
        href: "/marca/logo#descargas",
        label: "Descargas del logo",
        hint: "SVG y PNG en negro, blanco y amber",
        icon: Download,
      },
      {
        href: "/marca/personaje#descargas",
        label: "Kit de vpercito",
        hint: "PNG, avatar y emoji, en un ZIP",
        icon: Package,
      },
    ],
  },
  {
    label: "Para diseño y desarrollo",
    items: [
      {
        href: "/marca/sistema",
        label: "Sistema",
        hint: "Color, tipo y componentes, leídos en vivo",
        icon: Palette,
      },
      {
        href: "/lab/proceso",
        label: "Lab 3D",
        hint: "Los íconos 3D del proceso, en vivo",
        icon: Box,
      },
    ],
  },
];

/** Fuera de Marca: el sitio público. */
export const MARCA_OUT = [{ href: "/", label: "Sitio" }] as const;

/**
 * Página activa. Un ítem con ancla es un atajo a una sección de otra página
 * (o de la misma): no cuenta como página activa, así no quedan dos marcados.
 */
export const isActive = (pathname: string, href: string) =>
  href.includes("#")
    ? false
    : href === "/marca"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
