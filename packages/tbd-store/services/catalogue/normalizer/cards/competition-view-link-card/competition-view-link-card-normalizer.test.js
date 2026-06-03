import competitionViewLinkCardNormalizer from "./competition-view-link-card-normalizer";

const BFF_RESPONSE = {
  __typename: "CompetitionViewLinkCard",
  urn: "ppb:competition:59",
  competition: {
    competitionId: 59,
    name: "German Bundesliga",
    sport: "ppb:eventType:1",
    urn: "ppb:competition:59",
  },
  viewLink: {
    viewUrn: "ppb:tbd:view:event:29741672",
    viewUrl: "random/url/e-29741672",
  },
};

describe("CompetitionViewLinkCard normalizer", () => {
  describe("normalizeCompetitionViewLinkCardFragmentIntoCompetitionViewLinkCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = competitionViewLinkCardNormalizer(BFF_RESPONSE);
      expect(data).toEqual({
        urn: "ppb:competition:59",
        typename: "CompetitionViewLinkCard",
        competition: "ppb:competition:59",
        viewLink: {
          viewUrn: "ppb:tbd:view:event:29741672",
          viewUrl: "random/url/e-29741672",
        },
      });
    });
  });
});
