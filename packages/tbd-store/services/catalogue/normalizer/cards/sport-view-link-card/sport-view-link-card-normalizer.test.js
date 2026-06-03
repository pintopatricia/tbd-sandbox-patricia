import sportViewLinkCardNormalizer from "./sport-view-link-card-normalizer";

const BFF_RESPONSE = {
  __typename: "SportViewLinkCard",
  urn: "ppb:tbd:card:sportViewLink:1",
  viewLink: {
    viewUrn: "ppb:tbd:view:sport:1",
    viewUrl: "football/sport:1",
  },
  sport: {
    urn: "ppb:eventType:1",
    name: "Football",
    sportId: 1,
  },
};

describe("SportViewLinkCard normalizer", () => {
  const NORMALIZED_DATA = {
    urn: "ppb:tbd:card:sportViewLink:1",
    typename: "SportViewLinkCard",
    sport: "ppb:eventType:1",
    viewLink: {
      viewUrn: "ppb:tbd:view:sport:1",
      viewUrl: "football/sport:1",
    },
  };

  describe("normalizeSportViewLinkCardFragmentIntoSportViewLinkCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = sportViewLinkCardNormalizer(BFF_RESPONSE);

      expect(data).toEqual(NORMALIZED_DATA);
    });
  });
});
