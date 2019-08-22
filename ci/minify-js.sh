#!/usr/bin/env bash

cd "$(dirname ${0})/../"

function minify()
{
    filename=$1
    min_filename="./static/${filename%.js}.min.js"
    curl -X POST -s --data-urlencode `cat ${filename}` https://javascript-minifier.com/raw > "${min_filename}"
}

for filename in ./js/*.js; do
    minify $filename
done