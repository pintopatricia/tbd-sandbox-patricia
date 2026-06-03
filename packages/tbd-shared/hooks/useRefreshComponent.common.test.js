import {
  URNStaleCheckTimestamps,
  markUrnAsFresh,
  ensureStaleTrackingForUrn,
  isUrnStale,
  refreshIfStale,
  resetRefreshTimestamps,
} from "./useRefreshComponent.common";

describe("useRefreshComponent.common", () => {
  beforeEach(() => {
    resetRefreshTimestamps();
  });

  describe("markUrnAsFresh", () => {
    it("should set current timestamp for URN", () => {
      const urn = "test-urn";
      const beforeTime = Date.now();

      markUrnAsFresh(urn);

      const timestamp = URNStaleCheckTimestamps.get(urn);
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(Date.now());
    });
  });

  describe("ensureStaleTrackingForUrn", () => {
    it("should return false and mark as fresh for new URN", () => {
      const urn = "test-urn";

      const result = ensureStaleTrackingForUrn(urn);

      expect(result).toBe(false);
      expect(URNStaleCheckTimestamps.has(urn)).toBe(true);
    });

    it("should return true for existing URN", () => {
      const urn = "test-urn";
      markUrnAsFresh(urn);

      const result = ensureStaleTrackingForUrn(urn);

      expect(result).toBe(true);
    });
  });

  describe("isUrnStale", () => {
    it("should return true for timeout <= 0", () => {
      const urn = "test-urn";

      expect(isUrnStale(urn, 0)).toBe(true);
      expect(isUrnStale(urn, -1)).toBe(true);
    });

    it("should return false for URN not in map", () => {
      const urn = "test-urn";

      expect(isUrnStale(urn, 10)).toBe(false);
    });

    it("should return true for stale URN", () => {
      const urn = "test-urn";
      const oldTime = Date.now() - 2000;
      URNStaleCheckTimestamps.set(urn, oldTime);
      expect(isUrnStale(urn, 1)).toBe(true);
    });

    it("should return false for fresh URN", () => {
      const urn = "test-urn";
      markUrnAsFresh(urn);

      expect(isUrnStale(urn, 10)).toBe(false);
    });
  });

  describe("refreshIfStale", () => {
    it("should return true and mark as fresh for stale URN", () => {
      const urn = "test-urn";
      const oldTime = Date.now() - 141000;
      URNStaleCheckTimestamps.set(urn, oldTime);
      const result = refreshIfStale(urn, "TestComponent");
      expect(result).toBe(true);
      expect(URNStaleCheckTimestamps.get(urn)).toBeGreaterThan(oldTime);
    });

    it("should return false for fresh URN", () => {
      const urn = "test-urn";
      markUrnAsFresh(urn);

      const result = refreshIfStale(urn, "TestComponent");

      expect(result).toBe(false);
    });

    it("should use default timeout of 140 seconds", () => {
      const urn = "test-urn";
      const oldTime = Date.now() - 5000; // 5 seconds ago
      URNStaleCheckTimestamps.set(urn, oldTime);

      const result = refreshIfStale(urn, "TestComponent");

      expect(result).toBe(false); // Not stale yet (5s < 140s default)
    });
  });
});
