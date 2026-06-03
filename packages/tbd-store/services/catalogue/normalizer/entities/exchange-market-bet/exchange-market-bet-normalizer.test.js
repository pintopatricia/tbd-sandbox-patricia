import normalizeExchangeMarketBetFragmentIntoExchangeMarketBet from "./exchange-market-bet-normalizer";

jest.mock("../exchange-cashout-quote/exchange-cashout-quote-normalizer", () => jest.fn());

const BFF_RESPONSE = {
  urn: "ppb:marketBet:1.173614905",
  id: "1.173614905",
  description: "Match Odds",
  numOfOrders: 4,
  numOfUnmatched: 0,
  liability: 1,
  betDelay: 0,
  cashoutQuotes: [
    {
      urn: "ppb:excCashoutQuote:1.177655599/0",
      marketURN: "ppb:excMarket:1.177655599",
      profit: -0.02,
      value: 1.98,
      status: "AVAILABLE",
    },
    {
      urn: "ppb:excCashoutQuote:1.177655600/0",
      marketURN: "ppb:excMarket:1.177655600",
      profit: -0.02,
      value: 1.98,
      status: "AVAILABLE",
    },
  ],
  marketViewLink: {
    viewUrn: "ppb:tbd:view:market:1.173614905",
    viewUrl: "football/swedish-allsvenskan/malmo-ff-v-sirius/match-odds/m-1.173614905",
  },
  exchangeLightMarketViewLink: {
    viewUrn: "ppb:tbd:view:generic:exchangeLightMarket:1.173614905",
    viewUrl: "Not Implemented",
  },
};

describe("exchange market bets normalizer", () => {
  describe("normalizeExchangeMarketBetFragmentIntoExchangeMarketBet", () => {
    it("should correctly transform and return the data object when all field have data", () => {
      const { data } = normalizeExchangeMarketBetFragmentIntoExchangeMarketBet(
        BFF_RESPONSE,
        "betCardGroupURN",
        "marketBetCardGroupURN",
      );

      expect(data).toEqual({
        urn: "ppb:marketBet:1.173614905",
        marketId: "1.173614905",
        description: "Match Odds",
        numOfOrders: 4,
        numOfUnmatched: 0,
        cashoutQuotesURNs: ["ppb:excCashoutQuote:1.177655599/0", "ppb:excCashoutQuote:1.177655600/0"],
        liability: 1,
        betDelay: 0,
        marketViewLink: {
          viewUrn: "ppb:tbd:view:market:1.173614905",
          viewUrl: "football/swedish-allsvenskan/malmo-ff-v-sirius/match-odds/m-1.173614905",
        },
        exchangeLightMarketViewLink: {
          viewUrn: "ppb:tbd:view:generic:exchangeLightMarket:1.173614905",
          viewUrl: "Not Implemented",
        },
      });
    });

    it("should correctly transform and return the data object when non mandatory fields are null", () => {
      const { data } = normalizeExchangeMarketBetFragmentIntoExchangeMarketBet({
        ...BFF_RESPONSE,
        description: null,
        liability: null,
        betDelay: null,
        betCardGroupURN: null,
        marketViewLink: null,
        exchangeLightMarketViewLink: null,
      });

      expect(data).toEqual({
        urn: "ppb:marketBet:1.173614905",
        marketId: "1.173614905",
        description: null,
        numOfOrders: 4,
        numOfUnmatched: 0,
        cashoutQuotesURNs: ["ppb:excCashoutQuote:1.177655599/0", "ppb:excCashoutQuote:1.177655600/0"],
        betDelay: undefined,
        betCardGroupURN: undefined,
        marketViewLink: undefined,
        exchangeLightMarketViewLink: undefined,
        typename: undefined,
      });
    });
  });
});
