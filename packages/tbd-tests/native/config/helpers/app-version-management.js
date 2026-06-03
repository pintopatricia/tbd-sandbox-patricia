const availablePackageNames = {
  android: {
    bf: {
      release: "com.betfair.sportsbook",
      releaseBrazil: "com.betfair.sportsbook.brazil",
      staging: "com.betfair.tbd.release",
      inhouse: "com.betfair.tbd.inhouse",
      debug: "com.betfair.tbd.qa",
    },
    sbg: {
      release: "com.skybet.app.skybet",
      staging: "com.skybet.tbd.native.release",
      inhouse: "com.skybet.tbd.inhouse",
      debug: "com.skybet.tbd.qa",
    },
  },
  ios: {
    bf: {
      release: "com.betfair.sportsbook",
      staging: "com.betfair.tbd.release",
      inhouse: "com.betfair.tbd.in-house",
      debug: "com.betfair.tbd.qa",
    },
    sbg: {
      release: "com.betfair.sportsbook",
      staging: "com.betfair.tbd.release",
      inhouse: "com.betfair.tbd.in-house",
      debug: "com.betfair.tbd.qa",
    },
  },
};

const availableSplashActivity = {
  bf: "com.betfair.tbd.SplashActivity",
  sbg: "com.skybet.tbd.SplashActivity",
};

const availableMainActivity = {
  bf: "com.betfair.tbd.MainActivity",
  sbg: "com.skybet.tbd.MainActivity",
};

const baseDeeplink = {
  bf: "bfe://",
  sbg: "skybet://skybet.com/",
  ios: "skybet://",
};

const artifactoryBaseUrl = {
  android: {
    bf: "https://artifactory-prd.prd.betfair/artifactory/tbd-native/android/",
    sbg: "https://artifactory-prd.prd.betfair/artifactory/tbd-native/android/sbg/",
  },
  ios: {
    bf: "https://artifactory-prd.prd.betfair/artifactory/tbd-native/ios/qa/",
    sbg: "https://artifactory-prd.prd.betfair/artifactory/tbd-native/ios/sbg/",
  },
};

const appName = {
  android: {
    bf: "Betfair-",
    sbg: "SkyBet-",
  },
  ios: {
    bf: "Betfair-",
    sbg: "SkyBet-",
  },
};

const appExtension = {
  android: {
    bf: "apk",
    sbg: "apk",
  },
  ios: {
    bf: "app.zip",
    sbg: "app.zip",
  },
};

const uninstallOtherApps = async (platform, brand, packageName) =>
  Object.keys(availablePackageNames[platform][brand]).forEach(async (buildType) => {
    const packageId = availablePackageNames[platform][brand][buildType];
    if (packageId !== packageName) {
      const isAppInstalled = await browser.isAppInstalled(packageId);
      if (isAppInstalled) {
        console.log(`WARNING: ${packageId} detected in device, uninstalling to prevent deep links breaking`);
        await browser.removeApp(packageId);
      }
    }
  });

async function resetAppData(platform, packageName, appPath) {
  if (platform === "ios") {
    // need to uninstall and install app due to: https://github.com/webdriverio/appium-boilerplate/issues/156
    await driver.removeApp(packageName);
    await driver.installApp(appPath);
  }
}

const updateInstalledApp = async (platform, brand, packageName, appPath) => {
  try {
    await uninstallOtherApps(platform, brand, packageName);
    await resetAppData(platform, packageName, appPath);
  } catch (error) {
    console.log(error);
  }
};

const getPackageName = (platform, brand, buildType) => availablePackageNames[platform][brand][buildType];

const getBundleId = (platform, brand, buildType) => availablePackageNames[platform][brand][buildType];

const getSplashActivity = (brand) => availableSplashActivity[brand];

const getMainActivity = (brand) => availableMainActivity[brand];

const getBaseDeeplink = (brand) => baseDeeplink[brand];

module.exports = {
  updateInstalledApp,
  getPackageName,
  getBundleId,
  getSplashActivity,
  getMainActivity,
  getBaseDeeplink,
  artifactoryBaseUrl,
  appName,
  appExtension,
};
