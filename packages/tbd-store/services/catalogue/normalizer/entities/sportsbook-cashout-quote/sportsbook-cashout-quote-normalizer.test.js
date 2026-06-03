import sportsbookCashoutQuoteNormalizer from "./sportsbook-cashout-quote-normalizer";

const SBK_QUOTE_MOCK = {
  urn: "ppb:sbkCashoutQuote:1020152481",
  betUrn: "ppb:sbkBet:1",
  cashOutToken: "6Nad6hGVSatAz4jPfBnZTmR0o9GN3WHpfAJPXcG",
  quote: 2,
  refreshRate: 10,
  stake: 2,
  betDelay: 0,
  status: "AVAILABLE",
};

const SBK_QUOTE_NULL_MOCK = {
  urn: "ppb:sbkCashoutQuote:1020152481",
  betUrn: "ppb:sbkBet:1",
  cashOutToken: null,
  quote: null,
  refreshRate: null,
  stake: null,
  betDelay: null,
  status: "UNAVAILABLE",
};

describe("SportsbookCashoutQuote normalizer", () => {
  describe("when all props are available", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = sportsbookCashoutQuoteNormalizer(SBK_QUOTE_MOCK);

      expect(data).toEqual({
        urn: "ppb:sbkCashoutQuote:1020152481",
        betUrn: "ppb:sbkBet:1",
        cashOutToken: "6Nad6hGVSatAz4jPfBnZTmR0o9GN3WHpfAJPXcG",
        quote: 2,
        refreshRate: 10,
        stake: 2,
        betDelay: 0,
        status: "AVAILABLE",
        step: "DISPLAY",
      });
    });
  });
  describe("when the optional props are null", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = sportsbookCashoutQuoteNormalizer(SBK_QUOTE_NULL_MOCK);

      expect(data).toEqual({
        urn: "ppb:sbkCashoutQuote:1020152481",
        betUrn: "ppb:sbkBet:1",
        cashOutToken: undefined,
        quote: undefined,
        refreshRate: undefined,
        stake: undefined,
        betDelay: undefined,
        status: "UNAVAILABLE",
        step: "DISPLAY",
      });
    });
  });
});
