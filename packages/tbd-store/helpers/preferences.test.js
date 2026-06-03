import {
  DefaultProductOption,
  ExchangeDefaultProductOption,
  LastViewedProductOption,
  ProductsOption,
} from "../state/entities";
import {
  DefaultProduct,
  ExchangeDefaultProduct,
  LastViewedProduct,
  UserProducts,
} from "../clients/catalogue/catalogue-response-types";
import {
  mapDefaultProductOptionToDefaultProduct,
  mapDefaultProductOptionToSingleChoicePreference,
  mapLastViewedProductOptionToLastViewedProduct,
  mapProductsOptionToLastViewedProductOption,
  mapExchangeDefaultProductToExchangeDefaultProductOption,
  mapExchangeDefaultProductToSingleChoicePreference,
  mapProductOptionsListToUserProductsList,
  mapStringToExchangeDefaultProduct,
  mapStringToUserProducts,
  mapUserProductsListToProductOptionsList,
  mapUserProductsPreferenceToSingleChoicePreference,
  updateUserProductsList,
} from "./preferences";

describe("preferences helper", () => {
  beforeEach(jest.clearAllMocks);

  describe("mapExchangeDefaultProductToExchangeDefaultProductOption", () => {
    it("should return a mapped ExchangeDefaultProduct.Ems into ExchangeDefaultProductOption.ems", () => {
      expect(mapExchangeDefaultProductToExchangeDefaultProductOption(ExchangeDefaultProduct.Ems)).toEqual(
        ExchangeDefaultProductOption.ems,
      );
    });

    it("should return a mapped ExchangeDefaultProduct.Neme into ExchangeDefaultProductOption.neme", () => {
      expect(mapExchangeDefaultProductToExchangeDefaultProductOption(ExchangeDefaultProduct.Neme)).toEqual(
        ExchangeDefaultProductOption.neme,
      );
    });

    it("should return a mapped ExchangeDefaultProduct.Unassigned into ExchangeDefaultProductOption.default", () => {
      expect(mapExchangeDefaultProductToExchangeDefaultProductOption(ExchangeDefaultProduct.Unassigned)).toEqual(
        ExchangeDefaultProductOption.default,
      );
    });

    it("should return undefined if no valid ExchangeDefaultProduct is provided", () => {
      expect(mapExchangeDefaultProductToExchangeDefaultProductOption(null)).toEqual(undefined);
    });
  });

  describe("mapExchangeDefaultProductToSingleChoicePreference", () => {
    it("should return a mapped ExchangeDefaultProduct into SingleChoicePreference", () => {
      expect(
        mapExchangeDefaultProductToSingleChoicePreference(ExchangeDefaultProduct.Neme, {
          typename: "PreferenceSingleChoice",
          urn: "ppb:tbd:preference:exchangeDefaultProduct",
          preferenceKey: "exchangeDefaultProduct",
          preferenceValues: [
            { translationKey: "I18N_EMS", value: ExchangeDefaultProductOption.ems },
            { translationKey: "I18N_NEME", value: ExchangeDefaultProductOption.neme },
          ],
          selectedValueIndex: 0,
        }),
      ).toEqual({
        typename: "PreferenceSingleChoice",
        urn: "ppb:tbd:preference:exchangeDefaultProduct",
        preferenceKey: "exchangeDefaultProduct",
        preferenceValues: [
          { value: "ems", translationKey: "I18N_EMS" },
          { value: "neme", translationKey: "I18N_NEME" },
        ],
        selectedValueIndex: 1,
      });
    });
  });

  describe("mapProductOptionsListToUserProductsList", () => {
    it("should return a mapped ProductOptionsList into UserProductsList", () => {
      expect(
        mapProductOptionsListToUserProductsList([
          ProductsOption.exchange,
          ProductsOption.sportsbook,
          ProductsOption.games,
        ]),
      ).toEqual([UserProducts.Exchange, UserProducts.Sportsbook, UserProducts.Games]);
    });

    it("should return a list with UserProducts.Sportsbook if no valid ProductsOption is provided", () => {
      expect(mapProductOptionsListToUserProductsList([null])).toEqual([UserProducts.Sportsbook]);
    });
  });

  describe("mapStringToExchangeDefaultProduct", () => {
    it("should return a mapped 'ems' string into ExchangeDefaultProduct.Ems", () => {
      expect(mapStringToExchangeDefaultProduct("ems")).toEqual(ExchangeDefaultProduct.Ems);
    });

    it("should return a mapped 'neme' string into ExchangeDefaultProduct.Neme", () => {
      expect(mapStringToExchangeDefaultProduct("neme")).toEqual(ExchangeDefaultProduct.Neme);
    });

    it("should return a mapped 'unassigned' string into ExchangeDefaultProduct.Unassigned", () => {
      expect(mapStringToExchangeDefaultProduct("unassigned")).toEqual(ExchangeDefaultProduct.Unassigned);
    });

    it("should return undefined if no string is mapped", () => {
      expect(mapStringToExchangeDefaultProduct("badjoras")).toEqual(undefined);
    });
  });

  describe("mapStringToUserProducts", () => {
    it("should return a mapped 'sportsbook' string into UserProducts.Sportsbook", () => {
      expect(mapStringToUserProducts("sportsbook")).toEqual(UserProducts.Sportsbook);
    });

    it("should return a mapped 'exchange' string into UserProducts.Exchange", () => {
      expect(mapStringToUserProducts("exchange")).toEqual(UserProducts.Exchange);
    });

    it("should return a mapped 'games' string into UserProducts.Games", () => {
      expect(mapStringToUserProducts("games")).toEqual(UserProducts.Games);
    });

    it("should return undefined if no string is mapped", () => {
      expect(mapStringToUserProducts("badjoras")).toEqual(undefined);
    });
  });

  describe("mapUserProductsListToProductOptionsList", () => {
    it("should return a mapped UserProductsList into ProductOptionsList", () => {
      expect(
        mapUserProductsListToProductOptionsList([
          UserProducts.Exchange,
          UserProducts.Sportsbook,
          UserProducts.Games,
          null,
        ]),
      ).toEqual([ProductsOption.exchange, ProductsOption.sportsbook, ProductsOption.games]);
    });

    it("should return a list with ProductOptionsList.sportsbook if no valid UserProducts is provided", () => {
      expect(mapProductOptionsListToUserProductsList(["badjoras"])).toEqual([UserProducts.Sportsbook]);
    });
  });

  describe("mapUserProductsPreferenceToSingleChoicePreference", () => {
    it("should return a mapped UserProductsPreference into SingleChoicePreference", () => {
      expect(
        mapUserProductsPreferenceToSingleChoicePreference([null, UserProducts.Exchange], {
          typename: "PreferenceSingleChoice",
          urn: "ppb:tbd:preference:userProducts",
          preferenceKey: "userProducts",
          preferenceValues: [
            { translationKey: "I18N_SPORTSBOOK", value: ProductsOption.sportsbook },
            { translationKey: "I18N_EXCHANGE", value: ProductsOption.exchange },
            { translationKey: "I18N_GAMES", value: ProductsOption.games },
          ],
          selectedValueIndex: 0,
        }),
      ).toEqual({
        typename: "PreferenceSingleChoice",
        urn: "ppb:tbd:preference:userProducts",
        preferenceKey: "userProducts",
        preferenceValues: [
          { value: "sportsbook", translationKey: "I18N_SPORTSBOOK" },
          { value: "exchange", translationKey: "I18N_EXCHANGE" },
          { value: "games", translationKey: "I18N_GAMES" },
        ],
        selectedValueIndex: 1,
      });
    });

    it("should return SingleChoicePreference if no UserProducts is provided", () => {
      expect(
        mapUserProductsPreferenceToSingleChoicePreference(null, {
          typename: "PreferenceSingleChoice",
          urn: "ppb:tbd:preference:userProducts",
          preferenceKey: "userProducts",
          preferenceValues: [
            { translationKey: "I18N_SPORTSBOOK", value: ProductsOption.sportsbook },
            { translationKey: "I18N_EXCHANGE", value: ProductsOption.exchange },
            { translationKey: "I18N_GAMES", value: ProductsOption.games },
          ],
          selectedValueIndex: 0,
        }),
      ).toEqual({
        typename: "PreferenceSingleChoice",
        urn: "ppb:tbd:preference:userProducts",
        preferenceKey: "userProducts",
        preferenceValues: [
          { translationKey: "I18N_SPORTSBOOK", value: ProductsOption.sportsbook },
          { translationKey: "I18N_EXCHANGE", value: ProductsOption.exchange },
          { translationKey: "I18N_GAMES", value: ProductsOption.games },
        ],
        selectedValueIndex: 0,
      });
    });
  });

  describe("updateUserProductsList", () => {
    it("should return an updated UserProductsList", () => {
      expect(updateUserProductsList([UserProducts.Sportsbook, UserProducts.Games], UserProducts.Exchange)).toEqual([
        UserProducts.Games,
        UserProducts.Exchange,
      ]);
    });
  });

  describe("mapDefaultProductOptionToDefaultProduct", () => {
    it("should return a mapped lastViewed DefaultProductOption into DefaultProduct.LastViewed", () => {
      expect(mapDefaultProductOptionToDefaultProduct(DefaultProductOption.lastViewed)).toEqual(
        DefaultProduct.LastViewed,
      );
    });

    it("should return a mapped sportsbook DefaultProductOption into DefaultProduct.Sportsbook", () => {
      expect(mapDefaultProductOptionToDefaultProduct(DefaultProductOption.sportsbook)).toEqual(
        DefaultProduct.Sportsbook,
      );
    });

    it("should return a mapped exchange DefaultProductOption into DefaultProduct.Exchange", () => {
      expect(mapDefaultProductOptionToDefaultProduct(DefaultProductOption.exchange)).toEqual(DefaultProduct.Exchange);
    });

    it("should return undefined if there's no correspondence", () => {
      expect(mapDefaultProductOptionToDefaultProduct("unmatched")).toEqual(undefined);
    });
  });

  describe("mapLastViewedProductOptionToLastViewedProduct", () => {
    it("should return a mapped sportsbook LastViewedProductOption into LastViewedProduct.Sportsbook", () => {
      expect(mapLastViewedProductOptionToLastViewedProduct(LastViewedProductOption.sportsbook)).toEqual(
        LastViewedProduct.Sportsbook,
      );
    });

    it("should return a mapped exchange LastViewedProductOption into LastViewedProduct.Exchange", () => {
      expect(mapLastViewedProductOptionToLastViewedProduct(LastViewedProductOption.exchange)).toEqual(
        LastViewedProduct.Exchange,
      );
    });

    it("should return undefined if there's no correspondence", () => {
      expect(mapLastViewedProductOptionToLastViewedProduct("unmatched")).toEqual(undefined);
    });
  });

  describe("mapProductsOptionToLastViewedProductOption", () => {
    it("should return a mapped sportsbook ProductsOption into LastViewedProductOption.sportsbook", () => {
      expect(mapProductsOptionToLastViewedProductOption(ProductsOption.sportsbook)).toEqual(
        LastViewedProductOption.sportsbook,
      );
    });

    it("should return a mapped exchange ProductsOption into LastViewedProductOption.exchange", () => {
      expect(mapProductsOptionToLastViewedProductOption(ProductsOption.exchange)).toEqual(
        LastViewedProductOption.exchange,
      );
    });

    it("should return undefined if there's no correspondence", () => {
      expect(mapProductsOptionToLastViewedProductOption("unmatched")).toEqual(undefined);
    });
  });

  describe("mapDefaultProductOptionToSingleChoicePreference", () => {
    it("should return a mapped DefaultProductOption into SingleChoicePreference", () => {
      const preferenceSingleChoice = {
        typename: "PreferenceSingleChoice",
        urn: "someurn",
        preferenceKey: ProductsOption.sportsbook,
        preferenceValues: [
          {
            translationKey: "0",
            value: "last_viewed",
          },
          {
            translationKey: "1",
            value: "sportsbook",
          },
          {
            translationKey: "2",
            value: "exchange",
          },
        ],
      };

      expect(
        mapDefaultProductOptionToSingleChoicePreference(DefaultProductOption.sportsbook, preferenceSingleChoice),
      ).toEqual({
        ...preferenceSingleChoice,
        selectedValueIndex: 1,
      });
    });
  });
});
