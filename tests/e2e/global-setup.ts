import { execSync } from "node:child_process";

/**
 * Runs once before all e2e tests: resets the test database and seeds it.
 * So every run starts from the same clean data.
 */
export default function globalSetup() {
  const opts = { stdio: "inherit" as const, env: process.env };
  execSync("npx prisma migrate reset --force", opts);
  execSync("npx prisma db seed", opts);
}
