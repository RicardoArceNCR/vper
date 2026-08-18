"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const team = [
  {
    name: "Jader Vanegas",
    role: "Director General",
    photo: "/images/jader.png",
  },
  {
    name: "Carlos Escobar",
    role: "Director Digital",
    photo: "/images/carlos.png",
  },
  {
    name: "Victor Reyes",
    role: "Director de arte",
    photo: "/images/victor.png",
  },
  {
    name: "José Pulido",
    role: "Director creativo",
    photo: "/images/jose-pulido.png",
  },
];

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
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-5xl mx-auto"
        >
          {team.map((member) => (
            <motion.li
              variants={fadeInUp}
              key={member.name}
              className="flex min-w-0 flex-col items-center text-center group"
            >
              <div className="size-32 sm:size-40 lg:size-44 mb-5 overflow-hidden rounded-full ring-1 ring-border group-hover:ring-primary/40 transition-all duration-500">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="size-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-bold tracking-tight text-foreground">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-foreground/80">{member.role}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
