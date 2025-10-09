import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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