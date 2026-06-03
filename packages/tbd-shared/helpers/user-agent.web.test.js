import {
  getUserAgent,
  getUserAgentData,
  getUserAgentOS,
  getOSVersion,
  isAndroidDevice,
  isIOSDevice,
} from "./user-agent.web";

describe("user agent", () => {
  describe("getUserAgent", () => {
    it("should return the user agent string from the navigator object", () => {
      const mockUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

      Object.defineProperty(window.navigator, "userAgent", {
        value: mockUserAgent,
        writable: true,
      });

      expect(getUserAgent()).toBe(mockUserAgent);
    });
  });

  describe("isAndroidDevice", () => {
    it("should handle an empty user agent string gracefully", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "",
        writable: true,
      });

      expect(isAndroidDevice()).toBe(false);
    });

    it("should return false when the user agent does not contain 'Android'", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        writable: true,
      });

      expect(isAndroidDevice()).toBe(false);
    });

    it("should return true when the user agent contains 'Android'", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 10; Pixel 3)",
        writable: true,
      });

      expect(isAndroidDevice()).toBe(true);
    });
  });

  describe("isIOSDevice", () => {
    it("should handle an empty user agent string gracefully", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "",
        writable: true,
      });

      expect(isIOSDevice()).toBe(false);
    });

    it("should return false when the user agent does not contain 'iOS'", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        writable: true,
      });

      expect(isIOSDevice()).toBe(false);
    });

    it("should return true when the user agent contains 'iOS'", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        writable: true,
      });

      expect(isIOSDevice()).toBe(true);
    });
  });

  describe("getUserAgentData", () => {
    it("should return parsed UA data with os information for Android", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 10; Pixel 3)",
        writable: true,
      });

      const data = getUserAgentData();
      expect(data).toBeTruthy();
      expect(data.os?.name?.toLowerCase()).toBe("android");
      expect(data.os?.version).toBe("10");
    });
  });

  describe("getUserAgentOS", () => {
    it("should return 'android' for Android UA", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 10; Pixel 3)",
        writable: true,
      });

      expect(getUserAgentOS()).toBe("android");
    });

    it("should return 'ios' for iOS UA", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        writable: true,
      });

      expect(getUserAgentOS()).toBe("ios");
    });

    it("should return undefined for empty UA", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "",
        writable: true,
      });

      expect(getUserAgentOS()).toBeUndefined();
    });
  });

  describe("getOSVersion", () => {
    it("should return version for Android UA", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 10; Pixel 3)",
        writable: true,
      });

      expect(getOSVersion()).toBe("10");
    });

    it("should return version for iOS UA", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        writable: true,
      });

      expect(getOSVersion()).toBe("15.6.0");
    });

    it("should return empty string for empty UA", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "",
        writable: true,
      });

      expect(getOSVersion()).toBeUndefined();
    });
  });
});
