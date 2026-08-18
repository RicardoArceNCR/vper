import type { GalleryImage } from "@/lib/work-items";

// Rediseñado 2026-08-12: era un grid de 6 columnas que forzaba cada foto a
// una caja de aspect-ratio fija (21/9 · 4/3 · cuadrado) con object-cover —
// con imágenes placeholder genéricas no se notaba, pero con fotografía real
// (Toma-Tola) recortaba contenido real: latas cortadas por los bordes,
// collages perdiendo esquinas. Pedido explícito: una columna, una foto
// debajo de otra, SIN recortar. Cada `<img>` va a su alto natural (sin
// aspect-ratio impuesto, sin object-cover) — el navegador respeta las
// proporciones reales del archivo.
export default function ProjectGallery({ images }: { images: GalleryImage[] }) {
  return (
    <div className="flex flex-col">
      {images.map((img, idx) => (
        <div key={idx} className="overflow-hidden bg-muted">
          <img src={img.src} alt={img.alt} className="w-full h-auto block" />
        </div>
      ))}
    </div>
  );
}
