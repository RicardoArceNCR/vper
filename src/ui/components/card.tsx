import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ui/lib/utils";

// Copiado tal cual de misitio (src/ui/components/card.tsx) — mismos alias
// --card-* del paquete @misitio/ui compartido.
const cardVariants = cva(
  "rounded-[var(--card-radius)] border bg-[var(--card-bg)] p-[var(--card-padding)] text-[var(--card-text)] border-[var(--card-border)] shadow-[var(--card-shadow)] transition-colors",
  {
    variants: {
      interactive: {
        true: "hover:bg-[var(--card-bg-hover)] hover:border-[var(--card-border-hover)]",
        false: "",
      },
    },
    defaultVariants: {
      interactive: false,
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ interactive, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

export { Card, cardVariants };
