import { Appearance, NativeModules } from "react-native";
import { cetMainConfiguration } from "@flutter-global/react-native-cet-framework";
import { getProdIdConfig } from "@ppb/tbd-shared/config/endpoints";
import { resolveCETEnvironment } from "@ppb/tbd-shared/config/environments.native";
import { getCurrentEnv } from "@ppb/tbd-shared/config/base-path-utils.native";
import { getCustomUserAgentSuffix } from "@ppb/tbd-shared/helpers/user-agent.native";
import { getAnalyticsTrackingState } from "@ppb/tbd-shared/helpers/analytics-tracking-state.native";
import { sendEvent } from "@ppb/tbd-shared/gtm/tagging-collector.native";
import { trace } from "@opentelemetry/api";
import { setCetInitialised } from "@ppb/tbd-shared/helpers/cet-init-state.native";
import initialCetFrameworkSetup from "./init-cet-framework";

const PLATFORM_MOCK = { OS: "ios" };

jest.mock("@ppb/tbd-shared/helpers/analytics-tracking-state.native", () => ({
  getAnalyticsTrackingState: jest.fn(),
}));

jest.mock("@flutter-global/react-native-cet-framework", () => {
  function CetConfig() {
    this.setup = (data) => {
      Object.entries(data).forEach(([key, value]) => {
        this[key] = value;
      });
    };
  }

  return {
    cetMainConfiguration: new CetConfig(),
  };
});

jest.mock("@ppb/tbd-shared/config/endpoints", () => ({
  getProdIdConfig: jest.fn(() => "PRODUCT_ID"),
}));

jest.mock("react-native", () => ({
  Platform: PLATFORM_MOCK,
  Appearance: { getColorScheme: () => "light" },
  NativeModules: {
    TMXModule: {
      profileDevice: jest.fn(),
    },
    CetModule: {
      profileDevice: jest.fn(),
    },
  },
}));

jest.mock("@ppb/tbd-router", () => ({
  EXTERNAL_AUTH_RETURN_PATH: "/authexternal",
}));

jest.mock("@ppb/tbd-shared/helpers/cet-init-state.native", () => ({
  setCetInitialised: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/gtm/tagging-collector.native", () => ({
  sendEvent: jest.fn(),
  isMetaDataEvent: jest.fn(() => false),
}));

jest.mock("@ppb/tbd-shared/config/base-path-utils.native", () => ({
  getCurrentEnv: jest.fn(() => "qa"),
}));

const APP_CONFIG_MOCKS = {
  APP_KEYS: {
    android: "LDYesjOybjF6pAKy",
    ios: "husT5F46tmhjdCep",
  },
};

jest.mock("../app.config.json", () => APP_CONFIG_MOCKS);

jest.mock("@ppb/tbd-shared/config/environments.native", () => ({
  resolveCETEnvironment: jest.fn(() => "qa"),
}));

const ENVIRONMENTS_MOCKS = {
  environments: {
    nxt: {
      baseEnv: "nxt",
      path: "https://apitbdn.nxt.com.betfair/betting/",
    },
    prd: {
      baseEnv: "prd",
      path: "https://apitbdn.betfair.net/",
    },
  },
};

const USER_AGENT_SUFFIX_MOCK = "USER-AGENT-SUFFIX-MOCK";
jest.mock("@ppb/tbd-shared/helpers/user-agent.native", () => ({
  getCustomUserAgentSuffix: jest.fn().mockReturnValue(USER_AGENT_SUFFIX_MOCK),
}));

describe("when cet framework config setup is called", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function cetFrameworkSetup(params = {}) {
    return initialCetFrameworkSetup(
      params.jurisdiction ? params.jurisdiction : "",
      params.country ? params.country : "",
      params.authData ? params.authData : { JOIN_DATA: { joinNowLabel: "", joinNowLink: "" } },
    );
  }

  describe("when environment is configured", () => {
    it("should properly set cetEnvironment", async () => {
      getCurrentEnv.mockReturnValue("nxt");
      resolveCETEnvironment.mockReturnValueOnce("nxt");

      await cetFrameworkSetup();
      expect(resolveCETEnvironment).toHaveBeenCalledWith("nxt");
      expect(resolveCETEnvironment).toHaveBeenCalledTimes(1);
      expect(cetMainConfiguration.environmentConfiguration.environment).toBe("nxt");
    });
  });

  describe("universalAppLink", () => {
    it("should set the correct universalAppLink", async () => {
      await cetFrameworkSetup();

      expect(cetMainConfiguration.universalAppLink).toBe("https://www.betfair.com/betting/authexternal");
    });
  });

  describe("setCetInitialised", () => {
    it("should call setCetInitialised after init", async () => {
      await cetFrameworkSetup();
      expect(setCetInitialised).toHaveBeenCalledTimes(1);
    });
  });

  describe("when environment is not configured", () => {
    it("shouldn't return environmentConfiguration", async () => {
      getCurrentEnv.mockReturnValue(null);
      await cetFrameworkSetup();
      expect(cetMainConfiguration.environmentConfiguration).toBeNull();
    });
  });

  describe("applicationKey", () => {
    it("should return application key for ios", async () => {
      PLATFORM_MOCK.OS = "ios";
      await cetFrameworkSetup({ basePath: ENVIRONMENTS_MOCKS.environments.prd });
      expect(cetMainConfiguration.applicationKey).toBe(APP_CONFIG_MOCKS.APP_KEYS.ios);
    });

    it("should return application key for android", async () => {
      PLATFORM_MOCK.OS = "android";
      await cetFrameworkSetup({ basePath: ENVIRONMENTS_MOCKS.environments.prd });
      expect(cetMainConfiguration.applicationKey).toBe(APP_CONFIG_MOCKS.APP_KEYS.android);
    });
  });

  describe("myAccountScreenLinks", () => {
    it("should have MY_DETAILS setted with settings deeplink", () => {
      cetFrameworkSetup({ basePath: ENVIRONMENTS_MOCKS.environments.prd });
      expect(cetMainConfiguration.myAccountScreenLinks.MY_DETAILS).toEqual({
        link: "bfe://view/settings-settings",
      });
    });
  });

  describe("analyticsTrackingState", () => {
    beforeAll(() => {
      getAnalyticsTrackingState.mockResolvedValue("state");
    });

    it("should set as unset if OS is android", async () => {
      PLATFORM_MOCK.OS = "android";

      await cetFrameworkSetup();
      expect(cetMainConfiguration.analyticsConfiguration.analyticsTrackingState).toBe("unset");
    });

    it("should set the analyticsTrackingState correctly if OS is ios", async () => {
      PLATFORM_MOCK.OS = "ios";

      await cetFrameworkSetup();
      expect(cetMainConfiguration.analyticsConfiguration.analyticsTrackingState).toBe("state");
    });
  });

  describe("logGAEvent", () => {
    it("should call send event", async () => {
      await cetFrameworkSetup();
      cetMainConfiguration.analyticsConfiguration.logGAEvent({ message: "mock event", command: "logEvent" });
      expect(sendEvent).toHaveBeenCalledWith({ command: "logEvent", message: "mock event", product: "wrapper" });
    });
  });

  describe("logSignalFX", () => {
    let endMock;
    let startSpanMock;

    beforeEach(() => {
      endMock = jest.fn();
      startSpanMock = jest.fn(() => ({ end: endMock }));
      jest.spyOn(trace, "getTracer").mockReturnValue({ startSpan: startSpanMock });
    });

    it("should call getTracer with correct tracer name", async () => {
      await cetFrameworkSetup();
      await cetMainConfiguration.analyticsConfiguration.logSignalFX("eventType", "eventName", {});
      expect(trace.getTracer).toHaveBeenCalledWith("cet");
    });

    it("should flatten payload with cet.payload prefix and create span", async () => {
      await cetFrameworkSetup();
      const payload = {
        userId: "123",
        sessionId: "abc",
        value: 42,
      };

      await cetMainConfiguration.analyticsConfiguration.logSignalFX("eventType", "eventName", payload);

      expect(startSpanMock).toHaveBeenCalledWith("logger", {
        attributes: {
          "workflow.name": "eventName",
          eventType: "eventType",
          "cet.payload.userId": "123",
          "cet.payload.sessionId": "abc",
          "cet.payload.value": 42,
        },
      });
      expect(endMock).toHaveBeenCalled();
    });

    it("should stringify object values in payload", async () => {
      await cetFrameworkSetup();
      const payload = {
        user: { id: "123", name: "John" },
        simpleValue: "test",
        nested: { data: { deep: "value" } },
      };

      await cetMainConfiguration.analyticsConfiguration.logSignalFX("eventType", "eventName", payload);

      expect(startSpanMock).toHaveBeenCalledWith("logger", {
        attributes: {
          "workflow.name": "eventName",
          eventType: "eventType",
          "cet.payload.user": JSON.stringify({ id: "123", name: "John" }),
          "cet.payload.simpleValue": "test",
          "cet.payload.nested": JSON.stringify({ data: { deep: "value" } }),
        },
      });
      expect(endMock).toHaveBeenCalled();
    });

    it("should handle empty payload", async () => {
      await cetFrameworkSetup();

      await cetMainConfiguration.analyticsConfiguration.logSignalFX("eventType", "eventName", {});

      expect(startSpanMock).toHaveBeenCalledWith("logger", {
        attributes: {
          "workflow.name": "eventName",
          eventType: "eventType",
        },
      });
      expect(endMock).toHaveBeenCalled();
    });

    it("should not log errors in production mode", async () => {
      const originalDev = global.__DEV__;
      global.__DEV__ = false;
      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

      startSpanMock.mockImplementation(() => {
        throw new Error("Span creation failed");
      });

      await cetFrameworkSetup();

      await cetMainConfiguration.analyticsConfiguration.logSignalFX("eventType", "eventName", { test: "value" });

      expect(consoleLogSpy).not.toHaveBeenCalled();

      consoleLogSpy.mockRestore();
      global.__DEV__ = originalDev;
    });
  });

  it("should return SPORSTBOOK_BETS.link with default value", async () => {
    await cetFrameworkSetup({
      basePath: ENVIRONMENTS_MOCKS.environments.prd,
      jurisdiction: "international",
      country: "GB",
    });
    expect(cetMainConfiguration.myAccountScreenLinks.SPORTSBOOK_BETS.link).toBe("bfe://mybets/mybets-open");
  });

  describe("when authData is configured", () => {
    it("should return the correct value for joinNowLabel and joinNowUrl", async () => {
      await cetFrameworkSetup({
        authData: { JOIN_DATA: { joinNowLabel: "mocked_joinNowLabel", joinNowLink: "mocked_joinNowUrl" } },
      });
      expect(cetMainConfiguration.joinNowLabel).toBe("mocked_joinNowLabel");
      expect(cetMainConfiguration.joinNowUrl).toBe("mocked_joinNowUrl");
    });
  });

  describe("theme", () => {
    it("should have theme 1 when device theme is dark", async () => {
      jest.spyOn(Appearance, "getColorScheme").mockReturnValueOnce("dark");
      await cetFrameworkSetup({
        authData: { JOIN_DATA: { joinNowLabel: "mocked_joinNowLabel", joinNowLink: "mocked_joinNowUrl" } },
      });
      expect(cetMainConfiguration.theme).toBe(1);
    });
    it("should have theme 2 when device theme is light", async () => {
      await cetFrameworkSetup({
        authData: { JOIN_DATA: { joinNowLabel: "mocked_joinNowLabel", joinNowLink: "mocked_joinNowUrl" } },
      });
      expect(cetMainConfiguration.theme).toBe(2);
    });
  });

  it("should setup the correct User-Agent suffix", async () => {
    await cetFrameworkSetup();
    expect(getCustomUserAgentSuffix).toHaveBeenCalledOnce();
    expect(cetMainConfiguration.userAgentSuffix).toBe(USER_AGENT_SUFFIX_MOCK);
  });

  it("should properly set myAccountProductId", async () => {
    await cetFrameworkSetup();
    expect(getProdIdConfig).toHaveBeenCalled();
    expect(cetMainConfiguration.myAccountProductId).toBe("PRODUCT_ID");
  });

  describe("getTmxSessionId", () => {
    describe("when platform is iOS", () => {
      beforeEach(() => {
        PLATFORM_MOCK.OS = "ios";
      });

      it("should call TMXModule.profileDevice with correct parameters", async () => {
        const mockSessionId = "mock-session-id";
        NativeModules.TMXModule.profileDevice.mockResolvedValueOnce(JSON.stringify({ TMXSessionID: mockSessionId }));

        await cetFrameworkSetup();
        await cetMainConfiguration.tmxConfiguration.getSessionId();
        expect(NativeModules.TMXModule.profileDevice).toHaveBeenCalledWith("my device", "betfair");
      });

      it("should return TMXSessionID when response is string", async () => {
        const mockSessionId = "mock-session-id";
        NativeModules.TMXModule.profileDevice.mockResolvedValueOnce(JSON.stringify({ TMXSessionID: mockSessionId }));

        await cetFrameworkSetup();
        const result = await cetMainConfiguration.tmxConfiguration.getSessionId();
        expect(result).toBe(mockSessionId);
      });

      it("should return sessionId when response is object", async () => {
        const mockSessionId = "mock-session-id";
        NativeModules.TMXModule.profileDevice.mockResolvedValueOnce({
          sessionId: mockSessionId,
        });

        await cetFrameworkSetup();
        const result = await cetMainConfiguration.tmxConfiguration.getSessionId();
        expect(result).toBe(mockSessionId);
      });

      it("should return undefined when profiling fails", async () => {
        NativeModules.TMXModule.profileDevice.mockRejectedValueOnce(new Error("Profiling failed"));

        await cetFrameworkSetup();
        const result = await cetMainConfiguration.tmxConfiguration.getSessionId();
        expect(result).toBeUndefined();
      });
    });

    describe("when platform is Android", () => {
      beforeEach(() => {
        PLATFORM_MOCK.OS = "android";
      });

      it("should call CetModule.profileDevice with correct parameters", async () => {
        const mockSessionId = "mock-session-id";
        NativeModules.CetModule.profileDevice.mockResolvedValueOnce(JSON.stringify({ TMXSessionID: mockSessionId }));

        await cetFrameworkSetup();
        await cetMainConfiguration.tmxConfiguration.getSessionId();
        expect(NativeModules.CetModule.profileDevice).toHaveBeenCalledWith("my device", "betfair");
      });

      it("should return undefined when module is not available", async () => {
        const originalCetModule = NativeModules.CetModule;
        NativeModules.CetModule = undefined;

        await cetFrameworkSetup();
        const result = await cetMainConfiguration.tmxConfiguration.getSessionId();
        expect(result).toBeUndefined();

        NativeModules.CetModule = originalCetModule;
      });
    });
  });
});
