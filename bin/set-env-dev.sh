#!/usr/bin/env sh
cat ../env/env_default ../env/env_common > ../.env
./convert-env.sh
