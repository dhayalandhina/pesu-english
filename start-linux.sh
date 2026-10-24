#!/bin/sh
# Pesu English (Linux): needs Node.js 20+ installed.
cd "$(dirname "$0")" || exit 1
exec node server.mjs "$@"
