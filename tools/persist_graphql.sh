#!/bin/bash

# Config (paths relative to the root folder)
BFF_SPEC="apps/bf/tbd-mobile-site.spec"

# Get versions

BFF_VERSION=$(grep bf-tbd-http-bff-gql-v $BFF_SPEC | head -1 | awk -F '= ' '{ print $2 }' | awk -F '-' '{ print $1 }')
# BFF_VERSION=$(node -pe "require('$BFF_PACKAGE').version")
BFF_MAJOR_VERSION=$(echo $BFF_VERSION | awk -F \. {'print $1'})
EXTRACTED_QUERIES_STORE_FILE="extracted_queries_v$BFF_MAJOR_VERSION.json"
EXTRACTED_QUERIES_BFF_FILE="extracted_queries.json"
PQL_CATALOGUE_CONFIG="pql-manifest-catalogue.config.js"
PQL_APOLLO_CONFIG="pql-manifest-apollo.config.js"

if [[ -z "${LOCAL_BFF_SCHEMA_PATH}" ]]; then
  BFF_SCHEMA_PATH="https://github.com/Flutter-Global/tbd-bff/releases/download/%40ppb%2Fbf-tbd-http-bff-gql%40$BFF_VERSION/schema.graphql"
else
  if [ ! -f "${LOCAL_BFF_SCHEMA_PATH}" ]; then
        exit "The file specified for LOCAL_BFF_SCHEMA_PATH does not exist - ${schema}. Please check the path and try again."
  fi

  BFF_SCHEMA_PATH="${LOCAL_BFF_SCHEMA_PATH}"
fi

# Gets -o argument
while getopts o: flag
do
    case "${flag}" in
        o) project=${OPTARG};;
    esac
done

# Defaults to invalid string
if [ -z $project ]
then
  project="invalid"
fi

# Prints usage docs
if [ $project != "store" ] && [ $project != "bff" ] && [ $project != "apollo" ]
then
  printf "Usage: persist_graphql.sh -o store|bff\n\n"
  printf "Options:\n"
  printf "  -o\tOutput project\t[required]\n\n"
  printf "The output project is mandatory."

  exit
fi

if [ $project == "store" ]
then
  # Generate queries for @pbb/tbd-store
  persist-graphql \
    -c "$PQL_CATALOGUE_CONFIG" \
    -s "$BFF_SCHEMA_PATH" \
    -o packages/tbd-store/clients/catalogue/$EXTRACTED_QUERIES_STORE_FILE -p true

  yarn run prettier --write packages/tbd-store/clients/catalogue/$EXTRACTED_QUERIES_STORE_FILE

  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed \
      -i '' 's/\"TBDN_CATALOGUE_VERSION\": \"v[0-9]*\"/\"TBDN_CATALOGUE_VERSION\": \"v'$BFF_MAJOR_VERSION'\"/' \
      apps/bf/native/app.config.json
    sed \
      -i '' 's/\"TBDN_CATALOGUE_VERSION\": \"v[0-9]*\"/\"TBDN_CATALOGUE_VERSION\": \"v'$BFF_MAJOR_VERSION'\"/' \
      apps/sbg/native/app.config.json
  else
    sed \
      -i 's/\"TBDN_CATALOGUE_VERSION\": \"v[0-9]*\"/\"TBDN_CATALOGUE_VERSION\": \"v'$BFF_MAJOR_VERSION'\"/' \
      apps/bf/native/app.config.json
    sed \
      -i 's/\"TBDN_CATALOGUE_VERSION\": \"v[0-9]*\"/\"TBDN_CATALOGUE_VERSION\": \"v'$BFF_MAJOR_VERSION'\"/' \
      apps/sbg/native/app.config.json
  fi
elif [ $project == "bff" ]
then
  # Generate queries for bf-tbd-http-bff-gql
  persist-graphql \
    -c "$PQL_CATALOGUE_CONFIG" \
    -s "$BFF_SCHEMA_PATH" \
    -o apps/bf-tbd-http-bff-gql/src/config/$EXTRACTED_QUERIES_BFF_FILE -p false

  yarn run prettier --write apps/bf-tbd-http-bff-gql/src/config/$EXTRACTED_QUERIES_BFF_FILE

  cp apps/bf-tbd-http-bff-gql/src/config/$EXTRACTED_QUERIES_BFF_FILE apps/tbd-http-webserver/lib/config
elif [ $project == "apollo" ]
then
  # Generate apollo queries
  yarn run generate-persisted-query-manifest -c "$PQL_APOLLO_CONFIG"
fi
