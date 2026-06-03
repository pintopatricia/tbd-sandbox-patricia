import normalizeDartsFixtureFragmentIntoDartsFixture from "./darts-fixture-normalizer";

const BASIC_SCORE_RESPONSE = {
  __typename: "DartsFixture",
  urn: "ppb:dartsfixture:31132023",
  isAmericanFormat: false,
  runnerNames: { home: "Player A", away: "Player B" },
  dartsFixtureType: "LEGS",

  dartsScore: {
    home: 5,
    away: 3,
  },

  currentSet: null,
  previousSets: null,
};

const SETS_SCORE_RESPONSE = {
  __typename: "DartsFixture",
  urn: "ppb:dartsfixture:31132024",
  isAmericanFormat: false,
  runnerNames: { home: "Player A", away: "Player B" },
  dartsFixtureType: "SETS",

  dartsScore: {
    home: 2,
    away: 1,
  },

  currentSet: {
    number: 4,
    score: { home: 2, away: 1 },
  },
  previousSets: [
    { number: 1, score: { home: 3, away: 0 } },
    { number: 2, score: { home: 1, away: 3 } },
    { number: 3, score: { home: 3, away: 2 } },
  ],
};

describe("normalizeDartsFixtureFragmentIntoDartsFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when Darts data is minimal (no score)", () => {
    it("should return correct default values", () => {
      const { data } = normalizeDartsFixtureFragmentIntoDartsFixture({
        ...BASIC_SCORE_RESPONSE,
        dartsScore: null,
        dartsFixtureType: null,
      });

      expect(data).toEqual({
        typename: "DartsFixture",
        urn: "ppb:dartsfixture:31132023",
        isAmericanFormat: false,
        runnerNames: { home: "Player A", away: "Player B" },
        score: undefined,
        type: undefined,
        currentSet: undefined,
        previousSets: undefined,
      });
    });
  });

  describe("when Darts Basic Score is provided (LEGS)", () => {
    it("should normalize basic score correctly", () => {
      const { data } = normalizeDartsFixtureFragmentIntoDartsFixture(BASIC_SCORE_RESPONSE);

      expect(data).toEqual({
        typename: "DartsFixture",
        urn: "ppb:dartsfixture:31132023",
        isAmericanFormat: false,
        runnerNames: { home: "Player A", away: "Player B" },
        type: "LEGS",
        score: {
          home: 5,
          away: 3,
        },
        currentSet: undefined,
        previousSets: undefined,
      });
    });
  });

  describe("when Darts Sets Score is provided (SETS)", () => {
    it("should normalize sets score and flattened fields correctly", () => {
      const { data } = normalizeDartsFixtureFragmentIntoDartsFixture(SETS_SCORE_RESPONSE);

      expect(data).toEqual({
        typename: "DartsFixture",
        urn: "ppb:dartsfixture:31132024",
        isAmericanFormat: false,
        runnerNames: { home: "Player A", away: "Player B" },
        type: "SETS",
        score: {
          home: 2,
          away: 1,
        },
        currentSet: {
          number: 4,
          score: { home: 2, away: 1 },
        },
        previousSets: [
          { number: 1, score: { home: 3, away: 0 } },
          { number: 2, score: { home: 1, away: 3 } },
          { number: 3, score: { home: 3, away: 2 } },
        ],
      });
    });
  });

  describe("when Darts isAmericanFormat is provided", () => {
    it("should return correct isAmericanFormat", () => {
      const { data } = normalizeDartsFixtureFragmentIntoDartsFixture({
        ...BASIC_SCORE_RESPONSE,
        isAmericanFormat: true,
      });

      expect(data).toEqual(expect.objectContaining({ isAmericanFormat: true }));
    });
  });

  describe("when Darts runnerNames is provided", () => {
    it("should return correct runnerNames", () => {
      const { data } = normalizeDartsFixtureFragmentIntoDartsFixture({
        ...BASIC_SCORE_RESPONSE,
        runnerNames: {
          home: "Home Player",
          away: "Away Player",
        },
      });

      expect(data).toEqual(
        expect.objectContaining({
          runnerNames: {
            home: "Home Player",
            away: "Away Player",
          },
        }),
      );
    });
  });
});
