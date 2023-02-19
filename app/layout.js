import "./globals.css";

import Link from "next/link";
import test262ReportSummary from "../src/test262ReportSummary";

export default async function RootLayout({ children }) {
  const { hermesVersion } = await test262ReportSummary([]);

  return (
    <html>
      <head />
      <body>
        <header className="bg-hermes p-4 text-black">
          <Link
            href="/"
            className="no-underline text-black hover:text-black visited:text-black"
          >
            Hermes for React Native {hermesVersion.reactNativeVersion}{" "}
            <strong>Test262</strong> report
          </Link>
        </header>
        <main className="p-4">
          <section>{children}</section>
        </main>
        <footer></footer>
      </body>
    </html>
  );
}
