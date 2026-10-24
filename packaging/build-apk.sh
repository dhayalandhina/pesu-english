#!/usr/bin/env bash
# Builds Pesu-English.apk: Android shell (android/) around the hosted phone edition. No Gradle needed.
#   ANDROID_BUILD_TOOLS=<dir with aapt2, d8, zipalign, apksigner>  ANDROID_JAR=<platforms/android-35/android.jar>
#   APK_KEYSTORE=<signing key, created on first run; keep it to sign later updates>  APK_KS_PASS=<its password>
# Usage: packaging/build-apk.sh [outdir]      (needs JDK 17+)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/dist}"
BT="${ANDROID_BUILD_TOOLS:?set ANDROID_BUILD_TOOLS}"
JAR="${ANDROID_JAR:?set ANDROID_JAR}"
KS="${APK_KEYSTORE:-$HOME/.pesu-english-release.jks}"
PASS="${APK_KS_PASS:?set APK_KS_PASS (keystore password)}"
W="$(mktemp -d)"
trap 'rm -rf "$W"' EXIT
mkdir -p "$OUT" "$W/classes"

"$BT/aapt2" compile --dir "$ROOT/android/res" -o "$W/res.zip"
"$BT/aapt2" link -I "$JAR" --manifest "$ROOT/android/AndroidManifest.xml" -o "$W/base.apk" "$W/res.zip"
javac -nowarn -Xlint:-options -source 11 -target 11 -encoding UTF-8 -classpath "$JAR" -d "$W/classes" $(find "$ROOT/android/src" -name '*.java')
"$BT/d8" --release --min-api 24 --lib "$JAR" --output "$W" $(find "$W/classes" -name '*.class')
cp "$W/base.apk" "$W/unsigned.apk"
(cd "$W" && zip -q unsigned.apk classes.dex)
"$BT/zipalign" -f -p 4 "$W/unsigned.apk" "$W/aligned.apk"
if [ ! -f "$KS" ]; then
  keytool -genkeypair -keystore "$KS" -storetype PKCS12 -alias pesu -keyalg RSA -keysize 3072 -validity 10000 \
    -storepass "$PASS" -keypass "$PASS" -dname "CN=Pesu English, C=IN" >/dev/null
fi
"$BT/apksigner" sign --ks "$KS" --ks-key-alias pesu --ks-pass "pass:$PASS" --key-pass "pass:$PASS" --out "$OUT/Pesu-English.apk" "$W/aligned.apk"
"$BT/apksigner" verify "$OUT/Pesu-English.apk"
echo "APK ready: $OUT/Pesu-English.apk"
