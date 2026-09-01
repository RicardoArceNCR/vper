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
          className="mx-auto size-28 rounded-full border border-border bg-black md:size-36 lg:size-48"
        />
      ))}
    </div>
  ),
});

export default function ProcessLabLoader() {
  return <ProcessLab />;
}
