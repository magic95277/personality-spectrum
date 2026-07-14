import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] || "personality-spectrum";
const basePath = isGitHubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages only serves the static app. Cloudflare-specific starter files
  // are validated by the Sites build instead of Next's static export.
  typescript: {
    ignoreBuildErrors: isGitHubPages,
  },
};

export default nextConfig;
