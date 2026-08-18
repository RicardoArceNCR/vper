"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@ui/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "start" | "center";
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className={cn(
        "flex min-w-0",
        centered
          ? "flex-col items-center text-center"
          : "flex-col lg:flex-row lg:items-center gap-6 lg:gap-10",
      )}
    >
      {/* min-w-0: el flex item no puede ser más ancho que su columna.
          Sin esto min-width:auto = el ancho de SELECCIONADOS. y la fila
          se sale del viewport; el overflow-hidden del carrusel recorta
          el párrafo de la derecha. @container: el display-title lee cqi.
          w-full: con items-center el item se encogería al texto y cqi
          se persigue con el contenido. */}
      <div className="@container min-w-0 w-full lg:flex-1">
        <span className="text-xs font-bold tracking-[0.3em] text-primary mb-4 block">
          {eyebrow}
        </span>
        <h2 className="font-display display-title font-black tracking-tight max-w-full">
          {title}
        </h2>
      </div>
      {description ? (
        <p
          className={cn(
            "text-sm md:text-base text-muted-foreground font-medium min-w-0",
            !centered && "lg:basis-1/3 lg:shrink-0 lg:mt-8",
          )}
        >
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
