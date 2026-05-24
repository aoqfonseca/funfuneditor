#!/usr/bin/env bash
set -euo pipefail

TYPE="${1:-}"
if [[ "$TYPE" != "patch" && "$TYPE" != "minor" && "$TYPE" != "major" ]]; then
  echo "Usage: $0 patch|minor|major"
  exit 1
fi

CURRENT=$(cat VERSION | tr -d '[:space:]')
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

case "$TYPE" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
esac

NEXT="$MAJOR.$MINOR.$PATCH"

echo "$NEXT" > VERSION

# package.json
sed -i "s/\"version\": \"$CURRENT\"/\"version\": \"$NEXT\"/" package.json

# Cargo.toml (first occurrence only — the [package] version)
sed -i "0,/^version = \"$CURRENT\"/{s/^version = \"$CURRENT\"/version = \"$NEXT\"/}" src-tauri/Cargo.toml

# tauri.conf.json
sed -i "s/\"version\": \"$CURRENT\"/\"version\": \"$NEXT\"/" src-tauri/tauri.conf.json

echo "Bumped $CURRENT → $NEXT"
