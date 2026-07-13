import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  basePath,
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  typedRoutes: true,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },
};

export default nextConfig;
