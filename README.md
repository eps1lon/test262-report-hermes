# test262-report-hermes

## TODO

- strict vs non strict?
- check-in built Hermes binary
- run in CI?
- trim down report-key
- ACTUAL PAGE

## Playground

```bash
$ DEBUG="this:*" SHARD_INDEX=0 SHARD_TOTAL=8 yarn test262-harness --host-type hermes --host-path hermes-release/bin/hermes --test262-dir test262 "test262/test/built-ins/Array/from/**/*.js" --reporter json --reporter-keys attrs,scenario,relative,result --preprocessor scripts/test/test262StreamShardPreprocessor.js --threads 2
```
