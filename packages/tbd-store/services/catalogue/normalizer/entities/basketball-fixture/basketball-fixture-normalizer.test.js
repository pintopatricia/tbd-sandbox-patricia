import normalizeBasketballFixtureFragmentIntoBasketballFixture from "./basketball-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "BasketballFixture",
  urn: "ppb:fixture:31132023",
  score: {
    scoreHome: 35,
    scoreAway: 56,
  },
  clock: {
    period: "PERIOD_1",
    segment: "Q1",
    timeElapsed: 121,
    timeRemaining: 479,
  },
  periodScores: [
    {
      score: {
        scoreHome: 35,
        scoreAway: 56,
      },
      period: "PERIOD_1",
      segment: null,
    },
  ],
};

describe("normalizeBasketballFixtureFragmentIntoBasketballFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when basketball data is not provided", () => {
    it("should return correct default values", () => {
      const { data } = normalizeBasketballFixtureFragmentIntoBasketballFixture({
        ...BFF_RESPONSE,
        score: null,
        clock: null,
        periodScores: null,
      });

      expect(data).toEqual({
        typename: "BasketballFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        clock: undefined,
        periodScores: undefined,
      });
    });
  });

  describe("when basketball score is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeBasketballFixtureFragmentIntoBasketballFixture({
        ...BFF_RESPONSE,
        clock: null,
        periodScores: null,
      });

      expect(data).toEqual({
        typename: "BasketballFixture",
        urn: "ppb:fixture:31132023",
        score: {
          home: 35,
          away: 56,
        },
        clock: undefined,
        periodScores: undefined,
      });
    });
  });

  describe("when basketball clock is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeBasketballFixtureFragmentIntoBasketballFixture({
        ...BFF_RESPONSE,
        score: null,
        periodScores: null,
      });

      expect(data).toEqual({
        typename: "BasketballFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        clock: {
          period: "PERIOD_1",
          segment: "Q1",
          timeElapsed: 121,
          timeRemaining: 479,
        },
        periodScores: undefined,
      });
    });
  });

  describe("when basketball periodScores is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeBasketballFixtureFragmentIntoBasketballFixture({
        ...BFF_RESPONSE,
        score: null,
        clock: null,
      });

      expect(data).toEqual({
        typename: "BasketballFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        clock: undefined,
        periodScores: [
          {
            score: {
              home: 35,
              away: 56,
            },
            period: "PERIOD_1",
            segment: undefined,
          },
        ],
      });
    });
  });

  describe("when basketball isAmericanFormat is provided", () => {
    it("should return correct isAmericanFormat", () => {
      const { data } = normalizeBasketballFixtureFragmentIntoBasketballFixture({
        ...BFF_RESPONSE,
        isAmericanFormat: true,
        score: null,
        periodScores: null,
      });

      expect(data).toEqual(expect.objectContaining({ isAmericanFormat: true }));
    });
  });

  describe("when basketball runnerNames is provided", () => {
    it("should return correct runnerNames", () => {
      const { data } = normalizeBasketballFixtureFragmentIntoBasketballFixture({
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
