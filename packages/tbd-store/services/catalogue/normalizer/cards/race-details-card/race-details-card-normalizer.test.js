import normalizeRaceDetailsCardFragmentIntoRaceDetailsCard from "./race-details-card-normalizer";

const BFF_RESPONSE = {
  __typename: "RaceDetailsCard",
  urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
  race: {
    __typename: "Race",
    urn: "ppb:race:29939007.1535",
    meeting: {
      urn: "ppb:meeting:29893526",
    },
  },
  numberOfRunners: 2,
  raceClass: 2,
  showMeetingInfo: true,
  raceViewLink: {
    viewUrn: "viewUrnMock",
    viewUrl: "viewUrlMock",
  },
  availableToSubscribe: false,
};

describe("Race details card normalizer", () => {
  describe("normalizeRaceDetailsCardFragmentIntoRaceDetailsCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeRaceDetailsCardFragmentIntoRaceDetailsCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
        race: "ppb:race:29939007.1535",
        numberOfRunners: 2,
        raceClass: 2,
        showMeetingInfo: true,
        raceViewLink: {
          viewUrn: "viewUrnMock",
          viewUrl: "viewUrlMock",
        },
        availableToSubscribe: false,
      });
    });
  });
});
