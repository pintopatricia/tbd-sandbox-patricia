#!/bin/bash

# Check if all needed parameters are set
if ([ -z "$CF_AUTH_EMAIL" ] || [ -z "$CF_AUTH_TOKEN" ] || [ -z "$CF_ZONE" ] || [ -z "$CF_FILE" ]) then
   echo "Error: Missing CloudFlare configurations. (CF_ZONE/CF_AUTH_EMAIL/CF_AUTH_TOKEN/CF_FILE"
   exit 1;
fi

# Purge Cache
cloudFlare_result=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE/purge_cache" \
    -H "X-Auth-Email: $CF_AUTH_EMAIL" \
    -H "Authorization: Bearer $CF_AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"files":['\"${CF_FILE}\"']}')
echo $cloudFlare_result
echo "Done!"
