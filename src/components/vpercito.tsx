import type * as React from "react";
import { cn } from "@ui/lib/utils";

/**
 * vpercito, la mascota de VPER. `<picture>` plano (AVIF → WebP) para que se
 * porte a Vite tal cual; nunca el PNG de 740 KB. Los archivos viven en
 * /public/images/vpercito/ y salen del master con el script descrito en
 * /marca/personaje.
 *
 * Dónde va y dónde no: /marca/personaje. Corto: transiciones (404, envío del
 * formulario), nunca hero, trabajos ni equipo.
 *
 * `size` es el ancho en px (el más grande, si cambia por breakpoint): fija
 * width/height del <img> contra el CLS. Para anchos por breakpoint, pasá
 * `className="w-[160px] md:w-[280px]"` y el `sizes` equivalente. Proporción
 * del master recortado: 1006 × 983.
 */

const RATIO = 983 / 1006;
const WIDTHS = [240, 480, 720] as const;
const srcset = (ext: "avif" | "webp") =>
  WIDTHS.map((w) => `/images/vpercito/vpercito-${w}.${ext} ${w}w`).join(", ");

export function Vpercito({
  size,
  alt = "",
  float = false,
  halo = true,
  eager = false,
  sizes,
  className,
}: {
  size: number;
  /** `sizes` del srcset; por defecto, `${size}px`. */
  sizes?: string;
  /** Vacío si el titular ya dice todo (decorativo). */
  alt?: string;
  float?: boolean;
  /** Halo sky detrás: obligatorio sobre fondo oscuro, el cuerpo es negro. */
  halo?: boolean;
  eager?: boolean;
  className?: string;
}) {
  const sz = sizes ?? `${size}px`;
  return (
    <div
      className={cn("relative isolate mx-auto w-(--vp-w) max-w-full", className)}
      style={{ "--vp-w": `${size}px` } as React.CSSProperties}
    >
      {halo ? (
        <div aria-hidden className="vpercito-halo absolute -inset-[18%] -z-10" />
      ) : null}
      <div className={float ? "vpercito-float" : undefined}>
        <picture>
          <source type="image/avif" srcSet={srcset("avif")} sizes={sz} />
          <source type="image/webp" srcSet={srcset("webp")} sizes={sz} />
          <img
            src="/images/vpercito/vpercito-480.webp"
            alt={alt}
            width={size}
            height={Math.round(size * RATIO)}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            className="block h-auto w-full select-none"
          />
        </picture>
      </div>
      <div
        aria-hidden
        className="vpercito-shadow mx-auto -mt-[3%] h-[6%] w-[62%] -z-10"
      />
    </div>
  );
}
