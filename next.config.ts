import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Para GitHub Pages: usar exportación estática
  output: 'export',
  trailingSlash: true,
  assetPrefix: isProd ? '/t-cnicas-algor-tmicas/' : '',
  basePath: isProd ? '/t-cnicas-algor-tmicas' : '',
  images: {
    unoptimized: true
  },
};

export default nextConfig;
