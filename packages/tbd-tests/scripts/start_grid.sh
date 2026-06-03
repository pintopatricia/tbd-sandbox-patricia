#!/bin/bash

wait_for_ready () {
    for i in {1..120}
    do
        echo "[${i}/120s] Polling for ready state..."
        RESPONSE=$(curl -f -s 'http://localhost:4444/status' | jq '.value.ready')
        if [ ! -z "$RESPONSE" ]; then
            if ($RESPONSE)
            then
                echo "Local grid running"
                exit 0
            fi
        fi
        sleep 1
    done
    echo "Grid did not successfully start"
    exit 1
} 

RELATIVE_PATH=$(dirname "$0")
docker-compose -f "${RELATIVE_PATH}/docker-compose.grid.yml" up -d
if [ $? -eq 1 ]
then
    echo "Failed to start Docker container"
    exit 1
fi
wait_for_ready