const fs = require("node:fs/promises");
const path = require("node:path");
const process = require("node:process");
const debug = require("debug")("this:reportPostprocess");
const { compressCombinedReport } = require("./compressReport");

async function main() {
  const reportShardsRoot = path.resolve(process.cwd(), process.argv[2]);
  const outputRoot = path.resolve(process.cwd(), process.argv[3]);
  debug(`shardRoot: ${String(reportShardsRoot)}`);
  debug(`outputRoot: ${String(outputRoot)}`);

  const reportShardsDirectories = await fs.readdir(reportShardsRoot);
  const reportShardsFilepaths = reportShardsDirectories.map(
    (shardDirectory) => {
      const [, , shardIndex] = shardDirectory.split("-");
      return path.join(
        reportShardsRoot,
        shardDirectory,
        `test262-report.${shardIndex}.json`
      );
    }
  );
  const combinedReport = [];
  await Promise.all(
    reportShardsFilepaths.map(async (shardFilepath) => {
      const test262ShardJson = await fs.readFile(shardFilepath, {
        encoding: "utf-8",
      });
      const test262Shard = JSON.parse(test262ShardJson);
      combinedReport.push(...test262Shard);
    })
  );
  debug(
    `combined ${reportShardsFilepaths.length} shards into ${combinedReport.length} tests`
  );
  combinedReport.sort((a, b) => {
    if (a.relative === b.relative) {
      return a.scenario.localeCompare(b.scenario);
    }
    return a.relative.localeCompare(b.relative);
  });
  const compressedReport = compressCombinedReport(combinedReport);

  const combinedDevOutputPath = path.join(
    outputRoot,
    "test262-report.combined.dev.json"
  );
  debug(`combined output written to ${combinedDevOutputPath}`);
  const compressedOutputPath = path.join(
    outputRoot,
    "test262-report.compressed.json"
  );
  debug(`compressed output written to ${compressedOutputPath}`);
  const compressedDevOutputPath = path.join(
    outputRoot,
    "test262-report.compressed.development.json"
  );
  debug(`compressed dev output written to ${compressedDevOutputPath}`);

  await fs.mkdir(path.dirname(combinedDevOutputPath), { recursive: true });
  await Promise.all([
    fs.writeFile(
      combinedDevOutputPath,
      JSON.stringify(combinedReport, null, 2)
    ),
    fs.writeFile(compressedOutputPath, JSON.stringify(compressedReport)),
    fs.writeFile(
      compressedDevOutputPath,
      JSON.stringify(compressedReport, null, 2)
    ),
  ]);
}

main();
