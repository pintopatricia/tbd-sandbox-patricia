import {
  mapDefaultProductOptionToSingleChoicePreference,
  mapExchangeDefaultProductToExchangeDefaultProductOption,
  mapExchangeDefaultProductToSingleChoicePreference,
  mapUserProductsListToProductOptionsList,
  mapUserProductsPreferenceToSingleChoicePreference,
} from "../../helpers/preferences";
import normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice from "./normalizer/entities/preference-single-choice/preference-single-choice-normalizer";
import normalizeUserProductsPreferenceFragmentIntoUserProductsPreference from "./normalizer/entities/user-products-preference/user-products-preference-normalizer";
import normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference from "./normalizer/entities/exchange-default-product-preference/exchange-default-product-preference-normalizer";
import normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference from "./normalizer/entities/default-product-preference/default-product-preference-normalizer";
import normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference from "./normalizer/entities/last-viewed-product-preference/last-viewed-product-preference-normalizer";
import normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference from "./normalizer/entities/confirm-cashout-preference/confirm-cashout-preference-normalizer";

import {
  buildSingleChoiceResult,
  buildUserProductsResult,
  buildExchangeDefaultProductResult,
  buildLastViewedProductResult,
  buildDefaultProductResult,
  buildConfirmCashoutResult,
} from "./preference-mapper";

jest.mock("../../helpers/preferences", () => ({
  mapDefaultProductOptionToSingleChoicePreference: jest.fn(),
  mapExchangeDefaultProductToExchangeDefaultProductOption: jest.fn(),
  mapExchangeDefaultProductToSingleChoicePreference: jest.fn(),
  mapUserProductsListToProductOptionsList: jest.fn(),
  mapUserProductsPreferenceToSingleChoicePreference: jest.fn(),
}));

jest.mock("./normalizer/entities/preference-single-choice/preference-single-choice-normalizer", () => jest.fn());

jest.mock("./normalizer/entities/user-products-preference/user-products-preference-normalizer", () => jest.fn());

jest.mock(
  "./normalizer/entities/exchange-default-product-preference/exchange-default-product-preference-normalizer",
  () => jest.fn(),
);

jest.mock("./normalizer/entities/default-product-preference/default-product-preference-normalizer", () => jest.fn());

jest.mock("./normalizer/entities/last-viewed-product-preference/last-viewed-product-preference-normalizer", () =>
  jest.fn(),
);

jest.mock("./normalizer/entities/confirm-cashout-preference/confirm-cashout-preference-normalizer", () => jest.fn());

describe("PreferenceMapper", () => {
  afterEach(jest.clearAllMocks);

  describe("buildSingleChoiceResult", () => {
    describe("when the mutation has errors", () => {
      it("should throw an error", () => {
        expect(() =>
          buildSingleChoiceResult({
            setPreferences: {
              result: [],
              error: ["error mock"],
            },
          }),
        ).toThrow(new Error("Set preferences failed with error: error mock"));
        expect(normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has no result", () => {
      const mutationResult = {
        setPreferences: {
          result: [],
          error: [],
        },
      };

      it("should return undefined", () => {
        expect(buildSingleChoiceResult(mutationResult)).toBeUndefined();
        expect(normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has result", () => {
      const setPreferencesResult = {
        __typename: "PreferenceSingleChoice",
        urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
        preferenceKey: "sportsbookOddsDisplay",
        preferenceValues: [
          {
            value: "FRACTIONAL",
            translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.FRACTIONAL",
          },
          {
            value: "DECIMAL",
            translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.DECIMAL",
          },
        ],
        selectedValueIndex: 0,
      };

      const mutationResult = {
        setPreferences: {
          result: [{ ...setPreferencesResult }],
          error: [],
        },
      };

      beforeAll(() => {
        normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice.mockReturnValueOnce({
          data: {
            urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
            preferenceKey: "sportsbookOddsDisplay",
            preferenceValues: [
              {
                value: "FRACTIONAL",
                translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.FRACTIONAL",
              },
              {
                value: "DECIMAL",
                translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.DECIMAL",
              },
            ],
            selectedValueIndex: 0,
            typename: "PreferenceSingleChoice",
          },
        });
      });

      it("should return the correct values", () => {
        expect(buildSingleChoiceResult(mutationResult)).toEqual({
          settingsPreferences: {
            "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay": {
              urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
              preferenceKey: "sportsbookOddsDisplay",
              preferenceValues: [
                {
                  value: "FRACTIONAL",
                  translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.FRACTIONAL",
                },
                {
                  value: "DECIMAL",
                  translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.DECIMAL",
                },
              ],
              selectedValueIndex: 0,
              typename: "PreferenceSingleChoice",
            },
          },
          userPreferences: {
            sportsbookOddsDisplay: "FRACTIONAL",
          },
        });
        expect(normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice).toHaveBeenCalledWith(
          setPreferencesResult,
        );
      });
    });
  });

  describe("buildUserProductsResult", () => {
    describe("when the mutation has errors", () => {
      it("should throw an error", () => {
        expect(() =>
          buildUserProductsResult(
            {
              setPreferences: {
                result: [],
                error: ["error mock"],
              },
            },
            undefined,
          ),
        ).toThrow(new Error("Set preferences failed with error: error mock"));
        expect(normalizeUserProductsPreferenceFragmentIntoUserProductsPreference).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has no result", () => {
      const mutationResult = {
        setPreferences: {
          result: [],
          error: [],
        },
      };

      it("should return undefined", () => {
        expect(buildUserProductsResult(mutationResult, undefined)).toBeUndefined();
        expect(normalizeUserProductsPreferenceFragmentIntoUserProductsPreference).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has result", () => {
      const setPreferencesResult = {
        __typename: "UserProductsPreference",
        urn: "ppb:tbd:preference:userProducts:UserProducts",
        productOptions: ["SPORTSBOOK", "EXCHANGE", "GAMES"],
        selectedProduct: ["SPORTSBOOK", "GAMES"],
      };

      const mutationResult = {
        setPreferences: {
          result: [{ ...setPreferencesResult }],
          error: [],
        },
      };

      const userProductsSingleChoicePreference = {
        urn: "ppb:tbd:preference:singleChoice:products",
        preferenceKey: "products",
        preferenceValues: [
          {
            value: "sportsbook",
            translationKey: "I18N.SPORTSBOOK",
          },
          {
            value: "exchange",
            translationKey: "I18N.EXCHANGE",
          },
        ],
        selectedValueIndex: 1,
        typename: "PreferenceSingleChoice",
      };

      describe("when the preference has no selectedProduct", () => {
        beforeAll(() => {
          normalizeUserProductsPreferenceFragmentIntoUserProductsPreference.mockReturnValueOnce({ data: {} });
        });

        it("should return undefined", () => {
          expect(buildUserProductsResult(mutationResult, userProductsSingleChoicePreference)).toBeUndefined();
          expect(normalizeUserProductsPreferenceFragmentIntoUserProductsPreference).toHaveBeenCalledWith(
            setPreferencesResult,
          );
        });
      });

      describe("when the preference has selectedProduct", () => {
        beforeAll(() => {
          normalizeUserProductsPreferenceFragmentIntoUserProductsPreference.mockReturnValueOnce({
            data: {
              urn: "ppb:tbd:preference:userProducts:UserProducts",
              productOptions: ["SPORTSBOOK", "EXCHANGE", "GAMES"],
              selectedProduct: ["SPORTSBOOK", "GAMES"],
              typename: "UserProductsPreference",
            },
          });
          mapUserProductsPreferenceToSingleChoicePreference.mockReturnValueOnce({
            ...userProductsSingleChoicePreference,
            selectedValueIndex: 0,
          });
          mapUserProductsListToProductOptionsList.mockReturnValueOnce(["sportsbook", "games"]);
        });

        it("should return the correct values", () => {
          expect(buildUserProductsResult(mutationResult, userProductsSingleChoicePreference)).toEqual({
            settingsPreferences: {
              "ppb:tbd:preference:singleChoice:products": {
                urn: "ppb:tbd:preference:singleChoice:products",
                preferenceKey: "products",
                preferenceValues: [
                  {
                    value: "sportsbook",
                    translationKey: "I18N.SPORTSBOOK",
                  },
                  {
                    value: "exchange",
                    translationKey: "I18N.EXCHANGE",
                  },
                ],
                selectedValueIndex: 0,
                typename: "PreferenceSingleChoice",
              },
            },
            userPreferences: {
              products: ["sportsbook", "games"],
            },
          });
          expect(normalizeUserProductsPreferenceFragmentIntoUserProductsPreference).toHaveBeenCalledWith(
            setPreferencesResult,
          );
        });
      });
    });
  });

  describe("buildExchangeDefaultProductResult", () => {
    describe("when the mutation has errors", () => {
      it("should throw an error", () => {
        expect(() =>
          buildExchangeDefaultProductResult(
            {
              setPreferences: {
                result: [],
                error: ["error mock"],
              },
            },
            undefined,
          ),
        ).toThrow(new Error("Set preferences failed with error: error mock"));
        expect(
          normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference,
        ).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has no result", () => {
      const mutationResult = {
        setPreferences: {
          result: [],
          error: [],
        },
      };

      it("should return undefined", () => {
        expect(buildExchangeDefaultProductResult(mutationResult, undefined)).toBeUndefined();
        expect(
          normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference,
        ).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has result", () => {
      const setPreferencesResult = {
        __typename: "ExchangeDefaultProductPreference",
        urn: "ppb:tbd:preference:exchangeDefaultProduct:ExchangeDefaultProduct",
        exchangeDefaultProductOptions: ["EMS", "NEME", "UNASSIGNED"],
        selectedExchangeDefaultProduct: "NEME",
      };

      const mutationResult = {
        setPreferences: {
          result: [{ ...setPreferencesResult }],
          error: [],
        },
      };

      const exchangeDefaultProductSingleChoicePreference = {
        urn: "ppb:tbd:preference:singleChoice:exchangeDefaultProduct",
        preferenceKey: "exchangeDefaultProduct",
        preferenceValues: [
          {
            value: "ems",
            translationKey: "ems",
          },
          {
            value: "neme",
            translationKey: "neme",
          },
        ],
        selectedValueIndex: 0,
        typename: "PreferenceSingleChoice",
      };

      beforeAll(() => {
        normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference.mockReturnValueOnce({
          data: {
            urn: "ppb:tbd:preference:exchangeDefaultProduct:ExchangeDefaultProduct",
            exchangeDefaultProductOptions: ["EMS", "NEME", "UNASSIGNED"],
            selectedExchangeDefaultProduct: "NEME",
            typename: "ExchangeDefaultProductPreference",
          },
        });
        mapExchangeDefaultProductToSingleChoicePreference.mockReturnValueOnce({
          ...exchangeDefaultProductSingleChoicePreference,
          selectedValueIndex: 1,
        });
        mapExchangeDefaultProductToExchangeDefaultProductOption.mockReturnValueOnce("neme");
      });

      it("should return the correct values", () => {
        expect(buildExchangeDefaultProductResult(mutationResult, exchangeDefaultProductSingleChoicePreference)).toEqual(
          {
            settingsPreferences: {
              "ppb:tbd:preference:singleChoice:exchangeDefaultProduct": {
                urn: "ppb:tbd:preference:singleChoice:exchangeDefaultProduct",
                preferenceKey: "exchangeDefaultProduct",
                preferenceValues: [
                  {
                    value: "ems",
                    translationKey: "ems",
                  },
                  {
                    value: "neme",
                    translationKey: "neme",
                  },
                ],
                selectedValueIndex: 1,
                typename: "PreferenceSingleChoice",
              },
            },
            userPreferences: {
              exchangeDefaultProduct: "neme",
            },
          },
        );
        expect(
          normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference,
        ).toHaveBeenCalledWith(setPreferencesResult);
      });
    });
  });

  describe("buildDefaultProductResult", () => {
    describe("when the mutation has errors", () => {
      it("should throw an error", () => {
        expect(() =>
          buildDefaultProductResult(
            {
              setPreferences: {
                result: [],
                error: ["error mock"],
              },
            },
            undefined,
          ),
        ).toThrow(new Error("Set preferences failed with error: error mock"));
        expect(normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has no result", () => {
      const mutationResult = {
        setPreferences: {
          result: [],
          error: [],
        },
      };

      it("should return undefined", () => {
        expect(buildDefaultProductResult(mutationResult, undefined)).toBeUndefined();
        expect(normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has result", () => {
      const setPreferencesResult = {
        __typename: "DefaultProductPreference",
        urn: "ppb:tbd:preference:defaultProduct:DefaultProduct",
        defaultProductOptions: ["LAST_VIEWED", "SPORTSBOOK", "EXCHANGE"],
        selectedDefaultProduct: "SPORTSBOOK",
      };

      const mutationResult = {
        setPreferences: {
          result: [{ ...setPreferencesResult }],
          error: [],
        },
      };

      const defaultProductSingleChoicePreference = {
        urn: "ppb:tbd:preference:defaultProduct:DefaultProduct",
        preferenceKey: "defaultProduct",
        preferenceValues: [
          {
            value: "last_viewed",
            translationKey: "Last Viewed",
          },
          {
            value: "sportsbook",
            translationKey: "Sportsbook",
          },
          {
            value: "exchange",
            translationKey: "Exchange",
          },
        ],
        selectedValueIndex: 1,
        typename: "PreferenceSingleChoice",
      };

      beforeAll(() => {
        normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference.mockReturnValueOnce({
          data: {
            __typename: "DefaultProductPreference",
            urn: "ppb:tbd:preference:defaultProduct:DefaultProduct",
            defaultProductOptions: ["last_viewed", "sportsbook", "exchange"],
            selectedDefaultProduct: "sportsbook",
          },
        });
        mapDefaultProductOptionToSingleChoicePreference.mockReturnValueOnce({
          ...defaultProductSingleChoicePreference,
          selectedValueIndex: 1,
        });
      });

      it("should return the correct values", () => {
        expect(buildDefaultProductResult(mutationResult, defaultProductSingleChoicePreference)).toEqual({
          settingsPreferences: {
            "ppb:tbd:preference:defaultProduct:DefaultProduct": {
              urn: "ppb:tbd:preference:defaultProduct:DefaultProduct",
              preferenceKey: "defaultProduct",
              preferenceValues: [
                {
                  value: "last_viewed",
                  translationKey: "Last Viewed",
                },
                {
                  value: "sportsbook",
                  translationKey: "Sportsbook",
                },
                {
                  value: "exchange",
                  translationKey: "Exchange",
                },
              ],
              selectedValueIndex: 1,
              typename: "PreferenceSingleChoice",
            },
          },
          userPreferences: {
            defaultProduct: "sportsbook",
          },
        });
        expect(normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference).toHaveBeenCalledWith(
          setPreferencesResult,
        );
      });
    });
  });

  describe("buildLastViewedProductResult", () => {
    describe("when the mutation has errors", () => {
      it("should throw an error", () => {
        expect(() =>
          buildLastViewedProductResult({
            setPreferences: {
              result: [],
              error: ["error mock"],
            },
          }),
        ).toThrow(new Error("Set preferences failed with error: error mock"));
        expect(normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has no result", () => {
      const mutationResult = {
        setPreferences: {
          result: [],
          error: [],
        },
      };

      it("should return undefined", () => {
        expect(buildLastViewedProductResult(mutationResult)).toBeUndefined();
        expect(normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has result", () => {
      const setPreferencesResult = {
        __typename: "LastViewedProductPreference",
        urn: "ppb:tbd:preference:lastViewedProduct:LastViewedProduct",
        lastViewedProductOptions: ["SPORTSBOOK", "EXCHANGE"],
        selectedLastViewedProduct: "SPORTSBOOK",
      };

      const mutationResult = {
        setPreferences: {
          result: [{ ...setPreferencesResult }],
          error: [],
        },
      };

      beforeAll(() => {
        normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference.mockReturnValueOnce({
          data: {
            __typename: "LastViewedProductPreference",
            urn: "ppb:tbd:preference:lastViewedProduct:LastViewedProduct",
            lastViewedProductOptions: ["sportsbook", "exchange"],
            selectedLastViewedProduct: "sportsbook",
          },
        });
      });

      it("should return the correct values", () => {
        expect(buildLastViewedProductResult(mutationResult)).toEqual("sportsbook");
        expect(normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference).toHaveBeenCalledWith(
          setPreferencesResult,
        );
      });
    });
  });

  describe("buildConfirmCashoutResult", () => {
    const confirmCashoutSingleChoicePreference = {
      urn: "ppb:tbd:preference:singleChoice:confirmCashout",
      preferenceKey: "confirmCashout",
      preferenceValues: [
        { value: "ON", translationKey: "I18N.PREFERENCES.CONFIRM_CASHOUT.ON" },
        { value: "OFF", translationKey: "I18N.PREFERENCES.CONFIRM_CASHOUT.OFF" },
      ],
      selectedValueIndex: 1,
      typename: "PreferenceSingleChoice",
    };

    describe("when the mutation has errors", () => {
      it("should throw an error", () => {
        expect(() =>
          buildConfirmCashoutResult(
            {
              setPreferences: {
                result: [],
                error: ["error mock"],
              },
            },
            confirmCashoutSingleChoicePreference,
          ),
        ).toThrow(new Error("Set preferences failed with error: error mock"));
        expect(normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has no result", () => {
      const mutationResult = {
        setPreferences: {
          result: [],
          error: [],
        },
      };

      it("should return undefined", () => {
        expect(buildConfirmCashoutResult(mutationResult, confirmCashoutSingleChoicePreference)).toBeUndefined();
        expect(normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference).not.toHaveBeenCalled();
      });
    });

    describe("when the mutation has result with shouldConfirmCashout true", () => {
      const setPreferencesResult = {
        __typename: "ConfirmCashoutPreference",
        urn: "ppb:tbd:preference:confirmCashout",
        shouldConfirmCashout: true,
      };

      const mutationResult = {
        setPreferences: {
          result: [{ ...setPreferencesResult }],
          error: [],
        },
      };

      beforeAll(() => {
        normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference.mockReturnValueOnce({
          data: {
            typename: "ConfirmCashoutPreference",
            urn: "ppb:tbd:preference:confirmCashout",
            shouldConfirmCashout: true,
          },
        });
      });

      it("should return the correct values", () => {
        expect(buildConfirmCashoutResult(mutationResult, confirmCashoutSingleChoicePreference)).toEqual({
          settingsPreferences: {
            "ppb:tbd:preference:singleChoice:confirmCashout": {
              ...confirmCashoutSingleChoicePreference,
              selectedValueIndex: 0,
            },
          },
          userPreferences: {
            confirmCashout: true,
          },
        });
        expect(normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference).toHaveBeenCalledWith(
          setPreferencesResult,
        );
      });
    });

    describe("when the mutation has result with shouldConfirmCashout false", () => {
      const setPreferencesResult = {
        __typename: "ConfirmCashoutPreference",
        urn: "ppb:tbd:preference:confirmCashout",
        shouldConfirmCashout: false,
      };

      const mutationResult = {
        setPreferences: {
          result: [{ ...setPreferencesResult }],
          error: [],
        },
      };

      beforeAll(() => {
        normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference.mockReturnValueOnce({
          data: {
            typename: "ConfirmCashoutPreference",
            urn: "ppb:tbd:preference:confirmCashout",
            shouldConfirmCashout: false,
          },
        });
      });

      it("should return the correct values", () => {
        expect(buildConfirmCashoutResult(mutationResult, confirmCashoutSingleChoicePreference)).toEqual({
          settingsPreferences: {
            "ppb:tbd:preference:singleChoice:confirmCashout": {
              ...confirmCashoutSingleChoicePreference,
              selectedValueIndex: 1,
            },
          },
          userPreferences: {
            confirmCashout: false,
          },
        });
        expect(normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference).toHaveBeenCalledWith(
          setPreferencesResult,
        );
      });
    });
  });
});
