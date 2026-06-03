import { buildSetCookieInstructions } from "@ppb/affiliates-tracking";
import marketingCookiesHelper from "./marketing-cookies-helper";

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("@ppb/affiliates-tracking", () => ({
  buildSetCookieInstructions: jest.fn().mockReturnValue([
    {
      name: "rfr",
      value: "990768",
      attributes: { expires: "Fri, 15 Oct 2021 14:22:43 GMT", domain: "betfair.com" },
    },
    {
      name: "someCookie",
      value: "chocolate",
      attributes: { domain: "betfair.com" },
    },
  ]),
}));

const DOMAIN = "betfair.com";

describe("marketing cookies helper", () => {
  describe("when refererRFRValue is present", () => {
    it("should call buildSetCookiesInstructions with correct arguments", () => {
      marketingCookiesHelper("someUrl", DOMAIN, "70");
      expect(buildSetCookieInstructions).toHaveBeenCalledWith("someUrl", DOMAIN, { overrideRfrPartnerId: "70" });
    });
  });

  describe("when refererRFRValue is NOT present", () => {
    it("should call buildSetCookiesInstructions with no expires option", () => {
      marketingCookiesHelper("someUrl", DOMAIN, null);

      expect(buildSetCookieInstructions).toHaveBeenCalledWith("someUrl", DOMAIN, {
        overrideRfrPartnerId: undefined,
      });
    });
  });

  it("should return the correct cookieInstructions object", () => {
    expect(marketingCookiesHelper("someUrl", DOMAIN, null)).toEqual([
      {
        name: "rfr",
        options: {
          domain: DOMAIN,
          expires: new Date("2021-10-15T14:22:43.000Z"),
        },
        value: "990768",
      },
      {
        name: "someCookie",
        options: {
          domain: DOMAIN,
        },
        value: "chocolate",
      },
    ]);
  });
});
