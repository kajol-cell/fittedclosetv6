#!/bin/bash

./clean-for-release.sh

echo "✅ Running environment setup script (set-env-prod.sh)..."
./set-env-prod.sh

echo "🚀 Environment cleaned and initialized for release build."
