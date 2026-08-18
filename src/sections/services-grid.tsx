"use client";

import { Megaphone, Sparkles, Globe, Target, Clapperboard, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import SectionHeader from "@/components/section-header";

// Reemplaza 2026-08-12 las 6 categorías inventadas del demo original
// (Brand Strategy / Branding & Identity / UX-UI / Web Dev / Digital
// Marketing / Content Creation) por los 6 servicios reales de VPER, tal
// cual el orden y las categorías del deck de marca que pasó el cliente
// ("NUESTROS SERVICIOS": ATL & BTL → Creatividad → Digital → Planeación
// Estratégica → Audiovisual → Eventos). El deck solo trae los 6 nombres,
// sin copy de apoyo — las descripciones de una línea son redacción propia
// para esta sesión, a revisar/reemplazar por el copy real del cliente
// antes de producción (mismo criterio de "señalar la deuda" que el resto
// del contenido de relleno de esta sesión).
//
// Los íconos pasaron de imágenes rasterizadas con filter:invert (colores
// random sin relación con la marca — problema real, señalado antes en
// esta sesión) a lucide-react, coherente con el resto del sitio (Header,
// Footer, ContactSection, ProjectHero ya usan lucide). El color de cada
// ícono retoma la paleta alternada azul/ámbar/rojo/verde que ya traía el
// deck del cliente para estas 6 categorías — no un capricho nuevo, es la
// referencia que se pasó.
const services = [
  {
    id: 1,
    title: "ATL & BTL",
    desc: "Estrategias ATL y BTL que conectan tu marca con la audiencia correcta, en el canal correcto.",
    icon: Megaphone,
    color: "var(--brand-sky)",
  },
  {
    id: 2,
    title: "CREATIVIDAD",
    desc: "Ideas y conceptos que hacen que una marca sea imposible de ignorar.",
    icon: Sparkles,
    color: "var(--brand-main)",
  },
  {
    id: 3,
    title: "DIGITAL",
    desc: "Presencia digital, performance y contenido pensado para convertir, no solo para verse bien.",
    icon: Globe,
    color: "var(--feedback-error-icon)",
  },
  {
    id: 4,
    title: "PLANEACIÓN ESTRATÉGICA",
    desc: "La ruta antes de la ejecución: research, objetivos y el plan que sostiene toda la campaña.",
    icon: Target,
    color: "var(--brand-leaf)",
  },
  {
    id: 5,
    title: "AUDIOVISUAL",
    desc: "Producción de video y fotografía que le da cara y voz a cada historia de marca.",
    icon: Clapperboard,
    color: "var(--brand-sky)",
  },
  {
    id: 6,
    title: "EVENTOS",
    desc: "Experiencias en vivo, activaciones y presencia física que la audiencia recuerda.",
    icon: PartyPopper,
    color: "var(--brand-main)",
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="py-24 md:py-32 bg-muted border-b border-border">
      <div className="wrap">
        <div className="mb-20">
          <SectionHeader
            eyebrow="SERVICIOS"
            title="ESTRATEGIA. DISEÑO. IMPACTO."
            align="center"
          />
        </div>

        {/* max-w-4xl local, no .wrap: sin VER MÁS la fila es ícono + un
            título + una línea de copy, y a 1400px el hairline se va al
            borde del viewport con un hueco muerto a la derecha. 896px
            deja leer PLANEACIÓN ESTRATÉGICA y corta el copy a ~70ch. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="min-w-0 max-w-4xl mx-auto border border-[var(--border-strong)]"
        >
          {services.map((service) => (
            <motion.article
              variants={fadeInUp}
              key={service.id}
              className="group flex min-w-0 items-start gap-5 md:gap-8 p-6 md:p-8 bg-[var(--surface-accent-bg)] border-b border-[var(--border-strong)] last:border-b-0 hover:bg-primary/[0.03] transition-colors duration-500"
            >
              <div className="size-14 md:size-16 shrink-0 rounded-2xl flex items-center justify-center border border-[var(--border-strong)] group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-500">
                <service.icon
                  size={26}
                  style={{ color: service.color }}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="@container min-w-0 flex-1">
                <h3 className="font-display display-title-sm font-black tracking-tight min-w-0 mb-3 text-[var(--surface-accent-text)] group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-body-sm text-[var(--surface-accent-text)]">
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
