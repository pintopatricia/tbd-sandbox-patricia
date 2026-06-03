#!/bin/bash

VAULT_URL="https://vault-prd.prd.betfair/v1"

echo "Use your AD credentials. You're welcome."
read -rp "AD username: " ADU
read -rsp "AD password: " ADP
echo ""

# Basic validation
if [[ -z "$ADU" || -z "$ADP" ]]; then
    echo "\033[1;31mError: Username and Password cannot be empty.\033[0m"
    return 1 2>/dev/null || exit 1
fi

# Vault access
VAULT_TOKEN=$(curl -sSLf -H "X-Vault-Request: true" -X POST -d "{\"password\": \"${ADP}\"}" "${VAULT_URL}/auth/ldap/login/${ADU}" | sed -E 's/.*"client_token":"([^"]+)".*/\1/')

# Get Monterosa token from Vault
VAULT_RESPONSE=$(curl -sSLf -H "X-Vault-Token: ${VAULT_TOKEN}" "${VAULT_URL}/tla_tbd/data/common")

# Retrieve the monterosa token from the response
TOKEN_VALUE=$(echo "${VAULT_RESPONSE}" | sed -E "s/.*\"monterosa_token\":\"([^\"]+)\".*/\1/")

# Identify the user profile file
if [[ "$SHELL" == */bash ]]; then
  [ -f "$HOME/.bash_profile" ] && PROFILE_FILE="$HOME/.bash_profile" || PROFILE_FILE="$HOME/.bashrc"
elif [[ "$SHELL" == */zsh ]]; then
  PROFILE_FILE="$HOME/.zshrc"
else
  PROFILE_FILE="$HOME/.profile"
fi

# Check if MONTEROSA_TOKEN is set
if grep -qE "^(export )?MONTEROSA_TOKEN=" "$PROFILE_FILE"; then
  echo "MONTEROSA_TOKEN is already set in $PROFILE_FILE"
  read -p "Do you want to overwrite the existing value? [Y/n]: " confirm
  confirm=${confirm:-y}
  if [[ $confirm == [yY] ]]; then
        # Use sed to replace the existing line
        sed -i.bak -E "/^(export )?MONTEROSA_TOKEN=/d" "$PROFILE_FILE"
        echo "export MONTEROSA_TOKEN=\"$TOKEN_VALUE\"" >> "$PROFILE_FILE"
        echo "\033[1;32mMONTEROSA_TOKEN value updated.\033[0m"
    else
        echo "\033[1;33mAction canceled. No changes made.\033[0m"
    fi
else
  echo "Adding MONTEROSA_TOKEN to $PROFILE_FILE..."
  echo "export MONTEROSA_TOKEN=\"$TOKEN_VALUE\"" >> "$PROFILE_FILE"
  echo "\033[1;32mSuccessfully added.\033[0m"
fi

# Setting keychain for native access
node ./tools/ci/monterosa-gitlab-access.js "$TOKEN_VALUE"
if [ $? -eq 0 ]; then
  echo "To apply the environment changes now, run:"
  echo "\033[1;33msource "$PROFILE_FILE"\033[0m"
  echo "or start a new terminal session."
else
  echo "Something went wrong, try again."
fi
