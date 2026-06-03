#!/bin/bash
cd "$(dirname "$0")/.." # run script in root directory

BRAND=$(echo "$2" | tr a-z A-Z) # makes brand uppercase, enabling lowercase params
WEBSERVER_ENV_CONFIG_TEMPLATES_PATH="apps/tbd-http-webserver/lib/config/env-templates"
WEBSERVER_ENV_CONFIG_FILE_PATH="apps/tbd-http-webserver/lib/config"

BFF_ENV_CONFIG_TEMPLATES_PATH="apps/bf-tbd-http-bff-gql/src/config/env-templates"
BFF_ENV_CONFIG_FILE_PATH="apps/bf-tbd-http-bff-gql/src/config"

if [ "$4" != "" ] ;
then
    ENV=$(echo "$4" | tr a-z A-Z) # makes environment uppercase, enabling lowercase params
else
    ENV="QA/PRD"
fi

echo ".................................................."
echo "  setting ENV files for $BRAND - $ENV environment  "
echo ".................................................."

# set "environment.json" file for tbd-http-webserver strand to the desired brand and environment
if [ "$BRAND" = "SBG" ] ;
then
    echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment-backend.json for $BRAND..."
    cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-sbg-backend.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment-backend.json"

    if [ "$ENV" = "NXT" ] ;
    then
        echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json for $BRAND $ENV..."
        cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-sbg.nxt.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json"
        cp "$BFF_ENV_CONFIG_TEMPLATES_PATH/environment-sbg.nxt.json" "$BFF_ENV_CONFIG_FILE_PATH/environment.json"
    elif [ "$ENV" = "QACMS" ] ;
    then
        echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json for $BRAND $ENV..."
        cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-sbg.qacms.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json"
        cp "$BFF_ENV_CONFIG_TEMPLATES_PATH/environment-sbg.nxt.json" "$BFF_ENV_CONFIG_FILE_PATH/environment.json"
    else
        echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json for $BRAND $ENV..."
        cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-sbg.qa.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json"
        cp "$BFF_ENV_CONFIG_TEMPLATES_PATH/environment-sbg.qa.json" "$BFF_ENV_CONFIG_FILE_PATH/environment.json"
    fi
elif [ "$BRAND" = "PS" ]; then
    echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment-backend.json for $BRAND..."
    cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-ps-backend.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment-backend.json"
    if [ "$ENV" = "NXT" ] ;
    then
        echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json for $BRAND $ENV..."
        cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-ps.nxt.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json"
        cp "$BFF_ENV_CONFIG_TEMPLATES_PATH/environment-ps.nxt.json" "$BFF_ENV_CONFIG_FILE_PATH/environment.json"
    else
        echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json for $BRAND $ENV..."
        cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-ps.qa.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json"
        cp "$BFF_ENV_CONFIG_TEMPLATES_PATH/environment-ps.qa.json" "$BFF_ENV_CONFIG_FILE_PATH/environment.json"
    fi
elif [ "$BRAND" = "PP" ]; then
    echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment-backend.json for $BRAND..."
    cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-pp-backend.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment-backend.json"
    if [ "$ENV" = "NXT" ] ;
    then
        echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json for $BRAND $ENV..."
        cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-pp.nxt.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json"
        cp "$BFF_ENV_CONFIG_TEMPLATES_PATH/environment-pp.nxt.json" "$BFF_ENV_CONFIG_FILE_PATH/environment.json"
    else
        echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json for $BRAND $ENV..."
        cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-pp.qa.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json"
        cp "$BFF_ENV_CONFIG_TEMPLATES_PATH/environment-pp.qa.json" "$BFF_ENV_CONFIG_FILE_PATH/environment.json"
    fi
elif [ "$BRAND" = "BF" ]; then
    echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment-backend.json for $BRAND..."
    cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-bf-backend.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment-backend.json"
    if [ "$ENV" = "NXT" ] ;
    then
        echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json for $BRAND $ENV..."
        cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-bf.nxt.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json"
        cp "$BFF_ENV_CONFIG_TEMPLATES_PATH/environment-bf.nxt.json" "$BFF_ENV_CONFIG_FILE_PATH/environment.json"
    elif [ "$ENV" = "QACMS" ] ;
    then
        echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json for $BRAND $ENV..."
        cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-bf.qacms.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json"
        cp "$BFF_ENV_CONFIG_TEMPLATES_PATH/environment-bf.nxt.json" "$BFF_ENV_CONFIG_FILE_PATH/environment.json"
    else
        echo "writing ./$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json for $BRAND $ENV..."
        cp "$WEBSERVER_ENV_CONFIG_TEMPLATES_PATH/environment-bf.qa.json" "$WEBSERVER_ENV_CONFIG_FILE_PATH/environment.json"
        cp "$BFF_ENV_CONFIG_TEMPLATES_PATH/environment-bf.qa.json" "$BFF_ENV_CONFIG_FILE_PATH/environment.json"
    fi
else
    echo "\n"
    echo "Brand not recognised, aborting."
fi
