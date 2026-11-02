import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Logo and project image uploads go through server actions (default limit 1 MB).
    // Vercel caps a request at 4.5 MB, so keep under that.
    serverActions: { bodySizeLimit: "4mb" },
  },
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
