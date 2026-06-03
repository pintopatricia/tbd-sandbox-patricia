import CookieManager from "@react-native-cookies/cookies";

import { Platform } from "react-native";
import { getBasePath } from "../config/base-path-utils.native";

jest.mock("@react-native-cookies/cookies", () => ({
  get: jest.fn().mockResolvedValue({ myCookie: { value: "cookies" } }),
  set: jest.fn().mockResolvedValue("mock-return-cookie-set-value"),
  clearAll: jest.fn(),
}));

jest.mock("react-native", () => ({
  Platform: {
    OS: "ios",
  },
}));

jest.mock("../config/base-path-utils.native", () => ({
  getBasePath: jest.fn(() => "https://apitbdn.qa.com.betfair/"),
}));

jest.mock("../config/settings-utils.native", () => jest.fn());

const setup = () => {
  jest.clearAllMocks();

  let getCookie;
  let setCookie;

  jest.isolateModules(() => {
    ({ getCookie, setCookie } = require("./cookies.native"));
  });

  return { getCookie, setCookie };
};

describe("cookies helper", () => {
  describe("getCookie", () => {
    it("should build the base path", async () => {
      const { getCookie } = setup();
      await getCookie("myCookie");

      expect(getBasePath).toHaveBeenCalled();
    });

    describe("when cookie is defined", () => {
      it("should get cookies from CookieManager", async () => {
        const { getCookie } = setup();
        await getCookie("myCookie");

        expect(CookieManager.get).toHaveBeenCalledWith("https://apitbdn.qa.com.betfair");
      });

      it("should return cookie value", async () => {
        const { getCookie } = setup();
        const cookie = await getCookie("myCookie");

        expect(cookie).toEqual("cookies");
      });
    });

    describe("when cookie is not defined", () => {
      it("should get cookies from CookieManager", async () => {
        const { getCookie } = setup();
        await getCookie("myCookie");

        expect(CookieManager.get).toHaveBeenCalledWith("https://apitbdn.qa.com.betfair");
      });

      it("should return undefined", async () => {
        const { getCookie } = setup();
        const cookie = await getCookie("undefinedCookie");

        expect(cookie).toBe(undefined);
      });
    });
  });

  describe("setCookie", () => {
    it("should build the base path", async () => {
      const { setCookie } = setup();
      await setCookie("cookieName", "cookieValue");

      expect(await getBasePath).toHaveBeenCalled();
    });

    it("should call the CookieManager with default values", async () => {
      const { setCookie } = setup();
      await setCookie("cookieName", "cookieValue");

      expect(CookieManager.set).toHaveBeenCalledWith("https://apitbdn.qa.com.betfair", {
        domain: ".apitbdn.qa.com.betfair",
        httpOnly: true,
        name: "cookieName",
        secure: true,
        value: "cookieValue",
      });
    });

    describe("and the basePath is local environment and ios", () => {
      it("should call the CookieManager with secure equals false", async () => {
        const { setCookie } = setup();
        Platform.OS = "ios";
        await getBasePath.mockReturnValueOnce("http://localhost.betfair.com");
        await setCookie("cookieName", "cookieValue");
        expect(await CookieManager.set).toHaveBeenCalledWith("http://localhost.betfair.com", {
          domain: ".betfair.com",
          httpOnly: true,
          name: "cookieName",
          secure: false,
          value: "cookieValue",
        });
      });
    });

    describe("and the basePath is local environment and android", () => {
      it("should call the CookieManager with secure equals false", async () => {
        const { setCookie } = setup();
        await getBasePath.mockReturnValueOnce("http://localhost.betfair.com");
        Platform.OS = "android";
        await setCookie("cookieName", "cookieValue");
        expect(await CookieManager.set).toHaveBeenCalledWith("http://localhost.betfair.com", {
          domain: "localhost.betfair.com",
          httpOnly: true,
          name: "cookieName",
          secure: false,
          value: "cookieValue",
        });
      });
    });

    describe("when expires is passed as parameter", () => {
      it("should call the CookieManager with default values and expires value defined", async () => {
        const { setCookie } = setup();
        await setCookie("cookieName", "cookieValue", "expiresValue");

        expect(await CookieManager.set).toHaveBeenCalledWith("https://apitbdn.qa.com.betfair", {
          domain: ".apitbdn.qa.com.betfair",
          httpOnly: true,
          name: "cookieName",
          secure: true,
          value: "cookieValue",
          expires: "expiresValue",
        });
      });
    });
  });
});
