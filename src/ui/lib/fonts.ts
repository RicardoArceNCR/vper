import { Red_Hat_Display, IBM_Plex_Mono, League_Gothic } from "next/font/google";

export const fontBody = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--typography-family-body",
  display: "swap",
});

export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--typography-family-mono",
  display: "swap",
});

// Mismo choice que misitio (fonts.ts): League Gothic, un solo peso real (400)
// en Google Fonts. Copiado tal cual para que ambos proyectos compartan la
// misma identidad tipográfica de marca — ver nota en misitio sobre bold
// sintético si algún título necesita font-bold sobre font-display.
export const fontDisplay = League_Gothic({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--typography-family-display",
  display: "swap",
});
