import normalizeCricketFixtureFragmentIntoCricketFixture from "./cricket-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "CricketFixture",
  urn: "ppb:fixture:123456",
  score: {
    homeScore: [
      {
        inningNumber: 1,
        runs: 2,
        wickets: 3,
      },
    ],
    awayScore: [
      {
        inningNumber: 4,
        runs: 5,
        wickets: 6,
      },
    ],
  },
  currentTeamBatting: "HOME",
  currentTime: {
    inning: 99,
    over: 22,
  },
};

describe("normalizeCricketFixtureFragmentIntoCricketFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when cricket data is not provided", () => {
    it("should return correct default values", () => {
      const { data } = normalizeCricketFixtureFragmentIntoCricketFixture({
        ...BFF_RESPONSE,
        score: null,
        currentTeamBatting: null,
        currentTime: null,
      });

      expect(data).toEqual({
        typename: "CricketFixture",
        urn: "ppb:fixture:123456",
        score: undefined,
        currentTeamBatting: undefined,
        currentTime: undefined,
      });
    });
  });

  describe("when cricket score is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeCricketFixtureFragmentIntoCricketFixture({
        ...BFF_RESPONSE,
        currentTeamBatting: null,
        currentTime: null,
      });

      expect(data).toEqual({
        typename: "CricketFixture",
        urn: "ppb:fixture:123456",
        score: {
          home: [
            {
              inningNumber: 1,
              runs: 2,
              wickets: 3,
            },
          ],
          away: [
            {
              inningNumber: 4,
              runs: 5,
              wickets: 6,
            },
          ],
        },
        currentTeamBatting: undefined,
        currentTime: undefined,
      });
    });
  });

  describe("when cricket currentTime is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeCricketFixtureFragmentIntoCricketFixture({
        ...BFF_RESPONSE,
        score: null,
        currentTeamBatting: null,
      });

      expect(data).toEqual({
        typename: "CricketFixture",
        urn: "ppb:fixture:123456",
        score: undefined,
        currentTeamBatting: undefined,
        currentTime: {
          inning: 99,
          over: 22,
        },
      });
    });
  });

  describe("when cricket currentTeamBatting is provided", () => {
    it("should return correct values", () => {
      const { data } = normalizeCricketFixtureFragmentIntoCricketFixture({
        ...BFF_RESPONSE,
        score: null,
        currentTime: null,
      });

      expect(data).toEqual({
        typename: "CricketFixture",
        urn: "ppb:fixture:123456",
        score: undefined,
        currentTeamBatting: "HOME",
        currentTime: undefined,
      });
    });
  });

  describe("when cricket isAmericanFormat is provided", () => {
    it("should return correct isAmericanFormat", () => {
      const { data } = normalizeCricketFixtureFragmentIntoCricketFixture({
        ...BFF_RESPONSE,
        isAmericanFormat: true,
        currentTeamBatting: null,
        currentTime: null,
      });

      expect(data).toEqual(expect.objectContaining({ isAmericanFormat: true }));
    });
  });

  describe("when cricket runnerNames is provided", () => {
    it("should return correct runnerNames", () => {
      const { data } = normalizeCricketFixtureFragmentIntoCricketFixture({
        ...BFF_RESPONSE,
        runnerNames: {
          home: "home",
          away: "away",
        },
        currentTeamBatting: null,
        currentTime: null,
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
