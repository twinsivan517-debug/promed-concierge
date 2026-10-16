import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/site";

const nextConfig: NextConfig = {
  /* Plain files for GitHub Pages, served under the repository's name: no server, so no image resizing. */
  output: "export",
  basePath: BASE_PATH,
  images: { unoptimized: true },
};

export default nextConfig;
