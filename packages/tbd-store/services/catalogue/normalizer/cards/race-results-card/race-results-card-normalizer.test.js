import normalizeRaceResultsCardFragmentIntoRaceResultsCard from "./race-results-card-normalizer";

const BFF_RESPONSE = {
  __typename: "RaceResultsCard",
  urn: "ppb:tbd:card:raceResultsCard:1.171782025/24000991/0",
  race: {
    __typename: "Race",
    urn: "ppb:race:29939007.1535",
    meeting: {
      urn: "ppb:meeting:29893526",
    },
  },
};

describe("Race results card normalizer", () => {
  describe("normalizeRaceResultsCardFragmentIntoRaceResultsCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeRaceResultsCardFragmentIntoRaceResultsCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "RaceResultsCard",
        urn: "ppb:tbd:card:raceResultsCard:1.171782025/24000991/0",
        race: "ppb:race:29939007.1535",
      });
    });
  });
});
