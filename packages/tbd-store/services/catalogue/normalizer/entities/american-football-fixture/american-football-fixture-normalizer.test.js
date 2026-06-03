import normalizeAmericanFootballFixtureFragmentIntoAmericanFootballFixture from "./american-football-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "AmericanFootballFixture",
  urn: "ppb:fixture:31132023",
  score: {
    home: 21,
    away: 14,
  },
  clock: {
    americanFootballPeriod: "PERIOD_1",
  },
  quarterScores: [
    {
      score: {
        home: 7,
        away: 7,
      },
      period: "PERIOD_1",
    },
  ],
};

describe("normalizeAmericanFootballFixtureFragmentIntoAmericanFootballFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when AmericanFootball data is not provided", () => {
    it("should return correct default values", () => {
      const { data } = normalizeAmericanFootballFixtureFragmentIntoAmericanFootballFixture({
        ...BFF_RESPONSE,
        score: null,
        clock: null,
        quarterScores: null,
      });

      expect(data).toEqual({
        typename: "AmericanFootballFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        clock: undefined,
        quarterScores: undefined,
      });
    });
  });

  describe("when AmericanFootball score is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeAmericanFootballFixtureFragmentIntoAmericanFootballFixture({
        ...BFF_RESPONSE,
        clock: null,
        quarterScores: null,
      });

      expect(data).toEqual({
        typename: "AmericanFootballFixture",
        urn: "ppb:fixture:31132023",
        score: {
          home: 21,
          away: 14,
        },
        clock: undefined,
        quarterScores: undefined,
      });
    });
  });

  describe("when AmericanFootball clock is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeAmericanFootballFixtureFragmentIntoAmericanFootballFixture({
        ...BFF_RESPONSE,
        score: null,
        quarterScores: null,
      });

      expect(data).toEqual({
        typename: "AmericanFootballFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        clock: {
          period: "PERIOD_1",
        },
        quarterScores: undefined,
      });
    });
  });

  describe("when AmericanFootball quarterScores is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeAmericanFootballFixtureFragmentIntoAmericanFootballFixture({
        ...BFF_RESPONSE,
        score: null,
        clock: null,
      });

      expect(data).toEqual({
        typename: "AmericanFootballFixture",
        urn: "ppb:fixture:31132023",
        score: undefined,
        clock: undefined,
        quarterScores: [
          {
            score: {
              home: 7,
              away: 7,
            },
            period: "PERIOD_1",
          },
        ],
      });
    });
  });

  describe("when AmericanFootball isAmericanFormat is provided", () => {
    it("should return correct isAmericanFormat", () => {
      const { data } = normalizeAmericanFootballFixtureFragmentIntoAmericanFootballFixture({
        ...BFF_RESPONSE,
        isAmericanFormat: true,
        score: null,
        quarterScores: null,
      });

      expect(data).toEqual(expect.objectContaining({ isAmericanFormat: true }));
    });
  });

  describe("when AmericanFootball runnerNames is provided", () => {
    it("should return correct runnerNames", () => {
      const { data } = normalizeAmericanFootballFixtureFragmentIntoAmericanFootballFixture({
        ...BFF_RESPONSE,
        runnerNames: {
          home: "Patriots",
          away: "Eagles",
        },
        score: null,
        quarterScores: null,
      });

      expect(data).toEqual(
        expect.objectContaining({
          runnerNames: {
            home: "Patriots",
            away: "Eagles",
          },
        }),
      );
    });
  });

  describe("when AmericanFootball has all data", () => {
    it("should return complete fixture data", () => {
      const { data } = normalizeAmericanFootballFixtureFragmentIntoAmericanFootballFixture({
        ...BFF_RESPONSE,
        isAmericanFormat: false,
        runnerNames: {
          home: "Patriots",
          away: "Eagles",
        },
      });

      expect(data).toEqual({
        typename: "AmericanFootballFixture",
        urn: "ppb:fixture:31132023",
        isAmericanFormat: false,
        runnerNames: {
          home: "Patriots",
          away: "Eagles",
        },
        score: {
          home: 21,
          away: 14,
        },
        clock: {
          period: "PERIOD_1",
        },
        quarterScores: [
          {
            score: {
              home: 7,
              away: 7,
            },
            period: "PERIOD_1",
          },
        ],
      });
    });
  });
});
