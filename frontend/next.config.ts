import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignore TypeScript errors during production build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during production build
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        // Only redirect to /welcome if the query param 'started' is missing
        missing: [
          {
            type: "query",
            key: "started",
          },
        ],
        destination: "/welcome",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
