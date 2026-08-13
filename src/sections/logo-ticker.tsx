// Clientes reales (2026-08-12, pedido explícito: "solo estos los que
// debemos mostrar") — reemplaza los 7 placeholders del demo original.
// Los 5 PNG subidos ya venían blancos sobre transparente (logo "reverse"
// listo para fondo oscuro), por eso el filter brightness/contrast que
// tenía el demo para forzar blanco desapareció más abajo — con estos
// assets ya no hace falta y solo introducía grises de más.
const LOGOS = [
  "/images/logo-drytec.webp",
  "/images/logo-chevrolet.webp",
  "/images/logo-vidanica.webp",
  "/images/logo-novasis.webp",
  "/images/logo-flordecana.webp",
];

// Sin hooks/motion: puede quedarse como server component.
export default function LogoTicker() {
  return (
    <section className="bg-background py-12 md:mb-16 overflow-hidden">
      <div className="flex w-[280%] md:w-[180%] lg:w-[150%]">
        <div className="flex items-center justify-around w-full animate-ticker py-2 gap-12 md:gap-16">
          {LOGOS.map((logo, idx) => (
            <img
              key={idx}
              src={logo}
              alt="Client Logo"
              className="h-8 md:h-12 object-contain opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 px-2"
            />
          ))}
          {LOGOS.map((logo, idx) => (
            <img
              key={`dup-${idx}`}
              src={logo}
              alt="Client Logo"
              className="h-8 md:h-12 object-contain opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 px-2"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
