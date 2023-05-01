const debug = require("debug")("this:shard-processor");

const shardIndex = Number(process.env.SHARD_INDEX);
const shardTotal = Number(process.env.SHARD_TOTAL);

if (Number.isNaN(shardIndex)) {
  debug(`SHARD_INDEX is not set. Running all tests`);
} else if (Number.isNaN(shardTotal)) {
  debug(`SHARD_TOTAL is not set. Running all tests`);
} else {
  debug(`Handling shard ${shardIndex + 1}/${shardTotal}`);
}

const enableSharding = !Number.isNaN(shardIndex) && !Number.isNaN(shardTotal);

/**
 * @source https://stackoverflow.com/a/7616484/3406963
 */
function checksum(s) {
  var hash = 0,
    i,
    chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function shardPreprocessor(test) {
  if (!enableSharding) {
    return test;
  }

  // We need an index for each test that is stable across runs.
  // eshost preprocess have an "index" parameter but that is not stable across runs.
  // This won't result in an even distribution but it should be close enough.
  const index = checksum(test.relative);
  const targetShard = index % shardTotal;
  if (shardIndex === targetShard) {
    debug(
      JSON.stringify({
        targetShard,
        relative: test.relative,
        shardIndex,
        shardTotal,
        index,
      })
    );
    return test;
  } else {
    return null;
  }
}

module.exports = function eshostPreprocessor(initialTest, index) {
  let test = initialTest;

  for (const preprocess of [shardPreprocessor]) {
    test = preprocess(test, index);
    if (test === null) {
      break;
    }
  }

  return test;
};
