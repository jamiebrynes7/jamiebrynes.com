#!/bin/bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_FILE="$REPO_ROOT/data/github.json"

slugs=$(grep -rh '^githubSlug:' "$REPO_ROOT/content/projects/"*/index.md | sed 's/githubSlug: *//;s/"//g')

echo "{" > "$OUTPUT_FILE"

first=true
for slug in $slugs; do
  stars=$(gh api "repos/$slug" --jq '.stargazers_count')

  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> "$OUTPUT_FILE"
  fi

  printf '  "%s": %s' "$slug" "$stars" >> "$OUTPUT_FILE"
done

echo "" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

echo "Wrote star counts to $OUTPUT_FILE"
