import { isPlatformSupported, isStoreUpdate } from "./update-helper.native";

jest.mock("react-native-device-info", () => ({
  getBuildNumber: () => 5,
  getSystemVersion: () => "11.0",
}));

describe("update-helper", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("when isPlatformSupported is called", () => {
    let result;

    describe("with minOSVersion undefined", () => {
      it("should return false", () => {
        result = isPlatformSupported(undefined);
        expect(result).toBe(false);
      });
    });

    describe("with minOSVersion defined", () => {
      it("should return false if supported OS version is higher than 11.0", () => {
        result = isPlatformSupported("11.1");
        expect(result).toBe(false);
      });

      it("should return true if supported OS version is equal than 11.0", () => {
        result = isPlatformSupported("11");
        expect(result).toBe(true);
      });

      it("should return true if supported OS version is lower than 11.0", () => {
        result = isPlatformSupported(".10");
        expect(result).toBe(true);
      });
    });
  });

  describe("when isStoreUpdate is called", () => {
    let result;

    describe("when platform is iOS", () => {
      const isAndroid = false;

      it("should return true when jurisdiction supported", () => {
        const countryCode = { countryCode: "IE" };

        result = isStoreUpdate(isAndroid, countryCode);
        expect(result).toBe(true);
      });

      it("should return true when jurisdiction is not supported", () => {
        const countryCode = { countryCode: "PT" };

        result = isStoreUpdate(isAndroid, countryCode);
        expect(result).toBe(true);
      });
    });

    describe("when platform is Android", () => {
      const isAndroid = true;

      it("should return true when jurisdiction supported", () => {
        const countryCode = { countryCode: "IE" };

        result = isStoreUpdate(isAndroid, countryCode);
        expect(result).toBe(true);
      });

      it("should return false when jurisdiction is not supported", () => {
        const countryCode = { countryCode: "PT" };

        result = isStoreUpdate(isAndroid, countryCode);
        expect(result).toBe(false);
      });
    });
  });
});
