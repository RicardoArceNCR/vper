"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import SectionHeader from "@/components/section-header";

const processSteps = [
  {
    id: 1,
    title: "PREGUNTAR",
    desc: "Todo empieza con preguntas. Algunas cómodas, otras bastante menos. Entendemos la marca, el mercado y las personas hasta encontrar el reto que realmente vale resolver.",
    icon: "/images/process-investigacion.webp",
  },
  {
    id: 2,
    title: "PENSAR",
    desc: "Juntamos datos, experiencia e intuición hasta encontrar una dirección clara. Porque una gran idea también necesita saber hacia dónde va.",
    icon: "/images/process-estrategia.webp",
  },
  {
    id: 3,
    title: "CREAR",
    desc: "Acá la estrategia deja de ser una presentación. La convertimos en una idea con voz, forma y suficiente personalidad para salir al mundo.",
    icon: "/images/process-diseno.webp",
  },
  {
    id: 4,
    title: "HACER",
    desc: "Una gran idea merece una gran ejecución. La producimos, adaptamos y llevamos a cada lugar donde tenga algo importante que hacer.",
    icon: "/images/process-desarrollo.webp",
  },
  {
    id: 5,
    title: "APRENDER",
    desc: "Publicamos, medimos, escuchamos y aprendemos. Cada proyecto nos deja algo que hace que la próxima idea empiece un poco más adelante.",
    icon: "/images/process-entrega.webp",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 md:py-32 bg-background border-b border-border">
      <div className="wrap">
        <div className="mb-20">
          <SectionHeader
            eyebrow="METODOLOGÍA"
            title="LA MAGIA TIENE MÉTODO."
            description="Y si no, preguntale a Houdini."
            titleClassName="text-primary"
          />
          <p className="text-sm md:text-base text-muted-foreground font-medium mt-10 md:mt-12 max-w-3xl">
            Detrás de cada idea que parece simple hay preguntas, estrategia, criterio,
            ejecución y unas cuantas vueltas más. Así convertimos un reto en algo que valga
            la pena crear.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8"
        >
          {processSteps.map((step, index) => (
            <motion.div
              variants={fadeInUp}
              key={step.id}
              className="relative group flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-0 min-w-0"
            >
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-[65%] w-full h-[1px] bg-border z-0 group-hover:bg-primary/20 transition-colors duration-500" />
              )}

              <div className="relative z-10 size-28 md:size-36 lg:size-48 shrink-0 rounded-full overflow-hidden border border-border bg-black md:mb-8 group-hover:border-primary group-hover:shadow-[0_0_40px_color-mix(in_srgb,var(--brand-main)_25%,transparent)] transition-all duration-500">
                <img
                  src={step.icon}
                  alt=""
                  className="size-full object-contain scale-100 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="relative z-10 min-w-0 flex-1 md:flex-none md:flex md:flex-col md:items-center">
                <span className="text-sm md:text-base font-bold text-primary tracking-widest mb-1 md:mb-3 block">
                  0{step.id}
                </span>
                <h3 className="text-base md:text-lg font-bold tracking-wider text-foreground mb-1 md:mb-3 uppercase group-hover:text-primary transition-colors break-words">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
