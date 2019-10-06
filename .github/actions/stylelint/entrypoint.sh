#!/bin/sh

set -e -x

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
  echo "Set the GITHUB_WORKSPACE env variable."
  exit 1
fi

cd "${GITHUB_WORKSPACE}"

stylelint "sass/*.scss" "$@"