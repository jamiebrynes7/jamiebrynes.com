#!/bin/bash

set -e -u -o pipefail

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
  echo "Set the GITHUB_WORKSPACE env variable."
  exit 1
fi

cd "${GITHUB_WORKSPACE}"

# Strip front end matter before spellchecking.
TMP_DIR=$(mktemp -d)

pushd content/blog > /dev/null
  for filename in ./*.md; do
    csplit -z -f split_ "${filename}" /+++/ {*} > /dev/null
    rm split_00
    mv split_01 "${TMP_DIR}/${filename}"
  done
popd > /dev/null

pushd "${TMP_DIR}" > /dev/null
  spellchecker \
      -f "./*.md" "!1970-01-01-mkdown-test.md" "!_index.md" \
      -l en-GB \
      -d "${GITHUB_WORKSPACE}/ci/dictionary"
popd > /dev/null