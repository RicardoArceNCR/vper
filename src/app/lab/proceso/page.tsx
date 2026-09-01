import type { Metadata } from "next";
import ProcessLabLoader from "@/lab/proceso/process-lab-loader";
import { PROCESS_LAB_ICONS } from "@/lab/proceso/icons";

export const metadata: Metadata = {
  title: "Lab · proceso 3D — VPER",
  robots: { index: false, follow: false },
};

export default function ProcesoLabPage() {
  return (
    <main className="wrap py-12 md:py-16">
      <div className="@container min-w-0 mb-12 max-w-3xl">
        <p className="text-overline-sm font-bold tracking-widest text-[var(--text-eyebrow)] mb-4">
          EXPERIMENTO
        </p>
        <h1 className="display-title font-display font-black tracking-tight text-foreground">
          PROCESO EN THREE.JS
        </h1>
        <p className="mt-6 text-body-md text-muted-foreground font-medium">
          GLB livianos (voxel remesh, sin texturas). El glow de la referencia
          vive en Three.js: fresnel cian + núcleo índigo + env map + clearcoat,
          sin transmission. Bloom por CSS en el mesh. Llama naranja en Aprender.
          La sección de metodología en la home usa los mismos GLB.
        </p>
      </div>

      <ProcessLabLoader />

      <section className="mt-20 border-t border-border pt-12">
        <h2 className="text-h4 font-bold uppercase tracking-wider text-muted-foreground mb-8">
          Referencia raster (producción)
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {PROCESS_LAB_ICONS.map((icon) => (
            <div key={icon.id} className="flex flex-col items-center md:text-center">
              <div className="size-28 overflow-hidden rounded-full border border-border bg-black md:size-36 lg:size-48">
                <img src={icon.raster} alt="" className="size-full object-contain" />
              </div>
              <p className="mt-4 text-body-sm font-bold uppercase tracking-wider">
                {icon.title}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
