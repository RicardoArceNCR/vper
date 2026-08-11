import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ui/lib/utils";

// Copiado tal cual de misitio (src/ui/components/input.tsx) — mismos alias
// --input-* del paquete @misitio/ui compartido.
const inputVariants = cva(
  "flex h-10 w-full rounded-md border bg-[var(--input-bg)] px-[var(--input-padding-x)] py-[var(--input-padding-y)] text-sm text-[var(--input-text)] transition-colors placeholder:text-[var(--input-placeholder)] hover:border-[var(--input-border-hover)] focus-visible:outline-none focus-visible:border-[var(--input-border-focus)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:bg-[var(--input-bg-focus)] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--input-bg-disabled)] disabled:border-[var(--input-border-disabled)] disabled:text-[var(--input-text-disabled)] disabled:hover:border-[var(--input-border-disabled)]",
  {
    variants: {
      state: {
        default:
          "border-[var(--input-border)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-[var(--focus-ring-offset)]",
        error:
          "border-[var(--input-border-error)] text-[var(--feedback-error-text)] focus-visible:ring-[var(--feedback-error-icon)] focus-visible:ring-offset-[var(--focus-ring-offset)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ state, className }))}
        ref={ref}
        aria-invalid={state === "error" || undefined}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
