import { Instagram, Linkedin } from "lucide-react";
import { FOOTER_NAV_ITEMS } from "@/lib/navigation";

const LOGO = "/images/logo-vper-media.svg";

const IMAGES = {
  carlos: "/images/a8de85fcd4970bfcc467c2ef735fe8f8ac7284e1.webp",
  // TODO: esta imagen (b224891b...) muestra la bandera de Panamá, no una
  // foto real de Jader — mismo tipo de asset placeholder mal puesto que
  // ya se encontró en 2 de las cards de WorkGallery (ver sesión anterior).
  // No lo reemplacé por no tener una foto real para poner en su lugar.
  jader: "/images/b224891bc5b429bcdf1208e28a163266cde48bf2.webp",
};

// Sin hooks/motion: puede quedarse como server component.
export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] pt-20 pb-10 border-t border-border">
      {/* Auditoría 2026-08-12: se veía "tirado a la izquierda" en pantallas
          anchas porque .wrap NO tiene max-width en ningún lado del sitio
          (grep confirma: cero contenedores de sección con max-w-*, solo
          textos sueltos como max-w-2xl para cortar líneas largas) — a
          2600px de viewport real, este grid de 3 columnas iguales estiraba
          cada columna a ~800px cuando el contenido (nombres, emails, 5
          links cortos) necesita una fracción de eso, dejando huecos
          enormes. Otras secciones no se notan porque su contenido SÍ llena
          el ancho (grids de 6 cards, imagen de fondo del hero); el footer
          es puro texto corto, ahí se nota.
          Fix con dos partes: (1) max-w-7xl acá adentro — no toqué .wrap
          global a propósito, es un cambio de UNA sección, no una decisión
          de arquitectura de todo el sitio que nadie pidió; (2) grid de 3
          columnas iguales → flex justify-between con cada bloque a su
          ancho natural (shrink-0), que es como reparten espacio la
          mayoría de los footers reales (logo+tagline a la izquierda,
          columnas de link/contacto a su tamaño, aire parejo entre medio —
          no franjas iguales forzadas). */}
      <div className="wrap">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-16 mb-16 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start md:max-w-xs shrink-0">
              {/* Antes era texto ("VPER.MEDIA" armado con spans) — pedido
                  explícito: el SVG real del nav (mismo logo-vper-media.svg
                  que usa Header), no una recreación tipográfica aparte. */}
              <img src={LOGO} alt="VPER Media" className="h-8 md:h-9 w-auto mb-6" />
              <p className="text-xs text-[var(--footer-text)] leading-relaxed font-medium mb-6 max-w-xs text-center md:text-left">
                Campaigns, content & experiences that convert. Transformamos marcas y aceleramos el crecimiento digital.
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 border border-[var(--border-strong)] rounded-full flex items-center justify-center text-[var(--text-primary)] hover:text-primary hover:border-primary/20 hover:scale-110 transition-all duration-300">
                  <Instagram size={14} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 border border-[var(--border-strong)] rounded-full flex items-center justify-center text-[var(--text-primary)] hover:text-primary hover:border-primary/20 hover:scale-110 transition-all duration-300">
                  <Linkedin size={14} />
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start shrink-0">
              <h4 className="font-display text-xs font-bold tracking-widest text-[var(--footer-heading)] mb-6 uppercase">NAVIGATION</h4>
              <ul className="flex flex-col gap-3 items-center md:items-start">
                {FOOTER_NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-xs text-[var(--footer-text)] hover:text-[var(--footer-link-hover)] transition-colors font-medium">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start shrink-0">
              <h4 className="font-display text-xs font-bold tracking-widest text-[var(--footer-heading)] mb-6 uppercase">CONTACTO</h4>
              {/* Mobile: 2 columnas (pedido explícito) — desktop vuelve a
                  1 columna apilada (md:flex-col), que es donde hay más
                  ancho disponible para la fila avatar+texto horizontal.
                  Tamaños subidos en desktop (avatar 40px→64px, nombre
                  11px→16px, email/tel 10px→14px): a ese ancho el bloque
                  se veía chico comparado con el resto del footer. */}
              <div className="grid grid-cols-2 gap-6 md:flex md:flex-col md:gap-8 items-center md:items-start">
                <div className="flex flex-col items-center md:flex-row md:items-center gap-3 md:gap-4 group text-center md:text-left">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border border-[var(--border-strong)] group-hover:border-primary/30 transition-all duration-300 shrink-0">
                    <img src={IMAGES.carlos} alt="Carlos Escobar" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-xs md:text-base font-bold text-[var(--footer-heading)] block tracking-wide">CARLOS ESCOBAR</span>
                    <a href="mailto:carlos@vpermedia.com" className="text-[10px] md:text-sm text-[var(--footer-text)] hover:text-[var(--footer-link-hover)] transition-colors block font-medium">carlos@vpermedia.com</a>
                    <a href="tel:+50577824749" className="text-[10px] md:text-sm text-[var(--footer-text)] block font-medium">+505 7782-4749</a>
                  </div>
                </div>

                <div className="flex flex-col items-center md:flex-row md:items-center gap-3 md:gap-4 group text-center md:text-left">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border border-[var(--border-strong)] group-hover:border-primary/30 transition-all duration-300 shrink-0">
                    <img src={IMAGES.jader} alt="Jader Vanegas" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-xs md:text-base font-bold text-[var(--footer-heading)] block tracking-wide">JADER VANEGAS</span>
                    <a href="mailto:jader@vpermedia.com" className="text-[10px] md:text-sm text-[var(--footer-text)] hover:text-[var(--footer-link-hover)] transition-colors block font-medium">jader@vpermedia.com</a>
                    <a href="tel:+50768967401" className="text-[10px] md:text-sm text-[var(--footer-text)] block font-medium">+507 6896-7401</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <span className="text-[10px] text-[var(--footer-legal-text)] font-medium">
              &copy; 2026 VPER Media. Todos los derechos reservados.
            </span>
            <span className="text-[10px] text-[var(--footer-legal-text)] font-medium">
              Managua, Nicaragua | Remoto LATAM
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
