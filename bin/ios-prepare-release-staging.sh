#!/bin/bash

./ios-clean-for-release.sh

echo "✅ Running environment setup script (set-env-staging.sh)..."
./set-env-staging.sh

echo "🚀 Environment cleaned and initialized for release build."
