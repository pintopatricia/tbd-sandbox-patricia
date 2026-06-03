import normalizeAllCompetitionsViewFragmentIntoAllCompetitionsView from "./all-competitions-view-normalizer";

const BFF_RESPONSE = {
  __typename: "AllCompetitionsView",
  urn: "ppb:tbd:view:allCompetitions:1",
  url: "soccer/allCompetitions:1",
  title: "All Competitions",
  items: {
    edges: [
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:2888729",
        },
      },
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:12015440",
        },
      },
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:12117172",
        },
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
      },
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:12015440",
        },
      },
      {
        node: {
          __typename: "CompetitionViewLinkCard",
          urn: "ppb:tbd:card:competitionViewLink:12117172",
        },
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

describe("All competitions view normalizer", () => {
  describe("normalizeAllCompetitionsViewFragmentIntoAllCompetitionsView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeAllCompetitionsViewFragmentIntoAllCompetitionsView(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "CompetitionViewLinkCard",
            urn: "ppb:tbd:card:competitionViewLink:2888729",
          },
          {
            typename: "CompetitionViewLinkCard",
            urn: "ppb:tbd:card:competitionViewLink:12015440",
          },
          {
            typename: "CompetitionViewLinkCard",
            urn: "ppb:tbd:card:competitionViewLink:12117172",
          },
        ],
        typename: "AllCompetitionsView",
        url: "soccer/allCompetitions:1",
        urn: "ppb:tbd:view:allCompetitions:1",
        title: "All Competitions",
      });
    });
  });
});
