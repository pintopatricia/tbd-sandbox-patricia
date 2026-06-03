i=0; while ! (curl -sSL -X POST "http://http-webserver-proxy:8081/api/" | grep -i "Cannot POST" || [ $i -gt 30 ]) >/dev/null 2>&1; do echo -n "."; sleep 1 && i=$((i+1)); done

if [ $i -gt 30 ]
then
    echo "ERROR: TIMEOUT WAITING FOR HTTP WEB SERVER."
    exit 1
fi

yarn run test:regression # Possibly add a report generation task after, that's why this .sh was created
