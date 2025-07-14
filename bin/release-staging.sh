#!/bin/bash

./prepare-release-staging.sh

echo "✅ Building for release..."

cd ../android

./gradlew bundleRelease

cd ../bin
