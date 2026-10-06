#!/usr/bin/env bash
# Runs the SongGift payment tests against a fake Paystack API, then cleans up.
# Usage (from anywhere): bash .claude/skills/songgift/scripts/test-payments.sh
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(cd "$HERE/../../../../songgift" && pwd)"
PORT="${PORT:-3005}"
MOCK_PORT="${MOCK_PORT:-4010}"
WORK="$(mktemp -d)"
BACKUP=""

up() { curl -s -o /dev/null --max-time 2 "$1"; }

cleanup() {
  for f in "$WORK"/*.pid; do [ -f "$f" ] && kill -- "-$(cat "$f")" 2>/dev/null; done
  for _ in $(seq 1 15); do up "http://localhost:$PORT" || break; sleep 1; done
  rm -rf "$APP_DIR/.data"
  [ -n "$BACKUP" ] && mv "$BACKUP" "$APP_DIR/.data"
}
trap cleanup EXIT

[ -x "$APP_DIR/node_modules/.bin/next" ] || { echo "Run 'npm install' in $APP_DIR first."; exit 1; }
# A server left running on these ports would answer instead of ours (with different settings).
up "http://localhost:$PORT" && { echo "Port $PORT is busy. Stop that server first (or set PORT=...)."; exit 1; }
up "http://localhost:$MOCK_PORT" && { echo "Port $MOCK_PORT is busy. Stop that server first (or set MOCK_PORT=...)."; exit 1; }

# Keep any existing local data safe; tests use a fresh .data folder.
if [ -d "$APP_DIR/.data" ]; then BACKUP="$WORK/data-backup"; mv "$APP_DIR/.data" "$BACKUP"; fi

# Each server runs in its own process group so cleanup can stop all of its children.
MOCK_PAYSTACK_PORT="$MOCK_PORT" setsid bash -c "echo \$\$ > '$WORK/mock.pid'; exec node '$HERE/mock-paystack.mjs'" > "$WORK/mock.log" 2>&1 &

# Explicit settings override anything in .env.local: never touch real Redis, Blob, email or music APIs.
(cd "$APP_DIR" && env \
  PAYSTACK_SECRET_KEY=sk_test_mock PAYSTACK_API_URL="http://localhost:$MOCK_PORT" \
  NEXT_PUBLIC_SITE_URL="http://localhost:$PORT" PROMO_CODES="FAMILY:100:1,MERRY20:20" \
  NEXT_PUBLIC_CURRENCY=USD NEXT_PUBLIC_PRICE_STANDARD=29 NEXT_PUBLIC_PRICE_DELUXE=49 \
  UPSTASH_REDIS_REST_URL= UPSTASH_REDIS_REST_TOKEN= BLOB_READ_WRITE_TOKEN= \
  ELEVENLABS_API_KEY= RESEND_API_KEY= ANTHROPIC_API_KEY= \
  NEXT_PUBLIC_META_PIXEL_ID= NEXT_PUBLIC_TIKTOK_PIXEL_ID= \
  setsid bash -c "echo \$\$ > '$WORK/app.pid'; exec ./node_modules/.bin/next dev -p $PORT") > "$WORK/app.log" 2>&1 &

for _ in $(seq 1 120); do up "http://localhost:$PORT/terms" && up "http://localhost:$MOCK_PORT/__inits" && break; sleep 1; done
up "http://localhost:$PORT/terms" || { echo "App didn't start:"; tail -20 "$WORK/app.log"; exit 1; }

APP_URL="http://localhost:$PORT" MOCK_URL="http://localhost:$MOCK_PORT" DATA_DIR="$APP_DIR/.data/orders" node "$HERE/payments-e2e.mjs"
STATUS=$?
sleep 2

# Every paid order must have been generated exactly once, even when callback and webhook raced.
DUPES=$(grep -a -o "generating [0-9] version(s) for order [a-z0-9]*" "$WORK/app.log" | awk '{print $NF}' | sort | uniq -c | awk '$1 > 1')
if [ -n "$DUPES" ]; then echo "FAIL  songs generated more than once:"; echo "$DUPES"; STATUS=1; else echo "PASS  every song generated exactly once"; fi
grep -a -E "^\s*(Error|TypeError)|\[checkout\]" "$WORK/app.log" | head -5
exit $STATUS
