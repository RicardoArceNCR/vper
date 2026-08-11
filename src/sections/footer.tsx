import { Instagram, Linkedin } from "lucide-react";
import { FOOTER_NAV_ITEMS } from "@/lib/navigation";

const IMAGES = {
  carlos: "/images/a8de85fcd4970bfcc467c2ef735fe8f8ac7284e1.webp",
  jader: "/images/b224891bc5b429bcdf1208e28a163266cde48bf2.webp",
};

// Sin hooks/motion: puede quedarse como server component.
export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] pt-20 pb-10 border-t border-border">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl font-black tracking-widest text-[var(--text-primary)] block mb-6">
              VPER<span className="text-primary">.</span>MEDIA
            </span>
            <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium mb-6 max-w-xs text-center md:text-left">
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

          <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-8 text-left md:text-left">
            <div className="flex flex-col items-start">
              <h4 className="text-xs font-bold tracking-widest text-[var(--text-primary)] mb-6 uppercase">NAVIGATION</h4>
              <ul className="flex flex-col gap-3 items-start">
                {FOOTER_NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-xs text-[var(--text-primary)] hover:text-primary transition-colors font-medium">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start">
              <h4 className="text-xs font-bold tracking-widest text-[var(--text-primary)] mb-6 uppercase">CONTACTO</h4>
              <div className="flex flex-col gap-6 w-full items-start">
                <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 group text-left">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border-strong)] group-hover:border-primary/30 transition-all duration-300 shrink-0">
                    <img src={IMAGES.carlos} alt="Carlos Escobar" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] font-bold text-[var(--text-primary)] block tracking-wide">CARLOS ESCOBAR</span>
                    <a href="mailto:carlos@vpermedia.com" className="text-[10px] text-[var(--text-primary)] hover:text-primary transition-colors block font-medium truncate max-w-[130px] sm:max-w-none">carlos@vpermedia.com</a>
                    <a href="tel:+50577824749" className="text-[10px] text-[var(--text-primary)] block font-medium">+505 7782-4749</a>
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 group text-left">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border-strong)] group-hover:border-primary/30 transition-all duration-300 shrink-0">
                    <img src={IMAGES.jader} alt="Jader Vanegas" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] font-bold text-[var(--text-primary)] block tracking-wide">JADER VANEGAS</span>
                    <a href="mailto:jader@vpermedia.com" className="text-[10px] text-[var(--text-primary)] hover:text-primary transition-colors block font-medium truncate max-w-[130px] sm:max-w-none">jader@vpermedia.com</a>
                    <a href="tel:+50768967401" className="text-[10px] text-[var(--text-primary)] block font-medium">+507 6896-7401</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <span className="text-[10px] text-[var(--text-primary)] font-medium">
            &copy; 2026 VPER Media. Todos los derechos reservados.
          </span>
          <span className="text-[10px] text-[var(--text-primary)] font-medium">
            Managua, Nicaragua | Remoto LATAM
          </span>
        </div>
      </div>
    </footer>
  );
}
