"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { cn } from "@ui/lib/utils";

const team = [
  {
    name: "Carlos Escobar",
    role: "Director digital",
    photo: "/images/team-carlos.webp",
    bio: "Profesional de marketing con más de diez años de experiencia creando estrategias 360° que integran creatividad y resultados de negocio. Ha liderado equipos, administrado presupuestos superiores a $500,000 y desarrollado campañas digitales y tradicionales para marcas de retail, salud y finanzas, logrando retornos de hasta 10:1. Su formación internacional en la Universidad Rafael Landívar e INCAE fortalece su visión estratégica, analítica y orientada al impacto.",
  },
  {
    name: "Karen Cruz",
    role: "Directora de cuentas",
    photo: "/images/team-karen.webp",
    bio: "Profesional de Marketing apasionada por transformar insights en estrategias y estrategias en acciones. Cuenta con experiencia en investigación de mercados, estrategia comercial, gestión de categorías y desarrollo de campañas, combinando pensamiento analítico, creatividad y orientación a resultados. Actualmente cursa una Maestría en Marketing en la University of Denver.",
  },
  {
    name: "Heriberto García",
    role: "Web Master Leader",
    photo: "/images/team-heriberto.webp",
    bio: "Ingeniero en Sistemas con más de diez años de experiencia creando soluciones y experiencias digitales de alto impacto. Especialista en desarrollo web, diseño UX/UI, optimización de conversiones y comercio electrónico. Su enfoque combina eficiencia, escalabilidad y análisis de datos para desarrollar plataformas funcionales, intuitivas y orientadas a resultados. Impulsa procesos de innovación y transformación digital que fortalecen el crecimiento, la competitividad y el rendimiento empresarial.",
  },
  {
    name: "Chemel Pulido",
    role: "Creativo",
    photo: "/images/team-chemel.webp",
    bio: "Director de arte y creativo con amplia trayectoria en diseño, conceptualización y dirección visual. Admirador de la buena publicidad, desarrolla briefs sólidos y propuestas estratégicas basadas en un análisis profundo, integrando calidad narrativa, gráfica y funcionalidad. Reconocido con plata en Cannes Young Lions Dominicana 2022, combina liderazgo y colaboración. Ha creado campañas para sectores financiero, telecomunicaciones, automotriz, bienes raíces y plataformas digitales de alto impacto.",
  },
  {
    name: "Victor Reyes",
    role: "Director de arte",
    photo: "/images/team-victor.webp",
    bio: "Modelador 3D con perfil tecnocreativo, especializado en desarrollar piezas de alta calidad, detalle y excelencia visual. Combina dominio técnico, sensibilidad estética y afinidad por la tecnología, el hardware y la cultura geek. Ha creado un banco propio de mobiliario detallado y comercializado sus recursos digitalmente. Explora inteligencia artificial, animación, personajes y branding premium, integrando Smart Home y estética gamer con enfoque innovador, estratégico y rentable.",
  },
  {
    name: "Juan Traña",
    role: "Diseñador audiovisual",
    photo: "/images/team-juan.webp",
    bio: "Diseñador gráfico senior, ilustrador y animador 2D especializado en Motion Graphics, con 14 años de experiencia en agencias líderes del sector creativo. Posee una sólida trayectoria en diseño visual, comunicación estratégica y producción audiovisual, creando piezas de alto impacto para marcas, campañas publicitarias y proyectos multiplataforma. Destaca por su rigor, atención al detalle y coherencia visual, integrando creatividad y estrategia para fortalecer posicionamiento de marca.",
  },
  {
    name: "Elizabeth Altamirano",
    role: "Content manager",
    photo: "/images/team-elizabeth.webp",
    bio: "Licenciada en Comunicación especializada en estrategias de contenido y gestión de campañas en Meta Ads. Cuenta con experiencia en segmentación, análisis de métricas y optimización de resultados, utilizando datos para impulsar el crecimiento de marcas digitales. Se distingue por integrar creatividad, innovación y análisis estratégico, manteniéndose actualizada en tendencias de marketing digital para desarrollar campañas efectivas, relevantes y orientadas al logro de resultados.",
  },
  {
    name: "Manuel Miranda",
    role: "Pauta digital",
    photo: "/images/team-manuel.webp",
    bio: "Senior Performance Marketing Analyst con más de cuatro años de experiencia en marketing digital para clientes enterprise de México y Latinoamérica. Especializado en Google Ads y Meta, ha gestionado inversiones mensuales superiores a USD 650 mil, priorizando eficiencia, escalabilidad y resultados. Desarrolla automatizaciones mediante Google Ads Scripts y Apps Script, optimizando procesos y cuentas. También aporta liderazgo, mentoría y análisis estratégico con datos para crecer.",
  },
];

/** Intrínseco de las fotos del equipo (~3:4). El hueco de la card es
 *  mucho más chico; width/height acá son para CLS, no para pedir más
 *  píxeles. NOSOTROS vive debajo de hero + vitrina + servicios +
 *  proceso: las fotos van lazy. */
const TEAM_PHOTO_W = 966;
const TEAM_PHOTO_H = 1293;

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
      <div className="hover-brand-ring relative mb-4 rounded-2xl transition-shadow duration-500 group-hover:shadow-[0_0_28px_color-mix(in_srgb,var(--brand-main)_16%,transparent)]">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={photo}
            alt={name}
            width={TEAM_PHOTO_W}
            height={TEAM_PHOTO_H}
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
          />
        </div>
      </div>
      <h3 className="font-display font-black tracking-tight text-foreground mb-3 break-words pb-[0.15em] text-h5 md:display-title-sm">
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
      <div className="wrap max-w-[1217px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-12 md:mb-16"
        >
          <div className="@container min-w-0 w-full mb-8 md:mb-10">
            <span className="text-xs font-bold tracking-[0.3em] text-[var(--text-eyebrow)] mb-4 block">
              NOSOTROS
            </span>
            <h2 className="font-display display-title font-black tracking-tight title-brand-gradient">
              CINCO DIRECTORES.
              <br />
              MUCHAS IDEAS.
              <br />
              UNA SOLA DIRECCIÓN.
            </h2>
          </div>
          <p className="text-sm md:text-base text-foreground font-medium leading-relaxed max-w-2xl mx-auto">
            Estrategia, creatividad, arte, digital y cuentas pensando desde
            lugares distintos para llegar al mismo lugar: una idea más grande.
            Porque cuando juntás buenas cabezas alrededor de una mesa, siempre
            termina pasando algo interesante.
          </p>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid min-w-0 grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
        >
          {team.map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
