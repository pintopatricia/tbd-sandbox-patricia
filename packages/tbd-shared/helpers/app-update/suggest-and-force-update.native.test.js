import { AppUpdate } from "./suggest-and-force-update.native";
import { AppUpdateStatus } from "./update-helper.native";
import { UpdateBuilder } from "./update-builder.native";

jest.mock("react-native-device-info", () => ({
  getBuildNumber: () => 5,
  getSystemVersion: () => "11.0",
}));

jest.mock("./update-builder", () => ({
  UpdateBuilder: {
    displayForceUpdate: jest.fn(),
    displaySuggestUpdate: jest.fn(),
    displayPlatformNotSupported: jest.fn(),
    setup: jest.fn(),
  },
}));

const androidStoreLink = "androidStoreLink";
const androidDownloadLink = "androidDownloadLink";
const iosStoreLink = "iOSStoreLink";
const genericLink = "AgnosticLink";

const APP_VERSION_STORE_MOCK = {
  android: {
    storeUrl: androidStoreLink,
    downloadUrl: androidDownloadLink,
    versionCode: 5,
    minVersionCode: 3,
    minOSVersion: "10.0",
    blackList: [],
  },
  ios: {
    storeUrl: iosStoreLink,
    versionCode: 5,
    minVersionCode: 3,
    minOSVersion: "10.0",
    blackList: [],
  },
};

const USER_DETAILS_STORE_MOCK = {
  countryCode: "IE",
};

function checkAppUpdateCall(appVersionParams) {
  const { blackList, versionCode, minOSVersion, minVersionCode, countryCode, url } = appVersionParams;
  const androidAppUpdate = APP_VERSION_STORE_MOCK.android;
  const updatedMinVersionCode = minVersionCode || androidAppUpdate.minVersionCode;
  const updatedBlackList = blackList || androidAppUpdate.blackList;

  const androidConfig = {
    ...APP_VERSION_STORE_MOCK.android,
    ...(url && { url }),
    ...(versionCode && { versionCode }),
    ...(minOSVersion && { minOSVersion }),
    ...(updatedMinVersionCode && { minVersionCode: updatedMinVersionCode }),
    ...(updatedBlackList && { blackList: updatedBlackList }),
  };

  const iOSConfig = {
    ...APP_VERSION_STORE_MOCK.ios,
    ...(url && { url }),
    ...(versionCode && { versionCode }),
  };

  const appVersion = {
    ...APP_VERSION_STORE_MOCK,
    ...{ android: androidConfig },
    ...{ ios: iOSConfig },
  };

  const userDetails = {
    countryCode: countryCode || USER_DETAILS_STORE_MOCK.countryCode,
  };

  return AppUpdate.checkAppUpdate(appVersion, userDetails);
}

describe("suggest-and-force-update", () => {
  describe("when checkAppUpdate is called", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      AppUpdate.appUpdateStatus = AppUpdateStatus.Hidden;
    });

    describe("when platform is Android", () => {
      beforeAll(() => {
        AppUpdate.isAndroid = true;
      });

      describe("when appVersion state is undefined", () => {
        it("should return AppUpdateStatus hidden", () => {
          AppUpdate.checkAppUpdate({ appversion: undefined, userdetails: USER_DETAILS_STORE_MOCK });
          expect(AppUpdate.appUpdateStatus).toBe(AppUpdateStatus.Hidden);
        });
      });

      describe("when appVersion state is defined, but userDetails undefined", () => {
        it("should return AppUpdateStatus hidden", () => {
          AppUpdate.checkAppUpdate({ appversion: APP_VERSION_STORE_MOCK, userdetails: undefined });
          expect(AppUpdate.appUpdateStatus).toBe(AppUpdateStatus.Hidden);
        });
      });

      describe("when appVersion is configured as force update", () => {
        it("should return force status", () => {
          checkAppUpdateCall({ minVersionCode: 6, versionCode: 7 });
          expect(AppUpdate.appUpdateStatus).toBe(AppUpdateStatus.Force);
        });
      });

      describe("when appVersion is configured as suggest update", () => {
        it("should return suggest status", () => {
          checkAppUpdateCall({ versionCode: 7 });
          expect(AppUpdate.appUpdateStatus).toBe(AppUpdateStatus.Suggest);
        });
      });

      describe("when current version is blacklisted", () => {
        it("should return force status", () => {
          checkAppUpdateCall({ blackList: [{ versioncode: 5 }] });
          expect(AppUpdate.appUpdateStatus).toBe(AppUpdateStatus.Force);
        });
      });

      describe("when current OS is not supported", () => {
        it("should return unsupported status", () => {
          checkAppUpdateCall({ minOSVersion: "11.1" });
          expect(AppUpdate.appUpdateStatus).toBe(AppUpdateStatus.Unsupported);
        });
      });

      describe("when supported OS is undefined", () => {
        it("should return unsupported status", () => {
          AppUpdate.checkAppUpdate(
            { android: { ...APP_VERSION_STORE_MOCK.android, minOSVersion: undefined } },
            USER_DETAILS_STORE_MOCK,
          );
          expect(AppUpdate.appUpdateStatus).toBe(AppUpdateStatus.Unsupported);
        });
      });

      describe("when there is no update", () => {
        it("should return hidden status", () => {
          checkAppUpdateCall({});
          expect(AppUpdate.appUpdateStatus).toBe(AppUpdateStatus.Hidden);
        });
      });

      describe("when user countryCode is PT", () => {
        it("should call setup with androidDownloadLink", () => {
          AppUpdate.checkAppUpdate(
            { android: { ...APP_VERSION_STORE_MOCK.android, versionCode: 7 } },
            { countryCode: "PT" },
          );
          expect(UpdateBuilder.setup).toHaveBeenCalledWith(true, AppUpdateStatus.Suggest, "androidDownloadLink");
        });
      });

      describe("when there are is a url", () => {
        it("should call setup with AgnosticLink", () => {
          AppUpdate.checkAppUpdate(
            { android: { ...APP_VERSION_STORE_MOCK.android, versionCode: 7, url: genericLink } },
            { countryCode: "PT" },
          );
          expect(UpdateBuilder.setup).toHaveBeenCalledWith(true, AppUpdateStatus.Suggest, "AgnosticLink");
        });
      });
    });

    describe("when platform is iOS", () => {
      beforeAll(() => {
        AppUpdate.isAndroid = false;
      });

      describe("when there are is no url", () => {
        it("should call setup with iOSStoreLink", () => {
          checkAppUpdateCall({ versionCode: 7 });
          expect(UpdateBuilder.setup).toHaveBeenCalledWith(false, AppUpdateStatus.Suggest, "iOSStoreLink");
        });
      });

      describe("when there are is a url", () => {
        it("should call setup with AgnosticLink", () => {
          checkAppUpdateCall({ versionCode: 7, url: genericLink });
          expect(UpdateBuilder.setup).toHaveBeenCalledWith(false, AppUpdateStatus.Suggest, "AgnosticLink");
        });
      });
    });
  });

  describe("when displaySuggestOrForceUpdate is called", () => {
    describe("when appUpdateStatus is Force", () => {
      beforeAll(() => {
        jest.clearAllMocks();
        AppUpdate.appUpdateStatus = AppUpdateStatus.Force;
        AppUpdate.displaySuggestOrForceUpdate();
      });

      it("should display force update", () => {
        expect(UpdateBuilder.displayForceUpdate).toHaveBeenCalled();
      });
    });

    describe("when appUpdateStatus is Suggest", () => {
      beforeAll(() => {
        jest.clearAllMocks();
        AppUpdate.appUpdateStatus = AppUpdateStatus.Suggest;
        AppUpdate.displaySuggestOrForceUpdate();
      });

      it("should display suggest update", () => {
        expect(UpdateBuilder.displaySuggestUpdate).toHaveBeenCalled();
      });
    });

    describe("when appUpdateStatus is Unsupported", () => {
      beforeAll(() => {
        jest.clearAllMocks();
        AppUpdate.appUpdateStatus = AppUpdateStatus.Unsupported;
        AppUpdate.displaySuggestOrForceUpdate();
      });

      it("should display unsupported platform", () => {
        expect(UpdateBuilder.displayPlatformNotSupported).toHaveBeenCalled();
      });
    });

    describe("when appUpdateStatus is Hidden", () => {
      beforeAll(() => {
        jest.clearAllMocks();
        AppUpdate.appUpdateStatus = AppUpdateStatus.Hidden;
        AppUpdate.displaySuggestOrForceUpdate();
      });

      it("should not display suggest or force update", () => {
        expect(UpdateBuilder.displaySuggestUpdate).not.toHaveBeenCalled();
      });
    });
  });
});
