import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray pnpm-lock.yaml in a parent
  // folder otherwise makes Next infer the wrong root, which can break the
  // Vercel build's file tracing.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
