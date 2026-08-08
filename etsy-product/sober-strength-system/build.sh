#!/usr/bin/env bash
# Renders the source HTML to print-ready PDF using the local Chromium build.
# Usage: ./build.sh
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHROME="${CHROME:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}"

if [ ! -x "$CHROME" ]; then
  echo "Chromium not found at $CHROME — set CHROME=/path/to/chrome" >&2
  exit 1
fi

mkdir -p "$DIR/build"

render() {
  local src="$1" out="$2"
  echo "Rendering $(basename "$src") -> $(basename "$out")"
  "$CHROME" --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="$out" "file://$src" 2>/dev/null
}

render "$DIR/src/program.html"    "$DIR/build/Sober-Strength-System-Program.pdf"
render "$DIR/src/start-here.html" "$DIR/build/START-HERE-Read-Me-First.pdf"

python3 "$DIR/src/make_tracker.py"

echo "Done. Files in $DIR/build:"
ls -la "$DIR/build"
