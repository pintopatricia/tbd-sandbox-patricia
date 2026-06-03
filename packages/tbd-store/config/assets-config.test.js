import { setupAssets, getAssets } from "./assets-config";

const assetsConfigWithHost = {
  HOST: "https://fakehost",
  BASE_PATH: "https://fakehost/betting/assets",
};

const assetsConfigWithoutHost = {
  HOST: "",
  BASE_PATH: "/betting/assets",
};

describe("assets-config", () => {
  describe("when host is available", () => {
    // Native Only
    describe("and there is a basePath available", () => {
      it("should set assets config", () => {
        setupAssets(assetsConfigWithHost, "https://www.qa.com.betfair/");
        expect(getAssets()).toEqual(assetsConfigWithHost);
      });
    });
    // Web Only
    describe("and there isn't a basePath available", () => {
      it("should set assets config", () => {
        setupAssets(assetsConfigWithHost);
        expect(getAssets()).toEqual(assetsConfigWithHost);
      });
    });
  });

  describe("when host isn't available", () => {
    // Native Only
    describe("and there is a basePath available", () => {
      it("should set assets config", () => {
        setupAssets(assetsConfigWithoutHost, "https://www.qa.com.betfair/");
        expect(getAssets()).toEqual({
          HOST: "",
          BASE_PATH: "https://www.qa.com.betfair/betting/assets",
        });
      });
    });
    // Web Only
    describe("and there isn't a basePath available", () => {
      it("should set assets config", () => {
        setupAssets(assetsConfigWithoutHost);
        expect(getAssets()).toEqual(assetsConfigWithoutHost);
      });
    });
  });
});
