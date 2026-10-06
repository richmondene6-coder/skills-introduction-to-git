#!/usr/bin/env bash
# Builds SongGift.zip for the owner: committed app code, a blank .env.local,
# START-HERE.md and MARKET-RESEARCH.md. Usage: bash package-zip.sh [output-dir]
set -eu
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../.." && pwd)"
OUT="${1:-$(mktemp -d)}"
STAGE="$(mktemp -d)"
mkdir -p "$OUT" "$STAGE/SongGift"

git -C "$REPO" archive HEAD songgift | tar -x -C "$STAGE/SongGift"
mv "$STAGE/SongGift/songgift" "$STAGE/SongGift/app"
cp "$REPO/songgift/.env.example" "$STAGE/SongGift/app/.env.local"
cp "$HERE/../package/START-HERE.md" "$STAGE/SongGift/START-HERE.md"
cp "$REPO/songgift/MARKET-RESEARCH.md" "$STAGE/SongGift/MARKET-RESEARCH.md"

# Refuse to package anything that looks like a real key.
if grep -rIlE "sk-ant-(api|usr|admin)[0-9a-z-]*[A-Za-z0-9_-]{20,}|sk_(live|test)_[A-Za-z0-9]{20,}|whsec_[A-Za-z0-9]{20,}" "$STAGE/SongGift"; then
  echo "Found what looks like a secret key in the files above. Not packaging."; exit 1
fi

rm -f "$OUT/SongGift.zip"
(cd "$STAGE" && zip -qr "$OUT/SongGift.zip" SongGift)
rm -rf "$STAGE"
echo "$OUT/SongGift.zip"
