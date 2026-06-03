import normalizeAustralianRulesFixtureFragmentIntoAustralianRulesFixture from "./australian-rules-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "AustralianRulesFixture",
  urn: "ppb:fixture:31132023",
  score: {
    goals: {
      scoreHome: 3,
      scoreAway: 5,
    },
    behinds: {
      scoreHome: 1,
      scoreAway: 2,
    },
    points: {
      scoreHome: 7,
      scoreAway: 6,
    },
  },
  periodScores: [
    {
      score: {
        goals: {
          scoreHome: 3,
          scoreAway: 5,
        },
        behinds: {
          scoreHome: 1,
          scoreAway: 2,
        },
        points: {
          scoreHome: 7,
          scoreAway: 6,
        },
      },
      australianRulesPeriod: "PERIOD_1",
    },
  ],
};

describe("normalizeAustralianRulesFixtureFragmentIntoAustralianRulesFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when AustralianRules data is not provided", () => {
    it("should return correct default values", () => {
      const { data } = normalizeAustralianRulesFixtureFragmentIntoAustralianRulesFixture({
        ...BFF_RESPONSE,
        score: {},
        periodScores: null,
      });

      expect(data).toEqual({
        typename: "AustralianRulesFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        periodScores: undefined,
      });
    });
  });

  describe("when AustralianRules score is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeAustralianRulesFixtureFragmentIntoAustralianRulesFixture({
        ...BFF_RESPONSE,
        periodScores: null,
      });

      expect(data).toEqual({
        typename: "AustralianRulesFixture",
        urn: "ppb:fixture:31132023",
        score: {
          goals: {
            home: 3,
            away: 5,
          },
          behinds: {
            home: 1,
            away: 2,
          },
          points: {
            home: 7,
            away: 6,
          },
        },
        periodScores: undefined,
      });
    });
  });

  describe("when AustralianRules periodScores is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeAustralianRulesFixtureFragmentIntoAustralianRulesFixture({
        ...BFF_RESPONSE,
        score: null,
      });

      expect(data).toEqual({
        typename: "AustralianRulesFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        periodScores: [
          {
            score: {
              goals: {
                home: 3,
                away: 5,
              },
              behinds: {
                home: 1,
                away: 2,
              },
              points: {
                home: 7,
                away: 6,
              },
            },
            period: "PERIOD_1",
          },
        ],
      });
    });
  });

  describe("when AustralianRules isAmericanFormat is provided", () => {
    it("should return correct isAmericanFormat", () => {
      const { data } = normalizeAustralianRulesFixtureFragmentIntoAustralianRulesFixture({
        ...BFF_RESPONSE,
        isAmericanFormat: true,
        score: null,
        periodScores: null,
      });

      expect(data).toEqual(expect.objectContaining({ isAmericanFormat: true }));
    });
  });

  describe("when AustralianRules runnerNames is provided", () => {
    it("should return correct runnerNames", () => {
      const { data } = normalizeAustralianRulesFixtureFragmentIntoAustralianRulesFixture({
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
