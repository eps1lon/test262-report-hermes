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

    if (Object.keys(node).length === 0) {
      // compressing keys goes from 7.5M to 6.8M
      // annoying to deal with and not measured if that has a runtime impact
      node.strict = {};
      node.nonStrict = {};
      node.attrs = entry.attrs;
    }

    if (entry.scenario === "default") {
      node.nonStrict = entry.result;
    } else {
      node.strict = entry.result;
    }
  }

  return compressed;
}

module.exports = { compressCombinedReport };

async function main() {
  const combinedPath = path.resolve(process.cwd(), process.argv[2]);
  const compressedPath = path.resolve(process.cwd(), process.argv[3]);
  const compressedDevPath = path.resolve(process.cwd(), process.argv[4]);

  const combined = require(combinedPath);
  const compressed = compressCombinedReport(combined);

  await Promise.all([
    fs.writeFile(compressedPath, JSON.stringify(compressed)),
    fs.writeFile(compressedDevPath, JSON.stringify(compressed, null, 2)),
  ]);
}

if (require.main === module) {
  main();
}
