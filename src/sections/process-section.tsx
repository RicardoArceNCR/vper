"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import SectionHeader from "@/components/section-header";

const IMAGES = {
  proc1: "/images/bd37aae033ded0a3b41c58503bb285e902309d1a.webp",
  proc2: "/images/b8e5aa2cb8161a86beb964887f7eb868f1d146d4.webp",
  proc3: "/images/adc9ad8b7b6c369aad2235798753d32219fc2b03.webp",
  proc4: "/images/c2340cc4f028e5db1828d110a96850a40aa470c9.webp",
};

const processSteps = [
  { id: 1, title: "INVESTIGACIÓN", desc: "Analizamos tu mercado, audiencia y competencia para trazar la ruta.", icon: IMAGES.proc1 },
  { id: 2, title: "ESTRATEGIA", desc: "Definimos el plan de acción táctico y los objetivos clave.", icon: IMAGES.proc2 },
  { id: 3, title: "DISEÑO", desc: "Damos vida visual a la estrategia con conceptos innovadores.", icon: IMAGES.proc3 },
  { id: 4, title: "DESARROLLO", desc: "Implementamos las soluciones con la tecnología más avanzada.", icon: IMAGES.proc4 },
  // TODO: falta icono propio para "ENTREGA" — hoy reutiliza IMAGES.proc2 (mismo que "ESTRATEGIA")
  { id: 5, title: "ENTREGA", desc: "Lanzamos el proyecto y medimos su impacto continuo.", icon: IMAGES.proc2 },
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
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8"
        >
          {processSteps.map((step, index) => (
            <motion.div
              variants={fadeInUp}
              key={step.id}
              className="relative group flex flex-col items-center text-center"
            >
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-22 left-[65%] w-full h-[1px] bg-border z-0 group-hover:bg-primary/20 transition-colors duration-500" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-muted border border-border flex items-center justify-center mb-8 overflow-hidden group-hover:border-primary/30 group-hover:shadow-[0_0_40px_color-mix(in_srgb,var(--brand-main)_25%,transparent)] transition-all duration-500">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  />
                </div>

                <span className="text-xs font-bold text-primary tracking-widest mb-3">0{step.id}</span>
                <h3 className="text-sm font-bold tracking-widest text-foreground mb-3 uppercase group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] font-medium">
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
