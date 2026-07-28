import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// GitHub Pages serves a project repo from /<repo>, so every URL needs that prefix.
// Set NEXT_PUBLIC_BASE_PATH in CI; leave it empty for local dev.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export — GitHub Pages has no Node server.
  output: "export",
  basePath,
  // Pages serves /about as /about/index.html, so emit directories.
  trailingSlash: true,
  images: {
    // No image optimizer without a server. Sources are already compressed WebP.
    unoptimized: true,
  },
  outputFileTracingExcludes: { "*": ["./_reference/**"] },
};

export default withNextIntl(nextConfig);
