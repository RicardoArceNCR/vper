"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion, useSpring } from "framer-motion";
import SectionHeader from "@/components/section-header";
import WorkCard from "@/components/work-card";
import { getFeaturedWorkItems } from "@/lib/work-items";

// La VITRINA, no el archivo (2026-08-26). Muestra solo los proyectos con
// `homeOrder`; el listado completo vive en /work.
//
// POR QUÉ SE RECORTÓ: el cuello de botella no es "seis es mucho para un
// grid" — es este track. Cada card mide hasta 620px y el runway de
// scroll está clampado a 450vh, así que a partir de cierto número de
// piezas el gesto deja de ser una vitrina y se vuelve un túnel: el
// visitante scrollea medio minuto sin avanzar en la página. Con cuatro
// el track cabe holgado dentro del clamp y la home vuelve a ser una
// home. Listar es trabajo del archivo.
//
// La card vive en components/work-card.tsx desde que /work necesitó la
// misma pieza a otro tamaño.
//
// Sin `priority` en la home: PORTAFOLIO está bajo el hero. `eager` en
// la primera card competía con el LCP. El archivo `/work` sí marca las
// primeras del grid.

// Se calcula una vez, en módulo: la curaduría no cambia entre renders.
const featured = getFeaturedWorkItems();

const SECTION_TITLE = (
  <>
    {/* Setup a 30px, golpe a 60px (afinado 2026-08-26). El min() con cqi
        conserva la proporción 1:2 cuando el contenedor se estrecha —
        ENSEÑÁRTELA a 60px fijos se sale en un 375. El hueco ENTRE blanca
        y amarilla es solo el mt del segundo span — no el line-height. */}
    <span className="font-sans font-(weight:--button-font-weight) uppercase tracking-(--button-letter-spacing) text-foreground block leading-[1.25] [font-size:min(30px,calc(100cqi/26.8))]">
      Podríamos hablar
      <br />
      horas de creatividad.
    </span>
    <span className="title-brand-gradient mt-[0.08em] block leading-[1.1] [font-size:min(60px,calc(100cqi/13.4))]">
      Preferimos enseñártela.
    </span>
  </>
);
const SECTION_DESCRIPTION =
  "Una selección de retos que se convirtieron en ideas. Y de ideas que terminaron siendo mucho más.";
const SECTION_TITLE_CLASS = "uppercase title-solid";

// El link al archivo. No es un Button gold: ese rol ya lo tiene
// ¿NOS REUNIMOS? y un segundo pill en esta fila pelearía con las cards.
// Label + círculo es el mismo gesto que el badge de WorkCard, sin
// sumar altura propia (el sticky h-screen no aguanta otro bloque).
function ArchiveLink() {
  return (
    <Link
      href="/work"
      className="group inline-flex items-center gap-3 font-sans text-body-sm font-(weight:--button-font-weight) uppercase tracking-(--button-letter-spacing) text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring-color)] focus-visible:rounded-sm"
    >
      Ver todos los proyectos
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/80 transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-[var(--button-primary-text)]">
        <ArrowUpRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </Link>
  );
}

export default function WorkGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const [runwayVh, setRunwayVh] = useState(250);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(rawX, { stiffness: 300, damping: 40, mass: 0.5 });

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const measure = () => {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const dist = Math.max(trackWidth - window.innerWidth, 0);
      setDistance(dist);
      const extraVh = (dist / window.innerHeight) * 100;
      setRunwayVh(Math.max(140, Math.min(450, 100 + extraVh)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <section id="work" className="py-24 md:py-32 bg-background">
        <div className="wrap min-w-0 mb-12">
          <SectionHeader
            eyebrow="PORTAFOLIO"
            title={SECTION_TITLE}
            description={SECTION_DESCRIPTION}
            titleClassName={SECTION_TITLE_CLASS}
          />
        </div>
        <div className="wrap flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
          {featured.map((item) => (
            <div key={item.slug} className="snap-start">
              <WorkCard item={item} variant="featured" />
            </div>
          ))}
        </div>
        <div className="wrap mt-10 flex justify-center md:justify-end">
          <ArchiveLink />
        </div>
      </section>
    );
  }

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-background"
      style={{ height: `${runwayVh}vh` }}
    >
      {/* top-16 = header. El clip del carrusel tiene que ser solo
          horizontal: overflow-hidden también afeitaba PORTAFOLIO (el
          fadeInUp lo deja en y:0 contra el borde). overflow-x-clip no
          fuerza overflow-y a hidden. pt extra = aire tras la animación. */}
      <div className="sticky top-16 h-screen flex flex-col justify-start pt-4 pb-4 md:justify-center md:pt-10 md:pb-8 overflow-x-clip overflow-y-visible">
        <div className="wrap min-w-0 mb-3 md:mb-14">
          <SectionHeader
            eyebrow="PORTAFOLIO"
            title={SECTION_TITLE}
            description={SECTION_DESCRIPTION}
            titleClassName={SECTION_TITLE_CLASS}
          />
        </div>

        <motion.div ref={trackRef} style={{ x }} className="wrap flex gap-6 md:gap-8">
          {featured.map((item) => (
            <WorkCard
              key={item.slug}
              item={item}
              variant="featured"
            />
          ))}
          <div className="shrink-0 w-[12vw]" aria-hidden="true" />
        </motion.div>

        <div className="wrap mt-6 md:mt-14 flex flex-col items-center gap-3 md:flex-row md:justify-between md:gap-4">
          <div className="h-[2px] w-full max-w-xs bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full w-full bg-primary rounded-full"
              style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
            />
          </div>
          <ArchiveLink />
        </div>
      </div>
    </section>
  );
}
