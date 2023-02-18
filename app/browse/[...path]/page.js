import * as React from "react";
import Link from "next/link";
import ReportSummary from "@/components/ReportSummary";

export default async function BrowsePage({ params }) {
  return (
    <React.Fragment>
      <Link
        href={
          params.path.length > 1
            ? `/browse/${params.path.slice(0, -1).join("/")}`
            : "/"
        }
      >
        ..
      </Link>
      <ReportSummary path={params.path} />
    </React.Fragment>
  );
}
