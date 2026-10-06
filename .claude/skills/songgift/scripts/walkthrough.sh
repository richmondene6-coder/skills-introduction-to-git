#!/usr/bin/env bash
# Starts SongGift in demo mode (no keys), records a customer walkthrough, and saves
# screenshots plus SongGift-walkthrough.mp4. Usage: bash walkthrough.sh [output-dir]
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(cd "$HERE/../../../../songgift" && pwd)"
PORT="${PORT:-3005}"
OUT="${1:-$(mktemp -d)}"
WORK="$(mktemp -d)"
BACKUP=""
mkdir -p "$OUT"

up() { curl -s -o /dev/null --max-time 2 "$1"; }
cleanup() {
  [ -f "$WORK/app.pid" ] && kill -- "-$(cat "$WORK/app.pid")" 2>/dev/null
  for _ in $(seq 1 15); do up "http://localhost:$PORT" || break; sleep 1; done
  rm -rf "$APP_DIR/.data"
  [ -n "$BACKUP" ] && mv "$BACKUP" "$APP_DIR/.data"
}
trap cleanup EXIT

[ -x "$APP_DIR/node_modules/.bin/next" ] || { echo "Run 'npm install' in $APP_DIR first."; exit 1; }
up "http://localhost:$PORT" && { echo "Port $PORT is busy. Stop that server first (or set PORT=...)."; exit 1; }
if [ -d "$APP_DIR/.data" ]; then BACKUP="$WORK/data-backup"; mv "$APP_DIR/.data" "$BACKUP"; fi

# Demo mode: every key blank, so the app uses demo lyrics, skips payment and plays a test jingle.
(cd "$APP_DIR" && env \
  ANTHROPIC_API_KEY= ANTHROPIC_AUTH_TOKEN= ELEVENLABS_API_KEY= PAYSTACK_SECRET_KEY= RESEND_API_KEY= \
  UPSTASH_REDIS_REST_URL= UPSTASH_REDIS_REST_TOKEN= BLOB_READ_WRITE_TOKEN= \
  NEXT_PUBLIC_META_PIXEL_ID= NEXT_PUBLIC_TIKTOK_PIXEL_ID= \
  ADMIN_PASSWORD=walkthrough-demo NEXT_PUBLIC_SITE_URL="http://localhost:$PORT" \
  setsid bash -c "echo \$\$ > '$WORK/app.pid'; exec ./node_modules/.bin/next dev -p $PORT") > "$WORK/app.log" 2>&1 &

for _ in $(seq 1 120); do up "http://localhost:$PORT/terms" && break; sleep 1; done
up "http://localhost:$PORT/terms" || { echo "App didn't start:"; tail -20 "$WORK/app.log"; exit 1; }

APP_URL="http://localhost:$PORT" ADMIN_PASSWORD=walkthrough-demo node "$HERE/walkthrough.mjs" "$OUT" || exit 1
VIDEO="$(ls "$OUT"/*.webm 2>/dev/null | head -1)"
if [ -n "$VIDEO" ] && command -v ffmpeg >/dev/null; then
  ffmpeg -hide_banner -loglevel error -y -i "$VIDEO" -c:v libx264 -pix_fmt yuv420p -preset veryfast -crf 26 -movflags +faststart -an "$OUT/SongGift-walkthrough.mp4" && rm -f "$VIDEO"
fi
echo "Saved to $OUT:"; ls "$OUT"
