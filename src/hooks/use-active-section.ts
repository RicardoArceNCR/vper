import { useEffect, useState } from "react";

// Línea de sonda justo debajo del header (h-16 = 64). Si ninguna
// sección del nav la contiene — hero, ticker, footer — no hay item activo.
const PROBE_Y = 72;

function useActiveSection(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      let current: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= PROBE_Y && bottom > PROBE_Y) {
          current = id;
          break;
        }
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionIds]);

  return activeId;
}

export { useActiveSection };
