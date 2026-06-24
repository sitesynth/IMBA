import type { NextConfig } from "next";

const API_ORIGIN = process.env.IMBA_API_URL ?? "https://api.imba.live";

const nextConfig: NextConfig = {
  // imba.run is a Bunny CDN mirror that proxies to www.imba.live. The browser
  // sends Origin: imba.run while the proxy rewrites Host to www.imba.live, which
  // fails Next.js's server-action CSRF origin check (→ 500 on every action).
  // Allowlist the mirror origins so server actions work through the proxy.
  experimental: {
    serverActions: {
      allowedOrigins: ['imba.run', 'www.imba.live', 'imba.live'],
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_ORIGIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
