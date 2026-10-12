import type { MetadataRoute } from "next";

/**
 * Manifest para Android/Chrome ("Agregar a pantalla de inicio") y para quien lea
 * el ícono del sitio desde acá. Los PNG salen del mismo monograma que
 * src/app/icon.svg; el maskable deja la zona segura que Android recorta en
 * círculo. Hex en vez de tokens: un manifest no lee CSS.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VPER Media",
    short_name: "VPER",
    start_url: "/",
    display: "browser",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
