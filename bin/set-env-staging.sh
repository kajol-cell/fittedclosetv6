#!/usr/bin/env sh
cat ../env/env_staging ../env/env_common > ../.env
./convert-env.sh
