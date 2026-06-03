import { codecs } from "@ppb/tbd-urn-codecs";
import { findRoute } from "@ppb/tbd-routes";
import getRoutingData from "./routing-data";

jest.mock("@ppb/tbd-routes", () => ({
  findRoute: jest.fn(),
}));

const BASE = "/betting/";
const RESULT_TEMPLATE = {
  showBackButton: false,
  isRefreshing: false,
  currentUrl: "random/url",
  currentUrn: "ppb:tbd:view:generic:home",
  currentView: "ppb:tbd:view:generic",
  currentTabUrn: null,
  locationKey: null,
  firstLocationKey: null,
};

describe("routing data service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should remove /betting/ from uri", () => {
    getRoutingData(BASE, "/betting/football/s-1");

    expect(findRoute).toHaveBeenCalledWith("football/s-1");
  });

  it("should return router state", () => {
    findRoute.mockImplementation(() => codecs.sportView.encode("12345"));

    const result = getRoutingData(BASE, "/betting/football/s-1");

    expect(result).toEqual({
      ...RESULT_TEMPLATE,
      currentUrl: "football/s-1",
      currentUrn: "ppb:tbd:view:sport:12345",
      currentView: "ppb:tbd:view:sport",
    });
  });

  describe("when there's no urlPath", () => {
    beforeEach(() => {
      findRoute.mockImplementation(() => null);
    });

    it("should return homepage", () => {
      expect(getRoutingData(BASE)).toEqual({ ...RESULT_TEMPLATE, currentUrl: "" });
    });
  });

  describe("when there's urlPath", () => {
    describe("when there's no match for provided urlPath", () => {
      beforeEach(() => {
        findRoute.mockImplementation(() => null);
      });

      it("should return default one", () => {
        const result = getRoutingData(BASE, "/betting/random/url");

        expect(result).toEqual({
          ...RESULT_TEMPLATE,
          currentUrn: "ppb:tbd:view:notfound:notfound",
          currentView: "ppb:tbd:view:notfound",
        });
      });
    });

    describe("when there's a match and product query param is provided", () => {
      beforeEach(() => {
        findRoute.mockImplementation(() => codecs.sportView.encode("12345"));
      });

      it("should properly remove it from url", () => {
        const result1 = getRoutingData(BASE, "/betting/");
        const result2 = getRoutingData(BASE, "/betting/?product=EXC", { product: "EXC" });
        const result3 = getRoutingData(BASE, "/betting/?product=EXC&mock=MOCK", { product: "EXC" });
        const result4 = getRoutingData(BASE, "/betting/?mock=MOCK&product=SBK|EXC&param=PARAM", {
          product: "SBK|EXC",
        });
        const result5 = getRoutingData(BASE, "/betting/football/s-1");
        const result6 = getRoutingData(BASE, "/betting/football/s-1?product=EXC", { product: "EXC" });
        const result7 = getRoutingData(BASE, "/betting/football/s-1?product=SBK|EXC&mock=MOCK", {
          product: "SBK|EXC",
        });
        const result8 = getRoutingData(BASE, "/betting/football/s-1?mock=MOCK&product=SBK|EXC&param=PARAM", {
          product: "SBK|EXC",
        });
        const result9 = getRoutingData(BASE, "/betting/?tokens=0.0.0-my-pre&brand=my-brand&theme=sports.light", {
          customTokens: "0.0.0-my-pre",
          customBrand: "my-brand",
          customTheme: "sports.light",
        });

        expect(result1.currentUrl).toEqual("");
        expect(result2.currentUrl).toEqual("");
        expect(result3.currentUrl).toEqual("?mock=MOCK");
        expect(result4.currentUrl).toEqual("?mock=MOCK&param=PARAM");
        expect(result5.currentUrl).toEqual("football/s-1");
        expect(result6.currentUrl).toEqual("football/s-1");
        expect(result7.currentUrl).toEqual("football/s-1?mock=MOCK");
        expect(result8.currentUrl).toEqual("football/s-1?mock=MOCK&param=PARAM");
        expect(result9.currentUrl).toEqual("");
      });
    });
  });
});
