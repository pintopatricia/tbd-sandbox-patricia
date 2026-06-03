import normalizeRaceViewLinkCardFragmentIntoRaceViewLinkCard from "./race-view-link-card-normalizer";

const BFF_RESPONSE = {
  __typename: "RaceViewLinkCard",
  urn: "ppb:tbd:card:raceViewLink:7|30266486.1930",
  race: {
    __typename: "Race",
    urn: "ppb:race:30266486.1930",
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:30266486",
    },
  },
  viewLink: {
    viewUrl: "horse-racing/tpara-(us)-3rd-feb/r-7%7C30266486.1930",
    viewUrn: "ppb:tbd:view:race:7|30266486.1930",
  },
};

jest.mock("../../entities/race/race-normalizer", () => jest.fn(() => "Race Normalized"));

describe("Segmented card group normalizer", () => {
  describe("normalizeSegmentedCardGroupFragmentIntoSegmentedCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeRaceViewLinkCardFragmentIntoRaceViewLinkCard(BFF_RESPONSE);
      expect(data).toStrictEqual({
        typename: "RaceViewLinkCard",
        urn: "ppb:tbd:card:raceViewLink:7|30266486.1930",
        race: "ppb:race:30266486.1930",
        viewLink: {
          viewUrl: "horse-racing/tpara-(us)-3rd-feb/r-7%7C30266486.1930",
          viewUrn: "ppb:tbd:view:race:7|30266486.1930",
        },
      });
    });
  });
});
