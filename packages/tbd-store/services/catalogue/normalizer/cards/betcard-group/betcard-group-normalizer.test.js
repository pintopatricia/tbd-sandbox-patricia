import normalizeBetCardGroupFragmentIntoBetCardGroup from "./betcard-group-normalizer";

const BFF_RESPONSE = {
  __typename: "BetCardGroup",
  urn: "ppb:tbd:card:bet:group:1107046171",
  aggregatorId: "aggregatorId",
  aggregatorDesc: "aggregatorDesc",
  full: {
    edges: [
      {
        node: {
          __typename: "SportsbookBetCard",
          urn: "ppb:tbd:card:sbkBet:1107046171",
          navigationLinks: [],
          bet: {
            urn: "ppb:sbkBet:1107046171",
            __typename: "SportsbookBet",
            betReceiptId: "O/11037374/0000880",
            id: "1107046171",
            isSettled: false,
            profitAndLoss: 3.4,
            originalPotentialWin: null,
            isOddsBoosted: false,
            betType: "SGL",
            isSGM: false,
            currentSize: 0.1,
            numLines: 1,
            betPrice: null,
            legs: [],
            result: null,
            cashoutQuote: {},
            bonus: 0,
            edges: [],
          },
        },
      },
    ],
  },
};

describe("Betcard group normalizer", () => {
  describe("normalizeBetCardGroupFragmentIntoBetCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeBetCardGroupFragmentIntoBetCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "SportsbookBetCard",
            urn: "ppb:tbd:card:sbkBet:1107046171",
          },
        ],
        typename: "BetCardGroup",
        urn: "ppb:tbd:card:bet:group:1107046171",
        aggregatorId: "aggregatorId",
        aggregatorDesc: "aggregatorDesc",
      });
    });

    it("should correctly transform and return the data object of non mandatory fields", () => {
      const { data } = normalizeBetCardGroupFragmentIntoBetCardGroup({
        ...BFF_RESPONSE,
        aggregatorId: null,
        aggregatorDesc: null,
      });

      expect(data).toEqual({
        items: [
          {
            typename: "SportsbookBetCard",
            urn: "ppb:tbd:card:sbkBet:1107046171",
          },
        ],
        typename: "BetCardGroup",
        urn: "ppb:tbd:card:bet:group:1107046171",
      });
    });

    it("should correctly transform and return the data object when items are false", () => {
      BFF_RESPONSE.full.edges[0] = null;

      const { data } = normalizeBetCardGroupFragmentIntoBetCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        items: [],
        typename: "BetCardGroup",
        urn: "ppb:tbd:card:bet:group:1107046171",
        aggregatorId: "aggregatorId",
        aggregatorDesc: "aggregatorDesc",
      });
    });
  });
});
