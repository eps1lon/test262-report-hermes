import Link from "next/link";
import * as React from "react";
import test262ReportSummary, { loadReport } from "../src/test262ReportSummary";

function TestResult({ test }) {
  if (test.result.pass) {
    return (
      <span className="text-green-900 p-1 border-green-700 border-2">
        Passing
      </span>
    );
  }

  return (
    <details>
      <summary>
        <span className="text-red-900 p-1 border-red-700 border-2">
          Failing
        </span>
      </summary>

      <pre>{String(test.result.message)}</pre>
    </details>
  );
}

async function fetchTestSource(path) {
  const relativePathOnGH = `test/${path.join("/")}`;
  const response = await fetch(
    `https://cdn.jsdelivr.net/gh/tc39/test262@main/${relativePathOnGH}`
  );
  if (!response.ok) {
    throw new Error(
      `${response.url}: ${response.status} ${response.statusText}`
    );
  }
  return response.text();
}

async function TestSource({ path }) {
  let source;
  try {
    source = await fetchTestSource(path);
  } catch (error) {
    return (
      <details>
        <summary>
          Failed to fetch source for <code>{path.join("/")}</code>
        </summary>

        <pre>{String(error.stack)}</pre>
      </details>
    );
  }

  return <pre>{String(source)}</pre>;
}

async function TestSummary({ path }) {
  const relativePathOnGH = `test/${path.join("/")}`;

  const [report, testSource] = await Promise.all([loadReport()]);
  let test = report;
  for (const key of path) {
    if (!(key in test)) {
      throw new Error(`${key} does not exist in one of ${Object.keys(test)}`);
    }
    test = test[key];
  }
  const testName = path[path.length - 1];

  // Server Error
  // SyntaxError: Unexpected token u in JSON at position 0
  // return undefined;
  // return <></>;

  return (
    <section className="py-1">
      <div>
        <TestResult test={test} />
      </div>
      <div>
        Features:
        <ul className="inline-block pl-2">
          {test.attrs.features?.length > 0
            ? test.attrs.features.map((attribute) => {
                return (
                  <li key={attribute} className="inline-block">
                    {attribute}
                  </li>
                );
              })
            : "∅"}
        </ul>
      </div>
      <div>Scenario: {test.scenario}</div>
      <details>
        <summary>Source code</summary>

        <React.Suspense fallback="loading source">
          <TestSource path={path} />
        </React.Suspense>
      </details>
      <Link
        href={`https://github.com/tc39/test262/blob/main/${relativePathOnGH}`}
      >
        {testName} on GitHub
      </Link>
    </section>
  );
}

async function SuiteSummary({ path }) {
  const { summary, hermesVersion } = await test262ReportSummary(path);

  return (
    <>
      <table className="p-2">
        <caption>test262 Report</caption>
        <thead></thead>
        <tbody>
          {Object.entries(summary).map(([key, summary]) => {
            const href = `/browse/${[...path, key].join("/")}`;
            return (
              <tr key={key}>
                <td>
                  <Link href={href}>{key}</Link> {summary.total} tests
                </td>
                <td>
                  <span
                    title={`${summary.passed} out of ${summary.total} passed`}
                  >
                    {((summary.passed / summary.total) * 100).toFixed(2)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default async function ReportSummary({ path }) {
  return path.length > 0 && path[path.length - 1].endsWith(".js") ? (
    <TestSummary path={path} />
  ) : (
    <SuiteSummary path={path} />
  );
}
