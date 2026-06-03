import normalizeTennisFixtureFragmentIntoTennisFixture from "./tennis-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "TennisMatch",
  urn: "ppb:fixture:31132023",
  actualStartTime: null,
  scheduledStartTime: "2022-01-16T20:00:00Z",
  status: { status: "PRE_MATCH", reason: null },
  surface: "CLAY",
  type: "SINGLES",
};

describe("normalizeTennisFixtureFragmentIntoTennisFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("when tennis data is not provided", () => {
    it("should return correct default values", () => {
      const { data } = normalizeTennisFixtureFragmentIntoTennisFixture({
        ...BFF_RESPONSE,
        scheduledStartTime: null,
        currentSet: undefined,
        status: undefined,
        surface: undefined,
        type: undefined,
        teamAScore: null,
        teamBScore: null,
      });

      expect(data).toEqual({
        typename: "TennisMatch",
        urn: "ppb:fixture:31132023",
        actualStartTime: undefined,
        scheduledStartTime: undefined,
        surface: undefined,
        type: undefined,
        teamAScore: undefined,
        teamBScore: undefined,
      });
    });
  });

  describe("when current set data is not provided", () => {
    it("should return correct default values", () => {
      const { data } = normalizeTennisFixtureFragmentIntoTennisFixture({
        ...BFF_RESPONSE,
        currentSet: {},
        scheduledStartTime: null,
        status: undefined,
        surface: undefined,
        type: undefined,
        teamAScore: null,
        teamBScore: null,
      });

      expect(data).toEqual({
        typename: "TennisMatch",
        urn: "ppb:fixture:31132023",
        currentSet: {
          currentGame: {
            teamAScore: "",
            teamBScore: "",
            teamServing: undefined,
            type: undefined,
          },
          teamAScore: undefined,
          teamBScore: undefined,
        },
      });
    });
  });

  describe("when status data is not provided", () => {
    it("should return correct default values", () => {
      const { data } = normalizeTennisFixtureFragmentIntoTennisFixture({
        ...BFF_RESPONSE,
        currentSet: undefined,
        scheduledStartTime: null,
        status: {},
        surface: undefined,
        type: undefined,
        teamAScore: null,
        teamBScore: null,
      });

      expect(data).toEqual({
        typename: "TennisMatch",
        urn: "ppb:fixture:31132023",
        status: {
          status: undefined,
          reason: undefined,
        },
      });
    });
  });

  describe("when providing a PRE_MATCH fixture", () => {
    it("should return a fixture with all the pre-match information", () => {
      const { data } = normalizeTennisFixtureFragmentIntoTennisFixture(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "TennisMatch",
        urn: "ppb:fixture:31132023",
        actualStartTime: undefined,
        scheduledStartTime: new Date("2022-01-16T20:00:00Z"),
        status: { status: "PRE_MATCH", reason: undefined },
        surface: "CLAY",
        type: "SINGLES",
        teamAScore: undefined,
        teamBScore: undefined,
      });
    });
  });

  describe("when providing a INPLAY fixture", () => {
    it("should return a fixture with all the inplay information", () => {
      const { data } = normalizeTennisFixtureFragmentIntoTennisFixture({
        ...BFF_RESPONSE,
        actualStartTime: "2022-01-16T20:00:00Z",
        status: { status: "IN_RUNNING", reason: null },
        surface: "HARD",
        type: "SINGLES",
        currentSet: {
          currentGame: {
            teamAScore: "0",
            teamBScore: "15",
            teamServing: "AWAY",
            type: "NORMAL",
          },
          teamAScore: 5,
          teamBScore: 3,
        },
      });

      expect(data).toEqual({
        typename: "TennisMatch",
        urn: "ppb:fixture:31132023",
        actualStartTime: new Date("2022-01-16T20:00:00Z"),
        scheduledStartTime: new Date("2022-01-16T20:00:00Z"),
        status: { status: "IN_RUNNING", reason: undefined },
        surface: "HARD",
        type: "SINGLES",
        teamAScore: undefined,
        teamBScore: undefined,
        currentSet: {
          currentGame: {
            teamAScore: "0",
            teamBScore: "15",
            teamServing: "AWAY",
            type: "NORMAL",
          },
          teamAScore: 5,
          teamBScore: 3,
        },
      });
    });
  });

  describe("when providing isAmericanFormat", () => {
    it("should return correct isAmericanFormat", () => {
      const { data } = normalizeTennisFixtureFragmentIntoTennisFixture({
        ...BFF_RESPONSE,
        isAmericanFormat: true,
        scheduledStartTime: null,
        currentSet: undefined,
        status: undefined,
        surface: undefined,
        type: undefined,
        teamAScore: null,
        teamBScore: null,
      });

      expect(data).toEqual(expect.objectContaining({ isAmericanFormat: true }));
    });
  });

  describe("when providing runnerNames", () => {
    it("should return correct runnerNames", () => {
      const { data } = normalizeTennisFixtureFragmentIntoTennisFixture({
        ...BFF_RESPONSE,
        runnerNames: {
          home: "home",
          away: "away",
        },
        scheduledStartTime: null,
        currentSet: undefined,
        status: undefined,
        surface: undefined,
        type: undefined,
        teamAScore: null,
        teamBScore: null,
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
