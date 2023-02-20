# Contributing

Haven't made up my mind how I want to maintain it. Please just reach out by opening an issue and we can talk about it :)

## Playground

```bash
$ yarn test262-harness --host-type hermes --host-path hermes-releases/RNv0.71.0/hermes --test262-dir test262 --reporter json --reporter-keys result,relative,attrs.features,scenario --preprocessor scripts/test/eshostPreprocessor.js --threads 16 "test262/test/language/function-code/10.4.3-1-102gs.js" 

$ DEBUG="this:*" SHARD_INDEX=0 SHARD_TOTAL=1 yarn test262-harness --host-type hermes --host-path hermes-releases/RNv0.71.0/hermes --test262-dir test262 --reporter json --reporter-keys result,relative,attrs.features,scenario --preprocessor scripts/test/eshostPreprocessor.js --threads 16 "test262/test/language/**/*.js" > hermes-releases/RNv0.71.0/report/test262-report.combined.dev.json
```
