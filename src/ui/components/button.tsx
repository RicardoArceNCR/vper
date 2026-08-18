import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ui/lib/utils";

// Copiado tal cual de misitio (src/ui/components/button.tsx) — mismo
// paquete @misitio/ui, mismos alias --button-*. Ver ese archivo para la
// auditoría completa de qué token resuelve cada variante; no se duplica
// el comentario largo aquí para no desincronizarlo en dos lugares.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--button-radius)] text-body-sm font-sans font-(weight:--button-font-weight) uppercase tracking-(--button-letter-spacing) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)] disabled:pointer-events-none disabled:opacity-50 disabled:bg-[var(--button-disabled-bg)] disabled:text-[var(--button-disabled-text)] disabled:border-[var(--button-disabled-border)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] border-[var(--button-primary-border)] hover:bg-[var(--button-primary-bg-hover)] hover:text-[var(--button-primary-text-hover,#fff)] hover:border-[var(--button-primary-border-hover,var(--button-primary-bg-hover))] active:bg-[var(--button-primary-bg-press)] active:text-[var(--button-primary-text-hover,#fff)]",
        destructive:
          "bg-[var(--button-danger-bg)] text-[var(--button-danger-text)] border-[var(--button-danger-border)] hover:bg-[var(--button-danger-bg-hover)] active:bg-[var(--button-danger-bg-press)]",
        outline:
          "border border-[var(--button-secondary-border)] bg-transparent hover:bg-[var(--button-secondary-bg-hover)] text-[var(--button-secondary-text)]",
        secondary:
          "border bg-[var(--button-secondary-bg)] [background-image:var(--button-secondary-fill,none)] text-[var(--button-secondary-text)] border-[var(--button-secondary-border)] hover:bg-[var(--button-secondary-bg-hover)] hover:[background-image:none] hover:text-[var(--button-secondary-text-hover,#0e0e0e)] hover:border-[var(--button-secondary-border-hover,#fff)] active:bg-[var(--button-secondary-bg-press)] active:[background-image:none] active:text-[var(--button-secondary-text-hover,#0e0e0e)]",
        ghost:
          "border-[var(--button-ghost-border)] bg-[var(--button-ghost-bg)] text-[var(--button-ghost-text)] hover:bg-[var(--button-ghost-bg-hover)] active:bg-[var(--button-ghost-bg-press)]",
        link: "text-[var(--color-accent-base)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[var(--button-size-md-height)] px-[var(--button-size-md-padding-x)]",
        sm: "h-[var(--button-size-sm-height)] px-[var(--button-size-sm-padding-x)]",
        lg: "h-[var(--button-size-lg-height)] px-[var(--button-size-lg-padding-x)]",
        icon: "h-[var(--button-size-md-height)] w-[var(--button-size-md-height)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
