const childProcess = require("child_process");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const process = require("process");
const { promisify } = require("util");

const exec = promisify(childProcess.exec);

// Replicates CI for a single shard. Can be slow.

const hermesRelease = "RNv0.71.0";
// CPUs used is shardTotal * maxThreads
const shardTotal = 1000; // Math.floor(os.cpus().length / 2);
const maxThreads = 2;

async function test(shard) {
  const maxWorkers = Math.floor(os.cpus().length / 2);
  const command = [
    "yarn",
    "test262-harness",
    "--host-type",
    "hermes",
    "--host-path",
    `hermes-releases/${hermesRelease}/hermes`,
    "--preprocessor",
    "scripts/test/eshostPreprocessor.js",
    "--reporter",
    "json",
    "--reporter-keys",
    "result,relative,attrs.features,scenario",
    "--test262-dir",
    "test262",
    "--threads",
    maxThreads,
    "--timeout",
    "60000",
    '"test262/test/**/*.js"',
  ].join(" ");
  const env = {
    ...process.env,
    SHARD_INDEX: shard,
    SHARD_TOTAL: shardTotal,
  };

  const { stdout, stderr } = await exec(command, { env });

  console.log(stderr);
  await fs.emptyDir(`test262-report-shards/test262-report-${shard}`);
  await fs.writeFile(
    path.resolve(
      `test262-report-shards/test262-report-${shard}/test262-report.${shard}.json`
    ),
    stdout
  );
}

async function main() {
  await fs.emptyDir("test262-report-shards");

  await Promise.all([test(0)]);

  const command = [
    "node",
    "scripts/test/reportPostprocess.js",
    "test262-report-shards",
    `"hermes-releases/${hermesRelease}/report"`,
  ].join(" ");
  await exec(command);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
