export type CustomCurrencyConfiguration = {
  symbolPosition: "prefix" | "postfix";
  currencySymbol: string;
};

type CustomCurrencyFormatters = {
  [currencyCode: PropertyKey]: CustomCurrencyConfiguration;
};

/**
 * **[`@ng-extensions/locale`](https://github.com/Flutter-Global/ng-extensions-locale/blob/master/src/locale-constant.js)**
 * Angular.JS backport of Exchange currency format
 *
 * NOTE: Countries whose 'localeCodeBcp47' and 'currencyCode' appear
 * in **`@ng-extensions/locale`** but not here fallback to `Intl.NumberFormat`.
 *
 * More info here:
 * * [Usage of currency spacing](https://github.com/angular/angular.js/blob/d8f77817eb5c98dec5317bc3756d1ea1812bcfbe/i18n/closure/numberSymbols.js)
 * * [Currency symbol position logic - constant](https://github.com/angular/angular.js/blob/d8f77817eb5c98dec5317bc3756d1ea1812bcfbe/i18n/closure/currencySymbols.js#L308)
 * * [Currency symbol position logic - method](https://github.com/angular/angular.js/blob/d8f77817eb5c98dec5317bc3756d1ea1812bcfbe/i18n/closure/currencySymbols.js#L219)
 */
export const CUSTOM_CURRENCY_FORMATTERS: CustomCurrencyFormatters = {
  GBP: { symbolPosition: "prefix", currencySymbol: "\u00a3" },
  EUR: { symbolPosition: "prefix", currencySymbol: "\u20ac" },
  USD: { symbolPosition: "prefix", currencySymbol: "$" },
  AUD: { symbolPosition: "prefix", currencySymbol: "$" },
  CAD: { symbolPosition: "prefix", currencySymbol: "$" },
  RON: { symbolPosition: "postfix", currencySymbol: "RON" },
  DKK: { symbolPosition: "postfix", currencySymbol: "kr." },
  BRL: { symbolPosition: "prefix", currencySymbol: "R$" },
};
