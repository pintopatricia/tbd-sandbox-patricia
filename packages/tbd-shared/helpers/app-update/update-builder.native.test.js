import { Alert, AppState, BackHandler, Linking, NativeModules, Platform } from "react-native";
import SplashScreen from "react-native-splash-screen";
import BootSplash from "react-native-bootsplash";
import { buildInterfaceEvent } from "tagging-library";
import { sendEvent } from "../../gtm/tagging-collector.native";
import { UpdateBuilder } from "./update-builder.native";
import { AppUpdateStatus } from "./update-helper.native";

jest.mock("react-native", () => ({
  BackHandler: { exitApp: jest.fn() },
  Alert: { alert: jest.fn() },
  AppState: { addEventListener: jest.fn() },
  NativeModules: {
    IOSExitApp: { exitApp: jest.fn() },
  },
  Platform: { OS: "android" },
  Linking: {
    openURL: jest.fn(() => ({ then: jest.fn() })),
    canOpenURL: jest.fn(() => ({
      then: (fn) => {
        fn(true);
      },
    })),
  },
}));

const splashScreenHideSpy = jest.fn(() => {});

SplashScreen.hide = splashScreenHideSpy;
BootSplash.hide = splashScreenHideSpy;

jest.mock("react-native-splash-screen", () => ({
  SplashScreen: {
    hide: jest.fn(),
  },
}));

jest.mock("react-native-bootsplash", () => ({
  BootSplash: {
    hide: jest.fn(),
  },
}));

jest.mock("./update-helper", () => ({
  AppUpdateStatus: {
    Hidden: 0,
    Suggest: 1,
    Force: 2,
    Unsupported: 3,
  },
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../gtm/tagging-collector.native", () => ({
  sendEvent: jest.fn(),
}));

jest.mock("@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsDimensions", () => ({
  APPLICATION: {
    MODULE: "cd3",
  },
}));

jest.mock("@ppb/tbd-store/middlewares/tagging-resolvers/Event.types", () => ({
  TaggingAction: {
    DISPLAYED: "displayed",
    CLICKED: "clicked",
  },
}));

jest.mock("tagging-library", () => ({
  buildInterfaceEvent: jest.fn().mockReturnValue("interface event"),
}));

const appStateSpy = jest.spyOn(AppState, "addEventListener");

const androidStoreLink = "androidStoreLink";
const androidDownloadLink = "androidDownloadUrl";
const iosStoreLink = "iOSStoreLink";

const DISMISS_BUTTON = {
  onPress: expect.any(Function),
  text: "I18N.UPDATEOS.BUTTON",
};

const UPDATE_BUTTON = {
  onPress: expect.any(Function),
  text: "I18N.SUGGESTUPDATE.BUTTON_UPDATE",
};

const CANCEL_BUTTON = {
  text: "I18N.SUGGESTUPDATE.BUTTON_NOT_NOW",
};

function suggestUpdateAlertExpectation(isAndroid) {
  return isAndroid
    ? expect(Alert.alert).toHaveBeenCalledWith("I18N.SUGGESTUPDATE.TITLE", "I18N.SUGGESTUPDATE.BODY", [
        CANCEL_BUTTON,
        UPDATE_BUTTON,
      ])
    : expect(Alert.alert).toHaveBeenCalledWith("I18N.SUGGESTUPDATE.TITLE", "I18N.SUGGESTUPDATE.BODY", [
        UPDATE_BUTTON,
        CANCEL_BUTTON,
      ]);
}

function forceUpdateAlertExpectation() {
  expect(Alert.alert).toHaveBeenCalledWith("I18N.FORCEUPDATE.TITLE", "I18N.FORCEUPDATE.BODY", [UPDATE_BUTTON]);
}

function platformNotSupportedExpectation() {
  expect(Alert.alert).toHaveBeenCalledWith("I18N.UPDATEOS.TITLE", "I18N.UPDATEOS.BODY", [DISMISS_BUTTON]);
}

describe("update-builder", () => {
  describe("when suggest update is called through store", () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    const appStatus = AppUpdateStatus.Suggest;

    describe("when platform is iOS", () => {
      const isAndroid = false;
      Platform.OS = "ios";

      beforeAll(() => {
        UpdateBuilder.setup(isAndroid, appStatus, iosStoreLink);
        UpdateBuilder.displaySuggestUpdate();
      });

      it("should display suggest update alert", () => {
        suggestUpdateAlertExpectation(isAndroid);
      });

      describe("when update button clicked", () => {
        beforeAll(() => {
          Alert.alert.mock.calls[0][2][0].onPress();
        });

        it("should call openLink with iOS link", () => {
          expect(Linking.openURL).toHaveBeenCalledWith(iosStoreLink);
        });
      });
    });

    describe("when platform is Android", () => {
      const isAndroid = true;
      Platform.OS = "android";
      
      beforeAll(() => {
        jest.clearAllMocks();
        UpdateBuilder.setup(isAndroid, appStatus, androidStoreLink);
        UpdateBuilder.displaySuggestUpdate();
      });

      it("should display suggest update alert", () => {
        suggestUpdateAlertExpectation(isAndroid);
      });

      describe("when update button clicked", () => {
        beforeAll(() => {
          Alert.alert.mock.calls[0][2][1].onPress();
        });

        it("should call openLink with Android Store link", () => {
          expect(Linking.openURL).toHaveBeenCalledWith(androidStoreLink);
        });
      });
    });
  });

  describe("when force update is called and is not possible through store", () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    const appStatus = AppUpdateStatus.Force;

    describe("when platform is Android", () => {
      const isAndroid = true;
      Platform.OS = "android";

      beforeAll(() => {
        UpdateBuilder.setup(isAndroid, appStatus, androidDownloadLink);
        UpdateBuilder.displayForceUpdate();
      });

      it("should hide the splash screen", () => {
        expect(splashScreenHideSpy).toHaveBeenCalled();
      });

      it("should call sendEvent and buildInterfaceEvent with the right data", () => {
        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: "displayed",
          elementText: "update your app",
          module: "update prompt",
        });
        expect(sendEvent).toHaveBeenCalledWith("interface event");
        expect(sendEvent).toHaveBeenCalledTimes(1);
      });

      it("should display force update alert", () => {
        forceUpdateAlertExpectation();
      });

      describe("when update button clicked", () => {
        beforeAll(() => {
          sendEvent.mockClear();
          Alert.alert.mock.calls[0][2][0].onPress();
        });

        it("should call sendEvent buildInterfaceEvent with the right data", () => {
          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: "clicked",
            elementText: "update",
            module: "update prompt",
          });
          expect(sendEvent).toHaveBeenCalledWith("interface event");
          expect(sendEvent).toHaveBeenCalledTimes(1);
        });

        it("should call openLink with Android Download link", () => {
          expect(Linking.openURL).toHaveBeenCalledWith(androidDownloadLink);
        });
      });
    });
  });

  describe("when force update is called through store", () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    const appStatus = AppUpdateStatus.Force;

    describe("when platform is Android", () => {
      const isAndroid = true;
      Platform.OS = "android";

      beforeAll(() => {
        UpdateBuilder.setup(isAndroid, appStatus, androidStoreLink);
        UpdateBuilder.displayForceUpdate();
      });

      it("should display force update alert", () => {
        forceUpdateAlertExpectation();
      });

      describe("when update button clicked", () => {
        beforeAll(() => {
          Alert.alert.mock.calls[0][2][0].onPress();
        });

        it("should call openLink with android link", () => {
          expect(Linking.openURL).toHaveBeenCalledWith(androidStoreLink);
        });

        describe("when returning to the app after click", () => {
          it("should display force update alert when app state updated", async () => {
            await appStateSpy.mock.calls[0][1]("active");

            UpdateBuilder.displayForceUpdate();
            forceUpdateAlertExpectation(true);
          });
        });
      });
    });
  });

  describe("when device is unsupported", () => {
    beforeAll(() => {
      jest.clearAllMocks();
    });

    const appStatus = AppUpdateStatus.Unsupported;

    describe("when platform is Android", () => {
      const isAndroid = true;
      const linkUrl = "";
      Platform.OS = "android";

      beforeAll(() => {
        UpdateBuilder.setup(isAndroid, appStatus, linkUrl);
        UpdateBuilder.displayPlatformNotSupported();
      });

      it("should display unsupported device alert", () => {
        platformNotSupportedExpectation();
      });

      describe("when dismiss button clicked", () => {
        beforeAll(() => {
          Alert.alert.mock.calls[0][2][0].onPress();
        });

        it("should call openLink with android link", () => {
          expect(BackHandler.exitApp).toHaveBeenCalled();
        });
      });
    });

    describe("when platform is iOS", () => {
      const isAndroid = false;
      const linkUrl = "";
      Platform.OS = "ios";

      beforeAll(() => {
        jest.clearAllMocks();
        UpdateBuilder.setup(isAndroid, appStatus, linkUrl);
        UpdateBuilder.displayPlatformNotSupported();
      });

      it("should display unsupported device alert", () => {
        platformNotSupportedExpectation();
      });

      describe("when dismiss button clicked", () => {
        beforeAll(() => {
          Alert.alert.mock.calls[0][2][0].onPress();
        });

        it("should call openLink with android link", () => {
          expect(NativeModules.IOSExitApp.exitApp).toHaveBeenCalled();
        });
      });
    });
  });
});
