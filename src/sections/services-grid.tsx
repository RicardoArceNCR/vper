"use client";

import { ArrowRight, Megaphone, Sparkles, Globe, Target, Clapperboard, PartyPopper } from "lucide-react";
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
    desc: "Estrategias above y below the line que conectan tu marca con la audiencia correcta, en el canal correcto.",
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
            title="STRATEGY. DESIGN. IMPACT."
            description="Campaigns, content and experiences that convert. Ofrecemos soluciones creativas integrales para potenciar tu marca."
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              variants={fadeInUp}
              key={service.id}
              className="group p-8 bg-[var(--surface-accent-bg)] border border-[var(--border-strong)] hover:border-primary/20 transition-all duration-500 flex flex-col justify-between min-h-[300px] hover:shadow-[0_10px_30px_color-mix(in_srgb,var(--brand-main)_5%,transparent)]"
            >
              <div>
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-8 border border-[var(--border-strong)] group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-500">
                  <service.icon
                    size={26}
                    style={{ color: service.color }}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-bold tracking-wider mb-4 text-[var(--surface-accent-text)] group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-[var(--surface-accent-text)] leading-relaxed font-medium">
                  {service.desc}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--surface-accent-text)] group-hover:text-primary transition-colors">
                <span>LEARN MORE</span>
                <ArrowRight size={14} className="transform translate-x-0 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
