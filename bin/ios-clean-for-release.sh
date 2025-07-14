#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

./clean-metro-cache.sh

echo "🔄 Cleaning iOS build..."
cd ../ios
xcodebuild clean -workspace fittedcloset.xcworkspace -scheme fittedcloset -configuration Release
cd ../bin
