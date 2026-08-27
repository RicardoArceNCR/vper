import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { FOOTER_NAV_ITEMS } from "@/lib/navigation";

const LOGO = "/images/logo-vper-media.svg";

const IMAGES = {
  carlos: "/images/footer-carlos.jpg",
  jader: "/images/footer-jader.jpg",
};

// Sin hooks/motion: puede quedarse como server component.
export default function Footer() {
  // Sin border-t: la línea de horizonte ahora la dibuja <GlowMark />, que tapa
  // el 27% inferior del wordmark con este mismo --footer-bg. Dejar el borde acá
  // daba dos líneas paralelas separadas por esa franja.
  return (
    <footer className="bg-[var(--footer-bg)] pt-20 pb-10">
      <div className="wrap">
        <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-16 mb-16 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start md:max-w-xs shrink-0">
              {/* Antes era texto ("VPER.MEDIA" armado con spans) — pedido
                  explícito: el SVG real del nav (mismo logo-vper-media.svg
                  que usa Header), no una recreación tipográfica aparte. */}
              <img src={LOGO} alt="VPER Media" className="h-8 md:h-9 w-auto mb-6" />
              <p className="text-xs text-[var(--footer-text)] leading-relaxed font-medium mb-6 max-w-xs text-center md:text-left">
                Campañas, contenido y experiencias que convierten. Transformamos marcas y aceleramos el crecimiento digital.
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
              <h4 className="font-display text-xs font-bold tracking-widest text-[var(--footer-heading)] mb-6 uppercase">NAVEGACIÓN</h4>
              <ul className="flex flex-col gap-3 items-center md:items-start">
                {/* Antes: <a href={`#${item.id}`}>. El Header ya tenía
                    arreglado este mismo bug (el ancla relativa solo
                    funciona parado en "/"); el footer nunca lo recibió,
                    así que en /work/[slug] los cinco links no hacían
                    nada. Ahora el href viene de NAV_ITEMS ya absoluto, y
                    <Link> en vez de <a> para no tirar la navegación de
                    cliente en cada click. */}
                {FOOTER_NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-xs text-[var(--footer-text)] hover:text-[var(--footer-link-hover)] transition-colors font-medium">
                      {item.label}
                    </Link>
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
            <span className="text-xs text-[var(--footer-legal-text)] font-medium">
              &copy; 2026 VPER Media. Todos los derechos reservados.
            </span>
            <span className="text-xs text-[var(--footer-legal-text)] font-medium">
              Managua, Nicaragua | Remoto LATAM
            </span>
          </div>
      </div>
    </footer>
  );
}
