import normalizeRaceViewLinksCardFragmentIntoRaceViewLinksCard from "./race-view-links-card-normalizer";

const BFF_RESPONSE = {
  __typename: "RaceViewLinksCard",
  urn: "ppb:tbd:card:raceViewLinks:7|30157686.1930",
  race: {
    __typename: "Race",
    urn: "ppb:race:30157686.1930",
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:30157686",
    },
  },
  raceViewLinks: [
    {
      race: {
        __typename: "Race",
        urn: "ppb:race:30160350.1855",
        meeting: {
          __typename: "Meeting",
          urn: "ppb:meeting:30160350",
        },
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:race:7|30160350.1855",
        viewUrl: "horse-racing/deltad-(us)-2nd-dec/r-7%7C30160350.1855",
      },
      marketPromo: {
        title: "Title",
        description: "Description",
        signposting: "EXTRA_PLACES",
      },
    },
  ],
};

describe("Segmented card group normalizer", () => {
  describe("normalizeSegmentedCardGroupFragmentIntoSegmentedCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeRaceViewLinksCardFragmentIntoRaceViewLinksCard(BFF_RESPONSE);

      expect(data).toStrictEqual({
        typename: "RaceViewLinksCard",
        urn: "ppb:tbd:card:raceViewLinks:7|30157686.1930",
        race: "ppb:race:30157686.1930",
        raceViewLinks: [
          {
            race: "ppb:race:30160350.1855",
            viewLink: {
              viewUrl: "horse-racing/deltad-(us)-2nd-dec/r-7%7C30160350.1855",
              viewUrn: "ppb:tbd:view:race:7|30160350.1855",
            },
            marketPromo: "EXTRA_PLACES",
          },
        ],
      });
    });
  });
});
