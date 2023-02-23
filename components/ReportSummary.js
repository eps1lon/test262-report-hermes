import Link from "next/link";
import * as React from "react";
import test262ReportSummary, { loadReport } from "../src/test262ReportSummary";
import GracefulTestSource from "./GracefulTestSource";
import { setTimeout } from "timers/promises";

function TestResult({ label, result }) {
  if (result.pass) {
    return (
      <span className="text-green-900 p-1 border-green-700 border-2">
        {label} Passing
      </span>
    );
  }

  return (
    <details>
      <summary className="p-1">
        <span className="p-1 text-red-900 border-red-700 border-2">
          {label} Failing
        </span>
      </summary>

      <pre>{String(result.message)}</pre>
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
  const source = await fetchTestSource(path);

  return <pre>{String(source)}</pre>;
}

async function TestSummary({ path }) {
  const relativePathOnGH = `test/${path.join("/")}`;

  const [report] = await Promise.all([loadReport()]);
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
        {"pass" in test.strict && (
          <TestResult label="Strict mode" result={test.strict} />
        )}
        {"pass" in test.nonStrict && (
          <TestResult label="non-Strict mode" result={test.nonStrict} />
        )}
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
      <details>
        <summary>Source code</summary>

        <GracefulTestSource path={path}>
          <TestSource path={path} />
        </GracefulTestSource>
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
