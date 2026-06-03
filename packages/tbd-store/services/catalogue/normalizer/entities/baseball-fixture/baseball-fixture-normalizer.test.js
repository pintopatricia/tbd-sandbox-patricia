import normalizeBaseballFixtureFragmentIntoBaseballFixture from "./baseball-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "BaseballFixture",
  urn: "ppb:fixture:baseball:12345",
  score: {
    scoreHome: 5,
    scoreAway: 2,
  },
  clock: {
    baseballClockPeriod: "INNING_5",
  },
  scorePerInning: [
    {
      score: {
        scoreHome: 1,
        scoreAway: 0,
      },
      baseballInningPeriod: "INNING_1",
    },
    {
      score: {
        scoreHome: 4,
        scoreAway: 2,
      },
      baseballInningPeriod: "INNING_5",
    },
  ],
};

describe("normalizeBaseballFixtureFragmentIntoBaseballFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when Baseball data is not provided", () => {
    it("should return correct default values", () => {
      const { data } = normalizeBaseballFixtureFragmentIntoBaseballFixture({
        ...BFF_RESPONSE,
        score: null,
        clock: null,
        scorePerInning: null,
      });

      expect(data).toEqual({
        typename: "BaseballFixture",
        urn: "ppb:fixture:baseball:12345",
        score: undefined,
        clock: undefined,
        scorePerInning: undefined,
      });
    });
  });

  describe("when Baseball score is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeBaseballFixtureFragmentIntoBaseballFixture({
        ...BFF_RESPONSE,
        clock: null,
        scorePerInning: null,
      });

      expect(data).toEqual({
        typename: "BaseballFixture",
        urn: "ppb:fixture:baseball:12345",
        score: {
          home: 5,
          away: 2,
        },
        clock: undefined,
        scorePerInning: undefined,
      });
    });
  });

  describe("when Baseball clock is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeBaseballFixtureFragmentIntoBaseballFixture({
        ...BFF_RESPONSE,
        score: null,
        scorePerInning: null,
      });

      expect(data).toEqual({
        typename: "BaseballFixture",
        urn: "ppb:fixture:baseball:12345",
        score: undefined,
        clock: {
          period: "INNING_5",
        },
        scorePerInning: undefined,
      });
    });
  });

  describe("when Baseball scorePerInning is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeBaseballFixtureFragmentIntoBaseballFixture({
        ...BFF_RESPONSE,
        score: null,
        clock: null,
      });

      expect(data).toEqual({
        typename: "BaseballFixture",
        urn: "ppb:fixture:baseball:12345",
        score: undefined,
        clock: undefined,
        scorePerInning: [
          {
            score: {
              home: 1,
              away: 0,
            },
            period: "INNING_1",
          },
          {
            score: {
              home: 4,
              away: 2,
            },
            period: "INNING_5",
          },
        ],
      });
    });
  });
});
