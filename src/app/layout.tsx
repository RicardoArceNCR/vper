// La cadena de tokens (tokens.css → tokens-dark.css → theme-bridge.css →
// brand.css) ya NO se orquesta acá: vive entera dentro de globals.css como
// un único grafo de @import. Importar CSS desde un módulo JS lo manda a un
// chunk separado cuyo orden entre hojas decide el bundler, y eso rompía la
// cascada de brand.css en dev — ver el comentario largo en globals.css.
import "./globals.css";

import type { Metadata } from "next";
import { fontBody, fontMono } from "@ui/lib/fonts";

export const metadata: Metadata = {
  title: "VPER Media — No hacemos marketing, hacemos que tenga sentido.",
  description:
    "Campañas, contenido y experiencias que convierten. Estrategia de marca, diseño e impacto digital.",
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
