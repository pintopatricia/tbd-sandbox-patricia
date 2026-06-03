import victim from "./popular-betting-opportunity-normalizer";

const BFF_RESPONSE = {
  urn: "ppb:tbd:bettingopportunity:1",
  id: "bo:1",
  __typename: "PopularBettingOpportunity",
  selections: [
    {
      __typename: "BettingOpportunitySelection",
      market: {
        __typename: "SportsbookMarket",
        urn: "ppb:sbkMarket:1234",
      },
      runner: {
        runnerURN: "ppb:sbkRunner:1234",
      },
    },
    {
      __typename: "BettingOpportunitySelection",
      market: {
        __typename: "SportsbookMarket",
        urn: "ppb:sbkMarket:1235",
      },
      runner: {
        runnerURN: "ppb:sbkRunner:1235",
      },
      raceRunner: {
        details: {
          silk: "http://silk-url.com",
        },
      },
    },
  ],
  count: 5,
  name: undefined,
};

describe("BettingOpportunity normalizer", () => {
  describe("normalizeBettingOpportunityFragmentIntoBettingOpportunity", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = victim(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "PopularBettingOpportunity",
        urn: "ppb:tbd:bettingopportunity:1",
        id: "bo:1",
        count: 5,
        selections: [
          {
            marketUrn: "ppb:sbkMarket:1234",
            runnerUrn: "ppb:sbkRunner:1234",
          },
          {
            marketUrn: "ppb:sbkMarket:1235",
            runnerUrn: "ppb:sbkRunner:1235",
            silkUrl: "http://silk-url.com",
          },
        ],
        name: undefined,
      });
    });
  });
});
