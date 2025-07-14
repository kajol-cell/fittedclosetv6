#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

./clean-metro-cache.sh

echo "🧹 Cleaning Android build artifacts..."
cd ../android
./gradlew clean

echo "🗑️ Removing generated JS assets..."
rm -rf app/build/generated/assets/react

cd ../bin

