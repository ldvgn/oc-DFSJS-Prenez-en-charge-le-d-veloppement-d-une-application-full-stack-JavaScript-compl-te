import type { CoverageReportOptions } from "monocart-coverage-reports";

/** Whether the e2e run collects coverage (`npm run test:e2e:coverage`). */
export const isCoverage = !!process.env.E2E_COVERAGE;

/**
 * Shared Monocart options: the browser chunks are unpacked through their
 * source maps into a per-file report of the front-end sources.
 */
export const coverageOptions: CoverageReportOptions = {
  name: "MDD E2E Coverage",
  outputDir: "./coverage/e2e",
  reports: ["v8", "console-details", "lcovonly"],
  entryFilter: (entry) => entry.url.includes("/_next/static/chunks/"),
  sourceFilter: (sourcePath) =>
    /^(app|components|lib|modules)\/.*\.tsx?$/.test(sourcePath) &&
    !sourcePath.startsWith("components/ui/"),
  sourcePath: (filePath) => filePath.replace(/^.*\[project\]\//, ""),
};
