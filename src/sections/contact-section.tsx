"use client";

import { Button } from "@ui/components/button";
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import SectionHeader from "@/components/section-header";

const CONTACT_ITEMS = [
  { icon: Mail, label: "CORREO", val: "info@vpermedia.com", href: "mailto:info@vpermedia.com" },
  { icon: Phone, label: "TELÉFONO", val: "+505 7782-4749", href: "tel:+50577824749" },
  { icon: MapPin, label: "UBICACIÓN", val: "Managua, Nicaragua" },
] as const;

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
      className="py-24 md:py-32 bg-muted bg-[url('/images/bg-vper-pattern.webp')] bg-fixed bg-cover bg-center"
    >
      <div className="wrap min-w-0">
        <div className="mb-12 md:mb-16">
          <SectionHeader
            align="center"
            eyebrow="HABLEMOS"
            title="¿QUÉ CREAMOS AHORA?"
            description="Si tenés un proyecto, una marca o apenas una idea dando vueltas, contanos. Las cosas grandes suelen empezar con una conversación."
          />
        </div>

        {/* El relative vive en el ancho del form (max-w-xl, centrado). El
            stack se cuelga con left-full — no es una grilla de 2 columnas,
            así el card no se corre. xl (1280): hay ~350px por lado y el
            stack cabe. En lg (1024) solo quedan ~192px; absolute recortaría
            correo/teléfono, así que ahí el stack sigue en flujo debajo. */}
        <div className="relative mx-auto w-full min-w-0 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="bg-card border border-border p-6 md:p-8 rounded-[var(--button-radius)]"
          >
            {/* Igual que en vper-media-repo: submit de mentira (alert), no hay
                integración real de envío todavía — puerto fiel del demo. */}
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                alert("¡Formulario enviado! Nos contactaremos pronto.");
              }}
            >
              <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex min-w-0 flex-col gap-2">
                  <label htmlFor="contact-nombre" className="text-[10px] font-bold tracking-widest text-input-label">
                    NOMBRE
                  </label>
                  <input
                    id="contact-nombre"
                    type="text"
                    name="nombre"
                    placeholder="Tu nombre"
                    required
                    className="h-12 w-full min-w-0 bg-background border border-input px-4 text-xs font-medium focus:border-primary focus:outline-none transition-colors rounded-[var(--button-radius)]"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <label htmlFor="contact-apellido" className="text-[10px] font-bold tracking-widest text-input-label">
                    APELLIDO
                  </label>
                  <input
                    id="contact-apellido"
                    type="text"
                    name="apellido"
                    placeholder="Tu apellido"
                    required
                    className="h-12 w-full min-w-0 bg-background border border-input px-4 text-xs font-medium focus:border-primary focus:outline-none transition-colors rounded-[var(--button-radius)]"
                  />
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label htmlFor="contact-correo" className="text-[10px] font-bold tracking-widest text-input-label">
                  CORREO
                </label>
                <input
                  id="contact-correo"
                  type="email"
                  name="correo"
                  placeholder="tu@email.com"
                  required
                  className="h-12 w-full min-w-0 bg-background border border-input px-4 text-xs font-medium focus:border-primary focus:outline-none transition-colors rounded-[var(--button-radius)]"
                />
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label htmlFor="contact-mensaje" className="text-[10px] font-bold tracking-widest text-input-label">
                  MENSAJE
                </label>
                <textarea
                  id="contact-mensaje"
                  name="mensaje"
                  rows={4}
                  placeholder="Cuéntanos sobre tu proyecto..."
                  required
                  className="w-full min-w-0 bg-background border border-input p-4 text-xs font-medium focus:border-primary focus:outline-none transition-colors resize-none rounded-[var(--button-radius)]"
                />
              </div>

              <Button
                type="submit"
                className="h-12 w-full transition-all duration-300 hover:translate-y-[-2px] shadow-[0_4px_20px_color-mix(in_srgb,var(--brand-main)_20%,transparent)] hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--brand-main)_40%,transparent)]"
              >
                EMPECEMOS
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto mt-10 flex w-fit min-w-0 flex-col gap-8 xl:absolute xl:left-full xl:top-1/2 xl:mx-0 xl:mt-0 xl:-translate-y-1/2 xl:pl-10"
          >
            {CONTACT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex min-w-0 items-center gap-4 group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/5">
                    <Icon size={18} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold tracking-widest text-muted-foreground">
                      {item.label}
                    </span>
                    {"href" in item ? (
                      <a href={item.href} className="break-words text-sm font-bold hover:text-primary transition-colors">
                        {item.val}
                      </a>
                    ) : (
                      <span className="break-words text-sm font-bold">{item.val}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
