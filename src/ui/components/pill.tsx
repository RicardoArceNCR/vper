import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ui/lib/utils";

// Nuevo 2026-08-12 — primer consumo real de los tokens --pill-* del
// paquete @misitio/ui, que ya venían definidos (tokens.css/tokens-dark.css)
// pero sin ningún componente que los usara (huérfanos, confirmado por grep
// antes de armar esto). Trigger: página de detalle de proyecto (work/[slug])
// necesita etiquetas de categoría — mismo criterio que Button/Input/Card,
// "se agrega cuando una pantalla real lo necesita" (ver README, sección
// "Componentes UI"), no especulativo.
//
// variant "base": gris neutro, para categorías/etiquetas informativas
//   (--pill-base-bg/-text/-border) — es el que pide el layout de referencia.
// variant "brand": ámbar de marca, para cuando una categoría sí debe
//   destacar (--pill-brand-bg/-text), sin borde propio (mismo criterio que
//   el token: pill-brand no trae --pill-brand-border en el paquete).
const pillVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--pill-radius)] py-1 text-label-sm font-bold uppercase tracking-wide whitespace-nowrap",
  {
    variants: {
      variant: {
        base: "bg-[var(--pill-base-bg)] text-[var(--pill-base-text)] border border-[var(--pill-base-border)]",
        brand: "bg-[var(--pill-brand-bg)] text-[var(--pill-brand-text)]",
      },
      size: {
        default: "px-[var(--pill-md-padding-x)]",
        sm: "px-[var(--pill-sm-padding-x)] text-label-xs py-0.5",
      },
    },
    defaultVariants: {
      variant: "base",
      size: "default",
    },
  },
);

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof pillVariants> {}

const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        className={cn(pillVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Pill.displayName = "Pill";

export { Pill, pillVariants };
