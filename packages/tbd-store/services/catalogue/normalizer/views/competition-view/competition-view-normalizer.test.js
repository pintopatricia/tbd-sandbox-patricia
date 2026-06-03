import normalizeCompetitionViewFragmentIntoCompetitionView from "./competition-view-normalizer";

const BFF_RESPONSE = {
  __typename: "CompetitionView",
  urn: "ppb:tbd:view:competition:1",
  url: "soccer/competition:1",
  canonicalUrl: "soccer/competition:1",
  title: "Premier League",
  competition: {
    urn: "ppb:competition:1",
    name: "Premier League",
  },
  items: {
    edges: [
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:2888729",
        },
        theme: "THEME",
      },
    ],
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:2888729",
        },
        theme: "THEME",
      },
    ],
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
};

describe("Competition view normalizer", () => {
  describe("normalizeAllCompetitionsViewFragmentIntoAllCompetitionsView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeCompetitionViewFragmentIntoCompetitionView(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "CompetitionViewLinkCard",
            urn: "ppb:tbd:card:competitionViewLink:2888729",
            theme: "THEME",
          },
        ],
        typename: "CompetitionView",
        url: "soccer/competition:1",
        urn: "ppb:tbd:view:competition:1",
        title: "Premier League",
        canonicalUrl: "soccer/competition:1",
        competition: "ppb:competition:1",
      });
    });
  });
});
