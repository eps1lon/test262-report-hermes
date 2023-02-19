const fs = require("node:fs/promises");
const path = require("node:path");
const process = require("node:process");

function compressCombinedReport(combined) {
  const compressed = {};
  for (const entry of combined) {
    let node = compressed;
    const keyPath = entry.relative.split("/");
    for (const key of keyPath) {
      if (!node[key]) {
        node[key] = {};
      }
      node = node[key];
    }

    // compressing keys goes from 7.5M to 6.8M
    // annoying to deal with and not measured if that has a runtime impact
    node.result = entry.result;
    node.attrs = entry.attrs;
    node.scenario = entry.scenario;
  }

  return compressed;
}

module.exports = { compressCombinedReport };

async function main() {
  const combinedPath = path.resolve(process.cwd(), process.argv[2]);
  const compressedPath = path.resolve(process.cwd(), process.argv[3]);

  const combined = require(combinedPath);
  const compressed = compressCombinedReport(combined);

  await fs.writeFile(compressedPath, JSON.stringify(compressed));
}

if (require.main === module) {
  main();
}
