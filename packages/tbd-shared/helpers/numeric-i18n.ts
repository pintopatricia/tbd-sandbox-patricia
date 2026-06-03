import { KeyboardSeparator } from "@ppb/the-wall-common/types";

const COMMA_SEPARATOR_LOCALES = ["pt_BR", "it"];

/**
 * Return a custom separator based on user locale.
 *
 * @param {string} localeCode User localeCode.
 *
 * @returns {KeyboardSeparator} Returns a separator based on localeCode.
 */
export const getSeparatorByLocale = (localeCode: string): KeyboardSeparator => {
  const useComma = COMMA_SEPARATOR_LOCALES.includes(localeCode);

  return useComma ? KeyboardSeparator.Comma : KeyboardSeparator.Dot;
};
