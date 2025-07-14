#!/usr/bin/env sh
cat ../env/env_prod ../env/env_common > ../.env
./convert-env.sh
