"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

// Se calcula una vez, en módulo: la curaduría no cambia entre renders.
const featured = getFeaturedWorkItems();

const SECTION_TITLE = "PROYECTOS SELECCIONADOS.";
const SECTION_DESCRIPTION =
  "Campañas, contenido y experiencias que convierten. Una selección de lo último; el archivo completo está en la página de proyectos.";

// El link al archivo. Comparte la fila con la barra de progreso en vez
// de sumar altura propia: dentro de un sticky h-screen, cada bloque
// nuevo se come el aire de las cards.
function ArchiveLink() {
  return (
    <Link
      href="/work"
      className="group inline-flex items-center gap-2 font-sans text-body-sm font-(weight:--button-font-weight) uppercase tracking-(--button-letter-spacing) text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring-color)] focus-visible:rounded-sm"
    >
      Ver todos los proyectos
      <ArrowRight
        size={14}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
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
      <section id="work" className="py-24 md:py-32 bg-background border-b border-border">
        <div className="wrap min-w-0 mb-12">
          <SectionHeader
            eyebrow="PORTAFOLIO"
            title={SECTION_TITLE}
            description={SECTION_DESCRIPTION}
          />
        </div>
        <div className="wrap flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
          {featured.map((item, i) => (
            <div key={item.slug} className="snap-start">
              <WorkCard item={item} variant="featured" priority={i === 0} />
            </div>
          ))}
        </div>
        <div className="wrap mt-10">
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
      {/* top-16 coincide con el alto del header sin scroll (h-16, bajado
          de h-20 el 2026-08-12). */}
      <div className="sticky top-16 h-screen flex flex-col justify-start pt-6 md:justify-center md:pt-0 overflow-hidden border-b border-border">
        <div className="wrap min-w-0 mb-4 md:mb-14">
          <SectionHeader
            eyebrow="PORTAFOLIO"
            title={SECTION_TITLE}
            description={SECTION_DESCRIPTION}
          />
        </div>

        <motion.div ref={trackRef} style={{ x }} className="wrap flex gap-6 md:gap-8">
          {featured.map((item, i) => (
            <WorkCard
              key={item.slug}
              item={item}
              variant="featured"
              priority={i === 0}
            />
          ))}
          <div className="shrink-0 w-[12vw]" aria-hidden="true" />
        </motion.div>

        <div className="wrap mt-10 md:mt-14 flex flex-wrap items-center justify-between gap-4">
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
