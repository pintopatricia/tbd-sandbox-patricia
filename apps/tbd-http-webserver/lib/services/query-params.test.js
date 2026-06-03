import { execSync } from "node:child_process";
import { getQueryParamsFromRequest } from "./query-params";

jest.mock("node:child_process", () => ({
  execSync: jest.fn(() => "1.2.3"),
}));

describe("getQueryParamsFromRequest", () => {
  describe("when product exists", () => {
    it("should return the product", () => {
      expect(getQueryParamsFromRequest("/betting?product=bla").product).toEqual("bla");
      expect(getQueryParamsFromRequest("/betting?a=b&product=bla").product).toEqual("bla");
    });
  });

  describe("when loginStatus exists", () => {
    it("should return the loginStatus", () => {
      expect(getQueryParamsFromRequest("/betting?loginStatus=bla").loginStatus).toEqual("bla");
      expect(getQueryParamsFromRequest("/betting?a=b&loginStatus=bla").loginStatus).toEqual("bla");
    });
  });

  describe("when exchangeEnabled exists", () => {
    it("should return the exchangeEnabled", () => {
      expect(getQueryParamsFromRequest("/betting?exc=true").exchangeEnabled).toEqual("true");
      expect(getQueryParamsFromRequest("/betting?a=b&exc=true").exchangeEnabled).toEqual("true");
    });
  });

  describe("when throttlesOn exists", () => {
    it("should return the throttlesOn", () => {
      expect(getQueryParamsFromRequest("/betting?throttlesOn=bla,ble").throttlesOn).toEqual("bla,ble");
      expect(getQueryParamsFromRequest("/betting?a=b&throttlesOn=bla,ble").throttlesOn).toEqual("bla,ble");
    });
  });

  describe("when throttlesOff exists", () => {
    it("should return the throttlesOff", () => {
      expect(getQueryParamsFromRequest("/betting?throttlesOff=bla,ble").throttlesOff).toEqual("bla,ble");
      expect(getQueryParamsFromRequest("/betting?a=b&throttlesOff=bla,ble").throttlesOff).toEqual("bla,ble");
    });
  });

  describe("when env exists", () => {
    it("should return the drk parameter", () => {
      expect(getQueryParamsFromRequest("/betting?drk=bla,ble").drk).toEqual("bla,ble");
      expect(getQueryParamsFromRequest("/betting?a=b&drk=bla,ble").drk).toEqual("bla,ble");
    });
  });

  describe("when tokens exists", () => {
    it("should return the customTokens", () => {
      expect(getQueryParamsFromRequest("/betting?tokens=0.0.0-my-pre").customTokens).toEqual("0.0.0-my-pre");
      expect(getQueryParamsFromRequest("/betting?a=b&tokens=0.0.0-my-pre").customTokens).toEqual("0.0.0-my-pre");
    });

    describe("when tokens is latest", () => {
      it("should call execSync to get the latest version", () => {
        getQueryParamsFromRequest("/betting?tokens=latest");
        expect(execSync).toHaveBeenCalledWith(
          "npm view @ppb/the-wall-design-tokens version --registry=http://artifactory-prd.prd.betfair/artifactory/api/npm/npm",
          { encoding: "utf-8" },
        );
      });

      it("should return the latest version when tokens is latest", () => {
        expect(getQueryParamsFromRequest("/betting?tokens=latest").customTokens).toEqual("1.2.3");
      });
    });
  });

  describe("when brand exists", () => {
    it("should return the customBrand", () => {
      expect(getQueryParamsFromRequest("/betting?brand=my-brand").customBrand).toEqual("my-brand");
      expect(getQueryParamsFromRequest("/betting?a=b&brand=my-brand").customBrand).toEqual("my-brand");
    });
  });

  describe("when theme exists", () => {
    it("should return the customTheme", () => {
      expect(getQueryParamsFromRequest("/betting?theme=sports.light").customTheme).toEqual("sports.light");
      expect(getQueryParamsFromRequest("/betting?a=b&theme=sports.light").customTheme).toEqual("sports.light");
    });
  });
});
