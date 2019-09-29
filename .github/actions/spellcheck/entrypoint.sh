#!/bin/bash

set -e -x

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
  echo "Set the GITHUB_WORKSPACE env variable."
  exit 1
fi

cd "${GITHUB_WORKSPACE}"

spellchecker \
    -f 'content/blog/*.md' '!content/blog/1970-01-01-mkdown-test.md' '!content/blog/_index.md' \
    -l en-GB \
    -d ci/dictionary