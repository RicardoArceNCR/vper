"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import SectionHeader from "@/components/section-header";

const services = [
  {
    id: 1,
    title: "CREATIVIDAD",
    desc: "Ideas y conceptos que hacen que una marca sea imposible de ignorar.",
    icon: "/images/service-creatividad.png",
    iconBg: "var(--color-main-200)",
  },
  {
    id: 2,
    title: "BRANDING",
    desc: "Identidad visual, sistemas y piezas que hacen reconocible a la marca en cada punto de contacto.",
    icon: "/images/service-branding.png",
    iconBg: "var(--color-info-300)",
  },
  {
    id: 3,
    title: "DIGITAL",
    desc: "Presencia digital, performance y contenido pensado para convertir, no solo para verse bien.",
    icon: "/images/service-digital.png",
    iconBg: "var(--color-leaf-200)",
  },
  {
    id: 4,
    title: "PLANEACIÓN ESTRATÉGICA",
    desc: "La ruta antes de la ejecución: research, objetivos y el plan que sostiene toda la campaña.",
    icon: "/images/service-planeacion.png",
    iconBg: "var(--color-leaf-200)",
  },
  {
    id: 5,
    title: "AUDIOVISUAL",
    desc: "Producción de video y fotografía que le da cara y voz a cada historia de marca.",
    icon: "/images/service-audiovisual.png",
    iconBg: "var(--color-main-200)",
  },
  {
    id: 6,
    title: "ATL & BTL",
    desc: "Estrategias ATL y BTL que conectan tu marca con la audiencia correcta, en el canal correcto.",
    icon: "/images/service-atl.png",
    iconBg: "var(--color-info-300)",
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="py-24 md:py-32 bg-background border-b border-border">
      <div className="wrap max-w-[1217px] mx-auto">
        <div className="mb-16 md:mb-20">
          <SectionHeader
            eyebrow="SERVICIOS"
            title={
              <>
                <span className="block">ESTRATEGIA.</span>
                <span className="mt-[0.2em] block">DISEÑO. IMPACTO.</span>
              </>
            }
            titleClassName="leading-[1.2]"
            align="center"
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {services.map((service) => (
            <motion.article
              variants={fadeInUp}
              key={service.id}
              className="group flex min-w-0 flex-col rounded-3xl bg-card p-6 md:p-8 border border-transparent hover:border-white/25 transition-colors duration-500"
            >
              <div className="flex min-w-0 items-center gap-4 mb-5">
                <div
                  className="size-12 md:size-14 shrink-0 rounded-xl flex items-center justify-center p-2.5"
                  style={{ backgroundColor: service.iconBg }}
                >
                  <img
                    src={service.icon}
                    alt=""
                    className="size-full object-contain"
                  />
                </div>
                <div className="@container min-w-0 flex-1">
                  <h3 className="font-display font-black tracking-tight text-foreground max-w-full [font-size:min(0.875rem,calc(100cqi/16))] leading-none">
                    {service.title}
                  </h3>
                </div>
              </div>
              <p className="text-body-md text-foreground/80 leading-relaxed">
                {service.desc}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
