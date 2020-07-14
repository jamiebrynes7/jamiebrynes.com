#!/usr/bin/env bash

if [[ "${CONTEXT}" == "production" ]]; then
    DEPLOY_URL="https://www.jamiebrynes.com"
fi

npm run build-css

curl -sL https://github.com/getzola/zola/releases/download/v0.11.0/zola-v0.11.0-x86_64-unknown-linux-gnu.tar.gz | tar zxv && ./zola build --base-url ${DEPLOY_URL}

npm run purge-cs