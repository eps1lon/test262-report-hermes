# test262-report-hermes

## TODO

- strict vs non strict?
- trim down report-key
- ACTUAL PAGE

## Playground

```bash
$ DEBUG="this:*" SHARD_INDEX=0 SHARD_TOTAL=1 yarn test262-harness --host-type hermes --host-path hermes-releases/RNv0.71.0/hermes --test262-dir test262 --reporter json --reporter-keys result,relative,attrs.features,scenario --preprocessor scripts/test/eshostPreprocessor.js --threads 16 "test262/test/**/*.js" > data/RNv0.71.0/rawresult.combined.json
```
