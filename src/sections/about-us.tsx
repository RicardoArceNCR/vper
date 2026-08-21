"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { cn } from "@ui/lib/utils";

const team = [
  {
    name: "Jader Vanegas",
    role: "Director general",
    photo: "/images/team-jader.png",
    bio: "Placeholder. Lidera la dirección general de VPER y alinea estrategia, equipo y entrega para que cada proyecto tenga rumbo claro. Texto de relleno para la bio — reemplazar por el copy real.",
  },
  {
    name: "Carlos Escobar",
    role: "Director digital",
    photo: "/images/team-carlos.png",
    bio: "Placeholder. Define la estrategia digital, performance y presencia en canales. Texto de relleno para la bio — reemplazar por el copy real del cliente.",
  },
  {
    name: "Karen Cruz",
    role: "Directora de cuentas",
    photo: "/images/team-karen.png",
    bio: "Placeholder. Cuida la relación con el cliente y el día a día de las cuentas, para que nada se pierda entre briefing y entrega. Texto de relleno — reemplazar.",
  },
  {
    name: "Victor Reyes",
    role: "Director de arte",
    photo: "/images/team-victor.png",
    bio: "Placeholder. Marca el lenguaje visual de cada pieza: dirección de arte, sistemas y look que hacen reconocible a la marca. Texto de relleno — reemplazar.",
  },
  {
    name: "Chemel Pulido",
    role: "Creativo",
    photo: "/images/team-chemel.png",
    bio: "Placeholder. Conceptos, campañas y piezas que convierten una idea en algo imposible de ignorar. Texto de relleno para la bio — reemplazar por el copy real.",
  },
  {
    name: "Juan Traña",
    role: "Diseñador audiovisual",
    photo: "/images/team-juan.png",
    bio: "Placeholder. Motion, video y piezas audiovisuales para campañas y contenido. Texto de relleno para la bio — reemplazar por el copy real.",
  },
  {
    name: "Elizbeth Altamirano",
    role: "Content manager",
    photo: "/images/team-elizbeth.png",
    bio: "Placeholder. Planifica y produce el contenido que mantiene a la marca presente, con criterio y consistencia. Texto de relleno — reemplazar.",
  },
  {
    name: "Manuel Miranda",
    role: "Pauta digital",
    photo: "/images/team-manuel.png",
    bio: "Placeholder. Media buying y pauta: presupuesto, audiencias y medición para que la inversión rinda. Texto de relleno — reemplazar por el copy real.",
  },
];

function TeamMemberCard({
  name,
  role,
  photo,
  bio,
}: (typeof team)[number]) {
  const [open, setOpen] = useState(false);

  return (
    <motion.li
      variants={fadeInUp}
      className="group @container flex min-w-0 flex-col text-left"
    >
      <div className="mb-4 aspect-[3/4] overflow-hidden rounded-2xl bg-muted ring-1 ring-transparent transition-[box-shadow,ring-color] duration-500 group-hover:ring-primary/40 group-hover:shadow-[0_0_32px_color-mix(in_srgb,var(--brand-main)_22%,transparent)]">
        <img
          src={photo}
          alt={name}
          className="size-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
        />
      </div>
      <h3 className="font-display display-title-sm font-black tracking-tight text-foreground mb-3">
        {name}
      </h3>
      <p className="text-sm font-medium text-foreground/90 mb-2">{role}</p>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full min-w-0 items-start gap-2 text-left"
      >
        <p
          className={cn(
            "min-w-0 flex-1 text-xs text-muted-foreground leading-relaxed font-medium",
            !open && "line-clamp-2",
          )}
        >
          {bio}
        </p>
        <ChevronDown
          aria-hidden
          className={cn(
            "mt-0.5 size-4 shrink-0 text-primary transition-transform duration-300",
            open && "rotate-180",
          )}
        />
        <span className="sr-only">{open ? "Ver menos" : "Ver más"}</span>
      </button>
    </motion.li>
  );
}

export default function AboutUs() {
  return (
    <section
      id="aboutus"
      className="py-24 md:py-32 bg-background border-b border-border"
    >
      <div className="wrap">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-12 md:mb-16"
        >
          <div className="@container min-w-0 w-full mb-8 md:mb-10">
            <h2 className="font-display display-title font-black tracking-tight text-primary">
              NUESTRO EQUIPO
            </h2>
          </div>
          <p className="text-sm md:text-base text-foreground font-medium leading-relaxed max-w-2xl mx-auto">
            El marketing no falla por falta de ideas, falla por falta de
            estructura. Muchas marcas operan con áreas desconectadas, lo que
            genera decisiones aisladas, ejecución inconsistente y pérdida de
            eficiencia. Por eso, diseñamos un equipo donde cada rol cumple una
            función crítica dentro del proceso, asegurando dirección, coherencia
            y control en cada decisión.
          </p>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {team.map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
