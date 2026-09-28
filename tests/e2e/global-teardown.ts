import { execSync } from "node:child_process";

/**
 * Runs once after all e2e tests: stops and removes the test database container.
 * So nothing is left running after the suite.
 */
export default function globalTeardown() {
  execSync("npm run db:test:down", { stdio: "inherit" });
}
