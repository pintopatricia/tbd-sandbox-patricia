import normalizer from "./football-fixture-normalizer";

const BFF_FIXTURE = {
  __typename: "FootballFixture",
  urn: "ppb:fixture:31968883",
  home: {
    name: "Reading",
    color: "0000ff",
    crest: null,
  },
  away: {
    name: "Swansea",
    color: "ffa500",
    crest: null,
  },
  isAmericanFormat: false,
  runnerNames: {
    home: "Reading",
    away: "Swansea",
  },
  scheduledAt: "2022-12-27T17:15:00Z",
  startedAt: "2022-12-27T17:14:39Z",
  score: {
    home: 0,
    away: 0,
  },
  firstLegScore: null,
  duration: {
    period: "REGULAR",
    status: "INPLAY_FIRST_HALF",
    clock: { __typename: "Clock", minute: 10, second: 41 },
    stoppageMinutes: null,
  },
  penaltyShootout: null,
};

const BFF_FIXTURE_WITH_STATS = {
  ...BFF_FIXTURE,
  stats: [
    {
      __typename: "FootballStats",
      period: null,
      periodStatus: "FULL",
      home: {
        __typename: "FootballGameStats",
        possession: null,
        corners: 1,
        yellowCards: 0,
        redCards: 0,
        offsides: null,
        fouls: 3,
        throwIns: 1,
        freeKicks: 1,
        goalKicks: 0,
        blockedShots: 1,
        dangerousAttacks: null,
        shotsOnTarget: 0,
        shotsOffTarget: 1,
        goals: 0,
      },
      away: {
        __typename: "FootballGameStats",
        possession: null,
        corners: 0,
        yellowCards: 0,
        redCards: 0,
        offsides: null,
        fouls: 1,
        throwIns: 5,
        freeKicks: 3,
        goalKicks: 0,
        blockedShots: 0,
        dangerousAttacks: null,
        shotsOnTarget: 0,
        shotsOffTarget: 0,
        goals: 0,
      },
    },
    {
      __typename: "FootballStats",
      period: "EXTRA",
      periodStatus: "INPLAY_FIRST_HALF",
      home: null,
      away: null,
    },
    {
      __typename: "FootballStats",
      period: "EXTRA",
      periodStatus: "INPLAY_SECOND_HALF",
      home: null,
      away: null,
    },
    {
      __typename: "FootballStats",
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      home: {
        __typename: "FootballGameStats",
        possession: null,
        corners: 1,
        yellowCards: 0,
        redCards: 0,
        offsides: null,
        fouls: 3,
        throwIns: 1,
        freeKicks: 1,
        goalKicks: 0,
        blockedShots: 1,
        dangerousAttacks: null,
        shotsOnTarget: 0,
        shotsOffTarget: 1,
        goals: 0,
      },
      away: {
        __typename: "FootballGameStats",
        possession: null,
        corners: 0,
        yellowCards: 0,
        redCards: 0,
        offsides: null,
        fouls: 1,
        throwIns: 5,
        freeKicks: 3,
        goalKicks: 0,
        blockedShots: 0,
        dangerousAttacks: null,
        shotsOnTarget: 0,
        shotsOffTarget: 0,
        goals: 0,
      },
    },
    {
      __typename: "FootballStats",
      period: "REGULAR",
      periodStatus: "INPLAY_SECOND_HALF",
      home: null,
      away: null,
    },
  ],
};

const BFF_FIXTURE_WITH_H2H = {
  ...BFF_FIXTURE,
  head2head: {
    home: [
      {
        opponent: "Swansea",
        outcome: "LOSE",
        startAt: "2022-10-18T18:45:00Z",
        side: "AWAY",
        score: {
          home: 3,
          away: 2,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Swansea",
        outcome: "DRAW",
        startAt: "2022-04-18T14:00:00Z",
        side: "HOME",
        score: {
          home: 4,
          away: 4,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Swansea",
        outcome: "WIN",
        startAt: "2021-11-27T15:00:00Z",
        side: "AWAY",
        score: {
          home: 2,
          away: 3,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Swansea",
        outcome: "LOSE",
        startAt: "2021-08-10T19:00:00Z",
        side: "HOME",
        score: {
          home: 0,
          away: 3,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Swansea",
        outcome: "DRAW",
        startAt: "2021-04-25T11:00:00Z",
        side: "HOME",
        score: {
          home: 2,
          away: 2,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Swansea",
        outcome: "DRAW",
        startAt: "2020-12-30T20:00:00Z",
        side: "AWAY",
        score: {
          home: 0,
          away: 0,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
    ],
    away: [
      {
        opponent: "Reading",
        outcome: "WIN",
        startAt: "2022-10-18T18:45:00Z",
        side: "HOME",
        score: {
          home: 3,
          away: 2,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Reading",
        outcome: "DRAW",
        startAt: "2022-04-18T14:00:00Z",
        side: "AWAY",
        score: {
          home: 4,
          away: 4,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Reading",
        outcome: "LOSE",
        startAt: "2021-11-27T15:00:00Z",
        side: "HOME",
        score: {
          home: 2,
          away: 3,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Reading",
        outcome: "WIN",
        startAt: "2021-08-10T19:00:00Z",
        side: "AWAY",
        score: {
          home: 0,
          away: 3,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Reading",
        outcome: "DRAW",
        startAt: "2021-04-25T11:00:00Z",
        side: "AWAY",
        score: {
          home: 2,
          away: 2,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Reading",
        outcome: "DRAW",
        startAt: "2020-12-30T20:00:00Z",
        side: "HOME",
        score: {
          home: 0,
          away: 0,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
    ],
  },
};

const BFF_FIXTURE_WITH_TEAM_LINEUPS = {
  ...BFF_FIXTURE,
  home: {
    name: "Reading",
    color: "0000ff",
    crest: null,
    squad: {
      manager: "Ince, Paul",
      players: [
        {
          __typename: "FootballPlayer",
          id: "34986",
          name: "Joe Lumley",
          shirtNumber: 1,
          position: "GOALKEEPER",
          positionDescription: null,
          startingType: "LINEUP",
        },
        {
          __typename: "FootballPlayer",
          id: "24118",
          name: "Naby Sarr",
          shirtNumber: 24,
          position: "DEFENDER",
          positionDescription: null,
          startingType: "LINEUP",
        },
      ],
    },
  },
  away: {
    name: "Swansea",
    color: "ffa500",
    crest: null,
    squad: {
      manager: "Martin, Russell",
      players: [
        {
          __typename: "FootballPlayer",
          id: "69786",
          name: "Steven Benda",
          shirtNumber: 13,
          position: "GOALKEEPER",
          positionDescription: null,
          startingType: "LINEUP",
        },
        {
          __typename: "FootballPlayer",
          id: "69242",
          name: "Nathan Wood",
          shirtNumber: 23,
          position: "DEFENDER",
          positionDescription: null,
          startingType: "LINEUP",
        },
      ],
    },
  },
};

const BFF_FIXTURE_WITH_MATCH_TIMELINE = {
  ...BFF_FIXTURE,
  incidents: [
    {
      __typename: "FootballIncident",
      clock: { __typename: "Clock", minute: 70, second: 19 },
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      type: "PenaltyIncident",
      details: {
        side: "HOME",
        penaltyType: "AWARDED",
      },
    },
    {
      clock: { __typename: "Clock", minute: 70, second: 19 },
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      type: "PenaltyIncident",
      details: {
        side: "HOME",
        penaltyType: "AWARDED",
      },
    },
    {
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      clock: { __typename: "Clock", minute: 31, second: 0 },
      type: "SubstitutionIncident",
      details: {
        __typename: "SubstitutionIncident",
        playerIn: {
          name: "Player In",
        },
        playerOut: {
          name: "Player Out",
        },
        side: "HOME",
      },
    },
    {
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      clock: { __typename: "Clock", minute: 30, second: 45 },
      type: "ShotIncident",
      details: {
        __typename: "ShotIncident",
        shotType: "OFF_TARGET",
        player: {
          name: "Hagi G.",
        },
        side: "HOME",
      },
    },
    {
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      clock: { __typename: "Clock", minute: 30, second: 0 },
      type: "AttackIncident",
      details: {
        __typename: "AttackIncident",
        side: "HOME",
        attackType: "DANGEROUS_ATTACK",
      },
    },
    {
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      clock: { __typename: "Clock", minute: 26, second: 0 },
      type: "FoulIncident",
      details: {
        __typename: "FoulIncident",
        foulType: "FOUL",
        player: {
          name: "Stanescu H.",
        },
        side: "HOME",
      },
    },
    {
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      clock: { __typename: "Clock", minute: 24, second: 0 },
      type: "FoulIncident",
      details: {
        __typename: "FoulIncident",
        foulType: "FOUL",
        side: "HOME",
      },
    },
    {
      clock: { __typename: "Clock", minute: 23, second: 0 },
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      details: {
        __typename: "PeriodIncident",
        periodType: "PERIOD_TRANSITION",
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        injuryTime: null,
      },
    },
    {
      clock: { __typename: "Clock", minute: 19, second: 52 },
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      details: {
        __typename: "GoalIncident",
        goalType: "NORMAL",
        side: "HOME",
        goalScorer: null,
        assist: null,
      },
    },
    {
      clock: { __typename: "Clock", minute: 15, second: 55 },
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      details: {
        __typename: "CardIncident",
        cardType: "YELLOW",
        side: "HOME",
        player: null,
      },
    },
    {
      clock: { __typename: "Clock", minute: 13, second: 42 },
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      details: {
        __typename: "SetPieceIncident",
        side: "AWAY",
        setPieceType: "THROW_IN",
      },
    },
    {
      clock: { __typename: "Clock", minute: 12, second: 59 },
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      details: {
        __typename: "SetPieceIncident",
        side: "HOME",
        setPieceType: "GOAL_KICK",
      },
    },
  ],
};

const BFF_FIXTURE_WITH_RECENT_FORM = {
  ...BFF_FIXTURE,
  recentForm: {
    home: [
      {
        opponent: "Birmingham",
        outcome: "LOSE",
        startAt: "2022-12-16T20:00:00Z",
        side: "AWAY",
        score: {
          home: 3,
          away: 2,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Coventry",
        outcome: "WIN",
        startAt: "2022-12-10T14:00:00Z",
        side: "HOME",
        score: {
          home: 1,
          away: 0,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
    ],
    away: [
      {
        opponent: "Coventry",
        outcome: "DRAW",
        startAt: "2022-12-17T15:00:00Z",
        side: "AWAY",
        score: {
          home: 3,
          away: 3,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
      {
        opponent: "Norwich",
        outcome: "LOSE",
        startAt: "2022-12-10T15:00:00Z",
        side: "HOME",
        score: {
          home: 0,
          away: 1,
        },
        extraTimeScore: null,
        penaltyShootoutScore: null,
      },
    ],
  },
};

describe("FootballFixture normalizer", () => {
  describe("when retrieving the most basic data for a football fixture", () => {
    it("should return the normalized fixture", () => {
      expect(normalizer(BFF_FIXTURE).data).toEqual({
        typename: "FootballFixture",
        urn: "ppb:fixture:31968883",
        isAmericanFormat: false,
        runnerNames: { home: "Reading", away: "Swansea" },
        home: { color: "#0000ff", crest: undefined, name: "Reading" },
        away: { color: "#ffa500", crest: undefined, name: "Swansea" },
        score: { away: 0, home: 0 },
        duration: {
          clock: { __typename: "Clock", minute: 10, second: 41 },
          period: "REGULAR",
          status: "INPLAY_FIRST_HALF",
          stoppageMinutes: undefined,
        },
        scheduledAt: new Date("2022-12-27T17:15:00.000Z"),
        startedAt: new Date("2022-12-27T17:14:39.000Z"),
      });
    });
  });

  describe("when retrieving a football fixture with stats", () => {
    it("should return the normalized fixture", () => {
      expect(normalizer(BFF_FIXTURE_WITH_STATS).data).toEqual(
        expect.objectContaining({
          stats: [
            {
              __typename: "FootballStats",
              periodStatus: "FULL",
              period: undefined,
              home: {
                __typename: "FootballGameStats",
                possession: undefined,
                corners: 1,
                yellowCards: 0,
                redCards: 0,
                offsides: undefined,
                fouls: 3,
                throwIns: 1,
                freeKicks: 1,
                goalKicks: 0,
                blockedShots: 1,
                dangerousAttacks: undefined,
                shotsOnTarget: 0,
                shotsOffTarget: 1,
                goals: 0,
              },
              away: {
                __typename: "FootballGameStats",
                possession: undefined,
                corners: 0,
                yellowCards: 0,
                redCards: 0,
                offsides: undefined,
                fouls: 1,
                throwIns: 5,
                freeKicks: 3,
                goalKicks: 0,
                blockedShots: 0,
                dangerousAttacks: undefined,
                shotsOnTarget: 0,
                shotsOffTarget: 0,
                goals: 0,
              },
            },
            {
              __typename: "FootballStats",
              periodStatus: "INPLAY_FIRST_HALF",
              period: "EXTRA",
              home: undefined,
              away: undefined,
            },
            {
              __typename: "FootballStats",
              periodStatus: "INPLAY_SECOND_HALF",
              period: "EXTRA",
              home: undefined,
              away: undefined,
            },
            {
              __typename: "FootballStats",
              periodStatus: "INPLAY_FIRST_HALF",
              period: "REGULAR",
              home: {
                __typename: "FootballGameStats",
                possession: undefined,
                corners: 1,
                yellowCards: 0,
                redCards: 0,
                offsides: undefined,
                fouls: 3,
                throwIns: 1,
                freeKicks: 1,
                goalKicks: 0,
                blockedShots: 1,
                dangerousAttacks: undefined,
                shotsOnTarget: 0,
                shotsOffTarget: 1,
                goals: 0,
              },
              away: {
                __typename: "FootballGameStats",
                possession: undefined,
                corners: 0,
                yellowCards: 0,
                redCards: 0,
                offsides: undefined,
                fouls: 1,
                throwIns: 5,
                freeKicks: 3,
                goalKicks: 0,
                blockedShots: 0,
                dangerousAttacks: undefined,
                shotsOnTarget: 0,
                shotsOffTarget: 0,
                goals: 0,
              },
            },
            {
              __typename: "FootballStats",
              periodStatus: "INPLAY_SECOND_HALF",
              period: "REGULAR",
              home: undefined,
              away: undefined,
            },
          ],
        }),
      );
    });
  });

  describe("when retrieving a football fixture with head-to-head", () => {
    it("should return the normalized fixture", () => {
      expect(normalizer(BFF_FIXTURE_WITH_H2H).data).toEqual(
        expect.objectContaining({
          head2head: {
            away: [
              {
                extraTimeScore: undefined,
                opponent: "Reading",
                outcome: "WIN",
                penaltyShootoutScore: undefined,
                score: { away: 2, home: 3 },
                side: "HOME",
                startAt: new Date("2022-10-18T18:45:00.000Z"),
              },
              {
                extraTimeScore: undefined,
                opponent: "Reading",
                outcome: "DRAW",
                penaltyShootoutScore: undefined,
                score: { away: 4, home: 4 },
                side: "AWAY",
                startAt: new Date("2022-04-18T14:00:00.000Z"),
              },
              {
                extraTimeScore: undefined,
                opponent: "Reading",
                outcome: "LOSE",
                penaltyShootoutScore: undefined,
                score: { away: 3, home: 2 },
                side: "HOME",
                startAt: new Date("2021-11-27T15:00:00.000Z"),
              },
              {
                extraTimeScore: undefined,
                opponent: "Reading",
                outcome: "WIN",
                penaltyShootoutScore: undefined,
                score: { away: 3, home: 0 },
                side: "AWAY",
                startAt: new Date("2021-08-10T19:00:00.000Z"),
              },
              {
                extraTimeScore: undefined,
                opponent: "Reading",
                outcome: "DRAW",
                penaltyShootoutScore: undefined,
                score: { away: 2, home: 2 },
                side: "AWAY",
                startAt: new Date("2021-04-25T11:00:00.000Z"),
              },
            ],
            home: [
              {
                extraTimeScore: undefined,
                opponent: "Swansea",
                outcome: "LOSE",
                penaltyShootoutScore: undefined,
                score: { away: 2, home: 3 },
                side: "AWAY",
                startAt: new Date("2022-10-18T18:45:00.000Z"),
              },
              {
                extraTimeScore: undefined,
                opponent: "Swansea",
                outcome: "DRAW",
                penaltyShootoutScore: undefined,
                score: { away: 4, home: 4 },
                side: "HOME",
                startAt: new Date("2022-04-18T14:00:00.000Z"),
              },
              {
                extraTimeScore: undefined,
                opponent: "Swansea",
                outcome: "WIN",
                penaltyShootoutScore: undefined,
                score: { away: 3, home: 2 },
                side: "AWAY",
                startAt: new Date("2021-11-27T15:00:00.000Z"),
              },
              {
                extraTimeScore: undefined,
                opponent: "Swansea",
                outcome: "LOSE",
                penaltyShootoutScore: undefined,
                score: { away: 3, home: 0 },
                side: "HOME",
                startAt: new Date("2021-08-10T19:00:00.000Z"),
              },
              {
                extraTimeScore: undefined,
                opponent: "Swansea",
                outcome: "DRAW",
                penaltyShootoutScore: undefined,
                score: { away: 2, home: 2 },
                side: "HOME",
                startAt: new Date("2021-04-25T11:00:00.000Z"),
              },
            ],
          },
        }),
      );
    });
  });

  describe("when retrieving a football fixture with team lineups", () => {
    it("should return the normalized fixture", () => {
      expect(normalizer(BFF_FIXTURE_WITH_TEAM_LINEUPS).data).toEqual(
        expect.objectContaining({
          away: {
            color: "#ffa500",
            crest: undefined,
            name: "Swansea",
            squad: {
              manager: "Martin, Russell",
              players: [
                {
                  __typename: "FootballPlayer",
                  id: "69786",
                  name: "Steven Benda",
                  position: "GOALKEEPER",
                  shirtNumber: 13,
                  startingType: "LINEUP",
                },
                {
                  __typename: "FootballPlayer",
                  id: "69242",
                  name: "Nathan Wood",
                  position: "DEFENDER",
                  shirtNumber: 23,
                  startingType: "LINEUP",
                },
              ],
            },
          },
          home: {
            color: "#0000ff",
            crest: undefined,
            name: "Reading",
            squad: {
              manager: "Ince, Paul",
              players: [
                {
                  __typename: "FootballPlayer",
                  id: "34986",
                  name: "Joe Lumley",
                  position: "GOALKEEPER",
                  shirtNumber: 1,
                  startingType: "LINEUP",
                },
                {
                  __typename: "FootballPlayer",
                  id: "24118",
                  name: "Naby Sarr",
                  position: "DEFENDER",
                  shirtNumber: 24,
                  startingType: "LINEUP",
                },
              ],
            },
          },
        }),
      );
    });
  });

  describe("when retrieving a football fixture with match timeline", () => {
    it("should return the normalized fixture", () => {
      expect(normalizer(BFF_FIXTURE_WITH_MATCH_TIMELINE).data).toEqual(
        expect.objectContaining({
          incidents: [
            {
              __typename: "FootballIncident",
              clock: { __typename: "Clock", minute: 31, second: undefined },
              details: { __typename: "SubstitutionIncident", playerIn: undefined, playerOut: undefined, side: "HOME" },
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              type: "SubstitutionIncident",
            },
            {
              __typename: "FootballIncident",
              clock: { __typename: "Clock", minute: 30, second: 45 },
              details: { __typename: "ShotIncident", player: undefined, shotType: "OFF_TARGET", side: "HOME" },
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              type: "ShotIncident",
            },
            {
              __typename: "FootballIncident",
              clock: { __typename: "Clock", minute: 30, second: undefined },
              details: { __typename: "AttackIncident", attackType: 0, side: "HOME" },
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              type: "AttackIncident",
            },
            {
              __typename: "FootballIncident",
              clock: { __typename: "Clock", minute: 26, second: undefined },
              details: { __typename: "FoulIncident", foulType: "FOUL", player: undefined, side: "HOME" },
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              type: "FoulIncident",
            },
            {
              __typename: "FootballIncident",
              clock: { __typename: "Clock", minute: 24, second: undefined },
              details: { __typename: "FoulIncident", foulType: "FOUL", player: undefined, side: "HOME" },
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              type: "FoulIncident",
            },
            {
              __typename: "FootballIncident",
              clock: { __typename: "Clock", minute: 23, second: undefined },
              details: {
                __typename: "PeriodIncident",
                injuryTime: undefined,
                period: "REGULAR",
                periodType: "PERIOD_TRANSITION",
                status: "INPLAY_FIRST_HALF",
              },
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              type: "PeriodIncident",
            },
            {
              __typename: "FootballIncident",
              clock: { __typename: "Clock", minute: 19, second: 52 },
              details: {
                __typename: "GoalIncident",
                assist: undefined,
                goalScorer: undefined,
                goalType: "NORMAL",
                side: "HOME",
              },
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              type: "GoalIncident",
            },
            {
              __typename: "FootballIncident",
              clock: { __typename: "Clock", minute: 15, second: 55 },
              details: { __typename: "CardIncident", cardType: "YELLOW", player: undefined, side: "HOME" },
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              type: "CardIncident",
            },
            {
              __typename: "FootballIncident",
              clock: { __typename: "Clock", minute: 13, second: 42 },
              details: { __typename: "SetPieceIncident", setPieceType: "THROW_IN", side: "AWAY" },
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              type: "SetPieceIncident",
            },
            {
              __typename: "FootballIncident",
              clock: { __typename: "Clock", minute: 12, second: 59 },
              details: { __typename: "SetPieceIncident", setPieceType: "GOAL_KICK", side: "HOME" },
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              type: "SetPieceIncident",
            },
          ],
        }),
      );
    });
  });

  describe("when retrieving a football fixture with recent form", () => {
    it("should return the normalized fixture", () => {
      expect(normalizer(BFF_FIXTURE_WITH_RECENT_FORM).data).toEqual(
        expect.objectContaining({
          recentForm: {
            away: [
              {
                extraTimeScore: undefined,
                opponent: "Coventry",
                outcome: "DRAW",
                penaltyShootoutScore: undefined,
                score: { away: 3, home: 3 },
                side: "AWAY",
                startAt: new Date("2022-12-17T15:00:00.000Z"),
              },
              {
                extraTimeScore: undefined,
                opponent: "Norwich",
                outcome: "LOSE",
                penaltyShootoutScore: undefined,
                score: { away: 1, home: 0 },
                side: "HOME",
                startAt: new Date("2022-12-10T15:00:00.000Z"),
              },
            ],
            home: [
              {
                extraTimeScore: undefined,
                opponent: "Birmingham",
                outcome: "LOSE",
                penaltyShootoutScore: undefined,
                score: { away: 2, home: 3 },
                side: "AWAY",
                startAt: new Date("2022-12-16T20:00:00.000Z"),
              },
              {
                extraTimeScore: undefined,
                opponent: "Coventry",
                outcome: "WIN",
                penaltyShootoutScore: undefined,
                score: { away: 0, home: 1 },
                side: "HOME",
                startAt: new Date("2022-12-10T14:00:00.000Z"),
              },
            ],
          },
        }),
      );
    });
  });
});
