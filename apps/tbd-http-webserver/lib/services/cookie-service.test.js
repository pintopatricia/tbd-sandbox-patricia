import { URL } from "url";
import sharedData from "../betfair-shared-data-cookie-helper";
import marketingCookiesHelper from "../marketing-cookies-helper";
import calculateRefererPartnerId from "./calculate-referer";
import {
  getCookiesToSet,
  setEnvironmentCookie,
  setPhoenixEnabledCookie,
  buildProductPreferenceCookies,
} from "./cookie-service";

const $headers = {
  getHeader: jest.fn().mockImplementation((a) => a),
};

const $cookies = {
  getCookie: jest.fn().mockImplementation((a) => a),
};

const $params = {
  requestHost: "requestHost",
};

const $userContext = {
  loggedIn: false,
};

const router = {
  currentUrl: "currentUrl",
};

jest.mock("../betfair-shared-data-cookie-helper");
jest.mock("../marketing-cookies-helper");
jest.mock("./calculate-referer");

sharedData.mockReturnValue({ changed: false });
marketingCookiesHelper.mockReturnValue([]);

const setup = (dependencies = {}) =>
  getCookiesToSet(
    dependencies.$headers || $headers,
    dependencies.$cookies || $cookies,
    dependencies.$params || $params,
    dependencies.$userContext || $userContext,
    dependencies.localeCode || "localeCode",
    dependencies.router || router,
  );

describe("getCookiesToSet", () => {
  it.each([
    ["www-cms.betfair.com.qa.ppbdev.com", ".betfair.com.qa.ppbdev.com"],
    ["www.betfair.com", ".betfair.com"],
    ["localhost.betfair.com:80", ".betfair.com"],
    ["www.nxt.com.betfair", ".nxt.com.betfair"],
    ["betfair.com", "betfair.com"],
    ["http://www-cms.betfair.com.qa.ppbdev.com", ".betfair.com.qa.ppbdev.com"],
    ["http://www.betfair.com", ".betfair.com"],
    ["http://betfair.com", "betfair.com"],
    ["http://sports.pokerstars.com", ".pokerstars.com"],
  ])(
    "[%s] should always return locale and language cookie with value of localeCode and domain from requestHost",
    async (requestHost, expectedDomain) => {
      expect(await setup({ $params: { requestHost }, localeCode: "ok" })).toEqual([
        { name: "locale", value: "ok", options: { domain: expectedDomain, path: "/" } },
        { name: "language", value: "ok", options: { domain: expectedDomain, path: "/" } },
      ]);
    },
  );

  describe("when marketingCookiesHelper returns cookies", () => {
    it("should return them", async () => {
      expect(await setup({ $params: { requestHost: "http://www.betfair.com" }, localeCode: "ok" })).toEqual([
        { name: "locale", value: "ok", options: { domain: ".betfair.com", path: "/" } },
        { name: "language", value: "ok", options: { domain: ".betfair.com", path: "/" } },
      ]);
    });
  });

  describe("when bfsd has changed", () => {
    it("should set bfsd to the new value", async () => {
      marketingCookiesHelper.mockReturnValue([
        {
          name: "test",
          value: "ok",
          options: { some: "options" },
        },
        {
          name: "test2",
          value: "ok2",
          options: { some: "options2" },
        },
      ]);
      calculateRefererPartnerId.mockReturnValue("referer1");

      const cookies = await setup({
        $headers: { getHeader: jest.fn().mockReturnValue("testHeader") },
        $params: { requestHost: "http://www.betfair.com" },
        router: { currentUrl: "http://www.betfair.com" },
      });

      expect(calculateRefererPartnerId).toHaveBeenCalledWith("testHeader", { currentUrl: "http://www.betfair.com" });
      expect(marketingCookiesHelper).toHaveBeenCalledWith(
        new URL("http://www.betfair.com"),
        ".betfair.com",
        "referer1",
      );
      expect(cookies[2]).toEqual({
        name: "test",
        value: "ok",
        options: { some: "options", encode: String },
      });
      expect(cookies[3]).toEqual({
        name: "test2",
        value: "ok2",
        options: { some: "options2", encode: String },
      });
    });
  });

  describe("when bfsd has not changed", () => {
    it("should not return bfsd cookie", async () => {
      marketingCookiesHelper.mockReturnValue([]);

      const cookies = await setup();

      expect(cookies.length).toEqual(2);
    });
  });
});

describe("setEnvironmentCookie", () => {
  it("should set env cookie", async () => {
    const cookiesMock = {
      setCookie: jest.fn(),
    };

    setEnvironmentCookie(
      cookiesMock,
      {
        requestHost: "betfair.com",
      },
      "some_env",
      "some_hash",
    );

    expect(cookiesMock.setCookie).toHaveBeenCalledWith("some_env", "some_hash", { domain: "betfair.com", path: "/" });
  });
});

describe("buildCookieCorrections", () => {
  const $params = { requestHost: "www.betfair.com" };
  const expectedDomain = ".betfair.com";

  it("returns empty array when corrections is null", () => {
    expect(buildProductPreferenceCookies($params, null)).toEqual([]);
  });

  it("returns only tbd_dp cookie when only tbd_dp is provided", () => {
    expect(buildProductPreferenceCookies($params, { tbd_dp: "exchange" })).toEqual([
      { name: "tbd_dp", value: "exchange", options: { domain: expectedDomain, path: "/" } },
    ]);
  });

  it("returns only tbd_lvp cookie when only tbd_lvp is provided", () => {
    expect(buildProductPreferenceCookies($params, { tbd_lvp: "sportsbook" })).toEqual([
      { name: "tbd_lvp", value: "sportsbook", options: { domain: expectedDomain, path: "/" } },
    ]);
  });

  it("returns both cookies when both tbd_dp and tbd_lvp are provided", () => {
    expect(buildProductPreferenceCookies($params, { tbd_dp: "exchange", tbd_lvp: "exchange" })).toEqual([
      { name: "tbd_dp", value: "exchange", options: { domain: expectedDomain, path: "/" } },
      { name: "tbd_lvp", value: "exchange", options: { domain: expectedDomain, path: "/" } },
    ]);
  });
});

describe("setPhoenixEnabledCookie", () => {
  it("should set the phoenixEnabled cookie with value true", () => {
    const cookiesMock = { setCookie: jest.fn() };

    setPhoenixEnabledCookie(cookiesMock, { requestHost: "www.betfair.com" }, true);

    expect(cookiesMock.setCookie).toHaveBeenCalledWith("phoenixEnabled", "true", {
      domain: ".betfair.com",
      path: "/",
    });
  });

  it("should set the phoenixEnabled cookie with value false", () => {
    const cookiesMock = { setCookie: jest.fn() };

    setPhoenixEnabledCookie(cookiesMock, { requestHost: "www.betfair.com" }, false);

    expect(cookiesMock.setCookie).toHaveBeenCalledWith("phoenixEnabled", "false", {
      domain: ".betfair.com",
      path: "/",
    });
  });
});
