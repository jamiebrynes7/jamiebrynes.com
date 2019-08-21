#!/bin/bash

set -e

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
  echo "Set the GITHUB_WORKSPACE env variable."
  exit 1
fi

if [[ -z "${GITHUB_REPOSITORY}" ]]; then
  echo "Set the GITHUB_REPOSITORY env variable."
  exit 1
fi

cd "${GITHUB_WORKSPACE}/_kudos"

echo "----> Building Rust binary"
cargo build --release 

echo "----> Build is complete. Zipping result."
zip -j bootstrap.zip ./x86_64-unknown-linux-musl/release/bootstrap