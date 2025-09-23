import type { NextConfig } from "next";

const BASE_PATH = "/Blue-arc";

const nextConfig: NextConfig = {
  output: "export",             // Required for static export
  images: {
    unoptimized: true,          // Disable image optimizer for GitHub Pages
  },
  trailingSlash: true,          // Ensures proper routing on Pages
  basePath: BASE_PATH,
  assetPrefix: `${BASE_PATH}/`,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};

export default nextConfig;
