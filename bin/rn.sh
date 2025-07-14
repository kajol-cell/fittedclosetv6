#!/usr/bin/env sh
stty -echoctl
cd ..
npm run $@
stty echoctl
