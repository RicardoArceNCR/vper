"use client";

import { Button } from "@ui/components/button";
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export default function ContactSection() {
  return (
    // Mismo fondo fijo que las páginas de proyecto (2026-08-12, pedido
    // explícito): bg-muted de base + bg-image encima — son propiedades CSS
    // distintas (background-color vs -image), no colisionan. bg-fixed la
    // deja pegada al viewport mientras el contenido scrollea encima. El
    // asset ya es casi negro sobre negro, no compite con el texto — no
    // hace falta bajarle opacity aparte (ver /work/[slug]/page.tsx, mismo
    // criterio).
    <section
      id="contact"
      className="py-24 md:py-32 bg-muted bg-[url('/images/bg-vper-pattern.webp')] bg-fixed bg-cover bg-center border-b border-border"
    >
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="@container min-w-0"
          >
            <span className="text-xs font-bold tracking-[0.3em] text-primary mb-4 block">HABLEMOS</span>
            <h2 className="font-display display-title font-black tracking-tight mb-6">CONTÁCTANOS.</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium mb-12 max-w-md">
              ¿Tienes un proyecto en mente o quieres potenciar tu marca? Completa el formulario y nos pondremos en contacto contigo lo antes posible.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { icon: <Mail size={18} />, label: "CORREO", val: "info@vpermedia.com", href: "mailto:info@vpermedia.com" },
                { icon: <Phone size={18} />, label: "TELÉFONO", val: "+505 7782-4749", href: "tel:+50577824749" },
                { icon: <MapPin size={18} />, label: "UBICACIÓN", val: "Managua, Nicaragua" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-card border border-border flex items-center justify-center rounded-lg text-primary group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground block tracking-widest">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-bold hover:text-primary transition-colors">{item.val}</a>
                    ) : (
                      <span className="text-sm font-bold">{item.val}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="bg-card border border-border relative p-4 md:p-6"
          >
            {/* Igual que en vper-media-repo: submit de mentira (alert), no hay
                integración real de envío todavía — puerto fiel del demo. */}
            <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); alert("¡Formulario enviado! Nos contactaremos pronto."); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-widest text-input-label">NOMBRE</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    required
                    className="h-12 bg-background border border-input px-4 text-xs font-medium focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-widest text-input-label">APELLIDO</label>
                  <input
                    type="text"
                    placeholder="Tu apellido"
                    required
                    className="h-12 bg-background border border-input px-4 text-xs font-medium focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-input-label">CORREO</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  required
                  className="h-12 bg-background border border-input px-4 text-xs font-medium focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-input-label">MENSAJE</label>
                <textarea
                  rows={4}
                  placeholder="Cuéntanos sobre tu proyecto..."
                  required
                  className="bg-background border border-input p-4 text-xs font-medium focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                className="h-12 transition-all duration-300 hover:translate-y-[-2px] shadow-[0_4px_20px_color-mix(in_srgb,var(--brand-main)_20%,transparent)] hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--brand-main)_40%,transparent)]"
              >
                ENVIAR
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
