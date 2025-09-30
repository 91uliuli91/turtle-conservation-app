import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Para GitHub Pages: usar exportación estática
  output: 'export',
  trailingSlash: true,
  assetPrefix: isProd ? '/turtle-conservation-app/' : '',
  basePath: isProd ? '/turtle-conservation-app' : '',
  images: {
    unoptimized: true
  },
};

export default nextConfig;
