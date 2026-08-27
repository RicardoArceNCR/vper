import Link from "next/link";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import type { WorkItem } from "@/lib/work-items";

export default function ProjectPager({
  prev,
  next,
}: {
  prev: WorkItem;
  next: WorkItem;
}) {
  return (
    <nav
      aria-label="Proyectos"
      className="wrap mt-16 md:mt-24 pt-8 md:pt-10 border-t border-border grid grid-cols-2 gap-6 min-w-0"
    >
      <Link
        href={`/work/${prev.slug}`}
        className="group min-w-0 flex flex-col items-start gap-2"
      >
        <span className="flex items-center gap-2 text-overline-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
          <ArrowLeft size={14} />
          ANTERIOR
        </span>
        <span className="font-sans text-h5 font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors break-words">
          {prev.title}
        </span>
      </Link>
      <Link
        href={`/work/${next.slug}`}
        className="group min-w-0 flex flex-col items-end gap-2 text-right"
      >
        <span className="flex items-center gap-2 text-overline-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
          SIGUIENTE
          <ArrowRight size={14} />
        </span>
        <span className="font-sans text-h5 font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors break-words">
          {next.title}
        </span>
      </Link>

      {/* Tercera salida, al pie: anterior y siguiente asumen que querés
          seguir recorriendo de a uno. Si llegaste hasta acá y no era eso,
          el archivo completo es la respuesta. col-span-2 para que quede
          centrado bajo las dos columnas en cualquier ancho. */}
      <Link
        href="/work"
        className="group col-span-2 mt-4 flex items-center justify-center gap-2 border-t border-border pt-8 text-overline-sm font-bold text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring-color)] focus-visible:rounded-sm"
      >
        <LayoutGrid size={14} />
        VER TODOS LOS PROYECTOS
      </Link>
    </nav>
  );
}
