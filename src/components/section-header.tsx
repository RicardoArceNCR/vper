"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 min-w-0"
    >
      {/* min-w-0: el flex item no puede ser más ancho que su columna.
          Sin esto min-width:auto = el ancho de SELECCIONADOS. y la fila
          se sale del viewport; el overflow-hidden del carrusel recorta
          el párrafo de la derecha. @container: el display-title lee cqi. */}
      <div className="@container min-w-0 lg:flex-1">
        <span className="text-xs font-bold tracking-[0.3em] text-primary mb-4 block">{eyebrow}</span>
        <h2 className="font-display display-title font-black tracking-tight max-w-full">{title}</h2>
      </div>
      <p className="text-sm md:text-base text-muted-foreground font-medium min-w-0 lg:basis-1/3 lg:shrink-0 lg:mt-8">
        {description}
      </p>
    </motion.div>
  );
}
