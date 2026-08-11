import { useEffect, useState } from "react";

function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0]!.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}

export { useActiveSection };
