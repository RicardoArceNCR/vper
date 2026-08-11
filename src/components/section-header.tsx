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
      className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10"
    >
      <div className="md:basis-1/3 md:shrink-0">
        <span className="text-xs font-bold tracking-[0.3em] text-primary mb-4 block">{eyebrow}</span>
        <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight">{title}</h2>
      </div>
      <p className="text-sm md:text-base text-muted-foreground font-medium md:basis-1/3 md:shrink-0 md:mt-8">
        {description}
      </p>
    </motion.div>
  );
}
