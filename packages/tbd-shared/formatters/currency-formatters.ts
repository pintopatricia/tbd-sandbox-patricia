import { isOnlineUserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";

import { CurrencyArguments, CurrencyFormatters, CurrencyUserDetails } from "./formatters";
import { CustomCurrencyConfiguration, CUSTOM_CURRENCY_FORMATTERS } from "./custom-currency-formatters";

const isOnlineCurrencyUserDetails = (currencyDetails: CurrencyUserDetails): currencyDetails is CurrencyUserDetails =>
  (<CurrencyUserDetails>currencyDetails).currencyCode !== undefined;

/**
 * Returns a currency symbol part, by using the UserDetails
 *
 * @param {UserDetails} userDetails User details
 * @param {boolean} useNarrowSymbol If it should use a narrow format symbol
 * @returns {string | undefined} Extracted currency symbol
 */
export const getCurrencySymbol: CurrencyFormatters["getCurrencySymbol"] = function (userDetails): string | undefined {
  if (!isOnlineUserDetails(userDetails)) {
    return undefined;
  }

  const { localeCodeBcp47, currencyCode } = userDetails;
  const numberFormat = new Intl.NumberFormat(localeCodeBcp47, {
    style: "currency",
    currencyDisplay: "symbol",
    currency: currencyCode,
  })
    // 0 is passed because Safari 13 gives NaN with undefined
    .formatToParts(0)
    .find((numberFormatPart) => {
      const { type } = numberFormatPart;
      return type === "currency";
    });

  return numberFormat && numberFormat.value;
};

const formatCurrency: CurrencyFormatters["currencyFormatWithDecimalPlaces"] = ({
  localeCodeBcp47,
  currencyCode,
  decimalPlaces = 2,
  value,
}): string =>
  new Intl.NumberFormat(localeCodeBcp47, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);

/*
 * Applies "@ng-extensions/locale" and Angular.JS format logic
 * See https://github.com/Flutter-Global/ng-extensions-locale/blob/master/src/locale-constant.js
 */
const formatExchangeCurrency = (currency: CurrencyArguments, formatter: CustomCurrencyConfiguration): string => {
  const { localeCodeBcp47, decimalPlaces = 2, value } = currency;
  const { symbolPosition, currencySymbol } = formatter;

  const number = new Intl.NumberFormat(localeCodeBcp47, {
    style: "decimal",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);

  return symbolPosition === "prefix" ? `${currencySymbol}${number}` : `${number} ${currencySymbol}`;
};

/**
 * Format a value into a currency, with decimal places.
 *
 * For Sportsbook, it applies the default currency format.
 *
 * For Exchange, it lookups the intended format by validating existing
 * custom format for the provided `localeCodeBcp47` and `currencyCode`.
 * If no custom format exists, it applies the default currency format.
 * If custom format exists, it returns the currency in the desired
 * symbol format:
 * * Prefixed: <SYMBOL><SPACING><NUMBER>
 * * Postfixed: <NUMBER><SPACING><SYMBOL>
 *
 * @param {CurrencyArguments} args Currency format arguments
 * @param {string} options.localeCodeBcp47 BCP 47 language tag (from **`UserDetails`**)
 * @param {string} options.currencyCode Currency code (from **`UserDetails`**)
 * @param {number} options.value Value to be formatted into currency
 * @param {number} options.decimalPlaces Number of decimal places to be applied
 * @param {boolean} options.useCustomCurrencyFormat If custom currency format should be applied
 * @returns Formatted currency with decimal places
 */
export const currencyFormatWithDecimalPlaces: CurrencyFormatters["currencyFormatWithDecimalPlaces"] = (
  args,
): string => {
  const { localeCodeBcp47, currencyCode, useCustomCurrencyFormat = false } = args;
  if (!isOnlineCurrencyUserDetails({ localeCodeBcp47, currencyCode })) {
    return "";
  }

  const customCurrencyFormatter = CUSTOM_CURRENCY_FORMATTERS?.[currencyCode];
  /*
   * Applies custom currency formatting, depending on `localeCodeBcp47` and `currencyCode`.
   * See STSIER-864 spike output: https://flutteruki.atlassian.net/wiki/x/LAJCjQ
   */
  return useCustomCurrencyFormat && customCurrencyFormatter
    ? formatExchangeCurrency(args, customCurrencyFormatter)
    : formatCurrency(args);
};

/**
 * Format a value into a currency, without decimal places.
 *
 * Uses **`currencyFormatWithDecimalPlaces`**, while passing
 * `decimalPlaces` as 0.
 *
 * @param {CurrencyArguments} args Currency format arguments
 * @returns Formatted currency without decimal places
 */
export const currencyFormatWithoutDecimalPlaces: CurrencyFormatters["currencyFormatWithoutDecimalPlaces"] = (
  args,
): string => currencyFormatWithDecimalPlaces({ ...args, decimalPlaces: 0 });
