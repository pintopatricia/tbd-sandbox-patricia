echo "---------------------------------------------------------------------------------------------------------------------------"
echo "Due to signing of certificates, in order to build release applications you need to set the following environment variables:\n"

echo "\033[0;32mexport ANDROID_UPLOAD_STORE_PW={VALUE_FROM_VAULT}\033[0m"
echo "\033[0;32mexport RELEASE_KEYSTORE={VALUE_FROM_VAULT}\033[0m\n"

echo "Those values can be obtained in \033[4;36mhttps://vault-prd.prd.betfair/ui/vault/secrets/tla_tbdn/show/jenkins\033[0m\n"

echo "After setting those, you need to decode and store the keystore running this command (native folder):"
echo "\033[0;32mecho \$RELEASE_KEYSTORE | base64 --decode > ./android/app/release.keystore\033[0m\n"

echo "This script is obviously meant to be automated in the near future and ask for your vault credentials.."
echo "In the meantime if you feel like it go ahead, DYI and I'll nominate you for Channels Champion."
echo "---------------------------------------------------------------------------------------------------------------------------"
