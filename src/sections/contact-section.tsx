"use client";

import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import SectionHeader from "@/components/section-header";

const fieldLabel =
  "text-overline-sm font-bold text-[var(--input-label)]";

const textareaClass =
  "w-full min-w-0 resize-none rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-bg)] px-[var(--input-padding-x)] py-[var(--input-padding-y)] text-body-sm text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] transition-colors hover:border-[var(--input-border-hover)] focus-visible:border-[var(--input-border-focus)] focus-visible:bg-[var(--input-bg-focus)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)]";

const CONTACT_ITEMS = [
  { icon: Mail, label: "CORREO", val: "info@vpermedia.com", href: "mailto:info@vpermedia.com" },
  { icon: Phone, label: "TELÉFONO", val: "+505 7782-4749", href: "tel:+50577824749" },
  { icon: MapPin, label: "UBICACIÓN", val: "Managua, Nicaragua" },
] as const;

type ContactItemData = (typeof CONTACT_ITEMS)[number];

function ContactItem({ item }: { item: ContactItemData }) {
  const Icon = item.icon;
  return (
    <div className="group flex min-w-0 items-center gap-4">
      {/* Escenario `dark` local: en light (desktop al lado del form) el
          icono no queda en caja blanca. Bajo xl el padre ya es `dark`. */}
      <div className="dark flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-card text-primary transition-colors duration-300 group-hover:border-primary/20 group-hover:bg-primary/5">
        <Icon size={22} aria-hidden />
      </div>
      <div className="min-w-0">
        <span className="mb-1 block text-overline-sm font-bold text-muted-foreground">
          {item.label}
        </span>
        {"href" in item ? (
          <a
            href={item.href}
            className="break-words text-body-sm font-bold transition-colors hover:text-primary"
          >
            {item.val}
          </a>
        ) : (
          <span className="break-words text-body-sm font-bold">{item.val}</span>
        )}
      </div>
    </div>
  );
}

export default function ContactSection() {
  return (
    // Mismo fondo fijo que servicios y las fichas de proyecto: color de
    // página + textura. El webp solo pinta en oscuro; en claro queda
    // bg-background (blanco), sin invert ni un gris distinto.
    <section
      id="contact"
      className="py-24 md:py-32 bg-background bg-brand-texture"
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
          {/* Escenario oscuro: `dark` local pinta con la rampa de
              brand.css. El degradé BTL se queda en el título. En modo
              oscuro de página es no-op — mismos tokens. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="dark [color-scheme:dark] rounded-[var(--card-radius)] border border-border bg-card p-[var(--card-padding)] text-foreground md:p-8"
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
                  <label htmlFor="contact-nombre" className={fieldLabel}>
                    NOMBRE
                  </label>
                  <Input
                    id="contact-nombre"
                    type="text"
                    name="nombre"
                    placeholder="Tu nombre"
                    required
                    className="w-full min-w-0"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <label htmlFor="contact-apellido" className={fieldLabel}>
                    APELLIDO
                  </label>
                  <Input
                    id="contact-apellido"
                    type="text"
                    name="apellido"
                    placeholder="Tu apellido"
                    required
                    className="w-full min-w-0"
                  />
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label htmlFor="contact-correo" className={fieldLabel}>
                  CORREO
                </label>
                <Input
                  id="contact-correo"
                  type="email"
                  name="correo"
                  placeholder="tu@email.com"
                  required
                  className="w-full min-w-0"
                />
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label htmlFor="contact-mensaje" className={fieldLabel}>
                  MENSAJE
                </label>
                <textarea
                  id="contact-mensaje"
                  name="mensaje"
                  rows={4}
                  placeholder="Cuéntanos sobre tu proyecto..."
                  required
                  className={textareaClass}
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                EMPECEMOS
              </Button>
            </form>
          </motion.div>

          {/* Bajo xl: misma isla `dark` que el form (en light la card
              blanca pelea). En xl se disuelve al lado — sin `dark`, para
              que el copy herede tokens de página, no texto claro sobre
              fondo claro. */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="dark [color-scheme:dark] mx-auto mt-10 flex w-full min-w-0 flex-col gap-6 rounded-[var(--card-radius)] border border-border bg-card p-[var(--card-padding)] text-foreground xl:hidden"
          >
            {CONTACT_ITEMS.map((item) => (
              <ContactItem key={item.label} item={item} />
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="absolute left-full top-1/2 hidden w-auto -translate-y-1/2 flex-col gap-8 pl-10 xl:flex"
          >
            {CONTACT_ITEMS.map((item) => (
              <ContactItem key={item.label} item={item} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
