"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import SectionHeader from "@/components/section-header";
import { PROCESS_LAB_ICONS, type LabIcon } from "@/lab/proceso/icons";
import {
  ProcessRaster,
  useBrandSky,
  useInView,
  useNearView,
} from "@/lab/proceso/process-icon-shared";

// No montar hasta `useNearView`: si el chunk de Three entra en el
// primer paint (prefetch del dynamic), los GLB viajan con él. El
// webpackPrefetch: false es el cinturón; no renderizar el icono
// hasta `near` es el suspensario.
const ProcessStepIcon = dynamic(
  () =>
    import(
      /* webpackPrefetch: false, webpackPreload: false */
      "@/lab/proceso/process-step-icon"
    ).then((m) => m.ProcessStepIcon),
  { ssr: false, loading: () => <div className="size-full bg-background" /> },
);

const processSteps = [
  {
    id: "preguntar",
    number: 1,
    desc: "Todo empieza con preguntas. Algunas cómodas, otras bastante menos. Entendemos la marca, el mercado y las personas hasta encontrar el reto que realmente vale resolver.",
  },
  {
    id: "pensar",
    number: 2,
    desc: "Juntamos datos, experiencia e intuición hasta encontrar una dirección clara. Porque una gran idea también necesita saber hacia dónde va.",
  },
  {
    id: "crear",
    number: 3,
    desc: "Acá la estrategia deja de ser una presentación. La convertimos en una idea con voz, forma y suficiente personalidad para salir al mundo.",
  },
  {
    id: "hacer",
    number: 4,
    desc: "Una gran idea merece una gran ejecución. La producimos, adaptamos y llevamos a cada lugar donde tenga algo importante que hacer.",
  },
  {
    id: "aprender",
    number: 5,
    desc: "Publicamos, medimos, escuchamos y aprendemos. Cada proyecto nos deja algo que hace que la próxima idea empiece un poco más adelante.",
  },
] as const;

type ProcessStep = (typeof processSteps)[number];

function ProcessStepCard({
  step,
  icon,
  index,
  useGlb,
  color,
  inView,
}: {
  step: ProcessStep;
  icon: LabIcon;
  index: number;
  useGlb: boolean;
  color: string;
  inView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const [lit, setLit] = useState(false);
  const reduceMotion = useReducedMotion();

  // Mobile: al pasar cada paso por la banda central del viewport, mismo
  // “hover” que desktop (anillo + spin 3D). Desktop sigue con pointer.
  useEffect(() => {
    const el = cardRef.current;
    if (!el || reduceMotion) return;

    const mq = window.matchMedia("(max-width: 767px)");
    let io: IntersectionObserver | null = null;

    const clearLit = () => {
      hoverRef.current = false;
      setLit(false);
    };

    const bind = () => {
      io?.disconnect();
      io = null;
      if (!mq.matches) {
        clearLit();
        return;
      }
      io = new IntersectionObserver(
        ([entry]) => {
          const on =
            entry != null &&
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.35;
          hoverRef.current = on;
          setLit(on);
        },
        {
          threshold: [0.2, 0.35, 0.5, 0.7],
          rootMargin: "-26% 0px -46% 0px",
        },
      );
      io.observe(el);
    };

    bind();
    mq.addEventListener("change", bind);
    return () => {
      mq.removeEventListener("change", bind);
      io?.disconnect();
    };
  }, [reduceMotion]);

  return (
    <motion.div
      ref={cardRef}
      variants={fadeInUp}
      data-lit={lit ? "" : undefined}
      className="group relative flex min-w-0 flex-row items-center gap-4 md:flex-col md:gap-0 md:text-center"
      onPointerEnter={() => {
        if (!window.matchMedia("(hover: hover)").matches) return;
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        if (!window.matchMedia("(hover: hover)").matches) return;
        hoverRef.current = false;
      }}
    >
      {index < processSteps.length - 1 && (
        <div className="absolute top-28 left-[65%] z-0 hidden h-px w-full bg-border transition-colors duration-500 group-hover:bg-primary/20 lg:block" />
      )}

      <div className="relative z-10 size-32 shrink-0 overflow-visible md:mb-8 md:size-44 lg:size-56">
        {/* Mismo anillo conic que servicios/equipo: en reposo --card-border,
            en hover / data-lit gira sky→clay→action. */}
        <div className="hover-brand-ring hover-brand-ring-rest hover-brand-ring-thick pointer-events-none absolute inset-[16%] rounded-full transition-shadow duration-500 group-hover:shadow-[0_0_52px_color-mix(in_srgb,var(--brand-main)_38%,transparent)] group-data-[lit]:shadow-[0_0_52px_color-mix(in_srgb,var(--brand-main)_38%,transparent)] lg:inset-[18%]">
          <div className="bg-background" />
        </div>
        {useGlb ? (
          <div className="absolute inset-0">
            <ProcessStepIcon
              icon={icon}
              color={color}
              running={inView}
              hoverRef={hoverRef}
            />
          </div>
        ) : (
          <div className="absolute inset-[16%] overflow-hidden rounded-full lg:inset-[18%]">
            <ProcessRaster icon={icon} />
          </div>
        )}
      </div>

      <div className="relative z-10 min-w-0 flex-1 md:flex md:flex-none md:flex-col md:items-center">
        <span className="mb-1 block font-display text-xl font-black tracking-tight text-[var(--brand-sky)] md:mb-3 md:text-2xl">
          0{step.number}
        </span>
        <h3 className="mb-1 break-words text-base font-bold tracking-wider text-foreground uppercase transition-colors group-hover:text-primary group-data-[lit]:text-primary md:mb-3 md:text-lg">
          {icon.title}
        </h3>
        <p className="text-sm font-medium leading-relaxed text-muted-foreground">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
  const root = useRef<HTMLDivElement>(null);
  const near = useNearView(root);
  const inView = useInView(root, false);
  const reduceMotion = useReducedMotion();
  const color = useBrandSky();
  const useGlb = !reduceMotion && near;

  return (
    <section id="process" className="py-24 md:py-32 bg-background border-b border-border">
      <div className="wrap">
        <div className="mb-20">
          <SectionHeader
            eyebrow="METODOLOGÍA"
            title={
              <>
                LA MAGIA
                <br />
                TIENE MÉTODO.
              </>
            }
            description="Y si no, preguntale a Houdini."
          />
          <p className="text-sm md:text-base text-muted-foreground font-medium mt-10 md:mt-12 max-w-3xl">
            Detrás de cada idea que parece simple hay preguntas, estrategia, criterio,
            ejecución y unas cuantas vueltas más. Así convertimos un reto en algo que valga
            la pena crear.
          </p>
        </div>

        <motion.div
          ref={root}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8"
        >
          {processSteps.map((step, index) => {
            const icon = PROCESS_LAB_ICONS.find((item) => item.id === step.id);
            if (!icon) return null;

            return (
              <ProcessStepCard
                key={step.id}
                step={step}
                icon={icon}
                index={index}
                useGlb={useGlb}
                color={color}
                inView={inView}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
