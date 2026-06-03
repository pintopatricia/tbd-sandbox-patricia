/* eslint-disable no-undef */
import { Platform } from "react-native";
import { firebase } from "@react-native-firebase/analytics";
import OTPublishersNativeSDK from "react-native-onetrust-cmp";
import { waitFor } from "@testing-library/react-native";
import CookieManager from "@react-native-cookies/cookies";
import { getTaggingModule } from "@ppb/tbd-store/modules/tagging-module";
import { getCriticalTaggingModule } from "@ppb/tbd-store/modules/critical-tagging-module";
import Storage from "../helpers/storage.native";
import { isCurrentEnv } from "../config/base-path-utils.native";
import appConfiguration from "../config/app-configuration.native";
import {
  setupOneTrust,
  handleConsentChange,
  CATEGORIES,
  showCookieConsentBannerAfterDelay,
  initOneTrust,
  reinitOneTrust,
} from "./cookie-consent.native";

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  useAnalyticsTracking: jest.fn(() => ({
    analyticsTrackingEnableState: "unset",
    setAnalyticsTrackingEnableState: () => {},
  })),
}));

jest.mock("@react-native-firebase/analytics", () => ({
  firebase: {
    analytics: jest.fn().mockReturnValue({
      setAnalyticsCollectionEnabled: jest.fn(),
    }),
  },
}));

jest.mock("../config/base-path-utils.native", () => ({
  isCurrentEnv: jest.fn(),
}));

jest.mock("../config/app-configuration.native", () => ({
  appBrand: "betfair",
  appConfig: {
    TBDN_RELEASE_MODE: "internal",
    ONE_TRUST_KEYS: {
      ios: {
        dev: "ios-dev-key",
        prod: "ios-prod-key",
      },
      android: {
        dev: "android-dev-key",
        prod: "android-prod-key",
      },
    },
  },
}));

jest.mock("../setup/store.native", () => ({
  gtmConfig: "gtmConfig",
}));

jest.mock("react-native-onetrust-cmp", () => ({
  startSDK: jest.fn(() => Promise.resolve({ status: "resolved" })),
  setBroadcastAllowedValues: jest.fn(),
  listenForConsentChanges: jest.fn(),
  getConsentStatusForCategory: jest.fn().mockResolvedValue("1"),
  shouldShowBanner: jest.fn(),
  showBannerUI: jest.fn(),
}));

jest.mock("@ppb/tbd-store/modules/tagging-module", () => ({
  getTaggingModule: jest.fn(() => "gtmModule"),
}));

jest.mock("@ppb/tbd-store/modules/critical-tagging-module", () => ({
  getCriticalTaggingModule: jest.fn(() => "gtmModule"),
}));

jest.mock("@react-native-cookies/cookies", () => jest.fn());
CookieManager.set = jest.fn().mockResolvedValue("mock-return-cookie-set-value");

jest.mock("../helpers/storage.native", () => ({
  setItem: jest.fn().mockResolvedValue(true),
}));
const mockAsyncStorageGetItem = jest.fn();
Storage.getItem = mockAsyncStorageGetItem;

const mockSetAnalyticsTrackingEnableState = jest.fn();

async function callHandleConsentChange(performanceConsentStatus) {
  const addModule = jest.fn();
  const dispatch = jest.fn();

  await handleConsentChange(
    { addModule, dispatch },
    "gtmConfig",
    "unset",
    mockSetAnalyticsTrackingEnableState,
    performanceConsentStatus,
  );

  return { addModule, dispatch };
}

describe("cookie-consent", () => {
  describe("setupOneTrust", () => {
    describe("When a locale-code is provided", () => {
      beforeAll(async () => {
        await waitFor(() => {
          setupOneTrust("dev-test-id", () => {}, { dispatch: jest.fn() }, "pt-BR");
        });
      });

      it("should call startSDK with correct parameters", () => {
        expect(OTPublishersNativeSDK.startSDK).toHaveBeenCalledWith(
          "cdn-ukwest.onetrust.com",
          "dev-test-id",
          "pt-BR",
          {},
          true,
        );
      });
    });

    describe("When a locale-code isn't provided", () => {
      beforeAll(async () => {
        await waitFor(() => {
          setupOneTrust("dev-test-id", () => {}, { dispatch: jest.fn() });
        });
      });

      it("should call startSDK with correct parameters", () => {
        expect(OTPublishersNativeSDK.startSDK).toHaveBeenCalledWith(
          "cdn-ukwest.onetrust.com",
          "dev-test-id",
          "en-GB",
          {},
          true,
        );
      });

      it(
        "should call setBroadcastAllowedValues",
        () => {
          expect(OTPublishersNativeSDK.setBroadcastAllowedValues).toHaveBeenCalledWith(["C0002", "C0004"]);
        },
        {},
      );

      it(
        "should call listenForConsentChanges",
        () => {
          expect(OTPublishersNativeSDK.listenForConsentChanges).toHaveBeenCalledWith("C0002", expect.any(Function));
          expect(OTPublishersNativeSDK.listenForConsentChanges).not.toHaveBeenCalledWith("C0004", expect.any(Function));
        },
        {},
      );

      it("should sync consent categories to Redux when performance consent changes", async () => {
        OTPublishersNativeSDK.getConsentStatusForCategory.mockImplementation((category) => {
          if (category === CATEGORIES.STRICTLY_NECESSARY || category === CATEGORIES.PERFORMANCE) {
            return 1;
          }

          return 0;
        });

        OTPublishersNativeSDK.listenForConsentChanges.mockClear();
        const dispatch = jest.fn();
        setupOneTrust("dev-test-id", () => {}, { dispatch });

        const performanceListeners = OTPublishersNativeSDK.listenForConsentChanges.mock.calls
          .filter(([category]) => category === CATEGORIES.PERFORMANCE)
          .map(([, callback]) => callback);

        const performanceConsentListener = performanceListeners[1];

        performanceConsentListener();
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(dispatch).toHaveBeenCalledWith({
          type: "COOKIE_CONSENT/CATEGORIES_CHANGED",
          payload: [CATEGORIES.STRICTLY_NECESSARY, CATEGORIES.PERFORMANCE],
        });
      });
    });
  });

  describe("handleConsentChange", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("when performanceConsentStatus is not provided", () => {
      it("should call getConsentStatusForCategory for the performance category", async () => {
        await callHandleConsentChange();

        expect(OTPublishersNativeSDK.getConsentStatusForCategory).toHaveBeenCalledWith(CATEGORIES.PERFORMANCE);
        expect(OTPublishersNativeSDK.getConsentStatusForCategory).toHaveBeenCalledTimes(1);
      });

      describe("when performanceCookiesStatus === 0", () => {
        beforeEach(() => {
          OTPublishersNativeSDK.getConsentStatusForCategory.mockReturnValue(0);
        });

        it("should disable Firebase Analytics Collection", async () => {
          await callHandleConsentChange();

          expect(firebase.analytics().setAnalyticsCollectionEnabled).toHaveBeenCalledWith(false);
        });
      });

      describe("when performanceCookiesStatus === 1", () => {
        beforeEach(() => {
          OTPublishersNativeSDK.getConsentStatusForCategory.mockReturnValue(1);
        });

        it("should enable Firebase Analytics Collection", async () => {
          await callHandleConsentChange();

          expect(firebase.analytics().setAnalyticsCollectionEnabled).toHaveBeenCalledWith(true);
        });

        it("should call getTaggingModule", async () => {
          await callHandleConsentChange();
          expect(getTaggingModule).toHaveBeenCalledWith("gtmConfig");
        });

        it("should call getCriticalTaggingModule", async () => {
          await callHandleConsentChange();
          expect(getCriticalTaggingModule).toHaveBeenCalledWith("gtmConfig");
        });

        it("should call store addModule with the gtm module", async () => {
          const { addModule } = await callHandleConsentChange();
          expect(addModule).toHaveBeenCalledWith("gtmModule");
        });
      });
    });

    describe("when performanceConsentStatus is provided", () => {
      it("should reuse the provided performance status and avoid querying OneTrust", async () => {
        await callHandleConsentChange(0);

        expect(OTPublishersNativeSDK.getConsentStatusForCategory).not.toHaveBeenCalledWith(CATEGORIES.PERFORMANCE);
        expect(OTPublishersNativeSDK.getConsentStatusForCategory).not.toHaveBeenCalled();
      });
    });
  });

  describe("showCookieConsentBannerAfterDelay", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("calls showBannerUI if shouldShowBanner resolves true", async () => {
      OTPublishersNativeSDK.shouldShowBanner.mockResolvedValue(true);

      showCookieConsentBannerAfterDelay(200);

      jest.advanceTimersByTime(200);
      await Promise.resolve();

      expect(OTPublishersNativeSDK.shouldShowBanner).toHaveBeenCalled();
      expect(OTPublishersNativeSDK.showBannerUI).toHaveBeenCalledWith({});
    });

    it("does not call showBannerUI if shouldShowBanner resolves false", async () => {
      OTPublishersNativeSDK.shouldShowBanner.mockResolvedValue(false);

      showCookieConsentBannerAfterDelay(150);

      jest.advanceTimersByTime(150);
      await Promise.resolve();

      expect(OTPublishersNativeSDK.shouldShowBanner).toHaveBeenCalled();
      expect(OTPublishersNativeSDK.showBannerUI).not.toHaveBeenCalled();
    });
  });

  describe("initOneTrust", () => {
    const dev = __DEV__;
    const createMockStore = (localeCode = "localeCode") => ({
      getState: () => ({ entities: { userdetails: { localeCode } } }),
      addModule: jest.fn(),
      dispatch: jest.fn(),
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      __DEV__ = dev;
    });

    describe("when on mockserver", () => {
      beforeEach(() => {
        isCurrentEnv.mockImplementation((env) => env === "mockserver");
        appConfiguration.appConfig.TBDN_RELEASE_MODE = "internal";
      });

      it("should not call startSDK", async () => {
        await initOneTrust(createMockStore(), "unset", mockSetAnalyticsTrackingEnableState);

        expect(OTPublishersNativeSDK.startSDK).not.toHaveBeenCalled();
      });

      it("should sync consent categories to Redux", async () => {
        OTPublishersNativeSDK.getConsentStatusForCategory.mockImplementation((category) => {
          if (category === CATEGORIES.PERFORMANCE || category === CATEGORIES.FUNCTIONALITY) {
            return 1;
          }

          return 0;
        });

        const store = createMockStore();

        await initOneTrust(store, "unset", mockSetAnalyticsTrackingEnableState);
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(store.dispatch).toHaveBeenCalledWith({
          type: "COOKIE_CONSENT/CATEGORIES_CHANGED",
          payload: [CATEGORIES.PERFORMANCE, CATEGORIES.FUNCTIONALITY],
        });
      });
    });

    describe("when not on mockserver", () => {
      beforeEach(() => {
        isCurrentEnv.mockReturnValue(false);
        appConfiguration.appConfig.TBDN_RELEASE_MODE = "production";
        __DEV__ = false;
      });

      describe("on iOS", () => {
        beforeEach(() => {
          Platform.OS = "ios";
        });

        it("should call startSDK with prod ios key", async () => {
          await initOneTrust(createMockStore("pt-BR"), "unset", mockSetAnalyticsTrackingEnableState);

          expect(OTPublishersNativeSDK.startSDK).toHaveBeenCalledWith(
            "cdn-ukwest.onetrust.com",
            "ios-prod-key",
            "pt-BR",
            {},
            true,
          );
        });

        describe("when in DEV mode", () => {
          beforeEach(() => {
            __DEV__ = true;
          });

          it("should call startSDK with dev ios key", async () => {
            await initOneTrust(createMockStore(), "unset", mockSetAnalyticsTrackingEnableState);

            expect(OTPublishersNativeSDK.startSDK).toHaveBeenCalledWith(
              "cdn-ukwest.onetrust.com",
              "ios-dev-key",
              "localeCode",
              {},
              true,
            );
          });
        });
      });

      describe("on Android", () => {
        beforeEach(() => {
          Platform.OS = "android";
        });

        it("should call startSDK with prod android key", async () => {
          await initOneTrust(createMockStore(), "unset", mockSetAnalyticsTrackingEnableState);

          expect(OTPublishersNativeSDK.startSDK).toHaveBeenCalledWith(
            "cdn-ukwest.onetrust.com",
            "android-prod-key",
            "localeCode",
            {},
            true,
          );
        });

        describe("when in DEV mode", () => {
          beforeEach(() => {
            __DEV__ = true;
          });

          it("should call startSDK with dev android key", async () => {
            await initOneTrust(createMockStore(), "unset", mockSetAnalyticsTrackingEnableState);

            expect(OTPublishersNativeSDK.startSDK).toHaveBeenCalledWith(
              "cdn-ukwest.onetrust.com",
              "android-dev-key",
              "localeCode",
              {},
              true,
            );
          });
        });
      });
    });
  });

  describe("reinitOneTrust", () => {
    const dev = __DEV__;

    beforeEach(() => {
      jest.clearAllMocks();
      __DEV__ = false;
      appConfiguration.appConfig.TBDN_RELEASE_MODE = "production";
    });

    afterAll(() => {
      __DEV__ = dev;
    });

    describe("when on mockserver", () => {
      beforeEach(() => {
        isCurrentEnv.mockImplementation((env) => env === "mockserver");
      });

      it("should not call startSDK", async () => {
        await reinitOneTrust("localeCode");

        expect(OTPublishersNativeSDK.startSDK).not.toHaveBeenCalled();
      });
    });

    describe("when not on mockserver", () => {
      beforeEach(() => {
        isCurrentEnv.mockReturnValue(false);
        Platform.OS = "ios";
      });

      it("should call startSDK with the correct key and locale", async () => {
        await reinitOneTrust("es-ES");

        expect(OTPublishersNativeSDK.startSDK).toHaveBeenCalledWith(
          "cdn-ukwest.onetrust.com",
          "ios-prod-key",
          "es-ES",
          {},
          true,
        );
      });
    });
  });
});
