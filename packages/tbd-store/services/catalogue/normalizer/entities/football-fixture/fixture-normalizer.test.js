import victim from "./football-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "FootballFixture",
  urn: "ppb:fixture:31421972",
  home: {
    name: "Aston Villa",
    color: "88002d",
    crest: {
      large: "https://sca.betfair.com/Assets/Aston Villa@3x.png",
    },
  },
  away: {
    name: "Liverpool",
    color: "fbe6d5",
  },
  scheduledAt: "2022-05-10T19:00:00Z",
  startedAt: null,
  score: {
    away: 1,
    home: 0,
  },
  firstLegScore: {
    home: 1,
    away: 0,
  },
  duration: {
    period: "REGULAR",
    status: "PRE_MATCH",
    clock: null,
    stoppageMinutes: null,
  },
  penaltyShootout: {
    firstTeamToShoot: "HOME",
    nextTeamToShoot: "HOME",
    penaltyScores: [
      {
        penaltyNumber: 1,
        side: "HOME",
        shotResult: "SCORE",
      },
    ],
  },
};

const BFF_RESPONSE_WITH_RECENT_FORM = {
  ...BFF_RESPONSE,
  recentForm: {
    home: [
      {
        opponent: "Pontevedra",
        outcome: "WIN",
        startAt: "2020-12-13T11:00:00Z",
        side: "HOME",
        score: {
          home: 3,
          away: 0,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
    ],
    away: [
      {
        opponent: "Almeria",
        outcome: "LOSE",
        startAt: "2020-12-13T15:00:00Z",
        side: "AWAY",
        score: {
          home: 3,
          away: 1,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
    ],
  },
};

const BFF_LITE_RESPONSE = {
  __typename: "FootballFixture",
  urn: "ppb:fixture:31421972",
  scheduledAt: "2022-05-10T19:00:00Z",
  startedAt: "2022-05-10T19:00:00Z",
  home: {
    name: "Aston Villa",
  },
  away: {
    name: "Liverpool",
  },
  duration: {
    period: "REGULAR",
    status: "PRE_MATCH",
    clock: null,
    stoppageMinutes: null,
  },
};

describe("Football fixture normalizer", () => {
  describe("normalizeFootballFixtureFragmentIntoFootballFixture", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = victim(BFF_RESPONSE);

      expect(data).toEqual({
        away: {
          color: "#fbe6d5",
          crest: undefined,
          name: "Liverpool",
        },
        duration: {
          clock: undefined,
          period: "REGULAR",
          status: "PRE_MATCH",
          stoppageMinutes: undefined,
        },
        home: {
          color: "#88002d",
          crest: {
            large: "https://sca.betfair.com/Assets/Aston Villa@3x.png",
            medium: undefined,
            small: undefined,
            vector: undefined,
          },
          name: "Aston Villa",
        },
        scheduledAt: new Date("2022-05-10T19:00:00.000Z"),
        startedAt: undefined,
        typename: "FootballFixture",
        urn: "ppb:fixture:31421972",
        penaltyShootout: {
          firstTeamToShoot: "HOME",
          nextTeamToShoot: "HOME",
          penaltyFormat: undefined,
          penaltyScores: [
            {
              penaltyNumber: 1,
              shotResult: "SCORE",
              side: "HOME",
            },
          ],
        },
        firstLegScore: {
          away: 0,
          home: 1,
        },
        score: {
          away: 1,
          home: 0,
        },
      });
    });

    it("should have defaults for undefined values", () => {
      const { data } = victim({
        ...BFF_RESPONSE,
        penaltyShootout: undefined,
        duration: undefined,
        score: undefined,
        firstLegScore: undefined,
      });

      expect(data).toEqual({
        away: {
          color: "#fbe6d5",
          crest: undefined,
          name: "Liverpool",
        },
        home: {
          color: "#88002d",
          crest: {
            large: "https://sca.betfair.com/Assets/Aston Villa@3x.png",
            medium: undefined,
            small: undefined,
            vector: undefined,
          },
          name: "Aston Villa",
        },
        scheduledAt: new Date("2022-05-10T19:00:00.000Z"),
        startedAt: undefined,
        typename: "FootballFixture",
        urn: "ppb:fixture:31421972",
      });
    });

    it("should correctly transform recent form", () => {
      const { data } = victim({
        ...BFF_RESPONSE_WITH_RECENT_FORM,
        penaltyShootout: undefined,
        duration: undefined,
        score: undefined,
        firstLegScore: undefined,
      });

      expect(data).toEqual({
        away: {
          color: "#fbe6d5",
          crest: undefined,
          name: "Liverpool",
        },
        home: {
          color: "#88002d",
          crest: {
            large: "https://sca.betfair.com/Assets/Aston Villa@3x.png",
            medium: undefined,
            small: undefined,
            vector: undefined,
          },
          name: "Aston Villa",
        },
        scheduledAt: new Date("2022-05-10T19:00:00.000Z"),
        startedAt: undefined,
        typename: "FootballFixture",
        urn: "ppb:fixture:31421972",
        recentForm: {
          away: [
            {
              extraTimeScore: undefined,
              opponent: "Almeria",
              outcome: "LOSE",
              penaltyShootoutScore: undefined,
              score: {
                away: 1,
                home: 3,
              },
              side: "AWAY",
              startAt: new Date("2020-12-13T15:00:00.000Z"),
            },
          ],
          home: [
            {
              extraTimeScore: undefined,
              opponent: "Pontevedra",
              outcome: "WIN",
              penaltyShootoutScore: undefined,
              score: {
                away: 0,
                home: 3,
              },
              side: "HOME",
              startAt: new Date("2020-12-13T11:00:00.000Z"),
            },
          ],
        },
      });
    });

    it("should correctly transform lite queries", () => {
      const { data } = victim({
        ...BFF_LITE_RESPONSE,
      });

      expect(data).toEqual({
        away: {
          color: undefined,
          crest: undefined,
          name: "Liverpool",
        },
        duration: {
          clock: undefined,
          period: "REGULAR",
          status: "PRE_MATCH",
          stoppageMinutes: undefined,
        },
        home: {
          color: undefined,
          crest: undefined,
          name: "Aston Villa",
        },
        scheduledAt: new Date("2022-05-10T19:00:00.000Z"),
        startedAt: new Date("2022-05-10T19:00:00.000Z"),
        typename: "FootballFixture",
        urn: "ppb:fixture:31421972",
      });
    });
  });
});
