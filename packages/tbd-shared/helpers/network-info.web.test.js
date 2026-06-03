import { getNetworkAttributes } from "./network-info.web";

describe("network-info.web", () => {
  const originalNavigator = window.navigator;
  let mockConnection;

  beforeEach(() => {
    // Reset mocks
    mockConnection = {
      effectiveType: "4g",
      type: "wifi",
      downlink: 10,
      rtt: 50,
      saveData: false,
    };
  });

  afterEach(() => {
    // Clean up
    jest.restoreAllMocks();
  });

  describe("getNetworkAttributes", () => {
    it("should return network attributes when Network Information API is available", () => {
      Object.defineProperty(window, "navigator", {
        value: {
          ...originalNavigator,
          connection: mockConnection,
          onLine: true,
        },
        writable: true,
        configurable: true,
      });

      const attrs = getNetworkAttributes();

      expect(attrs).toEqual({
        customNetworkType: "wifi",
        customNetworkEffectiveType: "4g",
        customNetworkIsConnected: true,
        customNetworkDownlink: 10,
        customNetworkRtt: 50,
        customNetworkSaveData: false,
      });
    });

    it("should return undefined values when Network Information API is not available (Safari/Firefox)", () => {
      Object.defineProperty(window, "navigator", {
        value: {
          ...originalNavigator,
          connection: undefined,
          onLine: true,
        },
        writable: true,
        configurable: true,
      });

      const attrs = getNetworkAttributes();

      expect(attrs).toEqual({
        customNetworkType: undefined,
        customNetworkEffectiveType: undefined,
        customNetworkIsConnected: true,
        customNetworkDownlink: undefined,
        customNetworkRtt: undefined,
        customNetworkSaveData: undefined,
      });
    });

    it("should return isConnected=false when navigator.onLine is false", () => {
      Object.defineProperty(window, "navigator", {
        value: {
          ...originalNavigator,
          connection: mockConnection,
          onLine: false,
        },
        writable: true,
        configurable: true,
      });

      const attrs = getNetworkAttributes();

      expect(attrs.customNetworkIsConnected).toBe(false);
    });

    it("should handle cellular connection type", () => {
      mockConnection.type = "cellular";
      mockConnection.effectiveType = "3g";
      mockConnection.downlink = 1.5;
      mockConnection.rtt = 300;

      Object.defineProperty(window, "navigator", {
        value: {
          ...originalNavigator,
          connection: mockConnection,
          onLine: true,
        },
        writable: true,
        configurable: true,
      });

      const attrs = getNetworkAttributes();

      expect(attrs.customNetworkType).toBe("cellular");
      expect(attrs.customNetworkEffectiveType).toBe("3g");
    });

    it("should handle slow-2g effective type", () => {
      mockConnection.effectiveType = "slow-2g";
      mockConnection.downlink = 0.05;
      mockConnection.rtt = 2000;

      Object.defineProperty(window, "navigator", {
        value: {
          ...originalNavigator,
          connection: mockConnection,
          onLine: true,
        },
        writable: true,
        configurable: true,
      });

      const attrs = getNetworkAttributes();

      expect(attrs.customNetworkEffectiveType).toBe("slow-2g");
      expect(attrs.customNetworkRtt).toBe(2000);
    });

    it("should handle saveData mode enabled", () => {
      mockConnection.saveData = true;

      Object.defineProperty(window, "navigator", {
        value: {
          ...originalNavigator,
          connection: mockConnection,
          onLine: true,
        },
        writable: true,
        configurable: true,
      });

      const attrs = getNetworkAttributes();

      expect(attrs.customNetworkSaveData).toBe(true);
    });
  });
});
