import { getAsyncCookie, getCookie, setCookie } from "./cookies";

const getCookieSpy = jest.spyOn(document, "cookie", "get");
const setCookieSpy = jest.spyOn(document, "cookie", "set");

global.window = Object.create(window);
Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting/football/sport:1",
    hostname: "www.betfair.com",
    pathname: "betting/football/sport:1",
  },
});

describe("cookies helper", () => {
  describe("getCookie", () => {
    describe("when requested cookie name does not match any of the document.cookie", () => {
      it("should return null", () => {
        expect(getCookie("cookie1")).toBe(null);
      });
    });

    describe("when requested cookie name matches with document.cookie", () => {
      it("should return the cookie value", () => {
        getCookieSpy.mockReturnValueOnce("cookie1=value1; cookie2=value2");
        expect(getCookie("cookie1")).toEqual("value1");
      });
    });
  });

  describe("getAsyncCookie", () => {
    describe("when requested cookie name does not match any of the document.cookie", () => {
      it("should return null", async () => {
        expect(await getAsyncCookie("cookie1")).toBe(null);
      });
    });

    describe("when requested cookie name matches with document.cookie", () => {
      it("should return the cookie value", async () => {
        getCookieSpy.mockReturnValueOnce("cookie1=value1; cookie2=value2");
        expect(await getAsyncCookie("cookie2")).toEqual("value2");
      });
    });
  });

  describe("setCookie", () => {
    describe("when path is passed as argument", () => {
      it("should set cookie on the defined path", () => {
        setCookie("cookie1", "value1", "/cookiePath");

        expect(setCookieSpy).toHaveBeenCalledWith("cookie1=value1;domain=.betfair.com;path=/cookiePath");
      });
    });

    describe("when path is not passed as argument", () => {
      it("should set cookie on the base path", () => {
        setCookieSpy.mockClear();
        setCookie("cookie1", "value1");

        expect(setCookieSpy).toHaveBeenCalledWith("cookie1=value1;domain=.betfair.com;path=/football");
      });
    });
  });
});
