import { CashoutStep } from "@ppb/tbd-store/state/constants";

import { getExternalLink } from "../../helpers/external-links";
import {
  getCashoutButtonLabels,
  getEmptyCashoutViewModel,
  getExchangeCashoutViewModel,
  getSportsbookCashoutViewModel,
} from "./cashout-view-model";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: ({ value }) => {
    if (value >= 0) return `€${value}`;

    return `-€${value * -1}`;
  },
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    countryCode: "PT",
    currencyCode: "EUR",
    localeCode: "pt",
  })),
}));

jest.mock("../../helpers/external-links", () => ({
  getExternalLink: jest.fn(),
}));

let cashoutViewModel;

const excCashoutURN = "ppb:excCashoutQuote:1.40/0";
const sbkCashoutURN = "ppb:sbkCashoutQuote:1020152481";

const isConfirmStepActive = true;

const userDetails = {
  countryCode: "PT",
  currencyCode: "EUR",
  localeCode: "pt",
};

const excQuoteUnavailable = {
  urn: "ppb:excCashoutQuote:1.40/0",
  marketURN: "ppb:mockMarketUrn",
  status: "UNAVAILABLE",
};

const excQuoteAvailable = {
  urn: "ppb:excCashoutQuote:1.40/0",
  marketURN: "ppb:mockMarketUrn",
  value: 0.01,
  profit: -0.05,
  status: "AVAILABLE",
  step: CashoutStep.HIDE,
};

const market = {
  betDelay: 5,
};

const marketBet = {
  betDelay: 10,
};

const sbkQuoteUnavailable = {
  urn: "ppb:sbkCashoutQuote:1020152481",
  betUrn: "ppb:sbkBet:1",
  cashOutToken: undefined,
  quote: undefined,
  refreshRate: undefined,
  stake: undefined,
  betDelay: undefined,
  status: "UNAVAILABLE",
};

const sbkQuoteAvailable = {
  urn: "ppb:sbkCashoutQuote:1020152481",
  betUrn: "ppb:sbkBet:1",
  cashOutToken: "6Nad6hGVSatAz4jPfBnZTmR0o9GN3WHpfAJPXcG",
  quote: 2,
  refreshRate: 10,
  stake: 2,
  betDelay: 1,
  status: "AVAILABLE",
  step: CashoutStep.HIDE,
};

const sbkQuoteSuspended = {
  ...sbkQuoteUnavailable,
  status: "SUSPENDED",
};

describe("getEmptyCashoutViewModel", () => {
  beforeAll(() => {
    cashoutViewModel = getEmptyCashoutViewModel();
  });

  it("should return the default cashoutViewModel with no relevant data", () => {
    expect(cashoutViewModel).toEqual({
      cashoutURN: "",
      rawSecondaryValue: 0,
      isVisible: false,
      isDisabled: true,
      isConfirmStepActive: false,
      stopAnimation: true,
      buttonLabel: "",
      detailLabel: "",
      formattedSecondaryValueLabel: "",
      state: "default",
    });
  });
});

describe("getExchangeCashoutViewModel", () => {
  describe("state", () => {
    it("should return success state when step is RECEIPT", () => {
      cashoutViewModel = getExchangeCashoutViewModel(
        excCashoutURN,
        false,
        userDetails,
        { ...excQuoteAvailable, step: CashoutStep.RECEIPT, cashedOutProfit: 0.1 },
        market,
        marketBet,
      );

      expect(cashoutViewModel).toMatchObject({
        state: "success",
        isDisabled: true,
        rawSecondaryValue: 0.1,
      });
    });

    it("should return unavailable state when status is not AVAILABLE", () => {
      cashoutViewModel = getExchangeCashoutViewModel(
        excCashoutURN,
        false,
        userDetails,
        excQuoteUnavailable,
        market,
        marketBet,
      );

      expect(cashoutViewModel).toMatchObject({
        state: "unavailable",
        isDisabled: true,
        rawSecondaryValue: 0,
      });
    });

    it("should return default state when status is AVAILABLE and step is not RECEIPT", () => {
      cashoutViewModel = getExchangeCashoutViewModel(
        excCashoutURN,
        false,
        userDetails,
        excQuoteAvailable,
        market,
        marketBet,
      );

      expect(cashoutViewModel).toMatchObject({
        state: "default",
        isDisabled: false,
        rawSecondaryValue: -0.05,
      });
    });
  });

  describe("betDelay", () => {
    it("should use market betDelay when market is provided", () => {
      cashoutViewModel = getExchangeCashoutViewModel(
        excCashoutURN,
        false,
        userDetails,
        excQuoteAvailable,
        market,
        marketBet,
      );

      expect(cashoutViewModel.betDelay).toBe(5);
    });

    it("should use marketBet betDelay when market is not provided", () => {
      cashoutViewModel = getExchangeCashoutViewModel(
        excCashoutURN,
        false,
        userDetails,
        excQuoteAvailable,
        null,
        marketBet,
      );

      expect(cashoutViewModel.betDelay).toBe(10);
    });

    it("should default to 0 when neither market nor marketBet is provided", () => {
      cashoutViewModel = getExchangeCashoutViewModel(excCashoutURN, false, userDetails, excQuoteAvailable, null, null);

      expect(cashoutViewModel.betDelay).toBe(0);
    });
  });

  describe("stopAnimation", () => {
    it("should be false when step is CASHING_OUT", () => {
      cashoutViewModel = getExchangeCashoutViewModel(
        excCashoutURN,
        false,
        userDetails,
        { ...excQuoteAvailable, step: CashoutStep.CASHING_OUT },
        market,
        marketBet,
      );

      expect(cashoutViewModel.stopAnimation).toBe(false);
    });

    it("should be true when step is not CASHING_OUT", () => {
      cashoutViewModel = getExchangeCashoutViewModel(
        excCashoutURN,
        false,
        userDetails,
        { ...excQuoteAvailable, step: CashoutStep.HIDE },
        market,
        marketBet,
      );

      expect(cashoutViewModel.stopAnimation).toBe(true);
    });
  });

  describe("other props", () => {
    it("should always return isVisible as true and pass through cashoutURN, step and isConfirmStepActive", () => {
      cashoutViewModel = getExchangeCashoutViewModel(
        excCashoutURN,
        true,
        userDetails,
        excQuoteAvailable,
        market,
        marketBet,
      );

      expect(cashoutViewModel).toMatchObject({
        isVisible: true,
        cashoutURN: excCashoutURN,
        step: CashoutStep.HIDE,
        isConfirmStepActive: true,
      });
    });
  });
});

describe("getSportsbookCashoutViewModel", () => {
  describe("state", () => {
    it("should return success state when step is RECEIPT", () => {
      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, false, userDetails, {
        ...sbkQuoteAvailable,
        step: CashoutStep.RECEIPT,
        cashedOutProfit: 0.1,
      });

      expect(cashoutViewModel).toMatchObject({
        state: "success",
        isDisabled: true,
        rawSecondaryValue: 0.1,
      });
    });

    it("should return unavailable state when status is not AVAILABLE", () => {
      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, false, userDetails, sbkQuoteUnavailable);

      expect(cashoutViewModel).toMatchObject({
        state: "unavailable",
        isDisabled: true,
        rawSecondaryValue: 0,
      });
    });

    it("should return default state when status is AVAILABLE and step is not RECEIPT", () => {
      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, false, userDetails, sbkQuoteAvailable);

      expect(cashoutViewModel).toMatchObject({
        state: "default",
        isDisabled: false,
        rawSecondaryValue: 0,
      });
    });
  });

  describe("profit", () => {
    it("should calculate profit as quote minus stake", () => {
      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, false, userDetails, {
        ...sbkQuoteAvailable,
        quote: 10,
        stake: 3,
      });

      expect(cashoutViewModel.rawSecondaryValue).toBe(7);
    });

    it("should default profit to 0 when quote or stake is undefined", () => {
      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, false, userDetails, {
        ...sbkQuoteUnavailable,
        quote: undefined,
        stake: undefined,
      });

      expect(cashoutViewModel.rawSecondaryValue).toBe(0);
    });
  });

  describe("stopAnimation", () => {
    it("should be false when step is CASHING_OUT", () => {
      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, false, userDetails, {
        ...sbkQuoteAvailable,
        step: CashoutStep.CASHING_OUT,
      });

      expect(cashoutViewModel.stopAnimation).toBe(false);
    });

    it("should be false when step is CONFIRM", () => {
      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, false, userDetails, {
        ...sbkQuoteAvailable,
        step: CashoutStep.CONFIRM,
      });

      expect(cashoutViewModel.stopAnimation).toBe(false);
    });

    it("should be true when step is HIDE", () => {
      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, false, userDetails, {
        ...sbkQuoteAvailable,
        step: CashoutStep.HIDE,
      });

      expect(cashoutViewModel.stopAnimation).toBe(true);
    });
  });

  describe("showWhyIsThisLink and suspendedSupportUrl", () => {
    it("should set showWhyIsThisLink to true when status is SUSPENDED, the suspendedSupportUrl exists and cashoutSuspensionReasonsActive is false", () => {
      getExternalLink.mockReturnValueOnce("https://support.url");

      cashoutViewModel = getSportsbookCashoutViewModel(
        sbkCashoutURN,
        false,
        userDetails,
        sbkQuoteSuspended,
        false,
        false,
      );

      expect(getExternalLink).toHaveBeenCalledWith("CASHOUT_SUSPENDED_WHY_IS_THIS");
      expect(cashoutViewModel).toMatchObject({
        showWhyIsThisLink: true,
        suspendedSupportUrl: "https://support.url",
      });
    });

    it("should set showWhyIsThisLink to false when suspendedSupportUrl is empty", () => {
      getExternalLink.mockReturnValueOnce("");

      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, false, userDetails, sbkQuoteSuspended, false);

      expect(cashoutViewModel).toMatchObject({
        showWhyIsThisLink: false,
        suspendedSupportUrl: "",
      });
    });

    it("should set showWhyIsThisLink to false when status is not SUSPENDED", () => {
      getExternalLink.mockReturnValueOnce("https://support.url");

      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, false, userDetails, sbkQuoteAvailable, false);

      expect(cashoutViewModel.showWhyIsThisLink).toBe(false);
    });

    it("should set showWhyIsThisLink to false when cashoutSuspensionReasonsActive is true", () => {
      getExternalLink.mockReturnValueOnce("https://support.url");

      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, false, userDetails, sbkQuoteSuspended, true);

      expect(cashoutViewModel.showWhyIsThisLink).toBe(false);
    });
  });

  describe("other props", () => {
    it("should always return isVisible as true and pass through cashoutURN, step, betDelay and isConfirmStepActive", () => {
      cashoutViewModel = getSportsbookCashoutViewModel(sbkCashoutURN, true, userDetails, sbkQuoteAvailable);

      expect(cashoutViewModel).toMatchObject({
        isVisible: true,
        cashoutURN: sbkCashoutURN,
        step: CashoutStep.HIDE,
        betDelay: 1,
        isConfirmStepActive: true,
      });
    });
  });
});

describe("getCashoutButtonLabels", () => {
  const userDetails = {
    countryCode: "PT",
    currencyCode: "EUR",
    localeCode: "pt",
  };

  describe("when isSuccessCashout is true", () => {
    it("should return success title with formatted receipt profit", () => {
      const result = getCashoutButtonLabels(
        undefined,
        undefined,
        "AVAILABLE",
        CashoutStep.RECEIPT,
        userDetails,
        true,
        0.5,
        false,
      );

      expect(result).toEqual({
        buttonLabel: "I18N.CASHOUT.SUCCESS_TITLE",
        detailLabel: "I18N.CASHOUT.PROFIT",
        formattedSecondaryValueLabel: "€0.5",
      });
    });
  });

  describe("when value and profit are defined", () => {
    describe("and step is CONFIRM with isConfirmStepActive true", () => {
      it("should return confirm label with loading label", () => {
        const result = getCashoutButtonLabels(10, 5, "AVAILABLE", CashoutStep.CONFIRM, userDetails, false, 0, true);

        expect(result).toEqual({
          buttonLabel: "I18N.CASHOUT.CONFIRM: €10",
          detailLabel: "I18N.CASHOUT.PROFIT",
          loadingLabel: "I18N.CASHOUT.CASHING_OUT: €10",
          formattedSecondaryValueLabel: "€5",
        });
      });
    });

    describe("and step is CONFIRM with isConfirmStepActive false", () => {
      it("should return confirm label without loading label", () => {
        const result = getCashoutButtonLabels(10, 5, "AVAILABLE", CashoutStep.CONFIRM, userDetails, false, 0, false);

        expect(result).toEqual({
          buttonLabel: "I18N.CASHOUT.CONFIRM: €10",
          detailLabel: "I18N.CASHOUT.PROFIT",
          loadingLabel: undefined,
          formattedSecondaryValueLabel: "€5",
        });
      });
    });

    describe("and step is DISPLAY with isConfirmStepActive false", () => {
      it("should return title with loading label", () => {
        const result = getCashoutButtonLabels(10, 5, "AVAILABLE", CashoutStep.DISPLAY, userDetails, false, 0, false);

        expect(result).toEqual({
          buttonLabel: "I18N.CASHOUT.TITLE: €10",
          detailLabel: "I18N.CASHOUT.PROFIT",
          loadingLabel: "I18N.CASHOUT.CASHING_OUT: €10",
          formattedSecondaryValueLabel: "€5",
        });
      });
    });

    describe("and step is DISPLAY with isConfirmStepActive true", () => {
      it("should return title without loading label", () => {
        const result = getCashoutButtonLabels(10, 5, "AVAILABLE", CashoutStep.DISPLAY, userDetails, false, 0, true);

        expect(result).toEqual({
          buttonLabel: "I18N.CASHOUT.TITLE: €10",
          detailLabel: "I18N.CASHOUT.PROFIT",
          loadingLabel: undefined,
          formattedSecondaryValueLabel: "€5",
        });
      });
    });

    describe("and step is CASHING_OUT", () => {
      it("should return title with loading label", () => {
        const result = getCashoutButtonLabels(
          10,
          5,
          "AVAILABLE",
          CashoutStep.CASHING_OUT,
          userDetails,
          false,
          0,
          false,
        );

        expect(result).toEqual({
          buttonLabel: "I18N.CASHOUT.TITLE: €10",
          detailLabel: "I18N.CASHOUT.PROFIT",
          loadingLabel: "I18N.CASHOUT.CASHING_OUT: €10",
          formattedSecondaryValueLabel: "€5",
        });
      });
    });

    describe("and step is HIDE", () => {
      it("should return title without loading label", () => {
        const result = getCashoutButtonLabels(10, 5, "AVAILABLE", CashoutStep.HIDE, userDetails, false, 0, false);

        expect(result).toEqual({
          buttonLabel: "I18N.CASHOUT.TITLE: €10",
          detailLabel: "I18N.CASHOUT.PROFIT",
          loadingLabel: undefined,
          formattedSecondaryValueLabel: "€5",
        });
      });
    });
  });

  describe("when cashoutSuspensionReasonsActive is false and showWhyIsThisLink is true", () => {
    it("should return suspension messaging label", () => {
      const result = getCashoutButtonLabels(
        undefined,
        undefined,
        "SUSPENDED",
        CashoutStep.HIDE,
        userDetails,
        false,
        0,
        false,
        true,
        false,
      );

      expect(result).toEqual({
        buttonLabel: "I18N.CASH_OUT_SUSPENSION_MESSAGING_PT_1",
        detailLabel: "",
      });
    });
  });

  describe("when cashoutSuspensionReasonsActive is true and status is SUSPENDED", () => {
    it("should return updating label with new suspended label", () => {
      const result = getCashoutButtonLabels(
        undefined,
        undefined,
        "SUSPENDED",
        CashoutStep.HIDE,
        userDetails,
        false,
        0,
        false,
        false,
        true,
      );

      expect(result).toEqual({
        buttonLabel: "I18N.CASHOUT.UPDATING",
        detailLabel: "I18N.CASHOUT.STATUS.SUSPENDED_NEW",
      });
    });
  });

  describe("when none of the special conditions are met", () => {
    describe.each([
      ["AVAILABLE", ""],
      ["UNAVAILABLE", "I18N.CASHOUT.STATUS.UNAVAILABLE"],
      ["LATE_WITHDRAWAL", "I18N.CASHOUT.STATUS.LATE_WITHDRAWAL"],
      ["FAIL", "I18N.CASHOUT.STATUS.FAIL"],
      ["BET_CLOSED", "I18N.CASHOUT.STATUS.BET_CLOSED"],
      ["NOT_ELIGIBLE", "I18N.CASHOUT.STATUS.UNAVAILABLE"],
      ["SUSPENDED", "I18N.CASHOUT.STATUS.SUSPENDED"],
      ["QUOTE_TOO_LOW", "I18N.CASHOUT.STATUS.QUOTE_TOO_LOW"],
      ["QUOTE_TOO_LOW_FREE_BET", "I18N.CASHOUT.STATUS.QUOTE_TOO_LOW_FREE_BET"],
      ["LEG_RESULT_PENDING", "I18N.CASHOUT.STATUS.LEG_RESULT_PENDING"],
      ["PENDING_CASHOUT", "I18N.CASHOUT.STATUS.UNAVAILABLE"],
      ["INPLAY_MARKET_NOT_ELIGIBLE", "I18N.CASHOUT.STATUS.INPLAY_MARKET_NOT_ELIGIBLE"],
    ])("and status is %s", (status, detailLabel) => {
      it(`should return the cashout title with "${detailLabel}" as detailLabel`, () => {
        const result = getCashoutButtonLabels(
          undefined,
          undefined,
          status,
          CashoutStep.HIDE,
          userDetails,
          false,
          0,
          false,
          false,
          false,
        );

        expect(result).toEqual({
          buttonLabel: "I18N.CASHOUT.TITLE",
          detailLabel: detailLabel,
        });
      });
    });
  });
});
