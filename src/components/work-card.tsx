import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@ui/lib/utils";
import type { WorkItem } from "@/lib/work-items";

// Extraído de WorkGallery (2026-08-26), cuando el índice /work necesitó
// la misma card a otro tamaño. Es la misma pieza con dos vestidos, no
// dos componentes parecidos que se van a desincronizar en tres meses:
//
//   featured → la vitrina sticky de la home. Ancho fijo en vw porque
//              vive dentro de un track horizontal que se mide a sí mismo
//              (ver el useLayoutEffect de WorkGallery: si la card fuera
//              fluida, el scrollWidth cambiaría con el runway y la
//              medición se perseguiría a sí misma).
//   index    → el grid del archivo. Ancho 100%: acá manda la columna del
//              grid, no la card.
//
// Lo que NO cambia entre variantes: el recorte 16/10, el zoom al hover,
// el badge de flecha y la jerarquía subtítulo → título. Que el archivo
// se sienta el mismo sitio que la home es justamente el punto.
//
// Sin `sector` en la card a propósito: `subtitle` ya dice lo mismo en
// prosa ("Cocina cantonesa", "Bienes raíces"). `sector` existe como
// vocabulario cerrado para el filtro futuro, no para repetir en pantalla
// lo que la línea de arriba ya dice.

type WorkCardVariant = "featured" | "index";

export default function WorkCard({
  item,
  variant = "featured",
  priority = false,
}: {
  item: WorkItem;
  variant?: WorkCardVariant;
  /** Las primeras cards del viewport no deberían entrar por lazy. */
  priority?: boolean;
}) {
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/work/${item.slug}`}
      className={cn(
        "group relative bg-card border border-border overflow-hidden rounded-[var(--card-radius)] transition-all duration-500 hover:border-foreground/15",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring-color)]",
        isFeatured
          ? "shrink-0 w-[78vw] sm:w-[52vw] lg:w-[clamp(360px,42vw,620px)]"
          : "w-full",
      )}
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted relative">
        <img
          src={item.hero.src}
          alt={item.title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center border border-border opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
          <ArrowUpRight size={18} className="text-foreground" />
        </div>
      </div>
      <div className={cn("relative z-20", isFeatured ? "p-5" : "p-4 md:p-5")}>
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-eyebrow)] mb-2 block uppercase">
          {item.subtitle}
        </span>
        <h3
          className={cn(
            "font-display font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors",
            isFeatured ? "text-lg" : "text-base md:text-lg",
          )}
        >
          {item.title}
        </h3>
      </div>
    </Link>
  );
}
