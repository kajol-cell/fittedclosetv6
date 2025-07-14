#!/usr/bin/env sh

ENV_FILE="../.env"
PLIST_FILE="../ios/Environment.plist"
ANDROID_ENV_FILE="../android/environment.properties"

# 🧹 Clean old files
rm -f "$PLIST_FILE"
rm -f "$ANDROID_ENV_FILE"

echo "📄 Generating Environment.plist for iOS..."
echo '<?xml version="1.0" encoding="UTF-8"?>' >> "$PLIST_FILE"
echo '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">' >> "$PLIST_FILE"
echo '<plist version="1.0"><dict>' >> "$PLIST_FILE"

echo "📄 Generating environment.properties for Android..."
touch "$ANDROID_ENV_FILE"

while IFS='=' read -r key value; do
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)
  [[ -z "$key" ]] && continue
  echo "  <key>$key</key><string>$value</string>" >> "$PLIST_FILE"
  echo "$key=$value" >> "$ANDROID_ENV_FILE"
done < "$ENV_FILE"

echo '</dict></plist>' >> "$PLIST_FILE"

echo "✅ iOS plist written to $PLIST_FILE"
echo "✅ Android properties written to $ANDROID_ENV_FILE"
