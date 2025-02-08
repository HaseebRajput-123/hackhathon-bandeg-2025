import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enforces React best practices during development

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // Allow images from Sanity.io CDN
        pathname: "/images/**", // Match all image paths under /images/
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/api/:path*", // Apply headers to all API endpoints
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // Enable API response caching
          },
        ],
      },
    ];
  },
};

export default nextConfig;