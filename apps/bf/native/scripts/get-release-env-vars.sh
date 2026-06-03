#!/bin/bash

echo "Setting up environment variables for Android release build..."

# Prompt for AD username and password
read -p "Enter your AD username: " AD_USERNAME
read -s -p "Enter your AD password: " AD_PASSWORD

BASE_URL="https://vault-prd.prd.betfair/v1"

# Login to obtain auth token
echo
echo "Logging in to Vault..."
AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/ldap/login/$AD_USERNAME" \
  -H "Content-Type: application/json" \
  -d '{"password": "'$AD_PASSWORD'"}' \
  --insecure)

# Extract the auth token from the response
AUTH_TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.auth.client_token // empty')

if [ -z "$AUTH_TOKEN" ]; then
  echo
  echo "Authentication failed. Please check your credentials."
  exit 1
fi

echo
echo "Authentication successful. Fetching environment variables..."

# Fetch secrets from Vault
VAULT_RESPONSE=$(curl -s -X GET "$BASE_URL/tla_tbdn/data/jenkins" \
  -H "X-Vault-Token: $AUTH_TOKEN" \
  --insecure | jq -r '.data.data // empty')

if [ -z "$VAULT_RESPONSE" ]; then
  echo "Error: Failed to fetch or parse secrets from Vault."
  exit 1
fi

# Clean and validate the VAULT_SECRETS response
VAULT_SECRETS=$(echo "$VAULT_RESPONSE" | tr -d '\000-\037')

# Fetch environment variables using the cleaned response
ANDROID_UPLOAD_STORE_PW=$(echo "$VAULT_SECRETS" | jq -r '.androidUploadStorePw // empty')

if [ "$VARIANT" == "betfairBrazilRelease" ] || [ "$VARIANT" == "playReleaseBrazil" ]; then
  RELEASE_KEYSTORE=$(echo "$VAULT_SECRETS" | jq -r '.releaseBrazilKeystore // empty')
  ANDROID_KEYSTORE_ALIAS=$(echo "$VAULT_SECRETS" | jq -r '.releaseBrazilKeystoreAlias // empty')
else
  RELEASE_KEYSTORE=$(echo "$VAULT_SECRETS" | jq -r '.releaseKeystore // empty')
  ANDROID_KEYSTORE_ALIAS=$(echo "$VAULT_SECRETS" | jq -r '.releaseKeystoreAlias // empty')
fi

FB_APP_ID=$(echo "$VAULT_SECRETS" | jq -r '.facebook_app_id // empty')

FB_APP_TOKEN=$(echo "$VAULT_SECRETS" | jq -r '.facebook_app_token // empty')

if [ -z "$FB_APP_ID" ]; then
  echo "Failed to set FB_APP_ID."
  exit 1
fi

if [ -z "$FB_APP_TOKEN" ]; then
  echo "Failed to set FB_APP_TOKEN."
  exit 1
fi

# Replace Facebook app ID and token in configs.xml
sed -i '' "s/FACEBOOK_APP_ID/$FB_APP_ID/g" ./android/app/src/main/res/values/configs.xml
sed -i '' "s/FACEBOOK_APP_TOKEN/$FB_APP_TOKEN/g" ./android/app/src/main/res/values/configs.xml

# Validate responses
if [ -z "$ANDROID_UPLOAD_STORE_PW" ]; then
  echo "Failed to set ANDROID_UPLOAD_STORE_PW."
  exit 1
fi

if [ -z "$RELEASE_KEYSTORE" ]; then
  echo "Failed to set RELEASE_KEYSTORE."
  exit 1
fi

if [ -z "$ANDROID_KEYSTORE_ALIAS" ]; then
  echo "Failed to set ANDROID_KEYSTORE_ALIAS."
  exit 1
fi

# Export environment variables
echo
echo "Exporting environment variables..."
# These exports are required by gradle and CI. They cannot be renamed or removed!
export ANDROID_UPLOAD_STORE_PW="$ANDROID_UPLOAD_STORE_PW"
export RELEASE_KEYSTORE="$RELEASE_KEYSTORE"
export ANDROID_KEYSTORE_ALIAS="$ANDROID_KEYSTORE_ALIAS"

echo
echo "Environment variables set successfully."


# Decode and store the keystore
echo "Validating and saving the keystore..."
if ! echo "$RELEASE_KEYSTORE" | base64 --decode > ./android/app/release.keystore 2>/dev/null; then
  echo "Error: RELEASE_KEYSTORE is not valid base64."
  exit 1
fi

echo
echo "Keystore saved to ./android/app/release.keystore."
