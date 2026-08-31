import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Leaflet needs these image files served statically
  // They're in node_modules/leaflet/dist/images — no extra config needed
  // because Next.js serves public/ and imports handle the rest.
};

export default nextConfig;
