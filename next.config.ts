import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // ❌ ELIMINAR exportación estática - las API routes necesitan servidor
  // output: 'export',
  // trailingSlash: true,
  
  assetPrefix: isProd ? '/turtle-conservation-app/' : '',
  basePath: isProd ? '/turtle-conservation-app' : '',
  images: {
    unoptimized: true
  },
  // ✅ Agregar rewrites para tu estructura de carpetas personalizada
  async rewrites() {
    return [
      {
        source: '/api/eventos/:path*',
        destination: '/api/API_routes/eventos/:path*',
      },
      {
        source: '/api/nidos/:path*',
        destination: '/api/API_routes/nidos/:path*',
      },
      {
        source: '/api/observaciones/:path*',
        destination: '/api/API_routes/observaciones/:path*',
      }
    ]
  },
};

export default nextConfig;