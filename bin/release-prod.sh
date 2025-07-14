#!/bin/bash

./prepare-release-prod.sh

echo "✅ Building for release..."

cd ../android

./gradlew assembleRelease

cd ../bin
