import CookieManager from "@react-native-cookies/cookies";
import { buildBaseCookieTemplates } from "./template.native";
import { writer } from "./writer.android.native";

jest.mock("@react-native-cookies/cookies", () => ({
  set: jest.fn(),
  clearAll: jest.fn(),
}));

jest.mock("./template.native", () => ({
  buildBaseCookieTemplates: jest.fn().mockReturnValue([{ template: "template" }]),
}));

jest.spyOn(console, "error").mockImplementation(() => {});

function setup({ templates } = { templates: [{ url: "template.domain" }] }) {
  buildBaseCookieTemplates.mockReturnValue(templates);
}

describe("Android Writer", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("when building the writer", () => {
    it("should call the cookie templater with the domains", () => {
      setup();
      writer([".betfair.com"]);

      expect(buildBaseCookieTemplates).toHaveBeenCalledWith([".betfair.com"]);
    });

    it("should return set in the api", () => {
      setup();
      const result = writer([".betfair.com"]);

      expect(result.set).toEqual(expect.any(Function));
    });

    it("should return clear in the api", () => {
      setup();
      const result = writer([".betfair.com"]);

      expect(result.clear).toEqual(expect.any(Function));
    });
  });

  describe("when setting", () => {
    it("should call CookieManager.set once per cookie", async () => {
      CookieManager.set.mockResolvedValueOnce(true).mockResolvedValueOnce(true);
      setup();

      await writer([".betfair.com"]).set(new Map([["ssoid", "test"]]));

      expect(CookieManager.set).toHaveBeenCalledTimes(1);
      expect(CookieManager.set).toHaveBeenCalledWith("template.domain", { name: "ssoid", value: "test" });
    });

    describe("when no entries are present", () => {
      it("should return success and not call CookieManager", async () => {
        CookieManager.set.mockRejectedValue("Cookie Manager throw");
        setup();

        const result = await writer([".betfair.com"]).set(new Map());

        expect(result).toEqual(true);
        expect(CookieManager.set).not.toHaveBeenCalled();
      });
    });

    describe("when CookieManager throws", () => {
      it("should return success as false", async () => {
        CookieManager.set.mockRejectedValue("Cookie Manager throw");
        setup();

        const result = await writer([".betfair.com"]).set(new Map([["ssoid", "test"]]));

        expect(result).toEqual(false);
        expect(global.console.error).toHaveBeenCalledWith("Error setting configured cookies", "Cookie Manager throw");
      });
    });

    describe("when CookieManager didn't write successfully", () => {
      it("should return success as false", async () => {
        CookieManager.set.mockResolvedValue(false);
        setup();

        const result = await writer([".betfair.com"]).set(new Map([["ssoid", "test"]]));

        expect(result).toEqual(false);
      });
    });

    describe("when CookieManager writes successfully", () => {
      it("should return success as true", async () => {
        CookieManager.set.mockResolvedValueOnce(true).mockResolvedValueOnce(true);
        setup();

        const result = await writer([".betfair.com"]).set(new Map([["ssoid", "test"]]));

        expect(result).toEqual(true);
      });
    });
  });

  describe("when clearing", () => {
    it("should call CookieManager.clearAll once per cookie", async () => {
      CookieManager.clearAll.mockResolvedValueOnce(true).mockResolvedValueOnce(true);
      setup();

      await writer([".betfair.com"]).clear();

      expect(CookieManager.clearAll).toHaveBeenCalledTimes(1);
      expect(CookieManager.clearAll).toHaveBeenCalled();
    });

    describe("when CookieManager throws", () => {
      it("should return success as false", async () => {
        CookieManager.clearAll.mockRejectedValue("Cookie Manager throw");
        setup();

        const result = await writer([".betfair.com"]).clear();

        expect(result).toEqual(false);
        expect(global.console.error).toHaveBeenCalledWith("Error clearing cookies", "Cookie Manager throw");
      });
    });

    describe("when CookieManager didn't write successfully", () => {
      it("should return success as false", async () => {
        CookieManager.clearAll.mockResolvedValue(false);
        setup();

        const result = await writer([".betfair.com"]).clear();

        expect(result).toEqual(false);
      });
    });

    describe("when CookieManager writes successfully", () => {
      it("should return success as true", async () => {
        CookieManager.clearAll.mockResolvedValue(true);
        setup();

        const result = await writer([".betfair.com"]).clear();

        expect(result).toEqual(true);
      });
    });
  });
});
