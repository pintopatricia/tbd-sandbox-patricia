#!/bin/bash
cd "$(dirname "$0")/.." # run script in root directory

BRAND=$(echo "$2" | tr A-Z a-z) # makes brand lowercase

BRAND_CONFIG_TEMPLATES_PATH="apps/bf/web/config"
BRAND_CONFIG_PATH="apps/bf/web/"

echo ".................................................."
echo "  Generating Brand config files for $BRAND"
echo ".................................................."

export TITLE=$(jq -r '.TITLE' "$BRAND_CONFIG_TEMPLATES_PATH/${BRAND}/index.config.json")
export META_DESCRIPTION_CONTENT=$(jq -r '.META_DESCRIPTION_CONTENT' "$BRAND_CONFIG_TEMPLATES_PATH/${BRAND}/index.config.json")

# set "brand.config.json" file for webserver strand
if [ "$BRAND" = "bf" ] ;
then
    echo "writing $BRAND_CONFIG_TEMPLATES_PATH/${BRAND}/brand.config.json for $BRAND..."
    cp "$BRAND_CONFIG_TEMPLATES_PATH/${BRAND}/brand.config.json" "$BRAND_CONFIG_PATH/brand.config.json"
    
    echo "writing $BRAND_CONFIG_TEMPLATES_PATH/${BRAND}/assets for $BRAND..."
    cp -r "$BRAND_CONFIG_TEMPLATES_PATH/${BRAND}/assets/" "$BRAND_CONFIG_PATH/assets/"

    echo "writing $BRAND_CONFIG_TEMPLATES_PATH/${BRAND}/index.html for $BRAND..."
    envsubst < "$BRAND_CONFIG_TEMPLATES_PATH/common/index.template.html" > "$BRAND_CONFIG_PATH/index.temp.html" && mv "$BRAND_CONFIG_PATH/index.temp.html" "$BRAND_CONFIG_PATH/index.html"  
else
    echo "\n"
    echo "Brand not recognised, aborting."
fi
