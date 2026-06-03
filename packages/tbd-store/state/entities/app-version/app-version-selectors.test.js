import { getAppPlatformVersion, createGetAppPlatformVersionSelector } from "./app-version-selectors";

describe("app-version selectors", () => {
  describe("getAppPlatformVersion", () => {
    it("returns undefined when state is undefined", () => {
      expect(getAppPlatformVersion(undefined, "android")).toBeUndefined();
    });

    it("returns undefined when state is null", () => {
      expect(getAppPlatformVersion(null, "ios")).toBeUndefined();
    });

    it("returns platform version by os", () => {
      const androidVersion = { versionCode: 10, minVersionCode: 8 };
      const iosVersion = { versionCode: 20, minVersionCode: 18 };
      const stateSlice = { android: androidVersion, ios: iosVersion };

      expect(getAppPlatformVersion(stateSlice, "android")).toBe(androidVersion);
      expect(getAppPlatformVersion(stateSlice, "ios")).toBe(iosVersion);
    });

    it("returns undefined when os key is missing", () => {
      const stateSlice = { android: { versionCode: 1 } };
      expect(getAppPlatformVersion(stateSlice, "ios")).toBeUndefined();
    });
  });

  describe("createGetAppPlatformVersionSelector", () => {
    it("memoizes results across identical inputs", () => {
      const selector = createGetAppPlatformVersionSelector();
      const androidVersion = { versionCode: 10 };
      const iosVersion = { versionCode: 20 };
      const stateSlice = { android: androidVersion, ios: iosVersion };

      const first = selector(stateSlice, "android");
      expect(first).toBe(androidVersion);
      expect(selector.recomputations()).toBe(1);

      const second = selector(stateSlice, "android");
      expect(second).toBe(androidVersion);
      expect(selector.recomputations()).toBe(1);

      const third = selector(stateSlice, "ios");
      expect(third).toBe(iosVersion);
      expect(selector.recomputations()).toBe(2);
    });

    it("does not recompute when state reference changes but selected value is identical", () => {
      const selector = createGetAppPlatformVersionSelector();
      const androidVersion = { versionCode: 10 };
      const initialSlice = { android: androidVersion, ios: { versionCode: 20 } };

      selector(initialSlice, "android");
      expect(selector.recomputations()).toBe(1);

      const nextSlice = { android: androidVersion, ios: { versionCode: 30 } };
      const result = selector(nextSlice, "android");
      expect(result).toBe(androidVersion);
      expect(selector.recomputations()).toBe(1);
    });
  });
});
