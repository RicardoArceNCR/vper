/**
 * Lab + home: GLB web receta Blender en
 *   ~/blender/vper/iconos-proceso/recipes/optimize_meshy_web.py
 * Copia a public/lab/proceso/{id}.glb. Three.js pisa el material
 * (glow / fresnel); no hornear texturas ni emisión en el GLB.
 */
export type LabIconSource = "svg" | "glb";

export type LabIcon = {
  id: string;
  title: string;
  svg: string;
  glb: string;
  source: LabIconSource;
  raster: string;
  /** Pose de reposo en radianes [x, y, z], antes del spin. */
  restRotation?: [number, number, number];
  /**
   * Compensación óptica sobre el fit (caballo = 1). Las siluetas
   * flacas se leen más chicas que un hexágono del mismo AABB.
   */
  visualScale?: number;
};

export const PROCESS_LAB_ICONS: LabIcon[] = [
  {
    id: "preguntar",
    title: "PREGUNTAR",
    svg: "/images/lupa.svg",
    glb: "/lab/proceso/preguntar.glb?v=3",
    source: "glb",
    raster: "/images/process-investigacion.webp",
    restRotation: [0, 0, 0.7],
    visualScale: 1.12,
  },
  {
    id: "pensar",
    title: "PENSAR",
    svg: "/images/flecha.svg",
    glb: "/lab/proceso/pensar.glb",
    source: "glb",
    raster: "/images/process-estrategia.webp",
  },
  {
    id: "crear",
    title: "CREAR",
    svg: "/images/pluma.svg",
    glb: "/lab/proceso/crear.glb?v=4",
    source: "glb",
    raster: "/images/process-diseno.webp",
    restRotation: [0, 0, 2.44],
    visualScale: 1.08,
  },
  {
    id: "hacer",
    title: "HACER",
    svg: "/images/code.svg",
    glb: "/lab/proceso/hacer.glb",
    source: "glb",
    raster: "/images/process-desarrollo.webp",
    visualScale: 0.88,
  },
  {
    id: "aprender",
    title: "APRENDER",
    svg: "/images/cohete.svg",
    glb: "/lab/proceso/aprender.glb?v=3",
    source: "glb",
    raster: "/images/process-entrega.webp",
  },
];
