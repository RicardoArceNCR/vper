"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { PROCESS_LAB_ICONS } from "./icons";
import { ProcessRaster, useBrandSky, useInView } from "./process-icon-shared";
import { ProcessStepIcon } from "./process-step-icon";

export default function ProcessLab() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, true);
  const reduceMotion = useReducedMotion();
  const color = useBrandSky();

  return (
    <div
      ref={root}
      className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5"
    >
      {PROCESS_LAB_ICONS.map((icon) => (
        <div key={icon.id} className="flex min-w-0 flex-col items-center md:text-center">
          <div className="size-28 overflow-hidden rounded-full border border-border bg-black shadow-[0_0_22px_color-mix(in_srgb,var(--brand-sky)_26%,transparent)] transition-[box-shadow,border-color] duration-500 hover:border-primary hover:shadow-[0_0_36px_color-mix(in_srgb,var(--brand-sky)_40%,transparent)] md:size-36 lg:size-48">
            {reduceMotion ? (
              <ProcessRaster icon={icon} />
            ) : (
              <ProcessStepIcon icon={icon} color={color} running={inView} dpr={[1, 2]} />
            )}
          </div>
          <h3 className="mt-6 text-base font-bold uppercase tracking-wider text-foreground md:text-lg">
            {icon.title}
          </h3>
        </div>
      ))}
    </div>
  );
}
