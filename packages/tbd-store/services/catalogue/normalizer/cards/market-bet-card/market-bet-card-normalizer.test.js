import normalizeMarketBetCardFragmentIntoMarketBetCard from "./market-bet-card-normalizer";

describe("normalizeMarketBetCardFragmentIntoMarketBetCard", () => {
  const fragmentMock = {
    __typename: "typename",
    urn: "URN",
    betCardGroupURN: "betCardGroupURN",
    marketBetCardGroupURN: "marketBetCardGroupURN",
    marketBet: {
      urn: "marketBetURN",
      numOfOrders: "numOfOrdersMock",
      numOfUnmatched: "numOfUnmatchedMock",
      liability: "liabilityMock",
      commission: "commissionMock",
      profit: "profitMock",
      netProfit: "netProfitMock",
    },
  };

  describe("data normalizer", () => {
    it("should correctly normalize the card", () => {
      expect(normalizeMarketBetCardFragmentIntoMarketBetCard(fragmentMock)).toEqual({
        data: {
          typename: "typename",
          urn: "URN",
          marketBetURN: "marketBetURN",
          betCardGroupURN: "betCardGroupURN",
          marketBetCardGroupURN: "marketBetCardGroupURN",
          numberOfBets: "numOfOrdersMock",
          numberOfUnmatched: "numOfUnmatchedMock",
          matchedStatus: undefined,
          liability: "liabilityMock",
          commission: "commissionMock",
          profit: "profitMock",
          netProfit: "netProfitMock",
        },
      });
    });

    describe("when matchedStatus is available", () => {
      it("should correctly normalize the card", () => {
        expect(
          normalizeMarketBetCardFragmentIntoMarketBetCard({
            ...fragmentMock,
            matchedStatus: "matchedStatusMock",
            marketBet: {
              ...fragmentMock.marketBet,
            },
          }),
        ).toEqual({
          data: {
            typename: "typename",
            urn: "URN",
            marketBetURN: "marketBetURN",
            betCardGroupURN: "betCardGroupURN",
            marketBetCardGroupURN: "marketBetCardGroupURN",
            numberOfBets: "numOfOrdersMock",
            numberOfUnmatched: "numOfUnmatchedMock",
            matchedStatus: "matchedStatusMock",
            liability: "liabilityMock",
            commission: "commissionMock",
            profit: "profitMock",
            netProfit: "netProfitMock",
          },
        });
      });
    });
  });

  describe("when matchedStatus, liability, commission, profit or netProfit", () => {
    describe("is undefined", () => {
      it("should correctly normalize the card", () => {
        expect(
          normalizeMarketBetCardFragmentIntoMarketBetCard({
            ...fragmentMock,
            marketBet: {
              ...fragmentMock.marketBet,
              matchedStatus: undefined,
              liability: undefined,
              commission: undefined,
              profit: undefined,
              netProfit: undefined,
            },
          }),
        ).toEqual({
          data: {
            typename: "typename",
            urn: "URN",
            marketBetURN: "marketBetURN",
            betCardGroupURN: "betCardGroupURN",
            marketBetCardGroupURN: "marketBetCardGroupURN",
            numberOfBets: "numOfOrdersMock",
            numberOfUnmatched: "numOfUnmatchedMock",
            matchedStatus: undefined,
            liability: undefined,
            commission: undefined,
            profit: undefined,
            netProfit: undefined,
          },
        });
      });
    });

    describe("is null", () => {
      it("should correctly normalize the card", () => {
        expect(
          normalizeMarketBetCardFragmentIntoMarketBetCard({
            ...fragmentMock,
            marketBet: {
              ...fragmentMock.marketBet,
              matchedStatus: undefined,
              liability: null,
              commission: null,
              profit: null,
              netProfit: null,
            },
          }),
        ).toEqual({
          data: {
            typename: "typename",
            urn: "URN",
            marketBetURN: "marketBetURN",
            betCardGroupURN: "betCardGroupURN",
            marketBetCardGroupURN: "marketBetCardGroupURN",
            numberOfBets: "numOfOrdersMock",
            numberOfUnmatched: "numOfUnmatchedMock",
            matchedStatus: undefined,
            liability: undefined,
            commission: undefined,
            profit: undefined,
            netProfit: undefined,
          },
        });
      });
    });
  });
});
