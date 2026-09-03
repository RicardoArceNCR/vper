// Clientes reales (2026-08-12, pedido explícito: "solo estos los que
// debemos mostrar") — reemplaza los 7 placeholders del demo original.
// Mezcla reverse blanco (SVG) y wordmarks a color (webp). Un invert()
// en claro pondría los blancos en negro pero destiñe Flor de Caña /
// Vida Nica. La cinta es negra en los dos modos: mismos assets, y
// puente visual con el hero (también escenario oscuro).
const LOGOS = [
  "/images/logo-qonexia.svg",
  "/images/logo-06.svg",
  "/images/logo-07.svg",
  "/images/logo-08.svg",
  "/images/logo-vidanica.webp",
  "/images/logo-novasis.webp",
  "/images/logo-flordecana.webp",
];

function LogoStrip({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16"
      aria-hidden={hidden || undefined}
    >
      {LOGOS.map((logo, idx) => (
        <img
          key={hidden ? `dup-${idx}` : idx}
          src={logo}
          alt={hidden ? "" : "Logo de cliente"}
          loading="lazy"
          decoding="async"
          className="h-8 px-2 object-contain opacity-70 transition-all duration-300 hover:scale-110 hover:opacity-100 md:h-12"
        />
      ))}
    </div>
  );
}

// Dos tiras idénticas + `pr` = el gap. `-50%` cae exactamente en un
// ciclo: 7 logos + 7 huecos. El `w-[320%]` / `justify-around` anterior
// hacía que el 50% no coincidiera con un set — de ahí el salto.
export default function LogoTicker() {
  return (
    <section className="logo-ticker overflow-hidden bg-black py-12 md:mb-16">
      <div className="animate-ticker flex w-max">
        <LogoStrip />
        <LogoStrip hidden />
      </div>
    </section>
  );
}
