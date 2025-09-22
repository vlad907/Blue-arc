import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",             // Required for static export
  images: {
    unoptimized: true,          // Disable image optimizer for GitHub Pages
  },
  trailingSlash: true,          // Ensures proper routing on Pages
  basePath: "/Blue-arc",
  assetPrefix: "/Blue-arc/",
};

export default nextConfig;
