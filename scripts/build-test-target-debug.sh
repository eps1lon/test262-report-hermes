#!/bin/sh -x
DIRNAME=$(dirname $(realpath -s $0));
WORKSPACE_ROOT=$(realpath -s "$DIRNAME/..");

rm -rf "$WORKSPACE_ROOT/hermes-debug";
cmake -S "$WORKSPACE_ROOT/hermes" -B "$WORKSPACE_ROOT/hermes-debug" -G Ninja;
cmake --build "$WORKSPACE_ROOT/hermes-debug"
