import { convertUserPreferences } from "./user-preferences-converter";

const preferencesMock = {
  products: ["exchange", "games"],
  favoriteSports: ["sport_id_1"],
};

describe("UserPreferencesConverter", () => {
  beforeAll(jest.clearAllMocks);

  describe("convertUserPreferences", () => {
    let result;
    describe("when has userPreferences", () => {
      beforeEach(() => {
        result = convertUserPreferences(preferencesMock);
      });

      it("should return an object with all configurations", () => {
        expect(result).toEqual({
          favoriteSports: ["ppb:eventType:sport_id_1"],
          userProducts: ["EXCHANGE", "GAMES"],
        });
      });
    });

    describe("when has not got userPerferences", () => {
      beforeEach(() => {
        result = convertUserPreferences();
      });

      it("should return an empty object", () => {
        expect(result).toEqual({});
      });
    });
  });
});
