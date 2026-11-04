import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Default list minus 3840: a full-bleed photo on a 2x screen otherwise jumps from 2048 to
    // 3840px, and decoding that mid-scroll drops frames. 2560 is plenty for these photos.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
