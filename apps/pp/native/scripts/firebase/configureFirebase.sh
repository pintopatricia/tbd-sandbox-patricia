# In order to send metrics per build type to Firebase, GoogleService-Info.plist needs 
# to be configured for each one of the build types.  
# configureFirebase script will copy the correct GoogleService-Info.plist for release 
# build type. That will be achieved by using the arg passed in release jenkins job.
# As a default, GoogleService-Info.plist will be configured to In House, that is why this script 
# will not run on that job.

if [ $1 == "release" ]
then
  cp -f ./scripts/firebase/$1/GoogleService-Info.plist ./ios/GoogleService-Info.plist
  echo "GoogleService-Info.plist configured to $1"
else
  echo "There is no configuration for $1"
fi