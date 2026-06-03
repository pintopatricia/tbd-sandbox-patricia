/* eslint-disable no-underscore-dangle */
import normalizeExpandableMarketCardFragmentIntoExpandableMarketCard from "./expandable-market-card-normalizer";

const BFF_RESPONSE = {
  __typename: "ExpandableMarketCard",
  urn: "ppb:tbd:card:expandableMarket:12342343123/false/false/1",
  title: "My Title",
  marketCardURN: "ppb:tbd:card:market:12342343123/false/false/1",
  viewOpenBets: {
    viewUrl: "url",
    viewUrn: "ppb:urn?=1.1",
  },
};

describe("expandable market card normalizer", () => {
  describe("normalizeExpandableMarketCardFragmentIntoExpandableMarketCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeExpandableMarketCardFragmentIntoExpandableMarketCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "ExpandableMarketCard",
        urn: "ppb:tbd:card:expandableMarket:12342343123/false/false/1",
        title: "My Title",
        marketCardURN: "ppb:tbd:card:market:12342343123/false/false/1",
        viewOpenBets: {
          viewUrl: "url",
          viewUrn: "ppb:urn?=1.1",
        },
      });
    });
  });

  describe("and when parsing a partial fragment", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeExpandableMarketCardFragmentIntoExpandableMarketCard({
        __typename: BFF_RESPONSE.__typename,
        urn: BFF_RESPONSE.urn,
        title: BFF_RESPONSE.title,
      });

      expect(data).toEqual({
        typename: "ExpandableMarketCard",
        urn: "ppb:tbd:card:expandableMarket:12342343123/false/false/1",
        title: "My Title",
      });
    });
  });
});
