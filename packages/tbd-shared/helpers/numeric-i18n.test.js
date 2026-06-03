import { KeyboardSeparator } from "@ppb/the-wall-common/types";

import { getSeparatorByLocale } from "./numeric-i18n";

describe("Number format helper", () => {
  describe("getSeparatorByLocale", () => {
    describe.each`
      localeCode | separator
      ${"pt_BR"} | ${KeyboardSeparator.Comma}
      ${"it"}    | ${KeyboardSeparator.Comma}
      ${"uk"}    | ${KeyboardSeparator.Dot}
    `("when localeCode is", ({ localeCode, separator }) => {
      it(`${localeCode} should return ${separator}`, () => {
        expect(getSeparatorByLocale(localeCode)).toEqual(separator);
      });
    });
  });
});
