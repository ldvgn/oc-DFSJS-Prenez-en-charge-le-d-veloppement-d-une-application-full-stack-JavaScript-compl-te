import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Lets the e2e coverage report map the browser chunks back to the sources */
  productionBrowserSourceMaps: !!process.env.E2E_COVERAGE,
};

export default nextConfig;
