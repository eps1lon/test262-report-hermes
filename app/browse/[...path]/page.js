import * as React from "react";
import Link from "next/link";
import ReportSummary from "@/components/ReportSummary";

export const dynamicParams = true;

export async function generateStaticParams() {
  // TODO: Why can't this be empty? https://github.com/vercel/next.js/issues/45850?
  return [{ path: ["language"] }];
}

export default async function BrowsePage({ params }) {
  return (
    <React.Fragment>
      <nav>
        <ol>
          <li className="inline-block px-1">
            <Link href="/">⌂ Test262 </Link>
          </li>
          {params.path.slice(0, -1).map((key, index) => {
            return (
              <React.Fragment key={key}>
                <li className="inline-block px-1" role="separator">
                  /
                </li>
                <li className="inline-block px-1">
                  <Link
                    href={`/browse/${params.path
                      .slice(0, index + 1)
                      .join("/")}`}
                  >
                    {key}
                  </Link>
                </li>
              </React.Fragment>
            );
          })}
          <li className="inline-block px-1" role="separator">
            /
          </li>
          <li className="inline-block px-1">
            {params.path[params.path.length - 1]}
          </li>
        </ol>
      </nav>

      <ReportSummary path={params.path} />
    </React.Fragment>
  );
}
