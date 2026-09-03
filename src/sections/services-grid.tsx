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
    <section
      id="services"
      className="py-24 md:py-32 bg-background bg-brand-texture border-b border-border"
    >
      <div className="wrap max-w-[1217px] mx-auto">
        <div className="mb-16 md:mb-20">
          <SectionHeader
            eyebrow="SERVICIOS"
            title="Una buena idea necesita más que una chispa."
            description="Estrategia para guiarla, creatividad para darle forma, digital y medios para moverla, y producción para hacerla realidad."
            titleClassName="uppercase"
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
              className="hover-brand-ring hover-brand-ring-rest group h-full min-w-0 rounded-[var(--card-radius)] shadow-[var(--card-shadow)] transition-shadow duration-500 hover:shadow-[0_0_40px_color-mix(in_srgb,var(--brand-main)_22%,transparent)]"
            >
              <div className="flex flex-col bg-[var(--card-bg)] p-6 md:p-8 transition-colors duration-500 group-hover:bg-[var(--card-bg-hover)]">
                <div className="flex min-w-0 items-center gap-4 mb-5">
                  <div
                    className="size-12 md:size-14 shrink-0 rounded-xl flex items-center justify-center p-2.5"
                    style={{ backgroundColor: service.iconBg }}
                  >
                    <img
                      src={service.icon}
                      alt=""
                      width={80}
                      height={80}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-contain"
                    />
                  </div>
                  <div className="@container min-w-0 flex-1">
                    <h3 className="font-display font-black uppercase tracking-tight text-foreground max-w-full [font-size:min(1rem,calc(100cqi/14))] leading-[1.1] transition-colors duration-500 group-hover:text-primary">
                      {service.name}
                    </h3>
                  </div>
                </div>
                <p className="text-body-md text-foreground/90 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
