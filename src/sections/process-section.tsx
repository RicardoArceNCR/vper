"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import SectionHeader from "@/components/section-header";

const processSteps = [
  {
    id: 1,
    title: "INVESTIGACIÓN",
    desc: "Analizamos tu mercado, audiencia y competencia para trazar la ruta.",
    icon: "/images/icon-2.svg",
  },
  {
    id: 2,
    title: "ESTRATEGIA",
    desc: "Definimos el plan de acción táctico y los objetivos clave.",
    icon: "/images/icon-4.svg",
  },
  {
    id: 3,
    title: "DISEÑO",
    desc: "Damos vida visual a la estrategia con conceptos innovadores.",
    icon: "/images/icon-5.svg",
  },
  {
    id: 4,
    title: "DESARROLLO",
    desc: "Implementamos las soluciones con la tecnología más avanzada.",
    icon: "/images/icon-1.svg",
  },
  {
    id: 5,
    title: "ENTREGA",
    desc: "Lanzamos el proyecto y medimos su impacto continuo.",
    icon: "/images/icon-3.svg",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 md:py-32 bg-background border-b border-border">
      <div className="wrap">
        <div className="mb-20">
          <SectionHeader
            eyebrow="METODOLOGÍA"
            title="NUESTRO PROCESO."
            description="Campañas, contenido y experiencias que convierten. Cómo trabajamos para garantizar el éxito de tu proyecto."
          />
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

              <div className="relative z-10 size-28 md:size-36 lg:size-48 shrink-0 rounded-full bg-muted border border-border flex items-center justify-center p-3 md:p-4 lg:p-5 md:mb-8 group-hover:border-primary/30 group-hover:shadow-[0_0_40px_color-mix(in_srgb,var(--brand-main)_25%,transparent)] transition-all duration-500">
                <span
                  aria-hidden
                  className="block h-[82%] w-[82%] bg-foreground group-hover:bg-primary transition-all duration-500 group-hover:scale-105"
                  style={{
                    maskImage: `url(${step.icon})`,
                    WebkitMaskImage: `url(${step.icon})`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                  }}
                />
              </div>

              <div className="relative z-10 min-w-0 flex-1 md:flex-none md:flex md:flex-col md:items-center">
                <span className="text-xs font-bold text-primary tracking-widest mb-1 md:mb-3 block">
                  0{step.id}
                </span>
                <h3 className="text-sm font-bold tracking-widest text-foreground mb-1 md:mb-3 uppercase group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium md:max-w-[200px]">
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
