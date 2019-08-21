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

cd "${GITHUB_WORKSPACE}/kudos"

echo "----> Building Rust binary"
cargo build --release --target x86_64-unknown-linux-musl

echo "----> Build is complete."
mkdir -p "${GITHUB_WORKSPACE}/.release"
cp ./target/x86_64-unknown-linux-musl/release/bootstrap "${GITHUB_WORKSPACE}/.release/"