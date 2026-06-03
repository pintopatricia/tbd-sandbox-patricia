import normalizeRunnerInfoCardFragmentIntoRunnerInfoCard from "./runner-info-card-normalizer";

const BFF_RESPONSE = {
  __typename: "RunnerInfoCard",
  urn: "ppb:tbd:card:runnerInfo:1.171782025/24000991/0",
  raceRunner: {
    urn: "ppb:excRunner:1.171782025/24000991/0",
  },
};

jest.mock("../../entities/race-runners/race-runners-normalizer", () => jest.fn(() => "NormalizedRaceRunner"));

describe("Runner info card normalizer", () => {
  describe("normalizeRunnerInfoCardFragmentIntoRunnerInfoCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeRunnerInfoCardFragmentIntoRunnerInfoCard(BFF_RESPONSE);

      expect(data).toStrictEqual({
        typename: "RunnerInfoCard",
        urn: "ppb:tbd:card:runnerInfo:1.171782025/24000991/0",
        raceRunner: "ppb:excRunner:1.171782025/24000991/0",
      });
    });
  });
});
