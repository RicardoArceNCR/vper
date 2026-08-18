"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion, useSpring } from "framer-motion";
import SectionHeader from "@/components/section-header";
import { workItems, type WorkItem } from "@/lib/work-items";

// Los proyectos y sus imágenes viven en lib/work-items.ts — es la misma
// fuente que consume /work/[slug]. Antes estaban hardcodeados acá adentro;
// moverlos evita que la card de la home y la página de detalle del mismo
// proyecto terminen mostrando título/imagen distintos con el tiempo.

function WorkCard({ item }: { item: WorkItem }) {
  return (
    <Link
      href={`/work/${item.slug}`}
      className="group relative shrink-0 w-[78vw] sm:w-[52vw] lg:w-[clamp(360px,42vw,620px)] bg-card border border-border overflow-hidden transition-all duration-500 hover:border-foreground/15"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted relative">
        <img
          src={item.hero.src}
          alt={item.title}
          className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-md w-10 h-10 flex items-center justify-center border border-border opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
          <ArrowUpRight size={18} className="text-foreground" />
        </div>
      </div>
      <div className="p-5 relative z-20">
        <span className="text-[10px] font-bold tracking-widest text-primary mb-2 block uppercase">
          {item.subtitle}
        </span>
        <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {item.title}
        </h3>
      </div>
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
            title="PROYECTOS SELECCIONADOS."
            description="Campañas, contenido y experiencias que convierten. Descubre nuestros últimos proyectos destacados."
          />
        </div>
        <div className="wrap flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
          {workItems.map((item) => (
            <div key={item.slug} className="snap-start">
              <WorkCard item={item} />
            </div>
          ))}
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
            title="PROYECTOS SELECCIONADOS."
            description="Campañas, contenido y experiencias que convierten. Descubre nuestros últimos proyectos destacados."
          />
        </div>

        <motion.div ref={trackRef} style={{ x }} className="wrap flex gap-6 md:gap-8">
          {workItems.map((item) => (
            <WorkCard key={item.slug} item={item} />
          ))}
          <div className="shrink-0 w-[12vw]" aria-hidden="true" />
        </motion.div>

        <div className="wrap mt-10 md:mt-14">
          <div className="h-[2px] w-full max-w-xs bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full w-full bg-primary rounded-full"
              style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
