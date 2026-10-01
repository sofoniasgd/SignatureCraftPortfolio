#!/usr/bin/env bash
# Signature Craft — local preview server for WSL / Linux / macOS (needs python3)
# From the project folder:   bash serve.sh          (or: bash serve.sh 8080)
# Then open http://localhost:5173/ in your Windows browser. Ctrl+C to stop.
PORT="${1:-5173}"
cd "$(dirname "$0")" || exit 1
echo ""
echo "  Signature Craft is live at:  http://localhost:$PORT/"
echo "  Press Ctrl+C to stop."
echo ""
exec python3 -m http.server "$PORT" --bind 0.0.0.0
