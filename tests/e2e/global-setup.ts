import { execSync } from "node:child_process";
import { CoverageReport } from "monocart-coverage-reports";
import { coverageOptions, isCoverage } from "./coverage";

/**
 * Runs once before all e2e tests: resets the test database and seeds it.
 * So every run starts from the same clean data.
 * With coverage, generates the report once all tests have added theirs.
 */
export default async function globalSetup() {
  const opts = { stdio: "inherit" as const, env: process.env };
  execSync("npx prisma migrate reset --force", opts);
  execSync("npx prisma db seed", opts);

  if (!isCoverage) return;

  const report = new CoverageReport(coverageOptions);
  report.cleanCache();

  return async () => {
    await report.generate();
  };
}
