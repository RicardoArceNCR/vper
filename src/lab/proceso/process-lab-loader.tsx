"use client";

import dynamic from "next/dynamic";
import { PROCESS_LAB_ICONS } from "./icons";

const ProcessLab = dynamic(() => import("./process-lab"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5">
      {PROCESS_LAB_ICONS.map((icon) => (
        <div
          key={icon.id}
          className="relative mx-auto size-32 md:size-44 lg:size-56"
        >
          <div className="absolute inset-[16%] rounded-full border border-border bg-background lg:inset-[18%]" />
        </div>
      ))}
    </div>
  ),
});

export default function ProcessLabLoader() {
  return <ProcessLab />;
}
