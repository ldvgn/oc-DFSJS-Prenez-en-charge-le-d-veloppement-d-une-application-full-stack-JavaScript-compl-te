import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    setupFiles: ["./tests/setup.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["{app,modules,lib,components}/**/*.test.{ts,tsx}"],
          exclude: ["**/*.int.test.*"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "jsdom",
          include: ["{app,modules,lib,components}/**/*.int.test.{ts,tsx}"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: ["modules/**", "app/**", "lib/**", "components/**"],
      exclude: [
        "**/*.test.*",
        "prisma/generated/**",
        "components/ui/**",
        "**/*.d.ts",
        "app/api/auth/**",
      ],
    },
  },
});
