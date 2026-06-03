import { isOnlineUserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import {
  currencyFormatWithoutDecimalPlaces,
  currencyFormatWithDecimalPlaces,
  getCurrencySymbol,
} from "./currency-formatters";

jest.mock("@ppb/tbd-store/state/entities/user-details/UserDetailsState", () => ({
  isOnlineUserDetails: jest.fn(),
}));

jest.mock("./custom-currency-formatters", () => ({
  CUSTOM_CURRENCY_FORMATTERS: {
    USD: { symbolPosition: "prefix", currencySymbol: "$" },
    RON: { symbolPosition: "postfix", currencySymbol: "RON" },
  },
}));

afterEach(jest.clearAllMocks);

describe("currencyFormatWithDecimalPlaces", () => {
  const setupCurrencyFormat = ({
    localeCodeBcp47 = "en-GB",
    currencyCode = "GBP",
    value = "1234567.89",
    decimalPlaces,
    useCustomCurrencyFormat = false,
  } = {}) =>
    currencyFormatWithDecimalPlaces({
      localeCodeBcp47,
      currencyCode,
      value,
      decimalPlaces,
      useCustomCurrencyFormat,
    });

  describe("when currencyCode is provided", () => {
    describe("when 'useCustomCurrencyFormat' is provided", () => {
      describe("when there is a custom currency configuration", () => {
        describe("when symbol position is prefixed", () => {
          it("should return a formatted currency with prefixed custom symbol", () => {
            const formattedValue = setupCurrencyFormat({
              currencyCode: "USD",
              useCustomCurrencyFormat: true,
            });
            expect(formattedValue).toEqual("$1,234,567.89");
          });
        });

        describe("when symbol position is postfixed", () => {
          it("should return a formatted currency with postfixed custom symbol", () => {
            const formattedValue = setupCurrencyFormat({
              currencyCode: "RON",
              useCustomCurrencyFormat: true,
            });
            expect(formattedValue).toEqual("1,234,567.89 RON");
          });
        });
      });

      describe("when there is not a custom currency configuration", () => {
        it("should return a default formatted currency value", () => {
          const formattedValue = setupCurrencyFormat();
          expect(formattedValue).toEqual("£1,234,567.89");
        });
      });
    });

    describe("when 'useCustomCurrencyFormat' is not provided", () => {
      it("should format with the correct separators according to locale", () => {
        const formattedCurrency = setupCurrencyFormat();

        expect(formattedCurrency).toEqual("£1,234,567.89");
      });
    });

    describe("when `decimalPlaces` argument is provided", () => {
      it("should format with the provided decimal places", () => {
        const formattedCurrencyWithOneDecimalPlaces = setupCurrencyFormat({
          value: "1.234",
          decimalPlaces: 1,
        });

        expect(formattedCurrencyWithOneDecimalPlaces).toEqual("£1.2");

        const formattedCurrencyWithThreeDecimalPlaces = setupCurrencyFormat({
          value: "1.7347",
          decimalPlaces: 3,
        });

        expect(formattedCurrencyWithThreeDecimalPlaces).toEqual("£1.735");
      });
    });

    describe("when `decimalPlaces` argument is not provided", () => {
      it("should default to two decimal places", () => {
        const formattedCurrency = setupCurrencyFormat({
          value: "1.234",
        });

        expect(formattedCurrency).toEqual("£1.23");
      });
    });
  });

  describe("when currencyCode is not provided", () => {
    it("should return empty string when it doest not have currencyCode", () => {
      const formattedCurrency = currencyFormatWithDecimalPlaces({
        localeCodeBcp47: "en-GB",
        value: "1.234",
        decimalPlaces: 1,
      });

      expect(formattedCurrency).toBe("");
    });
  });
});

describe("currencyFormatWithoutDecimalPlaces", () => {
  it("should round to the nearest integer and format the value", () => {
    const roundedDown = currencyFormatWithoutDecimalPlaces({
      localeCodeBcp47: "en-GB",
      currencyCode: "GBP",
      value: "1.234",
    });

    expect(roundedDown).toEqual("£1");

    const roundedUp = currencyFormatWithoutDecimalPlaces({
      localeCodeBcp47: "en-GB",
      currencyCode: "GBP",
      value: "1.734",
    });

    expect(roundedUp).toEqual("£2");
  });

  it("should format with the correct separators according to locale", () => {
    const formattedCurrency = currencyFormatWithoutDecimalPlaces({
      localeCodeBcp47: "en-GB",
      currencyCode: "GBP",
      value: "1234567",
    });

    expect(formattedCurrency).toEqual("£1,234,567");
  });

  it("should return empty string when it doest not have currencyCode", () => {
    const formattedCurrency = currencyFormatWithoutDecimalPlaces({
      localeCodeBcp47: "en-GB",
      value: "1234567",
    });

    expect(formattedCurrency).toBe("");
  });
});

describe("getCurrencySymbol", () => {
  describe("when isOnlineUserDetails returns true", () => {
    beforeAll(() => {
      isOnlineUserDetails.mockReturnValue(true);
    });

    it("should return correct currency symbol according to given locale", () => {
      const euro = getCurrencySymbol({
        localeCodeBcp47: "pt-pt",
        currencyCode: "EUR",
      });
      expect(euro).toEqual("€");

      const pound = getCurrencySymbol({
        localeCodeBcp47: "en-GB",
        currencyCode: "GBP",
      });
      expect(pound).toEqual("£");
    });
  });

  describe("when isOnlineUserDetails returns false", () => {
    it("should return undefined when userDetails is offline", () => {
      isOnlineUserDetails.mockReturnValue(false);

      const pound = getCurrencySymbol({
        localeCodeBcp47: "en-GB",
        currencyCode: "GBP",
      });

      expect(pound).toEqual(undefined);
    });
  });
});
