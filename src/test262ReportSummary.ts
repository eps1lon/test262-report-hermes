import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";

const HERMES_RELEASE = "RNv0.71.0";

interface PassedTest {
  pass: true;
}

interface FailedTest {
  pass: false;
  message: string;
}

export type TestResult = PassedTest | FailedTest;

export interface Test262Result {
  strict: TestResult;
  nonStrict: TestResult;
  attrs: {
    features: string[];
  };
}

interface Test262Report extends Array<Test262Report | Test262Result> {}

export async function loadReport(): Promise<Test262Report> {
  const reportModule = await import(
    `../hermes-releases/${HERMES_RELEASE}/report/test262-report.compressed.json`
  );

  return reportModule.default;
}

interface ReportSummary {
  total: number;
  passed: number;
  failed: number;
}

function addTally(partial: ReportSummary, add: ReportSummary) {
  partial.total += add.total;
  partial.passed += add.passed;
  partial.failed += add.failed;
  return partial;
}

function tallyTests(node: any): ReportSummary {
  if ("strict" in node && "attrs" in node && "nonStrict" in node) {
    const summary = {
      total: 0,
      passed: 0,
      failed: 0,
    };

    if ("pass" in node.strict) {
      summary.total += 1;
      summary.passed += node.strict.pass ? 1 : 0;
      summary.failed += node.strict.pass ? 0 : 1;
    }
    if ("pass" in node.nonStrict) {
      summary.total += 1;
      summary.passed += node.nonStrict.pass ? 1 : 0;
      summary.failed += node.nonStrict.pass ? 0 : 1;
    }

    return summary;
  }

  return Object.values(node).reduce<ReportSummary>(
    (tally, node) => {
      return addTally(tally, tallyTests(node));
    },
    { total: 0, passed: 0, failed: 0 }
  );
}

interface HermesVersion {
  createdAt: Date;
  reactNativeVersion: string;
  commit: string;
}

function parseHermesVersion(hermesVersionString: string): HermesVersion {
  const [hermesIdentifier, year, month, day, rnTag, commitHash] =
    hermesVersionString.split("-");
  const [, reactNativeVersion] = rnTag.match(/RNv(.*)/)!;

  return {
    createdAt: new Date(+year, +month, +day),
    reactNativeVersion,
    commit: commitHash,
  };
}

export default async function test262ReportSummary(
  testPath: string[]
): Promise<{
  summary: Record<string, ReportSummary>;
  hermesVersion: HermesVersion;
}> {
  const [report, hermesVersionString] = await Promise.all([
    loadReport(),
    fs.readFile(
      // https://github.com/vercel/next.js/discussions/32236
      path.resolve(
        process.cwd(),
        `./hermes-releases/${HERMES_RELEASE}/.hermesversion`
      ),
      {
        encoding: "utf-8",
      }
    ),
  ]);

  const hermesVersion = parseHermesVersion(hermesVersionString);

  let node = report;
  for (const key of testPath) {
    if (!(key in node)) {
      const error = new Error(
        `'${key}' does not exist. Should be one of ${Object.keys(node).join(
          ", "
        )}`
      );
      error.name = "NotFound";

      throw error;
    }
    // @ts-expect-error -- Just verified at runtime that `key` is in `node`
    node = node[key];
  }

  const summary = Object.fromEntries(
    Object.entries(node).map(([key, node]) => {
      return [key, tallyTests(node)];
    })
  );

  return { summary, hermesVersion };
}
