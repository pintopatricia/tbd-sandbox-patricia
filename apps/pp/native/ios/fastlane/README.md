## fastlane documentation

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios in_house_gaming_firebase

```sh
[bundle exec] fastlane ios in_house_gaming_firebase
```

Build and uploads our In-House app to AppCenter for the stakeholders

This is used to setup the certificates and provisioning profiles on a dev machine

Build and uploads our QA app to Firebase for the stakeholders

### ios in_house

```sh
[bundle exec] fastlane ios in_house
```

Build and uploads our In-House app to Firebase for the stakeholders

### ios in_house_asset_packs

```sh
[bundle exec] fastlane ios in_house_asset_packs
```

Build and uploads the generated asset packs to the assets pack repo

---

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
