import normalizeRunnerMarketGraphFragment from "./runner-market-graph-normalizer";

const BFF_RESPONSE = {
  __typename: "RunnerMarketGraph",
  runnerURN: "ppb:fake:urn",
  liveData: {
    selectionId: 1,
    traded: [{ odd: "1.01", liquidity: 1000 }],
    availableToBack: [{ odd: "1.2", liquidity: 500 }],
    availableToLay: [{ odd: "1.2", liquidity: 500 }],
  },
};

describe("RunnerMarketGraph normalizer", () => {
  describe("normalizeRunnerMarketGraphFragmentIntoRunnerMarketGraph", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeRunnerMarketGraphFragment(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "RunnerMarketGraph",
        urn: "ppb:fake:urn",
        selectionId: 1,
        back: [
          {
            liquidity: 500,
            price: "1.2",
          },
        ],
        lastPriceTraded: undefined,
        lay: [
          {
            liquidity: 500,
            price: "1.2",
          },
        ],
        totalMatched: undefined,
        traded: [
          {
            liquidity: 1000,
            price: "1.01",
          },
        ],
      });
    });
  });
});
