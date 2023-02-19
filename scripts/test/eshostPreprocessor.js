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

function shardPreprocessor(test, index) {
  if (!enableSharding) {
    return test;
  }

  const targetShard = index % shardTotal;
  if (test.relative === "built-ins/Array/is-a-constructor.js") {
    debug(JSON.stringify({ shardIndex, shardTotal, targetShard, index }));
  }
  if (shardIndex === targetShard) {
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
