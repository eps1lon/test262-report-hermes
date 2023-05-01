import Link from "next/link";
import test262ReportSummary from "../../src/test262ReportSummary";

export const metadata = {
  title: "About Hermes test262 report",
};

export default async function AboutPage() {
  const { hermesVersion } = await test262ReportSummary([]);

  return (
    <>
      <h1 className="text-lg">About Hermes test262 report</h1>
      <p>
        Source code for this website and how data is collected:{" "}
        <Link href="https://github.com/eps1lon/test262-report-hermes">
          eps1lon/test262-report-hermes
        </Link>
      </p>
      <dl>
        <dt>React Native version of bundled Hermes</dt>
        <dd>{hermesVersion.reactNativeVersion}</dd>
        <dt>Hermes release date</dt>
        <dd>{hermesVersion.createdAt.toISOString().split("T")[0]}</dd>
        <dt>Hermes commit</dt>
        <dd>
          <Link
            href={`https://github.com/facebook/hermes/tree/${hermesVersion.commit}/`}
          >
            {hermesVersion.commit}
          </Link>
        </dd>
      </dl>
    </>
  );
}
