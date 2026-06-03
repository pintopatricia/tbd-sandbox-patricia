import { createExchangeMarketBetSelector } from "./exchange-market-bets-selectors";

const stateMock = {
  layouts: {
    cardgroups: {
      betcardgroups: {
        "ppb:tbd:card:bet:group:32716510|exc": {
          typename: "BetCardGroup",
          urn: "ppb:tbd:card:bet:group:32716510|exc",
          aggregatorId: "32716510",
          aggregatorDesc: "Boca Juniors de Cali v Fortaleza FC",
          items: [
            {
              typename: "MarketBetCardGroup",
              urn: "ppb:tbd:cardgroup:marketBetCard:1.173614905?=orderType=SETTLED",
            },
          ],
        },
      },
      marketbetcardgroups: {
        "ppb:tbd:cardgroup:marketBetCard:1.173614905?=orderType=SETTLED": {
          urn: "ppb:tbd:cardgroup:marketBetCard:1.173614905?=orderType=SETTLED",
          typename: "MarketBetCardGroup",
          items: [
            {
              typename: "MarketBetCard",
              urn: "ppb:tbd:card:marketBet:1.173614905?=orderType=SETTLED",
            },
          ],
        },
      },
    },
    cards: {
      marketbetcard: {
        "ppb:tbd:card:marketBet:1.173614905?=orderType=SETTLED": {
          typename: "MarketBetCard",
          urn: "ppb:tbd:card:marketBet:1.173614905?=orderType=SETTLED",
          numberOfBets: 2,
          numberOfUnmatched: 0,
          marketBetURN: "ppb:marketBet:1.173614905",
          commission: 0,
          profit: -0.65,
          netProfit: -0.65,
        },
      },
    },
  },
  betting: {
    exchangemarketbets: {
      "ppb:marketBet:1.173614905": {
        urn: "ppb:marketBet:1.173614905",
        id: "1.173614905",
        description: "Match Odds",
        numOfOrders: 4,
        numOfUnmatched: 0,
      },
    },
  },
};

const stateMock2 = {
  layouts: {
    cardgroups: {},
    cards: {},
  },
  betting: {
    exchangemarketbets: {
      "ppb:marketBet:1.173614906": {
        urn: "ppb:marketBet:1.173614906",
        id: "1.173614906",
        description: "Over/Under 2.5",
        numOfOrders: 0,
        numOfUnmatched: 1,
      },
    },
  },
};

describe('"exchangeMarketBet" selectors', () => {
  describe("createExchangeMarketBetSelector", () => {
    it("should be a function factory", () => {
      const getExchangeMarketBet = createExchangeMarketBetSelector();
      expect(getExchangeMarketBet).toEqual(expect.any(Function));
      expect(getExchangeMarketBet).not.toBe(createExchangeMarketBetSelector());
    });

    describe("when state does not change", () => {
      it("should not recompute the selector", () => {
        const getExchangeMarketBet = createExchangeMarketBetSelector();
        getExchangeMarketBet(stateMock);
        getExchangeMarketBet(stateMock);

        expect(getExchangeMarketBet.recomputations()).toEqual(1);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const getExchangeMarketBet = createExchangeMarketBetSelector();
        getExchangeMarketBet(stateMock);
        getExchangeMarketBet(stateMock2);
        getExchangeMarketBet(stateMock2);

        expect(getExchangeMarketBet.recomputations()).toEqual(2);
      });
    });

    describe("when bet for requested urn exists", () => {
      it("should return the corresponding bet", () => {
        const getExchangeMarketBet = createExchangeMarketBetSelector();
        expect(getExchangeMarketBet(stateMock, "ppb:marketBet:1.173614905")).toStrictEqual({
          urn: "ppb:marketBet:1.173614905",
          id: "1.173614905",
          description: "Match Odds",
          numOfOrders: 4,
          numOfUnmatched: 0,
          betCardGroupURN: "ppb:tbd:card:bet:group:32716510|exc",
          marketBetCardGroupURN: ["ppb:tbd:cardgroup:marketBetCard:1.173614905?=orderType=SETTLED"],
        });
      });
    });

    describe("when bet for requested urn does not exists", () => {
      it("should return undefined", () => {
        const getExchangeMarketBet = createExchangeMarketBetSelector();
        expect(getExchangeMarketBet(stateMock, "ppb:marketBet:1.173614900")).toBe(undefined);
      });
    });
  });
});
