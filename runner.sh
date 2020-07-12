#!/usr/bin/env bash

set -e -u -o pipefail

if [[ -n "${DEBUG-}" ]]; then
  set -x
fi

# Define tasks here.

maybe_rebuild_docker() {
    local DOCKERFILE="${1}"
    local CONTEXT="${2}"
    local TAG="${3}"

    echo "Checking ${TAG}"

    if docker inspect "${TAG}" > /dev/null; then
        IMAGE_TS=$(docker inspect -f '{{ .Created }}' "${TAG}" | xargs date +%s -d)
        DOCKERFILE_TS=$(stat -c %Y "${DOCKERFILE}")

        if [[ $DOCKERFILE_TS > $IMAGE_TS ]]; then
            echo "Image outdated, building..."
            docker build --file "${DOCKERFILE}" --tag "${TAG}" "${CONTEXT}"
        else 
            echo "Skipping build"
        fi
    else 
        echo "Image does not exist yet, building.."
        docker build --file "${DOCKERFILE}" --tag "${TAG}" "${CONTEXT}"
    fi
}

build_docker() {
    spellcheck_docker
    zola_docker
}

spellcheck_docker() {
    maybe_rebuild_docker ./.github/actions/spellcheck/Dockerfile ./.github/actions/spellcheck spellcheck
}

zola_docker() {
    maybe_rebuild_docker ./.github/actions/zola/Dockerfile ./.github/actions/zola zola
}

serve() {
    zola_docker

    trap "echo \"Stopping zola..\" && docker kill zola > /dev/null" EXIT 

    docker run --rm \
        --name "zola" \
        -v "${CWD}:/github/" \
        -p 1111:1111 \
        -e GITHUB_WORKSPACE="//github" \
        -e ZOLA_COMMAND="serve --interface 0.0.0.0" \
        zola:latest
}

build() {
    zola_docker

    docker run --rm \
        --name "zola" \
        -v "${CWD}:/github/" \
        -e GITHUB_WORKSPACE="//github" \
        zola:latest
}

spellcheck() {
    spellcheck_docker

    docker run --rm \
        -v "${CWD}:/github/" \
        -e GITHUB_WORKSPACE="//github" \
        spellcheck:latest
}

lint() {
    spellcheck
}

premerge() {
    lint
    build
}

clean() {
    rm -rf ./public/
}

pushd "$(dirname "$0")" > /dev/null
    CWD="$(pwd -W)"
    eval "$@"
popd > /dev/null