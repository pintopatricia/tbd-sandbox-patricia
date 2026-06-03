import normalizeIceHockeyFixtureFragmentIntoIceHockeyFixture from "./ice-hockey-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "IceHockeyFixture",
  urn: "ppb:fixture:31132023",
  score: {
    scoreHome: 3,
    scoreAway: 5,
  },
  clock: {
    clockPeriod: "PERIOD_1",
  },
  periodScores: [
    {
      score: {
        scoreHome: 3,
        scoreAway: 5,
      },
      periodScoresPeriod: "PERIOD_1",
    },
  ],
};

describe("normalizeIceHockeyFixtureFragmentIntoIceHockeyFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when IceHockey data is not provided", () => {
    it("should return correct default values", () => {
      const { data } = normalizeIceHockeyFixtureFragmentIntoIceHockeyFixture({
        ...BFF_RESPONSE,
        score: null,
        clock: null,
        periodScores: null,
      });

      expect(data).toEqual({
        typename: "IceHockeyFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        clock: undefined,
        periodScores: undefined,
      });
    });
  });

  describe("when IceHockey score is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeIceHockeyFixtureFragmentIntoIceHockeyFixture({
        ...BFF_RESPONSE,
        clock: null,
        periodScores: null,
      });

      expect(data).toEqual({
        typename: "IceHockeyFixture",
        urn: "ppb:fixture:31132023",
        score: {
          home: 3,
          away: 5,
        },
        clock: undefined,
        periodScores: undefined,
      });
    });
  });

  describe("when IceHockey clock is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeIceHockeyFixtureFragmentIntoIceHockeyFixture({
        ...BFF_RESPONSE,
        score: null,
        periodScores: null,
      });

      expect(data).toEqual({
        typename: "IceHockeyFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        clock: {
          period: "PERIOD_1",
        },
        periodScores: undefined,
      });
    });
  });

  describe("when IceHockey periodScores is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeIceHockeyFixtureFragmentIntoIceHockeyFixture({
        ...BFF_RESPONSE,
        score: null,
        clock: null,
      });

      expect(data).toEqual({
        typename: "IceHockeyFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        clock: undefined,
        periodScores: [
          {
            score: {
              home: 3,
              away: 5,
            },
            period: "PERIOD_1",
          },
        ],
      });
    });
  });

  describe("when IceHockey isAmericanFormat is provided", () => {
    it("should return correct isAmericanFormat", () => {
      const { data } = normalizeIceHockeyFixtureFragmentIntoIceHockeyFixture({
        ...BFF_RESPONSE,
        isAmericanFormat: true,
        score: null,
        periodScores: null,
      });

      expect(data).toEqual(expect.objectContaining({ isAmericanFormat: true }));
    });
  });

  describe("when IceHockey runnerNames is provided", () => {
    it("should return correct runnerNames", () => {
      const { data } = normalizeIceHockeyFixtureFragmentIntoIceHockeyFixture({
        ...BFF_RESPONSE,
        runnerNames: {
          home: "home",
          away: "away",
        },
        score: null,
        periodScores: null,
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
