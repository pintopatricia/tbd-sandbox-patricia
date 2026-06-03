import popularBetBuilderNormalizer from "./popular-bet-builder-card-normalizer";

let BFF_RESPONSE = {
  urn: "ppb:tbd:card:popularbetbuilder:1",
  __typename: "PopularBetBuilderCard",
  fixture: { __typename: "FootballFixture", urn: "ppb:fixture:12345" },
  sportevent: { __typename: "SportsEvent", urn: "ppb:event:12345" },
  popularbettingopportunity: { __typename: "BettingOpportunity", urn: "ppb:bo:12345" },
  viewLink: { viewUrl: "football/benfica-porto/e-123", viewUrn: "ppb:event:123" },
};

const BFF_RESPONSE_BASKETBALL = {
  urn: "ppb:tbd:card:popularbetbuilder:1",
  __typename: "PopularBetBuilderCard",
  fixture: { __typename: "BasketballFixture", urn: "ppb:fixture:12345" },
  sportevent: { __typename: "SportsEvent", urn: "ppb:event:12345" },
  popularbettingopportunity: { __typename: "BettingOpportunity", urn: "ppb:bo:123" },
  viewLink: { viewUrl: "basketball/lakers-bulls/e-123456", viewUrn: "ppb:event:123456" },
};

describe("PopularBetBuilderCard normalizer", () => {
  describe("when is FootballFixture", () => {
    describe("normalizePopularBetBuilderCardFragmentIntoPopularBetBuilderCard", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = popularBetBuilderNormalizer(BFF_RESPONSE);

        expect(data).toEqual({
          typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:1",
          popularbettingopportunity: "ppb:bo:12345",
          fixture: "ppb:fixture:12345",
          sportevent: "ppb:event:12345",
          viewLink: { viewUrl: "football/benfica-porto/e-123", viewUrn: "ppb:event:123" },
        });
      });
    });
  });

  describe("when is Base Fixture", () => {
    beforeAll(() => {
      BFF_RESPONSE = {
        ...BFF_RESPONSE,
        fixture: { __typename: "BaseFixture", urn: "ppb:fixture:12345" },
      };
    });
    describe("normalizePopularBetBuilderCardFragmentIntoPopularBetBuilderCard", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = popularBetBuilderNormalizer(BFF_RESPONSE);

        expect(data).toEqual({
          typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:1",
          popularbettingopportunity: "ppb:bo:12345",
          fixture: "ppb:fixture:12345",
          sportevent: "ppb:event:12345",
          viewLink: { viewUrl: "football/benfica-porto/e-123", viewUrn: "ppb:event:123" },
        });
      });
    });
  });

  describe("when is BasketballFixture", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = popularBetBuilderNormalizer(BFF_RESPONSE_BASKETBALL);

      expect(data).toEqual({
        typename: "PopularBetBuilderCard",
        urn: "ppb:tbd:card:popularbetbuilder:1",
        popularbettingopportunity: "ppb:bo:123",
        fixture: "ppb:fixture:12345",
        sportevent: "ppb:event:12345",
        viewLink: { viewUrl: "basketball/lakers-bulls/e-123456", viewUrn: "ppb:event:123456" },
      });
    });
  });
});
