"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { PROCESS_LAB_ICONS, type LabIcon } from "./icons";
import { ProcessRaster, useBrandSky, useInView } from "./process-icon-shared";
import { preloadProcessGlbs } from "./glb-icon";
import { ProcessStepIcon } from "./process-step-icon";

function LabIconCell({
  icon,
  color,
  inView,
  reduceMotion,
}: {
  icon: LabIcon;
  color: string;
  inView: boolean;
  reduceMotion: boolean | null;
}) {
  const hoverRef = useRef(false);

  return (
    <div
      className="group flex min-w-0 flex-col items-center md:text-center"
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
    >
      <div className="relative size-32 overflow-visible md:size-44 lg:size-56">
        <div className="pointer-events-none absolute inset-[16%] rounded-full border border-border bg-background shadow-[0_0_22px_color-mix(in_srgb,var(--brand-sky)_26%,transparent)] transition-[box-shadow,border-color] duration-500 group-hover:border-primary group-hover:shadow-[0_0_44px_color-mix(in_srgb,var(--brand-sky)_48%,transparent)] lg:inset-[18%]" />
        {reduceMotion ? (
          <div className="absolute inset-[16%] overflow-hidden rounded-full lg:inset-[18%]">
            <ProcessRaster icon={icon} />
          </div>
        ) : (
          <div className="absolute inset-0">
            <ProcessStepIcon
              icon={icon}
              color={color}
              running={inView}
              hoverRef={hoverRef}
              dpr={[1, 2]}
            />
          </div>
        )}
      </div>
      <h3 className="mt-6 text-base font-bold uppercase tracking-wider text-foreground transition-colors group-hover:text-primary md:text-lg">
        {icon.title}
      </h3>
    </div>
  );
}

export default function ProcessLab() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, true);
  const reduceMotion = useReducedMotion();
  const color = useBrandSky();

  useEffect(() => {
    preloadProcessGlbs();
  }, []);

  return (
    <div
      ref={root}
      className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5"
    >
      {PROCESS_LAB_ICONS.map((icon) => (
        <LabIconCell
          key={icon.id}
          icon={icon}
          color={color}
          inView={inView}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}
