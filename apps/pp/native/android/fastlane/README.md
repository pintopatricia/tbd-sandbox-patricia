fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## Android
### android inhousePlay
```
fastlane android inhousePlay
```
Build and upload our Play Store In-House apps to Firebase for the stakeholders
### android deployFirebaseApp
```
fastlane android deployFirebaseApp
```
Builds the staging app and deploys to firebase
### android deployStoreApp
```
fastlane android deployStoreApp
```
Builds the store app and deploys to play store (Internal track)
### android inhouseDeployFirebase
```
fastlane android inhouseDeployFirebase
```
Upload our Play Store In-House apps to Firebase on CI for the stakeholders
### android inhouseDebugDeployFirebase
```
fastlane android inhouseDebugDeployFirebase
```
Upload our QA apps to Firebase on CI for the stakeholders

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
