"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export default function AboutUs() {
  return (
    <section id="aboutus" className="py-24 md:py-32 bg-muted border-b border-border">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="wrap text-center max-w-2xl mx-auto"
      >
        <span className="text-xs font-bold tracking-[0.3em] text-primary mb-4 block">
          NOSOTROS
        </span>
        <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight mb-6">
          SOBRE NOSOTROS.
        </h2>
        <p className="text-sm md:text-base text-muted-foreground font-medium">
          Estamos preparando esta sección. Muy pronto vas a poder conocer al equipo detrás de VPER
          Media — historia, valores y el proceso que nos define.
        </p>
      </motion.div>
    </section>
  );
}
