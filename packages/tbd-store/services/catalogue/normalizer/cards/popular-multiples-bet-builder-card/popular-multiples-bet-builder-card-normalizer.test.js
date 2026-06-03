import popularMultiplesBetBuilderNormalizer from "./popular-multiples-bet-builder-card-normalizer";

const BFF_RESPONSE = {
  urn: "ppb:tbd:card:popularmultiplesbetbuilder:1",
  __typename: "PopularMultiplesBetBuilderCard",
  fixture: { __typename: "FootballFixture", urn: "ppb:fixture:12345" },
  sportevent: { __typename: "SportsEvent", urn: "ppb:event:12345" },
  popularbettingopportunity: { __typename: "BettingOpportunity", urn: "ppb:bo:12345" },
  viewLink: { viewUrl: "football/benfica-porto/e-123", viewUrn: "ppb:event:123" },
  cmsConfiguredTitle: { __typename: "DisplayNameTitle", name: "title" },
};

describe("PopularMultiplesBetBuilderCard normalizer", () => {
  describe("when is FootballFixture", () => {
    describe("normalizePopularBetBuilderCardFragmentIntoPopularBetBuilderCard", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = popularMultiplesBetBuilderNormalizer(BFF_RESPONSE);

        expect(data).toEqual({
          typename: "PopularMultiplesBetBuilderCard",
          urn: "ppb:tbd:card:popularmultiplesbetbuilder:1",
          popularbettingopportunity: "ppb:bo:12345",
          title: "title",
          fromCmsConfig: true,
        });
      });
    });
  });
});
