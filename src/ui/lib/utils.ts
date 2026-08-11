import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge trata `text-body-sm` y `text-[var(--text-secondary)]` como
// el mismo grupo `text-*` y se come el font-size — mismo bug real que ya
// documentó misitio (2026-08-11, niveles.tsx). Copiado tal cual: este
// proyecto también usa el type-scale (`text-body-sm`, `text-body-lg`, etc.)
// junto a colores arbitrarios.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-hero",
            "display-xl",
            "display-lg",
            "display-md",
            "display-sm",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "body-xs",
            "body-sm",
            "body-md",
            "body-lg",
            "body-lg-bold",
            "body-md-bold",
            "body-sm-bold",
            "label-xs",
            "label-sm",
            "label-md",
            "label-lg",
            "overline-sm",
            "overline-lg",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
