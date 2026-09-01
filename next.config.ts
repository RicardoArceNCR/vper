import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mismo criterio que misitio: los gates de TS/ESLint no se apagan "por ahora".
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  // Lab /proceso: SVGLoader y BufferGeometryUtils viven en three/addons.
  transpilePackages: ["three"],
};

export default nextConfig;
