import victim from "./correct-score-card-normalizer";

jest.mock("../../entities/sportsbook-market/sportsbook-market-normalizer", () =>
  jest.fn(() => "normalized-mocked-market"),
);

const BFF_RESPONSE = {
  __typename: "CorrectScoreCard",
  urn: "ppb:tbd:card:correctScore:12345",
  market: {
    urn: "ppb:sbkMarket:924.1111",
    name: "Market 1",
  },
};

describe("CorrectScoreCard normalizer", () => {
  describe("normalizeCorrectScoreCardFragmentIntoCorrectScoreCard", () => {
    describe("when bff response have numberOfItensToDisplay", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = victim({ ...BFF_RESPONSE, numberOfItemsToDisplay: 3 });

        expect(data).toEqual({
          typename: "CorrectScoreCard",
          urn: "ppb:tbd:card:correctScore:12345",
          market: "ppb:sbkMarket:924.1111",
          numberOfItemsToDisplay: 3,
        });
      });
    });

    describe("when bff response don't have numberOfItensToDisplay", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = victim(BFF_RESPONSE);

        expect(data).toEqual({
          typename: "CorrectScoreCard",
          urn: "ppb:tbd:card:correctScore:12345",
          market: "ppb:sbkMarket:924.1111",
          numberOfItemsToDisplay: undefined,
        });
      });
    });
  });
});
