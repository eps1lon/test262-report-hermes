import test262ReportSummary from "../../src/test262ReportSummary";

export default async function AboutPage() {
  const { hermesVersion } = await test262ReportSummary([]);

  return (
    <>
      <h1>About Hermes test262 report</h1>
      <dl>
        <dt>React Native version of bundled hermes</dt>
        <dd>{hermesVersion.reactNativeVersion}</dd>
      </dl>
    </>
  );
}
