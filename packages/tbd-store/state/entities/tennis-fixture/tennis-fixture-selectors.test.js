import { TennisStatus } from "./TennisFixture";
import {
  createTennisFixtureByURNSelector,
  isTennisMatchInplay,
  createTennisScoreboardByURNSelector,
} from "./tennis-fixture-selectors";

import { getAmericanFormatScoreData } from "../../../helpers/fixture";

jest.mock("../../../helpers/fixture", () => ({
  getAmericanFormatScoreData: jest.fn(({ isAmericanFormat, ...props }) => props),
}));

const URN = "ppb:tennisfixture:29605500";

const FIXTURE_MOCK = {
  urn: URN,
  isAmericanFormat: false,
  runnerNames: {
    home: "Bucsa",
    away: "Gracheva",
  },
  actualStartTime: undefined,
  scheduledStartTime: new Date("2022-01-16T20:00:00Z"),
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
  status: { status: "PRE_MATCH", reason: undefined },
  surface: "CLAY",
  type: "SINGLES",
  teamAScore: 1,
  teamBScore: 1,
};

const STATE_MOCK = {
  entities: {
    tennisfixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

const SCOREBOARD_MOCK = {
  ...FIXTURE_MOCK,
  fixtureStatus: "PRE_MATCH",
  score: {
    currentMatch: {
      home: 1,
      away: 1,
    },
    currentSet: {
      home: 5,
      away: 3,
    },
    currentGame: {
      home: "0",
      away: "15",
    },
  },
  scoreData: [
    {
      teamA: 1,
      teamB: 1,
      style: "FINISHED",
    },
    {
      teamA: 5,
      teamB: 3,
      style: "DEFAULT",
    },
    {
      teamA: "0",
      teamB: "15",
      style: "IN_PLAY",
    },
  ],
};

describe('"tennisFixtures" selectors', () => {
  describe("getTennisFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getTennisFixtureByURN = createTennisFixtureByURNSelector();
      const fixture = getTennisFixtureByURN(STATE_MOCK.entities.tennisfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing tennis fixture", () => {
      const getTennisFixtureByURN = createTennisFixtureByURNSelector();
      const fixture = getTennisFixtureByURN(STATE_MOCK.entities.tennisfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.tennisfixtures[URN],
        fixtureStatus: "PRE_MATCH",
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createTennisFixtureByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getTennisFixtureByURN1 = createTennisFixtureByURNSelector();
        const getTennisFixtureByURN2 = createTennisFixtureByURNSelector();

        expect(getTennisFixtureByURN1).not.toEqual(getTennisFixtureByURN2);
      });
    });

    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createTennisFixtureByURNSelector()(
          {
            [URN]: {
              urn: URN,
            },
          },
          "random:urn",
        );

        expect(result).toEqual(undefined);
      });
    });

    describe("when providing an URN for an existing fixture", () => {
      it("must return the respective tennis fixture", () => {
        const result = createTennisFixtureByURNSelector()(STATE_MOCK.entities.tennisfixtures, URN);

        expect(result).toEqual({ ...FIXTURE_MOCK, fixtureStatus: "PRE_MATCH" });
      });

      describe("when the selector is called again and fixture relevant data didn't change", () => {
        const getTennisFixtureByURN = createTennisFixtureByURNSelector();

        const firstCall = getTennisFixtureByURN(STATE_MOCK.entities.tennisfixtures, URN);
        const secondCall = getTennisFixtureByURN({ ...STATE_MOCK.entities.tennisfixtures, newProp: "newData" }, URN);

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getTennisFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getTennisFixtureByURN = createTennisFixtureByURNSelector();

        const firstCall = getTennisFixtureByURN(STATE_MOCK.entities.tennisfixtures, URN);
        const secondCall = getTennisFixtureByURN(
          {
            URN: {
              ...FIXTURE_MOCK,
              teamAScore: 1,
              teamBScore: 2,
            },
          },
          URN,
        );

        it("should return a different fixture object", () => {
          expect(firstCall === secondCall).toBe(false);
        });

        it("should recompute the selector", () => {
          expect(getTennisFixtureByURN.recomputations()).toEqual(2);
        });
      });
    });
  });

  describe("isTennisMatchInplay", () => {
    describe("when the status is not defined", () => {
      it("should return false", () => {
        const result = isTennisMatchInplay({ ...FIXTURE_MOCK, status: undefined });

        expect(result).toEqual(false);
      });
    });

    describe("when the status status is not defined", () => {
      it("should return false", () => {
        const result = isTennisMatchInplay({ ...FIXTURE_MOCK, status: { status: undefined } });

        expect(result).toEqual(false);
      });
    });

    describe("when the status status is TennisStatus.PRE_MATCH", () => {
      it("should return false", () => {
        const result = isTennisMatchInplay({ ...FIXTURE_MOCK, status: { status: TennisStatus.PRE_MATCH } });

        expect(result).toEqual(false);
      });
    });

    describe("when the status status is TennisStatus.IN_RUNNING", () => {
      it("should return true", () => {
        const result = isTennisMatchInplay({ ...FIXTURE_MOCK, status: { status: TennisStatus.IN_RUNNING } });

        expect(result).toEqual(true);
      });
    });
    describe("when the status status is TennisStatus.INTERRUPTED", () => {
      it("should return true", () => {
        const result = isTennisMatchInplay({ ...FIXTURE_MOCK, status: { status: TennisStatus.INTERRUPTED } });

        expect(result).toEqual(true);
      });
    });
    describe("when the status status is TennisStatus.FINISHED", () => {
      it("should return false", () => {
        const result = isTennisMatchInplay({ ...FIXTURE_MOCK, status: { status: TennisStatus.FINISHED } });

        expect(result).toEqual(false);
      });
    });

    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getTennisFixtureByURN = createTennisFixtureByURNSelector();
      const fixture = getTennisFixtureByURN(STATE_MOCK.entities.tennisfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing tennis fixture", () => {
      const getTennisFixtureByURN = createTennisFixtureByURNSelector();
      const fixture = getTennisFixtureByURN(STATE_MOCK.entities.tennisfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.tennisfixtures[URN],
        fixtureStatus: "PRE_MATCH",
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createTennisScoreboardByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getTennisScoreboardByURN1 = createTennisScoreboardByURNSelector();
        const getTennisScoreboardByURN2 = createTennisScoreboardByURNSelector();

        expect(getTennisScoreboardByURN1).not.toEqual(getTennisScoreboardByURN2);
      });
    });

    describe("when providing an URN for a non-existing scoreboard", () => {
      it("must return undefined", () => {
        const result = createTennisScoreboardByURNSelector()(
          {
            [URN]: {
              urn: URN,
            },
          },
          "random:urn",
        );

        expect(result).toEqual(undefined);
      });
    });

    describe("when providing an URN for an existing scoreboard", () => {
      it("must return the respective tennis scoreboard", () => {
        const result = createTennisScoreboardByURNSelector()(STATE_MOCK.entities.tennisfixtures, URN);

        expect(result).toEqual(SCOREBOARD_MOCK);
      });

      describe("score", () => {
        describe("when isAmericanFormat is true", () => {
          it("should return inverted score information", () => {
            const { score } = createTennisScoreboardByURNSelector()(
              {
                "ppb:tennisfixture:29605500": {
                  ...FIXTURE_MOCK,
                  isAmericanFormat: true,
                },
              },
              URN,
            );

            expect(score).toEqual({
              currentGame: { away: "0", home: "15" },
              currentMatch: { away: 1, home: 1 },
              currentSet: { away: 5, home: 3 },
            });
          });
        });

        describe("when isAmericanFormat is false", () => {
          it("should return correct score information", () => {
            const { score } = createTennisScoreboardByURNSelector()(STATE_MOCK.entities.tennisfixtures, URN);

            expect(score).toEqual({
              currentGame: { away: "15", home: "0" },
              currentMatch: { away: 1, home: 1 },
              currentSet: { away: 3, home: 5 },
            });
          });
        });
      });

      describe("and scoreData", () => {
        describe("and when currentSet is undefined", () => {
          it("should return the default scoreData", () => {
            const result = createTennisScoreboardByURNSelector()(
              {
                "ppb:tennisfixture:29605500": {
                  ...STATE_MOCK.entities.tennisfixtures["ppb:tennisfixture:29605500"],
                  currentSet: undefined,
                },
              },
              URN,
            );

            expect(result.scoreData).toEqual([
              { teamA: 0, teamB: 0, style: "EMPTY" },
              { teamA: 0, teamB: 0, style: "EMPTY" },
              { teamA: 0, teamB: 0, style: "EMPTY" },
            ]);
          });
        });

        describe("and when the match is finished", () => {
          it("should return the correct scoreData", () => {
            const result = createTennisScoreboardByURNSelector()(
              {
                "ppb:tennisfixture:29605500": {
                  ...STATE_MOCK.entities.tennisfixtures["ppb:tennisfixture:29605500"],
                  status: { status: "FINISHED", reason: "RAIN_DELAY" },
                },
              },
              URN,
            );

            expect(result.scoreData).toEqual([{ teamA: 1, teamB: 1, style: "FINISHED" }]);
          });
        });

        describe("and when the match is finished and currentSet is undefined", () => {
          it("should return the correct scoreData", () => {
            const result = createTennisScoreboardByURNSelector()(
              {
                "ppb:tennisfixture:29605500": {
                  ...STATE_MOCK.entities.tennisfixtures["ppb:tennisfixture:29605500"],
                  status: { status: "FINISHED", reason: "RAIN_DELAY" },
                  currentSet: undefined,
                },
              },
              URN,
            );

            expect(result.scoreData).toEqual([{ teamA: 1, teamB: 1, style: "FINISHED" }]);
          });
        });

        describe("and when the match is interrupted", () => {
          it("should return correct scoreData accordingly with status", () => {
            const result = createTennisScoreboardByURNSelector()(
              {
                "ppb:tennisfixture:29605500": {
                  ...STATE_MOCK.entities.tennisfixtures["ppb:tennisfixture:29605500"],
                  status: { status: "INTERRUPTED", reason: "RAIN_DELAY" },
                },
              },
              URN,
            );

            expect(result.scoreData).toEqual([
              {
                teamA: 1,
                teamB: 1,
                style: "FINISHED",
              },
              {
                teamA: 5,
                teamB: 3,
                style: "DEFAULT",
              },
              {
                teamA: "0",
                teamB: "15",
                style: "PAUSED",
              },
            ]);
          });
        });

        describe("and when the match is running", () => {
          it("should return correct scoreData accordingly with status", () => {
            const result = createTennisScoreboardByURNSelector()(
              {
                "ppb:tennisfixture:29605500": {
                  ...STATE_MOCK.entities.tennisfixtures["ppb:tennisfixture:29605500"],
                  status: { status: "IN_RUNNING", reason: "" },
                },
              },
              URN,
            );

            expect(result.scoreData).toEqual([
              {
                teamA: 1,
                teamB: 1,
                style: "FINISHED",
              },
              {
                teamA: 5,
                teamB: 3,
                style: "DEFAULT",
              },
              {
                teamA: "0",
                teamB: "15",
                style: "IN_PLAY",
              },
            ]);
          });
        });

        describe("when isAmericanFormat is true", () => {
          it("should return inverted scoreData information", () => {
            getAmericanFormatScoreData.mockReturnValue({ teamA: "teamB score", teamB: "teamA score" });

            const { scoreData } = createTennisScoreboardByURNSelector()(
              {
                "ppb:tennisfixture:29605500": {
                  ...FIXTURE_MOCK,
                  isAmericanFormat: true,
                  status: { status: "IN_RUNNING", reason: "" },
                },
              },
              URN,
            );

            expect(scoreData).toEqual([
              { teamB: "teamA score", teamA: "teamB score", style: "FINISHED" },
              { teamB: "teamA score", teamA: "teamB score", style: "DEFAULT" },
              { teamB: "teamA score", teamA: "teamB score", style: "IN_PLAY" },
            ]);
          });
        });
      });

      describe("and the status is defined", () => {
        describe("and the status reason is not defined", () => {
          const result = createTennisScoreboardByURNSelector()(STATE_MOCK.entities.tennisfixtures, URN);

          it("should return props with correct status", () => {
            expect(result.status.status).toEqual(SCOREBOARD_MOCK.status.status);
            expect(result.status.reason).toBeUndefined();
          });
        });

        describe("and the status reason is defined", () => {
          const result = createTennisScoreboardByURNSelector()(
            {
              "ppb:tennisfixture:29605500": {
                ...STATE_MOCK.entities.tennisfixtures["ppb:tennisfixture:29605500"],
                status: { status: "IN_RUNNING", reason: "RAIN_DELAY" },
              },
            },
            URN,
          );

          it("should return props with correct status", () => {
            expect(result.status).toEqual({ status: "IN_RUNNING", reason: "RAIN_DELAY" });
          });
        });

        describe("and the status reason is defined but should be ignored", () => {
          const result = createTennisScoreboardByURNSelector()(
            {
              "ppb:tennisfixture:29605500": {
                ...STATE_MOCK.entities.tennisfixtures["ppb:tennisfixture:29605500"],
                status: { status: "INTERRUPTED", reason: "TOILET_BREAK" },
              },
            },
            URN,
          );

          it("should return props with default status for IN_RUNNING", () => {
            expect(result.status).toEqual({ status: "IN_RUNNING", reason: undefined });
          });
        });
      });

      describe("when the selector is called again and fixture relevant data didn't change", () => {
        const getTennisScoreboardByURN = createTennisScoreboardByURNSelector();

        const firstCall = getTennisScoreboardByURN(STATE_MOCK.entities.tennisfixtures, URN);
        const secondCall = getTennisScoreboardByURN({ ...STATE_MOCK.entities.tennisfixtures, newProp: "newData" }, URN);

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getTennisScoreboardByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getTennisScoreboardByURN = createTennisScoreboardByURNSelector();

        const firstCall = getTennisScoreboardByURN(STATE_MOCK.entities.tennisfixtures, URN);
        const secondCall = getTennisScoreboardByURN(
          {
            URN: {
              ...FIXTURE_MOCK,
              teamAScore: 1,
              teamBScore: 2,
            },
          },
          URN,
        );

        it("should return a different fixture object", () => {
          expect(firstCall === secondCall).toBe(false);
        });

        it("should recompute the selector", () => {
          expect(getTennisScoreboardByURN.recomputations()).toEqual(2);
        });
      });
    });
  });
});
