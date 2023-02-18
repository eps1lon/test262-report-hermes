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
  if ("result" in node && "attrs" in node && "scenario" in node) {
    return {
      total: 1,
      passed: node.result.pass ? 1 : 0,
      failed: node.result.pass ? 0 : 1,
    };
  }

  return Object.values(node).reduce<ReportSummary>(
    (tally, node) => {
      return addTally(tally, tallyTests(node));
    },
    { total: 0, passed: 0, failed: 0 }
  );
}

export default async function test262ReportSummary(
  path: string[]
): Promise<Record<string, ReportSummary>> {
  const report = await import("./test262-report.json");
  let node = report;
  for (const key of path) {
    if (!(key in node)) {
      const error = new Error(
        `'${key}' does not exist. Should be one of ${Object.keys(node).join(
          ", "
        )}`
      );
      error.name = "NotFound";

      throw error;
    }
    node = node[key];
  }

  return Object.fromEntries(
    Object.entries(node).map(([key, node]) => {
      return [key, tallyTests(node)];
    })
  );
}
