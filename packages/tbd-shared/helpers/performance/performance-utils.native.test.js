import * as performanceUtils from "./performance-utils.native";

describe("Performance utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calculateDelay should return a 5ms delay", () => {
    expect(performanceUtils.calculateDelay(1657026771830, 1657026770825, 1000)).toBe(5);
  });

  it("calculateSmoothingDelay should return a 8ms smoother delay", () => {
    expect(Math.round(performanceUtils.calculateSmoothingDelay(5, 10))).toBe(8);
  });

  it("calculateSmoothingDelay should smooth big delay", () => {
    expect(performanceUtils.calculateSmoothingDelay(150, 10) < 150).toBe(true);
  });
});
