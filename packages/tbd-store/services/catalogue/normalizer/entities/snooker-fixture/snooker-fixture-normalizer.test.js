import normalizeSnookerFixtureFragmentIntoSnookerFixture from "./snooker-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "SnookerFixture",
  urn: "ppb:fixture:31132023",
  score: {
    scoreHome: 3,
    scoreAway: 5,
  },
};

describe("normalizeSnookerFixtureFragmentIntoSnookerFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when Snooker data is not provided", () => {
    it("should return correct default values", () => {
      const { data } = normalizeSnookerFixtureFragmentIntoSnookerFixture({
        ...BFF_RESPONSE,
        score: null,
      });

      expect(data).toEqual({
        typename: "SnookerFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
      });
    });
  });

  describe("when Snooker score is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeSnookerFixtureFragmentIntoSnookerFixture({ ...BFF_RESPONSE });

      expect(data).toEqual({
        typename: "SnookerFixture",
        urn: "ppb:fixture:31132023",
        score: {
          home: 3,
          away: 5,
        },
      });
    });
  });

  describe("when Snooker isAmericanFormat is provided", () => {
    it("should return correct isAmericanFormat", () => {
      const { data } = normalizeSnookerFixtureFragmentIntoSnookerFixture({
        ...BFF_RESPONSE,
        isAmericanFormat: true,
        score: null,
      });

      expect(data).toEqual(expect.objectContaining({ isAmericanFormat: true }));
    });
  });

  describe("when Snooker runnerNames is provided", () => {
    it("should return correct runnerNames", () => {
      const { data } = normalizeSnookerFixtureFragmentIntoSnookerFixture({
        ...BFF_RESPONSE,
        runnerNames: {
          home: "home",
          away: "away",
        },
        score: null,
      });

      expect(data).toEqual(
        expect.objectContaining({
          runnerNames: {
            home: "home",
            away: "away",
          },
        }),
      );
    });
  });
});
