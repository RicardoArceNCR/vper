// Orquestador de la cadena de tokens. Mismo contrato que misitio (ADR 0011
// de @misitio/ui): el orden 1→2→3 importa, theme-bridge.css referencia via
// var(...) valores que tienen que existir antes en la cascada.
import "@misitio/ui/tokens.css"; // 1: :root (light)
import "@misitio/ui/tokens-dark.css"; // 2: .dark
import "./globals.css"; // 3: tailwind + bridge

import type { Metadata } from "next";
import { fontBody, fontMono } from "@ui/lib/fonts";

export const metadata: Metadata = {
  title: "VPER Media — No hacemos marketing, hacemos que tenga sentido.",
  description:
    "Campaigns, content and experiences that convert. Estrategia de marca, diseño e impacto digital.",
};

// Anti-FOUC de dark mode, mismo truco que misitio: se decide la clase .dark
// ANTES del primer paint, leyendo localStorage. Default "dark" (así vivía
// en el index.html original de VPER Media, no "light" como en misitio).
const themeInit = `(function(){try{var t=localStorage.getItem("vper-theme")||"dark";if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${fontBody.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
