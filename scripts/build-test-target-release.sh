#!/bin/sh
DIRNAME=$(dirname $(realpath -s $0));
WORKSPACE_ROOT=$(realpath -s "$DIRNAME/..");

rm -rf "$WORKSPACE_ROOT/hermes-release";
cmake -S "$WORKSPACE_ROOT/hermes" -B "$WORKSPACE_ROOT/hermes-release" -G Ninja -DCMAKE_BUILD_TYPE=Release;
cmake --build "$WORKSPACE_ROOT/hermes-release";
