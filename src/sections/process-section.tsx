"use client";

import { useRef } from "react";
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
  const hoverRef = useRef(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="relative group flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-0 min-w-0"
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
    >
      {index < processSteps.length - 1 && (
        <div className="hidden lg:block absolute top-28 left-[65%] w-full h-[1px] bg-border z-0 group-hover:bg-primary/20 transition-colors duration-500" />
      )}

      <div className="relative z-10 size-32 shrink-0 overflow-visible md:mb-8 md:size-44 lg:size-56">
        <div className="pointer-events-none absolute inset-[16%] rounded-full border border-border bg-background transition-all duration-500 group-hover:border-primary group-hover:shadow-[0_0_52px_color-mix(in_srgb,var(--brand-main)_38%,transparent)] lg:inset-[18%]" />
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

      <div className="relative z-10 min-w-0 flex-1 md:flex-none md:flex md:flex-col md:items-center">
        <span className="font-display font-black tracking-tight text-primary mb-1 md:mb-3 block text-xl md:text-2xl">
          0{step.number}
        </span>
        <h3 className="text-base md:text-lg font-bold tracking-wider text-foreground mb-1 md:mb-3 uppercase group-hover:text-primary transition-colors break-words">
          {icon.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
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
