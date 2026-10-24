#!/bin/bash
# Pesu English (macOS): starts the local server with the bundled Node and opens the app window.
HERE="$(cd "$(dirname "$0")" && pwd)"
RES="$(cd "$HERE/../Resources" && pwd)"
APP_JS="$RES/app/server.mjs"
NODE="$RES/node/bin/node"
DATA="$HOME/Library/Application Support/Pesu English"
mkdir -p "$DATA"

if ! "$NODE" -v >/dev/null 2>&1; then
  # bundled Node can't run here (e.g. Intel Mac): use one installed on this Mac
  NODE=""
  for c in /opt/homebrew/bin/node /usr/local/bin/node; do
    if [ -x "$c" ]; then NODE="$c"; break; fi
  done
  if [ -z "$NODE" ] && [ -d "$HOME/.nvm/versions/node" ]; then
    NODE="$(ls -d "$HOME"/.nvm/versions/node/v*/bin/node 2>/dev/null | tail -n 1)"
  fi
  if [ -z "$NODE" ]; then
    NODE="$(/bin/zsh -ilc 'command -v node' 2>/dev/null | tail -n 1)"
  fi
fi

if [ -z "$NODE" ] || ! "$NODE" -v >/dev/null 2>&1; then
  /usr/bin/osascript -e 'display dialog "Pesu English start aagala: Node.js kidaikkala. nodejs.org-la install pannitu thirumba open pannunga." buttons {"OK"} default button 1 with title "Pesu English" with icon caution' >/dev/null 2>&1
  exit 1
fi

"$NODE" "$APP_JS" >>"$DATA/launcher.log" 2>&1
STATUS=$?
if [ $STATUS -ne 0 ]; then
  /usr/bin/osascript -e 'display dialog "Pesu English start aagala. Details: ~/Library/Application Support/Pesu English/server.log" buttons {"OK"} default button 1 with title "Pesu English" with icon caution' >/dev/null 2>&1
fi
exit $STATUS
