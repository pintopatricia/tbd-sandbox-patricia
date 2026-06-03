import exchangeCashoutQuoteNormalizer from "./exchange-cashout-quote-normalizer";

const BFF_EXCHANGE_QUOTE = {
  urn: "ppb:excCashoutQuote:1.160337355/0",
  marketURN: "ppb:excMarket:1.160337355",
  marketBetURN: "ppb:marketBet:1.160337355",
  value: 1.94,
  profit: -0.06,
  status: "AVAILABLE",
};

const BFF_EXCHANGE_QUOTE_NULL_SCENARIO = {
  urn: "ppb:excCashoutQuote:1.160337355/0",
  marketURN: "ppb:excMarket:1.160337355",
  marketBetURN: "ppb:marketBet:1.160337355",
  value: null,
  profit: null,
  status: "AVAILABLE",
};

const BFF_EXCHANGE_QUOTE_ZERO_SCENARIO = {
  urn: "ppb:excCashoutQuote:1.160337355/0",
  marketURN: "ppb:excMarket:1.160337355",
  marketBetURN: "ppb:marketBet:1.160337355",
  value: 0,
  profit: 0,
  status: "AVAILABLE",
};

describe("ExchangeCashoutQuote normalizer", () => {
  describe("when profit and value are null", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = exchangeCashoutQuoteNormalizer(BFF_EXCHANGE_QUOTE_NULL_SCENARIO);

      expect(data).toEqual({
        urn: "ppb:excCashoutQuote:1.160337355/0",
        marketURN: "ppb:excMarket:1.160337355",
        marketBetURN: "ppb:marketBet:1.160337355",
        value: undefined,
        profit: undefined,
        status: "AVAILABLE",
        step: "DISPLAY",
      });
    });
  });
  describe("when profit and data are zero", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = exchangeCashoutQuoteNormalizer(BFF_EXCHANGE_QUOTE_ZERO_SCENARIO);

      expect(data).toEqual({
        urn: "ppb:excCashoutQuote:1.160337355/0",
        marketURN: "ppb:excMarket:1.160337355",
        marketBetURN: "ppb:marketBet:1.160337355",
        value: 0,
        profit: 0,
        status: "AVAILABLE",
        step: "DISPLAY",
      });
    });
  });
  describe("when profit and data are defined", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = exchangeCashoutQuoteNormalizer(BFF_EXCHANGE_QUOTE);

      expect(data).toEqual({
        urn: "ppb:excCashoutQuote:1.160337355/0",
        marketURN: "ppb:excMarket:1.160337355",
        marketBetURN: "ppb:marketBet:1.160337355",
        value: 1.94,
        profit: -0.06,
        status: "AVAILABLE",
        step: "DISPLAY",
      });
    });
  });
});
