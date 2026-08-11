import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mismo criterio que misitio: los gates de TS/ESLint no se apagan "por ahora".
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
