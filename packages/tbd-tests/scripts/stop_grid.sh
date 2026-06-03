#!/bin/bash

RELATIVE_PATH=$(dirname "$0")
docker-compose -f "${RELATIVE_PATH}/docker-compose.grid.yml" down
echo "Grid successfully shut down"
exit 0