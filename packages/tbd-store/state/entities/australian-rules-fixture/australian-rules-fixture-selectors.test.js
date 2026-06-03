import { AustralianRulesPeriod } from "./AustralianRulesFixture.types";
import {
  createAustralianRulesFixtureByURNSelector,
  isAustralianRulesMatchInplay,
} from "./australian-rules-fixture-selectors";

jest.mock("../../../helpers/fixture", () => ({
  getOpponentsNames: jest.fn(() => ({
    teamA: "mocked home team",
    teamB: "mocked away team",
  })),
}));

const URN = "ppb:australianrulesfixture:29605500";

const FIXTURE_MOCK = {
  isAmericanFormat: false,
  runnerNames: {
    home: "home team",
    away: "away team",
  },
  score: {
    goals: {
      home: 4,
      away: 3,
    },
    behinds: {
      home: 1,
      away: 0,
    },
    point: {
      home: 10,
      away: 8,
    },
  },
  periodScores: [
    {
      score: {
        goals: {
          home: 4,
          away: 3,
        },
        behinds: {
          home: 1,
          away: 0,
        },
        point: {
          home: 10,
          away: 8,
        },
      },
      period: "PERIOD_1",
    },
  ],
};

const STATE_MOCK = {
  entities: {
    australianrulesfixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

describe('"australianRulesFixtures" selectors', () => {
  describe("getAustralianRulesFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getAustralianRulesFixtureByURN = createAustralianRulesFixtureByURNSelector();
      const fixture = getAustralianRulesFixtureByURN(STATE_MOCK.entities.australianrulesfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing australianrules fixture", () => {
      const getAustralianRulesFixtureByURN = createAustralianRulesFixtureByURNSelector();
      const fixture = getAustralianRulesFixtureByURN(STATE_MOCK.entities.australianrulesfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.australianrulesfixtures[URN],
        opponentsNames: {
          teamA: "mocked home team",
          teamB: "mocked away team",
        },
        fixtureStatus: "IN_PLAY",
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createAustralianRulesFixtureByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getAustralianRulesFixtureByURN1 = createAustralianRulesFixtureByURNSelector();
        const getAustralianRulesFixtureByURN2 = createAustralianRulesFixtureByURNSelector();

        expect(getAustralianRulesFixtureByURN1).not.toEqual(getAustralianRulesFixtureByURN2);
      });
    });

    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createAustralianRulesFixtureByURNSelector()(
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
      it("must return the respective australianrules fixture", () => {
        const result = createAustralianRulesFixtureByURNSelector()(STATE_MOCK.entities.australianrulesfixtures, URN);

        expect(result).toEqual({
          ...FIXTURE_MOCK,
          opponentsNames: {
            teamA: "mocked home team",
            teamB: "mocked away team",
          },
          fixtureStatus: "IN_PLAY",
        });
      });

      describe("when the selector is called again and fixture relevant data didn't change", () => {
        const getAustralianRulesFixtureByURN = createAustralianRulesFixtureByURNSelector();

        const firstCall = getAustralianRulesFixtureByURN(STATE_MOCK.entities.australianrulesfixtures, URN);
        const secondCall = getAustralianRulesFixtureByURN(
          { ...STATE_MOCK.entities.australianrulesfixtures, newProp: "newData" },
          URN,
        );

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getAustralianRulesFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getAustralianRulesFixtureByURN = createAustralianRulesFixtureByURNSelector();

        const firstCall = getAustralianRulesFixtureByURN(STATE_MOCK.entities.australianrulesfixtures, URN);
        const secondCall = getAustralianRulesFixtureByURN(
          {
            URN: {
              ...FIXTURE_MOCK,
              score: {
                goals: {
                  home: 7,
                  away: 7,
                },
                behinds: {
                  home: 3,
                  away: 0,
                },
                point: {
                  home: 1,
                  away: 1,
                },
              },
            },
          },
          URN,
        );

        it("should return a different fixture object", () => {
          expect(firstCall === secondCall).toBe(false);
        });

        it("should recompute the selector", () => {
          expect(getAustralianRulesFixtureByURN.recomputations()).toEqual(2);
        });
      });
    });
  });

  describe("isAustralianRulesMatchInplay", () => {
    describe("when there is score", () => {
      it("should return true", () => {
        const result = isAustralianRulesMatchInplay({
          ...FIXTURE_MOCK,
        });

        expect(result).toEqual(true);
      });
    });

    describe("when there is no score", () => {
      describe("and score is null", () => {
        it("should return false", () => {
          const result = isAustralianRulesMatchInplay({
            ...FIXTURE_MOCK,
            score: null,
          });

          expect(result).toEqual(false);
        });
      });

      describe("and score is empty", () => {
        it("should return false", () => {
          const result = isAustralianRulesMatchInplay({
            ...FIXTURE_MOCK,
            score: {},
          });

          expect(result).toEqual(false);
        });
      });
    });

    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getAustralianRulesFixtureByURN = createAustralianRulesFixtureByURNSelector();
      const fixture = getAustralianRulesFixtureByURN(STATE_MOCK.entities.australianrulesfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing australianrules fixture", () => {
      const getAustralianRulesFixtureByURN = createAustralianRulesFixtureByURNSelector();
      const fixture = getAustralianRulesFixtureByURN(STATE_MOCK.entities.australianrulesfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.australianrulesfixtures[URN],
        opponentsNames: {
          teamA: "mocked home team",
          teamB: "mocked away team",
        },
        fixtureStatus: "IN_PLAY",
      };

      expect(fixture).toEqual(expectedResult);
    });
  });
});
