module.exports = {
  project: {
    android: {},
  },
  assets: ["./assets/fonts/"],
  dependencies: {
    "react-native-ios-settings-bundle": {
      platforms: {
        android: null,
      },
    },
    "react-native-notifications": {
      platforms: {
        android: null,
        ios: null,
      },
    },
    "@ppb/the-wall-native": {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
