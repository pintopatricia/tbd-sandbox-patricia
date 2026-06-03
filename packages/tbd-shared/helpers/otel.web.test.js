import { setOtelCustomAttributes } from "./otel.web";
import { getActiveThrottles } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { getUserAgent } from "./user-agent.web";
import { getNetworkAttributes } from "./network-info.web";

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  getActiveThrottles: jest.fn(),
}));

jest.mock("./user-agent.web", () => ({
  getUserAgent: jest.fn(),
}));

jest.mock("./network-info.web", () => ({
  getNetworkAttributes: jest.fn(),
}));

describe("otel.web", () => {
  let mockSplunkRum;
  const originalNavigator = window.navigator;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSplunkRum = {
      setGlobalAttributes: jest.fn(),
    };
    window.SplunkRum = mockSplunkRum;

    // Default mock values
    getUserAgent.mockReturnValue("TestUserAgent/1.0.0");
    getActiveThrottles.mockReturnValue(["throttle1", "throttle2"]);
    getNetworkAttributes.mockReturnValue({
      customNetworkType: "wifi",
      customNetworkEffectiveType: "4g",
      customNetworkIsConnected: true,
      customNetworkDownlink: 10,
      customNetworkRtt: 50,
      customNetworkSaveData: false,
    });

    // Mock hardware properties
    Object.defineProperty(window, "navigator", {
      value: {
        ...originalNavigator,
        hardwareConcurrency: 8,
        deviceMemory: 16,
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    delete window.SplunkRum;
    Object.defineProperty(window, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  describe("setOtelCustomAttributes", () => {
    it("should set custom attributes for a logged in user", () => {
      const preloadedState = {
        entities: {
          userdetails: {
            loggedIn: true,
            accountId: 12345,
          },
          brandSettings: {
            setting1: true,
            setting2: false,
          },
          experiments: {
            exp1: "variant1",
            exp2: "variant2",
          },
          throttles: {
            throttle1: { active: true },
            throttle2: { active: true },
          },
        },
      };

      setOtelCustomAttributes(preloadedState);

      expect(mockSplunkRum.setGlobalAttributes).toHaveBeenCalledWith(
        expect.objectContaining({
          customUserAgent: "TestUserAgent/1.0.0",
          customLoggedIn: true,
          customThrottles: "throttle1,throttle2",
          customExperiments: "exp1,exp2",
          customAccountId: 12345,
          customBrandSettings: "setting1,setting2",
          customHardwareConcurrency: 8,
          customDeviceMemory: 16,
          customNetworkType: "wifi",
          customNetworkEffectiveType: "4g",
          customNetworkIsConnected: true,
          customNetworkDownlink: 10,
          customNetworkRtt: 50,
          customNetworkSaveData: false,
        }),
      );
    });

    it("should set custom attributes for a logged out user", () => {
      const preloadedState = {
        entities: {
          userdetails: {
            loggedIn: false,
          },
          brandSettings: null,
          experiments: {},
          throttles: {},
        },
      };

      getActiveThrottles.mockReturnValue([]);

      setOtelCustomAttributes(preloadedState);

      expect(mockSplunkRum.setGlobalAttributes).toHaveBeenCalledWith(
        expect.objectContaining({
          customLoggedIn: false,
          customThrottles: "",
          customExperiments: "",
        }),
      );

      // Should not include accountId for logged out users
      const callArgs = mockSplunkRum.setGlobalAttributes.mock.calls[0][0];
      expect(callArgs.customAccountId).toBeUndefined();
    });

    it("should include network attributes", () => {
      const preloadedState = {
        entities: {
          userdetails: { loggedIn: false },
          experiments: {},
          throttles: {},
        },
      };

      getActiveThrottles.mockReturnValue([]);

      setOtelCustomAttributes(preloadedState);

      expect(mockSplunkRum.setGlobalAttributes).toHaveBeenCalledWith(
        expect.objectContaining({
          customNetworkType: "wifi",
          customNetworkEffectiveType: "4g",
          customNetworkIsConnected: true,
          customNetworkDownlink: 10,
          customNetworkRtt: 50,
          customNetworkSaveData: false,
        }),
      );
    });

    it("should handle missing Network Information API (Safari/Firefox)", () => {
      getNetworkAttributes.mockReturnValue({
        customNetworkType: undefined,
        customNetworkEffectiveType: undefined,
        customNetworkIsConnected: true,
        customNetworkDownlink: undefined,
        customNetworkRtt: undefined,
        customNetworkSaveData: undefined,
      });

      const preloadedState = {
        entities: {
          userdetails: { loggedIn: false },
          experiments: {},
          throttles: {},
        },
      };

      getActiveThrottles.mockReturnValue([]);

      setOtelCustomAttributes(preloadedState);

      expect(mockSplunkRum.setGlobalAttributes).toHaveBeenCalledWith(
        expect.objectContaining({
          customNetworkType: undefined,
          customNetworkEffectiveType: undefined,
          customNetworkIsConnected: true,
        }),
      );
    });

    it("should handle missing hardwareConcurrency", () => {
      Object.defineProperty(window, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: undefined,
          deviceMemory: 8,
        },
        writable: true,
        configurable: true,
      });

      const preloadedState = {
        entities: {
          userdetails: { loggedIn: false },
          experiments: {},
          throttles: {},
        },
      };

      getActiveThrottles.mockReturnValue([]);

      setOtelCustomAttributes(preloadedState);

      const callArgs = mockSplunkRum.setGlobalAttributes.mock.calls[0][0];
      expect(callArgs.customHardwareConcurrency).toBeUndefined();
    });

    it("should handle missing deviceMemory", () => {
      Object.defineProperty(window, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: 4,
          deviceMemory: undefined,
        },
        writable: true,
        configurable: true,
      });

      const preloadedState = {
        entities: {
          userdetails: { loggedIn: false },
          experiments: {},
          throttles: {},
        },
      };

      getActiveThrottles.mockReturnValue([]);

      setOtelCustomAttributes(preloadedState);

      const callArgs = mockSplunkRum.setGlobalAttributes.mock.calls[0][0];
      expect(callArgs.customDeviceMemory).toBeUndefined();
    });

    it("should handle null experiments", () => {
      const preloadedState = {
        entities: {
          userdetails: { loggedIn: false },
          experiments: null,
          throttles: {},
        },
      };

      getActiveThrottles.mockReturnValue([]);

      setOtelCustomAttributes(preloadedState);

      expect(mockSplunkRum.setGlobalAttributes).toHaveBeenCalledWith(
        expect.objectContaining({
          customExperiments: "",
        }),
      );
    });

    it("should not throw when SplunkRum is undefined", () => {
      delete window.SplunkRum;

      const preloadedState = {
        entities: {
          userdetails: { loggedIn: false },
          experiments: {},
          throttles: {},
        },
      };

      getActiveThrottles.mockReturnValue([]);

      expect(() => setOtelCustomAttributes(preloadedState)).not.toThrow();
    });

    it("should call getActiveThrottles with throttles entity", () => {
      const throttlesData = {
        throttle1: { active: true },
        throttle2: { active: false },
      };

      const preloadedState = {
        entities: {
          userdetails: { loggedIn: false },
          experiments: {},
          throttles: throttlesData,
        },
      };

      getActiveThrottles.mockReturnValue(["throttle1"]);

      setOtelCustomAttributes(preloadedState);

      expect(getActiveThrottles).toHaveBeenCalledWith(throttlesData);
    });

    it("should not throw and log error when getNetworkAttributes throws an error", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Network API error");
      getNetworkAttributes.mockImplementation(() => {
        throw error;
      });

      const preloadedState = {
        entities: {
          userdetails: { loggedIn: false },
          experiments: {},
          throttles: {},
        },
      };

      getActiveThrottles.mockReturnValue([]);

      expect(() => setOtelCustomAttributes(preloadedState)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith("Failed to get network attributes:", error);
      consoleSpy.mockRestore();
    });
  });
});
