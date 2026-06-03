import { getPreciseSubtraction } from "@ppb/tbd-store/helpers/math";

import { buildSbkBalanceAfterBetLabel } from "./betslip-balance-helper";
import { i18n } from "./i18n";
import { currencyFormatWithDecimalPlaces } from "../formatters/currency-formatters";

jest.mock("@ppb/tbd-store/helpers/math", () => ({
  getPreciseSubtraction: jest.fn((fn, ...numbers) => numbers.reduce((acc, curr) => acc - curr, fn)),
}));

jest.mock("../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(({ value }) => `${value.toFixed(2)} €`),
}));

jest.mock("./i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const USER_DETAILS = {
  currency: "EUR",
};

describe("buildSbkBalanceAfterBetLabel", () => {
  describe("when isOldUseBonusActive is true", () => {
    it("should return N/A", () => {
      const balance = buildSbkBalanceAfterBetLabel(USER_DETAILS, {
        accountBalance: 100,
        totalStake: 2,
        isOldUseBonusActive: true,
        isLoggedIn: true,
      });

      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.NOT_AVAILABLE" });
      expect(balance).toEqual("I18N.BETSLIP.NOT_AVAILABLE");
    });
  });

  describe("when isLoggedIn is false", () => {
    it("should return 0 formatted", () => {
      const balance = buildSbkBalanceAfterBetLabel(USER_DETAILS, {
        accountBalance: 0,
        totalStake: 2,
        isOldUseBonusActive: false,
        isLoggedIn: false,
      });

      expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
        currency: "EUR",
        value: 0,
      });

      expect(balance).toEqual("0.00 €");
    });
  });

  describe("when none of the above conditions are meet", () => {
    describe("and the new account balance is negative", () => {
      it("should return N/A", () => {
        const balance = buildSbkBalanceAfterBetLabel(USER_DETAILS, {
          accountBalance: 100,
          totalStake: 102,
          isOldUseBonusActive: false,
          isLoggedIn: true,
        });

        expect(getPreciseSubtraction).toHaveBeenCalledWith(100, 102);

        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.NOT_AVAILABLE" });

        expect(balance).toEqual("I18N.BETSLIP.NOT_AVAILABLE");
      });
    });

    describe("and the new account balance is equal or above zero", () => {
      it("should return the new balance amount", () => {
        const balance = buildSbkBalanceAfterBetLabel(USER_DETAILS, {
          accountBalance: 100,
          totalStake: 98,
          isOldUseBonusActive: false,
          isLoggedIn: true,
        });

        expect(getPreciseSubtraction).toHaveBeenCalledWith(100, 98);

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          currency: "EUR",
          value: 2,
        });

        expect(balance).toEqual("2.00 €");
      });
    });
  });
});
