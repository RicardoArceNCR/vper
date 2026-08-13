"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { WorkItem } from "@/lib/work-items";

// Miniatura/hero de la columna izquierda del detalle de proyecto. Soporta
// imagen o video (click-to-play, no autoplay-loop — mejor para performance
// y coincide con el placeholder ">" de la referencia de diseño). Ningún
// proyecto de work-items.ts usa "video" todavía porque no hay ningún .mp4
// real en public/ — esta rama queda escrita y tipada, pendiente de un
// asset real para probarla en pantalla.
export default function ProjectHero({
  hero,
  title,
}: {
  hero: WorkItem["hero"];
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (hero.type === "video") {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-muted border border-border">
        {playing ? (
          <video
            src={hero.src}
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <img
              src={hero.poster ?? hero.src}
              alt={title}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Reproducir video de ${title}`}
              className="absolute inset-0 flex items-center justify-center bg-background/40 hover:bg-background/20 transition-colors"
            >
              <span className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center">
                <Play size={22} className="text-foreground translate-x-0.5" />
              </span>
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="aspect-[4/3] overflow-hidden bg-muted border border-border">
      <img src={hero.src} alt={title} className="w-full h-full object-cover" />
    </div>
  );
}
