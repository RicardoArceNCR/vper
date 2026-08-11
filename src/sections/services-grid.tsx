"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import SectionHeader from "@/components/section-header";

const IMAGES = {
  srv1: "/images/1031bf7c59810c75b1e729e6881a5931e8d03819.webp",
  srv2: "/images/36bc2da07d386d06bb24293e2aac95fd81bdb5dc.webp",
  srv3: "/images/645801bdbd0b05382051f8fac1b00ac24d6c1340.webp",
  srv4: "/images/82bbaf1eb527f137627b5fd0b0f70dda88cacec0.webp",
  srv5: "/images/9353bfe8e9365a790af56f3356bd07903b8f2724.webp",
  srv6: "/images/a338897be47fb06799af096e1a29aeb038648149.webp",
};

const services = [
  { id: 1, title: "BRAND STRATEGY", desc: "Definimos bases sólidas que impulsan el crecimiento y la diferenciación.", icon: IMAGES.srv1 },
  { id: 2, title: "BRANDING & IDENTITY", desc: "Creamos identidades de marca coherentes que conectan emocionalmente.", icon: IMAGES.srv2 },
  { id: 3, title: "UX/UI DESIGN", desc: "Diseñamos experiencias digitales intuitivas centradas en el usuario.", icon: IMAGES.srv3 },
  { id: 4, title: "WEB DEVELOPMENT", desc: "Construimos sitios web de alto rendimiento, rápidos y escalables.", icon: IMAGES.srv4 },
  { id: 5, title: "DIGITAL MARKETING", desc: "Ejecutamos campañas orientadas a resultados que maximizan el retorno.", icon: IMAGES.srv5 },
  { id: 6, title: "CONTENT CREATION", desc: "Producimos contenido visual de alta calidad que cuenta historias únicas.", icon: IMAGES.srv6 },
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
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-8 border border-[var(--border-strong)] group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-500 overflow-hidden">
                  <img src={service.icon} alt={service.title} className="w-8 h-8 object-contain filter invert group-hover:scale-110 transition-transform duration-300" />
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
