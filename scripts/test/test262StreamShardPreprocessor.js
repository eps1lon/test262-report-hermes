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

module.exports = function shardPreprocessor(test, index) {
  if (!enableSharding) {
    return test;
  }

  const targetShard = index % shardTotal;
  if (shardIndex === targetShard) {
    return test;
  } else {
    return null;
  }
};
