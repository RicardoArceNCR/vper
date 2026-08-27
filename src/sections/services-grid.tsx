"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import SectionHeader from "@/components/section-header";
import { SERVICES } from "@/lib/services";

// Los seis servicios ya no viven acá: se movieron a lib/services.ts
// porque work-items.ts necesita el MISMO vocabulario para tipar las
// categorías de cada proyecto. Sacar o renombrar uno ahora rompe el
// build donde haya un proyecto tagueado con él, en vez de dejar el sitio
// mostrando una categoría que ya no es un servicio.
//
// Los nombres se guardan capitalizados ("Planeación Estratégica") y esta
// grilla los sube con `uppercase` en CSS: mismos glifos, mismo ancho
// medido, ningún cambio visual — y la pill del proyecto puede mostrar el
// mismo dato sin una segunda cadena que mantener.

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
          {SERVICES.map((service) => (
            <motion.article
              variants={fadeInUp}
              key={service.name}
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
                  <h3 className="font-display font-black uppercase tracking-tight text-foreground max-w-full [font-size:min(0.875rem,calc(100cqi/16))] leading-none">
                    {service.name}
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
