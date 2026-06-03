import { BaseballPeriod } from "./BaseballFixture";
import { createBaseballFixtureByURNSelector, isBaseballMatchInplay } from "./baseball-fixture-selectors";

jest.mock("../../../helpers/fixture", () => ({
  getOpponentsNames: jest.fn(() => ({
    teamA: "mocked home team",
    teamB: "mocked away team",
  })),
}));

const URN = "ppb:baseballfixture:123456";

const FIXTURE_MOCK = {
  isAmericanFormat: false,
  runnerNames: {
    home: "home team",
    away: "away team",
  },
  score: {
    home: 5,
    away: 2,
  },
  clock: {
    period: "INNING_4",
  },
  scorePerInning: [
    {
      score: {
        home: 1,
        away: 0,
      },
      period: "INNING_1",
    },
  ],
};

const STATE_MOCK = {
  entities: {
    baseballfixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

describe('"BaseballFixtures" selectors', () => {
  describe("getBaseballFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getBaseballFixtureByURN = createBaseballFixtureByURNSelector();
      const fixture = getBaseballFixtureByURN(STATE_MOCK.entities.baseballfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing Baseball fixture", () => {
      const getBaseballFixtureByURN = createBaseballFixtureByURNSelector();
      const fixture = getBaseballFixtureByURN(STATE_MOCK.entities.baseballfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.baseballfixtures[URN],
        opponentsNames: {
          teamA: "mocked home team",
          teamB: "mocked away team",
        },
        fixtureStatus: "IN_PLAY",
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createBaseballFixtureByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getBaseballFixtureByURN1 = createBaseballFixtureByURNSelector();
        const getBaseballFixtureByURN2 = createBaseballFixtureByURNSelector();

        expect(getBaseballFixtureByURN1).not.toEqual(getBaseballFixtureByURN2);
      });
    });

    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createBaseballFixtureByURNSelector()(
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
      it("must return the respective Baseball fixture", () => {
        const result = createBaseballFixtureByURNSelector()(STATE_MOCK.entities.baseballfixtures, URN);

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
        const getBaseballFixtureByURN = createBaseballFixtureByURNSelector();

        const firstCall = getBaseballFixtureByURN(STATE_MOCK.entities.baseballfixtures, URN);
        const secondCall = getBaseballFixtureByURN(
          { ...STATE_MOCK.entities.baseballfixtures, newProp: "newData" },
          URN,
        );

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getBaseballFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getBaseballFixtureByURN = createBaseballFixtureByURNSelector();

        const firstCall = getBaseballFixtureByURN(STATE_MOCK.entities.baseballfixtures, URN);
        const secondCall = getBaseballFixtureByURN(
          {
            [URN]: {
              ...FIXTURE_MOCK,
              score: {
                home: 6,
                away: 2,
              },
            },
          },
          URN,
        );

        it("should return a different fixture object", () => {
          expect(firstCall === secondCall).toBe(false);
        });

        it("should recompute the selector", () => {
          expect(getBaseballFixtureByURN.recomputations()).toEqual(2);
        });
      });
    });
  });

  describe("isBaseballMatchInplay", () => {
    describe("when the clock is not defined", () => {
      it("should return false", () => {
        const result = isBaseballMatchInplay({ ...FIXTURE_MOCK, clock: undefined });

        expect(result).toEqual(false);
      });
    });

    describe("when the period is not defined", () => {
      it("should return false", () => {
        const result = isBaseballMatchInplay({ ...FIXTURE_MOCK, clock: { period: undefined } });

        expect(result).toEqual(false);
      });
    });

    describe("when the period is BaseballPeriod.INNING_1", () => {
      it("should return true", () => {
        const result = isBaseballMatchInplay({ ...FIXTURE_MOCK, clock: { period: BaseballPeriod.INNING_1 } });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is BaseballPeriod.INNING_9", () => {
      it("should return true", () => {
        const result = isBaseballMatchInplay({ ...FIXTURE_MOCK, clock: { period: BaseballPeriod.INNING_9 } });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is BaseballPeriod.EXTRA_INNINGS", () => {
      it("should return true", () => {
        const result = isBaseballMatchInplay({ ...FIXTURE_MOCK, clock: { period: BaseballPeriod.EXTRA_INNINGS } });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is BaseballPeriod.END", () => {
      it("should return false", () => {
        const result = isBaseballMatchInplay({ ...FIXTURE_MOCK, clock: { period: BaseballPeriod.END } });

        expect(result).toEqual(false);
      });
    });

    describe("when the period is BaseballPeriod.PRE_MATCH", () => {
      it("should return false", () => {
        const result = isBaseballMatchInplay({ ...FIXTURE_MOCK, clock: { period: BaseballPeriod.PRE_MATCH } });

        expect(result).toEqual(false);
      });
    });
  });
});
