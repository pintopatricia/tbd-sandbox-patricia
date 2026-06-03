import { extractBasePathFromRequestUri } from "./base-path";
import environment from "../config/environment.json";

jest.mock("../config/environment.json", () => ({
  BASE_PATH: "/wetten/",
}));

describe("extractBasePathFromRequestUri", () => {
  afterEach(() => jest.clearAllMocks());

  describe("if second folder is a valid language folder", () => {
    it("should return both decoded", () => {
      expect(extractBasePathFromRequestUri("/wetten/br/mock?param=true")).toStrictEqual({
        base: "/wetten/br/",
        languageFolder: "br",
      });
      expect(
        extractBasePathFromRequestUri("/%D0%B4%D0%B5%D0%BB%D0%B0%D1%82%D1%8C-%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B8/ru/"),
      ).toStrictEqual({ base: "/делать-ставки/ru/", languageFolder: "ru" });
    });
  });

  describe("if second folder is an invalid language folder", () => {
    it("should return the first folder decoded", () => {
      expect(extractBasePathFromRequestUri("/wetten/pt/mock?param=true")).toStrictEqual({
        base: "/wetten/",
        languageFolder: undefined,
      });
      expect(
        extractBasePathFromRequestUri("/%D0%B4%D0%B5%D0%BB%D0%B0%D1%82%D1%8C-%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B8/cz/"),
      ).toStrictEqual({ base: "/делать-ставки/", languageFolder: undefined });
    });
  });

  describe("if second folder does not exist", () => {
    it("should return the first folder decoded", () => {
      expect(extractBasePathFromRequestUri("/wetten?param=true")).toStrictEqual({
        base: "/wetten/",
        languageFolder: undefined,
      });
      expect(extractBasePathFromRequestUri("/%D1%88%D0%B5%D0%BB%D0%BB%D1%8B/?param=true")).toStrictEqual({
        base: "/шеллы/",
        languageFolder: undefined,
      });
    });
  });

  describe("if BASE_PATH is equal to ROOT_PATH", () => {
    beforeEach(() => {
      environment.BASE_PATH = "/";
    });

    describe("and second folder is a valid language folder", () => {
      it("should return both decoded", () => {
        expect(extractBasePathFromRequestUri("/br/football/s-1?param=true")).toStrictEqual({
          base: "/br/",
          languageFolder: "br",
        });
      });
    });

    describe("and second folder is an invalid language folder", () => {
      it("should return the ROOT_PATH", () => {
        expect(extractBasePathFromRequestUri("/pt/mock?param=true")).toStrictEqual({
          base: "/",
          languageFolder: undefined,
        });
      });
    });

    describe("and second folder does not exist", () => {
      it("should return the first folder decoded", () => {
        expect(extractBasePathFromRequestUri("/?param=true")).toStrictEqual({
          base: "/",
          languageFolder: undefined,
        });
      });
    });
  });
});
