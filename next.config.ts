import type { NextConfig } from "next";

const normalizeBasePath = (value?: string | null) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") return "";
  const leading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return leading.replace(/\/+$/, "");
};

const BASE_PATH =
  normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH) ||
  normalizeBasePath(process.env.BASE_PATH);

const nextConfig: NextConfig = {
  output: "export",             // Required for static export
  images: {
    unoptimized: true,          // Disable image optimizer for GitHub Pages
  },
  trailingSlash: true,          // Ensures proper routing on Pages
  ...(BASE_PATH
    ? {
        basePath: BASE_PATH,
        assetPrefix: `${BASE_PATH}/`,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH ?? "",
  },
};

export default nextConfig;
