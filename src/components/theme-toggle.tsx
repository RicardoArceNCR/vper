"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Sin Context/Provider (a diferencia del ThemeContext original de
// vper-media-repo): el anti-FOUC script en layout.tsx ya decide la clase
// `.dark` antes del primer paint (mismo mecanismo que misitio), así que
// este botón solo necesita leer/escribir esa clase + localStorage
// directamente — no hay estado que compartir con ningún otro componente.
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("vper-theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-[var(--nav-item-default)] hover:text-[var(--nav-item-hover)] transition-colors"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
