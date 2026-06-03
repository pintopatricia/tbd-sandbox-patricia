import { BetType } from "../state/constants";
import { buildQuoteReceipt } from "./receipt";

const QUOTE_DATA = {
  cashoutUrn: "cashoutUrn",
  cashedOutQuote: 2.1,
  profit: 0.1,
  marketDescription: "Match Odds",
  eventDescription: "Man Utd v Crystal Palace",
};

const COMMON_VIEW_MODEL = {
  entityURN: QUOTE_DATA.cashoutUrn,
  receiptTitle: {
    translate: { key: "I18N.CASHOUT.SUCCESS_TITLE" },
  },
  detailTitle: {
    translated: QUOTE_DATA.eventDescription,
  },
  detailSubtitle: {
    translated: QUOTE_DATA.marketDescription,
  },
  segmentLeftLabel: {
    translate: { key: "I18N.CASHOUT.TITLE" },
  },
  segmentLeftValue: {
    value: QUOTE_DATA.cashedOutQuote,
    decimalPlaces: 2,
  },
  segmentRightLabel: {
    translate: { key: "I18N.CASHOUT.PROFIT" },
  },
  segmentRightValue: {
    value: QUOTE_DATA.profit,
    decimalPlaces: 2,
  },
  errorMessage: undefined,
};

const ERROR_VIEW_MODEL = {
  entityURN: QUOTE_DATA.cashoutUrn,
  receiptTitle: {
    translate: { key: "I18N.CASHOUT.TITLE" },
  },
  errorMessage: undefined,
};

const buildViewModel = ({ cashoutStatus = "SUCCESS", betType, numLines, isSGM = false } = {}) =>
  buildQuoteReceipt(
    QUOTE_DATA.cashoutUrn,
    cashoutStatus,
    QUOTE_DATA.eventDescription,
    QUOTE_DATA.marketDescription,
    QUOTE_DATA.cashedOutQuote,
    QUOTE_DATA.profit,
    betType,
    numLines,
    isSGM,
  );

afterEach(() => {
  jest.clearAllMocks();
});

describe("buildQuoteReceipt", () => {
  describe("when cashed out quote has SUCCESS status", () => {
    it("should return the correct viewModel", () => {
      expect(buildViewModel()).toEqual({
        ...COMMON_VIEW_MODEL,
      });
    });
  });

  describe("when betType is SINGLE and numLines is defined (SBK bet cashout only)", () => {
    it("should return the correct viewModel with the default detailTitle and detailSubtitle", () => {
      expect(buildViewModel({ betType: BetType.SGL, numLines: 1 })).toEqual({
        ...COMMON_VIEW_MODEL,
      });
    });
  });

  describe("when betType is not SINGLE and numLines is undefined (SBK bet cashout only)", () => {
    it("should return the correct viewModel with the default detailTitle and detailSubtitle", () => {
      expect(buildViewModel({ betType: BetType.TBL })).toEqual({
        ...COMMON_VIEW_MODEL,
      });
    });
  });

  describe("when betType is not SINGLE and numLines is defined (SBK bet cashout only)", () => {
    describe("when it is a Bet Builder multiple", () => {
      it("should return the correct viewModel with the detailTitle and detailSubtitle overridden with BET_BUILDER", () => {
        expect(buildViewModel({ betType: BetType.TBL, numLines: 1, isSGM: true })).toEqual({
          ...COMMON_VIEW_MODEL,
          detailTitle: {
            translate: { key: "I18N.MY_BETS.SBK.BET_BUILDER.TREBLE_LINES", interpolationValues: { numLines: "1" } },
          },
          detailSubtitle: {
            translated: "",
          },
        });
      });
    });

    describe("when it is not a Bet Builder multiple", () => {
      it("should return the correct viewModel with the detailTitle and detailSubtitle overridden with MULTIPLES", () => {
        expect(buildViewModel({ betType: BetType.TBL, numLines: 1 })).toEqual({
          ...COMMON_VIEW_MODEL,
          detailTitle: {
            translate: { key: "I18N.MY_BETS.SBK.MULTIPLE.TREBLE_LINES", interpolationValues: { numLines: "1" } },
          },
          detailSubtitle: {
            translated: "",
          },
        });
      });
    });
  });

  describe.each([
    "ALL_UNMATCHED",
    "BAD_REQUOTE",
    "CANCEL_FAILURE",
    "CASHOUT_FAILED",
    "FORBIDDEN",
    "GENERIC",
    "NOT_ELIGIBLE",
    "NOT_OPEN",
    "NULL",
    "ODD_MOVEMENT",
    "PARTIAL_SUCCESS",
    "PLACEMENT_FAILURE",
    "SUSPENDED",
    "TIMEOUT",
    "UNEXPECTED",
  ])("when cashed out quote has `%s` status", (cashoutStatus) => {
    it("should return the correct viewModel with the generic error message", () => {
      expect(buildViewModel({ cashoutStatus })).toEqual({
        ...ERROR_VIEW_MODEL,
        errorMessage: {
          translate: { key: "I18N.CASHOUT.MESSAGES.CASHOUT_FAILED" },
        },
      });
    });
  });

  describe.each([
    "GENERAL_FAILURE",
    "GEOGRAPHICAL_RESTRICTION",
    "INVALID_BET_DEFINITIONS",
    "INVALID_RUNNER_SIZE",
    "FEATURE_NOT_SUPPORTED",
    "REQUESTED_PRICE_NOT_AVAILABLE",
    "COUNTRY_OF_RESIDENCE_RESTRICTION",
    "PRICE_TYPE_NOT_AVAILABLE",
    "REGULATOR_CLOSED",
  ])("when cashed out quote has `%s` status", (cashoutStatus) => {
    it("should return the correct viewModel with the general failure error message", () => {
      expect(buildViewModel({ cashoutStatus })).toEqual({
        ...ERROR_VIEW_MODEL,
        errorMessage: {
          translate: { key: "I18N.CASHOUT.MESSAGES.GENERAL_FAILURE" },
        },
      });
    });
  });

  describe("when cashed out quote has a status that doesn't belong to general failure or generic error", () => {
    it("should return the correct viewModel with the specific error message", () => {
      expect(buildViewModel({ cashoutStatus: "EXPOSURE" })).toEqual({
        ...ERROR_VIEW_MODEL,
        errorMessage: {
          translate: { key: "I18N.CASHOUT.MESSAGES.EXPOSURE" },
        },
      });
    });
  });
});
