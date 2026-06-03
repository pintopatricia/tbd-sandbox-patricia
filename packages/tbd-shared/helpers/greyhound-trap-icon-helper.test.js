import { resolveTrapIconVM } from "./greyhound-trap-icon-helper";

describe("resolveTrapIconVM", () => {
  describe("for GB", () => {
    it("should return correct view model", () => {
      expect(resolveTrapIconVM("GB", undefined)).toEqual({
        size: "small",
        region: "UK",
        trap: "default",
      });
    });
  });

  describe("for AU", () => {
    it("should return correct view model", () => {
      expect(resolveTrapIconVM("AU", undefined)).toEqual({
        size: "small",
        region: "AU",
        trap: "default",
      });
    });
  });

  describe("for US", () => {
    it("should return correct view model", () => {
      expect(resolveTrapIconVM("US", undefined)).toEqual({
        size: "small",
        region: "US",
        trap: "default",
      });
    });
  });

  describe("for other countries", () => {
    it("should return correct view model", () => {
      expect(resolveTrapIconVM("FRA", undefined)).toEqual({
        size: "small",
        region: "AGNOSTIC",
        trap: "default",
      });
    });
  });

  describe("when there is no trap number", () => {
    it("should return correct view model", () => {
      expect(resolveTrapIconVM("GB", undefined)).toEqual({
        size: "small",
        region: "UK",
        trap: "default",
      });
    });
  });

  describe("when there is trap number", () => {
    it("should return correct view model", () => {
      expect(resolveTrapIconVM("GB", 3)).toEqual({
        size: "small",
        region: "UK",
        trap: 3,
      });
    });
  });
  describe("when there is no size", () => {
    it("should return correct view model with small size", () => {
      expect(resolveTrapIconVM("GB", 3)).toEqual({
        size: "small",
        region: "UK",
        trap: 3,
      });
    });
  });

  describe("when there is size", () => {
    it("should return correct view model with size", () => {
      expect(resolveTrapIconVM("GB", 3, "medium")).toEqual({
        size: "medium",
        region: "UK",
        trap: 3,
      });
    });
  });
});
