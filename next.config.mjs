import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
// GitHub Pages phục vụ dưới /<repo>; build local để trống.
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  transpilePackages: ["@erp/miniapp-ui"],
  outputFileTracingRoot: root,
};

export default nextConfig;
