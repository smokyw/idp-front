#!/bin/sh
set -e

echo "Checking env vars"
if [ -z $NUXT_PUBLIC_API_BASE ]; then
    echo "NUXT_PUBLIC_API_BASE is not defined"
    exit 1
fi

echo "Replacing env vars"
grep -rl '###NUXT_PUBLIC_API_BASE###' . | xargs sed -i -e 's|###NUXT_PUBLIC_API_BASE###|'${NUXT_PUBLIC_API_BASE}'|g' || true

echo "Done"