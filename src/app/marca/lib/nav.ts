import { Home, Mail, Palette, Shapes, type LucideIcon } from "lucide-react";

/**
 * Mapa de Marca VPER: una sola fuente para el sidebar de escritorio y la barra
 * de mobile. Tres capas, como en un portal de marca: design system,
 * lineamientos y recursos. Una pieza nueva se suma acá y aparece en los dos.
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
    label: "Design system",
    items: [
      {
        href: "/marca/sistema",
        label: "Sistema",
        hint: "Color, tipo y componentes, leídos en vivo",
        icon: Palette,
      },
    ],
  },
  {
    label: "Lineamientos",
    items: [
      {
        href: "/marca/logo",
        label: "Logo",
        hint: "Versiones, color, reducción y descargas",
        icon: Shapes,
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
    ],
  },
];

/** Fuera de Marca: laboratorio y sitio público. */
export const MARCA_OUT = [
  { href: "/lab/proceso", label: "Lab 3D" },
  { href: "/", label: "Sitio" },
] as const;

export const isActive = (pathname: string, href: string) =>
  href === "/marca"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
