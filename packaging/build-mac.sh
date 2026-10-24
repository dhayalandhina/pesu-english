#!/bin/bash
# Builds "Pesu English.app" (Apple Silicon, bundled Node) and a zip next to it.
#   usage: packaging/build-mac.sh [out-dir]
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$SRC/dist}"
NODE_VER="v24.21.0"
NODE_PKG="node-$NODE_VER-darwin-arm64"
CACHE="${PESU_CACHE:-/tmp/pesu-build-cache}"
APP="$OUT/Pesu English.app"
mkdir -p "$CACHE" "$OUT"

if [ ! -f "$CACHE/$NODE_PKG.tar.gz" ]; then
  curl -fsSL -o "$CACHE/$NODE_PKG.tar.gz" "https://nodejs.org/dist/$NODE_VER/$NODE_PKG.tar.gz"
  curl -fsSL -o "$CACHE/SHASUMS256-$NODE_VER.txt" "https://nodejs.org/dist/$NODE_VER/SHASUMS256.txt"
fi
( cd "$CACHE" && grep " $NODE_PKG.tar.gz\$" "SHASUMS256-$NODE_VER.txt" | sha256sum -c - )

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources/node/bin" "$APP/Contents/Resources/app"
cp "$SRC/packaging/Info.plist" "$APP/Contents/Info.plist"
cp "$SRC/packaging/mac-launcher.sh" "$APP/Contents/MacOS/Pesu English"
chmod 755 "$APP/Contents/MacOS/Pesu English"
cp "$SRC/packaging/AppIcon.icns" "$APP/Contents/Resources/AppIcon.icns"
tar -xzf "$CACHE/$NODE_PKG.tar.gz" -C "$CACHE"
cp "$CACHE/$NODE_PKG/bin/node" "$APP/Contents/Resources/node/bin/node"
cp "$CACHE/$NODE_PKG/LICENSE" "$APP/Contents/Resources/node/LICENSE"
chmod 755 "$APP/Contents/Resources/node/bin/node"

A="$APP/Contents/Resources/app"
cp -R "$SRC/server.mjs" "$SRC/package.json" "$SRC/lib" "$SRC/public" "$SRC/node_modules" "$A/"
[ -f "$SRC/package-lock.json" ] && cp "$SRC/package-lock.json" "$A/"
cp "$SRC/start-linux.sh" "$A/"
chmod 755 "$A/start-linux.sh"
sed 's/$/\r/' "$SRC/Start Pesu English (Windows).bat" > "$A/Start Pesu English (Windows).bat"
cp "$SRC/packaging/README-Setup.txt" "$A/README-Setup.txt"
# slim the SDK: source maps and browser builds are not used by the local server
find "$A/node_modules" -name "*.map" -delete
rm -rf "$A/node_modules/@google/genai/dist/web"

cp "$SRC/packaging/README-Setup.txt" "$OUT/README - Setup (Thanglish).txt"
( cd "$OUT" && rm -f Pesu-English-mac.zip && zip -qry Pesu-English-mac.zip "Pesu English.app" "README - Setup (Thanglish).txt" )
du -sh "$APP" "$OUT/Pesu-English-mac.zip"
