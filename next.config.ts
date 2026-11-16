import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Safety net: www and the .in domain permanently redirect to the primary domain.
  // (Also set these as redirects in Vercel → Domains; see README.)
  async redirects() {
    return ["www.swagatabanerjee.com", "swagatabanerjee.in", "www.swagatabanerjee.in"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://swagatabanerjee.com/:path*",
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default config;
