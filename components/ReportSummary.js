import Link from "next/link";
import * as React from "react";
import test262ReportSummary from "../src/test262ReportSummary";

export default async function ReportSummary({ path }) {
  const summary = await test262ReportSummary(path);

  return (
    <table>
      <thead></thead>
      <tbody>
        {Object.entries(summary).map(([key, summary]) => {
          const href =
            summary.total === 1
              ? `https://github.com/tc39/test262/blob/main/test/${[
                  ...path,
                  key,
                ].join("/")}`
              : `/browse/${[...path, key].join("/")}`;
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
  );
}
