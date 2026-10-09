import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mismo criterio que misitio: los gates de TS/ESLint no se apagan "por ahora".
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  // Lab /proceso: SVGLoader y BufferGeometryUtils viven en three/addons.
  transpilePackages: ["three"],
  // Las láminas de marca vivían en /design-preview (nombre de herramienta
  // interna). Ahora son /marca; los links viejos que ya circularon siguen
  // funcionando.
  async redirects() {
    return [
      { source: "/design-preview", destination: "/marca/sistema", permanent: true },
      { source: "/design-preview/:path*", destination: "/marca/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
