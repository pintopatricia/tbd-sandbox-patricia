import { Platform, NativeModules } from "react-native";
import {
  getCustomUserAgent,
  getCustomWebViewUserAgent,
  getCustomUserAgentSuffix,
  registerCustomUserAgent,
} from "./user-agent.native";
import DeviceInfo from "react-native-device-info";

const MOCK_ANDROID_USER_AGENT = "release/0.0.0.1 Mozilla/5.0 (Linux; Android 12; SM-G996B Build/SP1A.210812.016; wv)";
const MOCK_DEFAULT_USER_AGENT = "Betfair/0.0.0.1 CFNetwork/0.0.0 Darwin/0.0.0 (iPhone/14 iOS/26.2";
const MOCK_IOS_WEBVIEW_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
const MOCK_IOS_WEBVIEW_USER_AGENT_SUFFIX = "; TBDN (Betfair/0.0.1; iOS; GamesFramework/7.14.0; ResourcesVersion/21)";

jest.mock("../config/app-configuration.native", () => ({
  appBrand: "betfair",
  appConfig: {
    TBDN_DEFAULT_ENVIRONMENT: "prd",
  },
}));

let MOCK_USER_AGENT = "Default User-Agent mock";

jest.mock("react-native-device-info", () => ({
  getBundleId: jest.fn().mockReturnValue("com.betfair.release"),
  getApplicationName: jest.fn(() => "Betfair (In-House)"),
  getBuildNumber: jest.fn(() => "1"),
  getVersion: jest.fn(() => "0.0"),
  getModel: jest.fn(() => "iPhone 14"),
  getSystemName: jest.fn(() => "iOS"),
  getSystemVersion: jest.fn(() => "26.2"),
  getUserAgent: jest.fn(() => MOCK_USER_AGENT),
  getUserAgentSync: jest.fn(() => MOCK_USER_AGENT),
}));

jest.mock("react-native", () => ({
  NativeModules: {
    CustomUserAgent: {
      getFrameworkVersion: jest.fn(() => ({
        then: (fn) => {
          fn("7.14.0");
        },
      })),
      getResourcesVersion: jest.fn(() => ({
        then: (fn) => {
          fn("21");
        },
      })),
      registerCustomUserAgent: jest.fn(),
    },
  },
  Platform: {},
}));

describe("user-agent setup", () => {
  beforeEach(jest.clearAllMocks);

  describe("getCustomUserAgentSuffix", () => {
    describe("when platform is Android", () => {
      beforeEach(() => {
        Platform.OS = "android";
      });

      it("should not call anything", async () => {
        await getCustomUserAgentSuffix();

        expect(NativeModules.CustomUserAgent.getFrameworkVersion).not.toHaveBeenCalled();
        expect(NativeModules.CustomUserAgent.getResourcesVersion).not.toHaveBeenCalled();
      });

      it("should return the empty value", async () => {
        const customUserAgentSuffix = await getCustomUserAgentSuffix();
        expect(customUserAgentSuffix).toBe("");
      });
    });

    describe("when platform is iOS", () => {
      beforeEach(() => {
        Platform.OS = "ios";
      });

      it("should do calls for versions", async () => {
        await getCustomUserAgentSuffix();

        expect(NativeModules.CustomUserAgent.getFrameworkVersion).toHaveBeenCalledTimes(1);
        expect(NativeModules.CustomUserAgent.getResourcesVersion).toHaveBeenCalledTimes(1);
      });

      it("should return the correct value", async () => {
        const customUserAgentSuffix = await getCustomUserAgentSuffix();
        expect(customUserAgentSuffix).toBe("; TBDN (Betfair/0.0.1; iOS; GamesFramework/7.14.0; ResourcesVersion/21)");
      });
    });
  });

  describe("registerCustomUserAgent", () => {
    describe("when platform is Android", () => {
      it("should not call anything", async () => {
        Platform.OS = "android";
        await registerCustomUserAgent();

        expect(NativeModules.CustomUserAgent.getFrameworkVersion).not.toHaveBeenCalled();
        expect(NativeModules.CustomUserAgent.getResourcesVersion).not.toHaveBeenCalled();
        expect(NativeModules.CustomUserAgent.registerCustomUserAgent).not.toHaveBeenCalled();
        expect(DeviceInfo.getUserAgent).not.toHaveBeenCalled();
      });
    });

    describe("when platform is iOS", () => {
      beforeEach(() => {
        Platform.OS = "ios";
      });

      it("should do calls for versions and WebView User-Agent", async () => {
        await registerCustomUserAgent();

        expect(NativeModules.CustomUserAgent.getFrameworkVersion).toHaveBeenCalledTimes(1);
        expect(NativeModules.CustomUserAgent.getResourcesVersion).toHaveBeenCalledTimes(1);
        expect(DeviceInfo.getUserAgent).toHaveBeenCalledTimes(1);
      });

      describe("when the user agent was already updated", () => {
        it("should not to new call to registerCustomUserAgent", async () => {
          MOCK_USER_AGENT = "TBDN (";
          await registerCustomUserAgent();

          expect(NativeModules.CustomUserAgent.registerCustomUserAgent).not.toHaveBeenCalled();
        });
      });

      describe("when the the default user agent is empty", () => {
        it("should not to a call to registerCustomUserAgent", async () => {
          MOCK_USER_AGENT = "";
          await registerCustomUserAgent();

          expect(NativeModules.CustomUserAgent.registerCustomUserAgent).not.toHaveBeenCalled();
        });
      });

      describe("when wasn't updated yet", () => {
        it("should do a call to registerCustomUserAgent with the correct value", async () => {
          MOCK_USER_AGENT = "User-Agent";
          await registerCustomUserAgent();

          expect(NativeModules.CustomUserAgent.registerCustomUserAgent).toHaveBeenCalledWith(
            "User-Agent; TBDN (Betfair/0.0.1; iOS; GamesFramework/7.14.0; ResourcesVersion/21)",
          );
        });
      });
    });
  });

  describe("getCustomUserAgent", () => {
    describe("when platform is Android", () => {
      it("should return the correct Android user agent", () => {
        Platform.OS = "android";
        jest.spyOn(DeviceInfo, "getUserAgentSync").mockReturnValue(MOCK_ANDROID_USER_AGENT);
        expect(getCustomUserAgent()).toBe(
          "TBDN/Betfair/1/release/prd/Mozilla/5.0 (Linux; Android 12; SM-G996B Build/SP1A.210812.016; wv)",
        );
      });
    });

    describe("when platform is iOS", () => {
      it("should return a construction of the iOS user agent", () => {
        Platform.OS = "ios";
        expect(DeviceInfo.getUserAgent).not.toHaveBeenCalled();
        expect(DeviceInfo.getUserAgentSync).not.toHaveBeenCalled();
        expect(getCustomUserAgent()).toBe(
          "TBDN/Betfair/1/release/prd/CFNetwork/0.0.0 Darwin/0.0.0 (iPhone 14 iOS/26.2)",
        );
      });
    });

    describe("when platform is different from iOS or Android", () => {
      it("should return the default user agent", () => {
        Platform.OS = "macos";
        jest.spyOn(DeviceInfo, "getUserAgentSync").mockReturnValue(MOCK_DEFAULT_USER_AGENT);
        expect(getCustomUserAgent()).toBe(MOCK_DEFAULT_USER_AGENT);
      });
    });
  });

  describe("getCustomWebViewUserAgent", () => {
    describe("when platform is iOS", () => {
      it("should return the correct iOS user agent", async () => {
        Platform.OS = "ios";
        const customUserAgentSuffix = await getCustomUserAgentSuffix();
        expect(customUserAgentSuffix).toBe(MOCK_IOS_WEBVIEW_USER_AGENT_SUFFIX);
        jest.spyOn(DeviceInfo, "getUserAgent").mockReturnValue(MOCK_IOS_WEBVIEW_USER_AGENT);
        expect(await getCustomWebViewUserAgent()).toBe(
          `${MOCK_IOS_WEBVIEW_USER_AGENT}${MOCK_IOS_WEBVIEW_USER_AGENT_SUFFIX}`,
        );
      });
    });

    describe("when platform is android", () => {
      it("should return the default customUserAgent for Android", async () => {
        Platform.OS = "android";
        jest.spyOn(DeviceInfo, "getUserAgentSync").mockReturnValue(MOCK_ANDROID_USER_AGENT);
        expect(await getCustomWebViewUserAgent()).toBe(
          "TBDN/Betfair/1/release/prd/Mozilla/5.0 (Linux; Android 12; SM-G996B Build/SP1A.210812.016; wv)",
        );
      });
    });

    describe("when platform is different from iOS or Android", () => {
      it("should return the customUserAgent - default user agent", async () => {
        Platform.OS = "macos";
        jest.spyOn(DeviceInfo, "getUserAgentSync").mockReturnValue(MOCK_DEFAULT_USER_AGENT);
        expect(await getCustomWebViewUserAgent()).toBe(MOCK_DEFAULT_USER_AGENT);
      });
    });
  });
});
