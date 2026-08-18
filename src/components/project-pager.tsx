import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
    </nav>
  );
}
