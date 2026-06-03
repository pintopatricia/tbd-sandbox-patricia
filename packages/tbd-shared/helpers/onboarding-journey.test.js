import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { getProductPreferenceFromUserPreferences } from "./onboarding-journey";

describe("onboarding-journey", () => {
  beforeEach(jest.clearAllMocks);

  describe("getProductPreferenceFromUserPreferences", () => {
    describe("when preferences.products has one product", () => {
      it("should return product preference for single product", () => {
        expect(getProductPreferenceFromUserPreferences([ProductsOption.exchange])).toEqual(ProductsOption.exchange);
      });
    });

    describe("when preferences.products has more than one product", () => {
      describe("when preferences.products has 'sportsbook'", () => {
        it("should return product preference as 'sportsbook'", () => {
          expect(
            getProductPreferenceFromUserPreferences([
              ProductsOption.sportsbook,
              ProductsOption.exchange,
              ProductsOption.games,
            ]),
          ).toEqual(ProductsOption.sportsbook);
        });
      });

      describe("when preferences.products does not have 'sportsbook'", () => {
        it("should return product preference as 'exchange'", () => {
          expect(getProductPreferenceFromUserPreferences([ProductsOption.exchange, ProductsOption.games])).toEqual(
            ProductsOption.exchange,
          );
        });
      });
    });
  });
});
