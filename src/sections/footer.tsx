import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { FOOTER_NAV_ITEMS } from "@/lib/navigation";
import {
  VPER_WORDMARK_PATHS as PATHS,
  VPER_WORDMARK_VIEWBOX as VB,
} from "@/lib/vper-wordmark";

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
      <div className="wrap min-w-0">
        <div className="flex min-w-0 flex-col md:flex-row md:justify-between gap-12 md:gap-16 mb-16 text-center md:text-left">
            <div className="flex min-w-0 w-full flex-col items-center md:max-w-xs md:items-start">
              {/* El SVG del nav es blanco sólido: en el header funciona
                  porque el vidrio es --nav-bg (inverse, oscuro en los
                  dos modos). El footer es --footer-bg (papel en claro),
                  así que el wordmark se pinta con currentColor.
                  viewBox 238×19: h-8 w-auto pide ~400px y con shrink-0
                  se come NAVEGACIÓN. Es Obviously Wide, no un bug de
                  SVG en general — mismo min-w-0 que display-title. */}
              <svg
                viewBox={`0 0 ${VB.w} ${VB.h}`}
                className="mb-6 h-auto w-full max-w-full text-[var(--footer-heading)]"
                role="img"
                aria-label="VPER Media"
              >
                {PATHS.map((d, i) => (
                  <path key={i} d={d} fill="currentColor" />
                ))}
              </svg>
              <p className="text-xs text-[var(--footer-text)] leading-relaxed font-medium mb-6 max-w-xs text-center md:text-left">
                Creamos. Aprendemos. Volvemos a crear.
                <br />
                Siempre hay algo más grande por crear.
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/profile.php?id=61587696818975" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-8 h-8 border border-[var(--border-strong)] rounded-full flex items-center justify-center text-[var(--text-primary)] hover:text-primary hover:border-primary/20 hover:scale-110 transition-all duration-300">
                  <Facebook size={14} />
                </a>
                <a href="https://www.instagram.com/vpermedia/" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 border border-[var(--border-strong)] rounded-full flex items-center justify-center text-[var(--text-primary)] hover:text-primary hover:border-primary/20 hover:scale-110 transition-all duration-300">
                  <Instagram size={14} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-8 h-8 border border-[var(--border-strong)] rounded-full flex items-center justify-center text-[var(--text-primary)] hover:text-primary hover:border-primary/20 hover:scale-110 transition-all duration-300">
                  <Linkedin size={14} />
                </a>
              </div>
            </div>

            <div className="flex min-w-0 flex-col items-center md:items-start">
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

            <div className="flex min-w-0 flex-col items-center md:items-start">
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
