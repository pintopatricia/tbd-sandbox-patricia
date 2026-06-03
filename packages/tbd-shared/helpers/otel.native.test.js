import { getOtelCustomAttributes, getOtelNetworkAttributes } from "./otel.native";
import { getActiveThrottles } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { getCustomUserAgent } from "./user-agent.native";
import { getTotalMemorySync } from "react-native-device-info";
import { getNetworkAttributes } from "./network-info.native";

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  getActiveThrottles: jest.fn(),
}));

jest.mock("./user-agent.native", () => ({
  getCustomUserAgent: jest.fn(),
}));

jest.mock("react-native-device-info", () => ({
  getTotalMemorySync: jest.fn(),
}));

jest.mock("./network-info.native", () => ({
  getNetworkAttributes: jest.fn(),
}));

describe("otel.native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOtelCustomAttributes", () => {
    it("should return correct custom attributes for a logged in user", () => {
      getCustomUserAgent.mockReturnValue("TestUserAgent/1.0.0");
      getActiveThrottles.mockReturnValue(["throttle1", "throttle2"]);
      getTotalMemorySync.mockReturnValue(4000000000);

      const entities = {
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
      };

      const attributes = getOtelCustomAttributes(entities);

      expect(attributes).toEqual({
        customUserAgent: "TestUserAgent/1.0.0",
        customLoggedIn: true,
        customThrottles: "throttle1,throttle2",
        customExperiments: "exp1,exp2",
        customDeviceMemory: 4000000000,
        customBrandSettings: "setting1,setting2",
        customAccountId: "12345",
      });
    });

    it("should return correct custom attributes for a logged out user", () => {
      getCustomUserAgent.mockReturnValue("TestUserAgent/1.0.0");
      getActiveThrottles.mockReturnValue([]);
      getTotalMemorySync.mockReturnValue(2000000000);

      const entities = {
        userdetails: {
          loggedIn: false,
          accountId: 0,
        },
        brandSettings: {},
        experiments: null,
        throttles: {},
      };

      const attributes = getOtelCustomAttributes(entities);

      expect(attributes).toEqual({
        customUserAgent: "TestUserAgent/1.0.0",
        customLoggedIn: false,
        customThrottles: "",
        customExperiments: "",
        customDeviceMemory: 2000000000,
        customBrandSettings: "",
        customAccountId: "0",
      });
    });

    it("should handle undefined experiments", () => {
      getCustomUserAgent.mockReturnValue("TestUserAgent/1.0.0");
      getActiveThrottles.mockReturnValue([]);
      getTotalMemorySync.mockReturnValue(3000000000);

      const entities = {
        userdetails: {
          loggedIn: false,
          accountId: 0,
        },
        brandSettings: { someSetting: true },
        experiments: undefined,
        throttles: {},
      };

      const attributes = getOtelCustomAttributes(entities);

      expect(attributes.customExperiments).toBe("");
    });

    it("should call getActiveThrottles with throttles entity", () => {
      getCustomUserAgent.mockReturnValue("TestUserAgent/1.0.0");
      getActiveThrottles.mockReturnValue(["activeThrottle"]);
      getTotalMemorySync.mockReturnValue(4000000000);

      const throttlesData = {
        throttle1: { active: true },
        throttle2: { active: false },
      };

      const entities = {
        userdetails: { loggedIn: true, accountId: 123 },
        brandSettings: {},
        experiments: {},
        throttles: throttlesData,
      };

      getOtelCustomAttributes(entities);

      expect(getActiveThrottles).toHaveBeenCalledWith(throttlesData);
    });
  });

  describe("getOtelNetworkAttributes", () => {
    it("should return network attributes for WiFi connection", async () => {
      getNetworkAttributes.mockResolvedValue({
        customNetworkType: "wifi",
        customNetworkEffectiveType: undefined,
        customNetworkIsConnected: true,
        customNetworkIsInternetReachable: true,
        customNetworkIsExpensive: false,
      });

      const attributes = await getOtelNetworkAttributes();

      expect(attributes).toEqual({
        customNetworkType: "wifi",
        customNetworkEffectiveType: undefined,
        customNetworkIsConnected: true,
        customNetworkIsInternetReachable: true,
        customNetworkIsExpensive: false,
      });
    });

    it("should return network attributes for cellular 4G connection", async () => {
      getNetworkAttributes.mockResolvedValue({
        customNetworkType: "cellular",
        customNetworkEffectiveType: "4g",
        customNetworkIsConnected: true,
        customNetworkIsInternetReachable: true,
        customNetworkIsExpensive: true,
      });

      const attributes = await getOtelNetworkAttributes();

      expect(attributes).toEqual({
        customNetworkType: "cellular",
        customNetworkEffectiveType: "4g",
        customNetworkIsConnected: true,
        customNetworkIsInternetReachable: true,
        customNetworkIsExpensive: true,
      });
    });

    it("should return correct attributes when offline", async () => {
      getNetworkAttributes.mockResolvedValue({
        customNetworkType: "none",
        customNetworkEffectiveType: undefined,
        customNetworkIsConnected: false,
        customNetworkIsInternetReachable: false,
        customNetworkIsExpensive: undefined,
      });

      const attributes = await getOtelNetworkAttributes();

      expect(attributes).toEqual({
        customNetworkType: "none",
        customNetworkEffectiveType: undefined,
        customNetworkIsConnected: false,
        customNetworkIsInternetReachable: false,
        customNetworkIsExpensive: undefined,
      });
    });

    it("should call getNetworkAttributes from network-info.native", async () => {
      getNetworkAttributes.mockResolvedValue({
        customNetworkType: "wifi",
        customNetworkEffectiveType: undefined,
        customNetworkIsConnected: true,
        customNetworkIsInternetReachable: true,
        customNetworkIsExpensive: false,
      });

      await getOtelNetworkAttributes();

      expect(getNetworkAttributes).toHaveBeenCalledTimes(1);
    });

    it("should return empty object and log error when getNetworkAttributes throws an error", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Network error");
      getNetworkAttributes.mockRejectedValue(error);

      const attributes = await getOtelNetworkAttributes();

      expect(attributes).toEqual({});
      expect(consoleSpy).toHaveBeenCalledWith("Failed to get network attributes:", error);
      consoleSpy.mockRestore();
    });
  });
});
