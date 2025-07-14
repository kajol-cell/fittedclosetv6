#!/bin/bash

echo "🔄 Cleaning Metro cache..."
rm -rf $TMPDIR/metro-cache || echo "No metro cache found in $TMPDIR"
rm -rf ../node_modules/.cache || echo "No cache in node_modules"
