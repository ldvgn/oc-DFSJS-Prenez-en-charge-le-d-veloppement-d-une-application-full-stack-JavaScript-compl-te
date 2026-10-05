import { readFile } from "node:fs/promises";
import { test as base, expect, type CDPSession } from "@playwright/test";
import { CoverageReport } from "monocart-coverage-reports";
import { coverageOptions, isCoverage } from "./coverage";

const chunkPath = "/_next/static/chunks/";

type ScriptCoverage = {
  scriptId: string;
  url: string;
  functions: unknown[];
};

/**
 * Adds the JS coverage counted since the last call to the report.
 *
 * @param session - CDP session of the page
 * @param report - Coverage report of the run
 */
async function takeCoverage(session: CDPSession, report: CoverageReport) {
  const { result } = (await session.send("Profiler.takePreciseCoverage")) as {
    result: ScriptCoverage[];
  };
  const entries = await Promise.all(
    result
      .filter((script) => script.url.includes(chunkPath))
      .map(async (script) => ({
        ...script,
        source: await readFile(
          `.next/static/chunks/${script.url.split(chunkPath)[1]}`,
          "utf8",
        ),
      })),
  );
  if (entries.length) await report.add(entries);
}

/**
 * Playwright `test` whose `page` records the browser JS coverage of each test
 * (Chromium only) when the run collects coverage.
 */
export const test = base.extend({
  page: async ({ page, browserName }, provide) => {
    if (!isCoverage || browserName !== "chromium") return provide(page);

    const report = new CoverageReport(coverageOptions);
    const session = await page.context().newCDPSession(page);
    await session.send("Profiler.enable");
    await session.send("Profiler.startPreciseCoverage", {
      callCount: true,
      detailed: true,
    });
    // A full navigation drops the scripts of the previous document, so their
    // coverage is taken first (client-side navigations keep the document)
    const goto = page.goto.bind(page);
    page.goto = async (url, options) => {
      await takeCoverage(session, report);
      return goto(url, options);
    };

    await provide(page);

    await takeCoverage(session, report);
    await session.detach();
  },
});

export { expect };
