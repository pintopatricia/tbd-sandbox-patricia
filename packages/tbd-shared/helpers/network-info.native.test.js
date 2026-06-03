import NetInfo from "@react-native-community/netinfo";
import { getNetworkAttributes, getNetworkAttributesFromState } from "./network-info.native";

jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(),
}));

describe("network-info.native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getNetworkAttributes", () => {
    it("should return correct attributes for WiFi connection", async () => {
      const mockWifiState = {
        type: "wifi",
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
        },
      };

      NetInfo.fetch.mockResolvedValue(mockWifiState);

      const attrs = await getNetworkAttributes();

      expect(attrs).toEqual({
        customNetworkType: "wifi",
        customNetworkEffectiveType: undefined,
        customNetworkIsConnected: true,
        customNetworkIsInternetReachable: true,
        customNetworkIsExpensive: false,
      });
    });

    it("should return correct attributes for 4G cellular connection", async () => {
      const mockCellularState = {
        type: "cellular",
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: "4g",
        },
      };

      NetInfo.fetch.mockResolvedValue(mockCellularState);

      const attrs = await getNetworkAttributes();

      expect(attrs).toEqual({
        customNetworkType: "cellular",
        customNetworkEffectiveType: "4g",
        customNetworkIsConnected: true,
        customNetworkIsInternetReachable: true,
        customNetworkIsExpensive: true,
      });
    });

    it("should return correct attributes for 5G cellular connection", async () => {
      const mockCellularState = {
        type: "cellular",
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: "5g",
        },
      };

      NetInfo.fetch.mockResolvedValue(mockCellularState);

      const attrs = await getNetworkAttributes();

      expect(attrs.customNetworkEffectiveType).toBe("5g");
    });

    it("should return correct attributes for 3G cellular connection", async () => {
      const mockCellularState = {
        type: "cellular",
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: "3g",
        },
      };

      NetInfo.fetch.mockResolvedValue(mockCellularState);

      const attrs = await getNetworkAttributes();

      expect(attrs.customNetworkEffectiveType).toBe("3g");
    });

    it("should handle null cellularGeneration gracefully", async () => {
      const mockCellularState = {
        type: "cellular",
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: null,
        },
      };

      NetInfo.fetch.mockResolvedValue(mockCellularState);

      const attrs = await getNetworkAttributes();

      expect(attrs.customNetworkEffectiveType).toBeUndefined();
    });

    it("should return correct attributes when offline", async () => {
      const mockOfflineState = {
        type: "none",
        isConnected: false,
        isInternetReachable: false,
        details: null,
      };

      NetInfo.fetch.mockResolvedValue(mockOfflineState);

      const attrs = await getNetworkAttributes();

      expect(attrs).toEqual({
        customNetworkType: "none",
        customNetworkEffectiveType: undefined,
        customNetworkIsConnected: false,
        customNetworkIsInternetReachable: false,
        customNetworkIsExpensive: undefined,
      });
    });

    it("should handle null isInternetReachable (initial state)", async () => {
      const mockInitialState = {
        type: "wifi",
        isConnected: true,
        isInternetReachable: null,
        details: {
          isConnectionExpensive: false,
        },
      };

      NetInfo.fetch.mockResolvedValue(mockInitialState);

      const attrs = await getNetworkAttributes();

      expect(attrs.customNetworkIsInternetReachable).toBeUndefined();
    });
  });

  describe("getNetworkAttributesFromState", () => {
    it("should return correct attributes from WiFi state", () => {
      const wifiState = {
        type: "wifi",
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
        },
      };

      const attrs = getNetworkAttributesFromState(wifiState);

      expect(attrs).toEqual({
        customNetworkType: "wifi",
        customNetworkEffectiveType: undefined,
        customNetworkIsConnected: true,
        customNetworkIsInternetReachable: true,
        customNetworkIsExpensive: false,
      });
    });

    it("should return correct attributes from cellular state with 4g", () => {
      const cellularState = {
        type: "cellular",
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: "4g",
        },
      };

      const attrs = getNetworkAttributesFromState(cellularState);

      expect(attrs.customNetworkType).toBe("cellular");
      expect(attrs.customNetworkEffectiveType).toBe("4g");
    });
  });
});
