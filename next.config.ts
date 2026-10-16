import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Plain files for GitHub Pages, served under the repository's name: no server, so no image resizing. */
  output: "export",
  basePath: "/promed-concierge",
  images: { unoptimized: true },
};

export default nextConfig;
