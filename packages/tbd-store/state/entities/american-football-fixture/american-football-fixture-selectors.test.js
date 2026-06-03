import { AmericanFootballPeriod } from "./AmericanFootballFixture";
import {
  createAmericanFootballFixtureByURNSelector,
  isAmericanFootballMatchInplay,
} from "./american-football-fixture-selectors";

jest.mock("../../../helpers/fixture", () => ({
  getOpponentsNames: jest.fn(() => ({
    teamA: "mocked home team",
    teamB: "mocked away team",
  })),
}));

const URN = "ppb:americanfootballfixture:29605500";

const FIXTURE_MOCK = {
  isAmericanFormat: false,
  runnerNames: {
    home: "home team",
    away: "away team",
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
};

const STATE_MOCK = {
  entities: {
    americanfootballfixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

describe('"AmericanFootballFixtures" selectors', () => {
  describe("getAmericanFootballFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getAmericanFootballFixtureByURN = createAmericanFootballFixtureByURNSelector();
      const fixture = getAmericanFootballFixtureByURN(
        STATE_MOCK.entities.americanfootballfixtures,
        "RANDOM_URN",
      );
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing AmericanFootball fixture", () => {
      const getAmericanFootballFixtureByURN = createAmericanFootballFixtureByURNSelector();
      const fixture = getAmericanFootballFixtureByURN(STATE_MOCK.entities.americanfootballfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.americanfootballfixtures[URN],
        opponentsNames: {
          teamA: "mocked home team",
          teamB: "mocked away team",
        },
        fixtureStatus: "IN_PLAY",
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createAmericanFootballFixtureByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getAmericanFootballFixtureByURN1 = createAmericanFootballFixtureByURNSelector();
        const getAmericanFootballFixtureByURN2 = createAmericanFootballFixtureByURNSelector();

        expect(getAmericanFootballFixtureByURN1).not.toEqual(getAmericanFootballFixtureByURN2);
      });
    });

    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createAmericanFootballFixtureByURNSelector()(
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
      it("must return the respective AmericanFootball fixture", () => {
        const result = createAmericanFootballFixtureByURNSelector()(
          STATE_MOCK.entities.americanfootballfixtures,
          URN,
        );

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
        const getAmericanFootballFixtureByURN = createAmericanFootballFixtureByURNSelector();

        const firstCall = getAmericanFootballFixtureByURN(STATE_MOCK.entities.americanfootballfixtures, URN);
        const secondCall = getAmericanFootballFixtureByURN(
          { ...STATE_MOCK.entities.americanfootballfixtures, newProp: "newData" },
          URN,
        );

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getAmericanFootballFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getAmericanFootballFixtureByURN = createAmericanFootballFixtureByURNSelector();

        const firstCall = getAmericanFootballFixtureByURN(STATE_MOCK.entities.americanfootballfixtures, URN);
        const secondCall = getAmericanFootballFixtureByURN(
          {
            URN: {
              ...FIXTURE_MOCK,
              score: {
                home: 28,
                away: 21,
              },
            },
          },
          URN,
        );

        it("should return a different fixture object", () => {
          expect(firstCall === secondCall).toBe(false);
        });

        it("should recompute the selector", () => {
          expect(getAmericanFootballFixtureByURN.recomputations()).toEqual(2);
        });
      });
    });
  });

  describe("isAmericanFootballMatchInplay", () => {
    describe("when the clock is not defined", () => {
      it("should return false", () => {
        const result = isAmericanFootballMatchInplay({ ...FIXTURE_MOCK, clock: undefined });

        expect(result).toEqual(false);
      });
    });

    describe("when the period is not defined", () => {
      it("should return false", () => {
        const result = isAmericanFootballMatchInplay({ ...FIXTURE_MOCK, clock: { period: undefined } });

        expect(result).toEqual(false);
      });
    });

    describe("when the period is AmericanFootballPeriod.PERIOD_1", () => {
      it("should return true", () => {
        const result = isAmericanFootballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: AmericanFootballPeriod.PERIOD_1 },
        });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is AmericanFootballPeriod.END_PERIOD_1", () => {
      it("should return true", () => {
        const result = isAmericanFootballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: AmericanFootballPeriod.END_PERIOD_1 },
        });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is AmericanFootballPeriod.PERIOD_2", () => {
      it("should return true", () => {
        const result = isAmericanFootballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: AmericanFootballPeriod.PERIOD_2 },
        });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is AmericanFootballPeriod.END_PERIOD_2", () => {
      it("should return true", () => {
        const result = isAmericanFootballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: AmericanFootballPeriod.END_PERIOD_2 },
        });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is AmericanFootballPeriod.PERIOD_3", () => {
      it("should return true", () => {
        const result = isAmericanFootballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: AmericanFootballPeriod.PERIOD_3 },
        });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is AmericanFootballPeriod.END_PERIOD_3", () => {
      it("should return true", () => {
        const result = isAmericanFootballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: AmericanFootballPeriod.END_PERIOD_3 },
        });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is AmericanFootballPeriod.PERIOD_4", () => {
      it("should return true", () => {
        const result = isAmericanFootballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: AmericanFootballPeriod.PERIOD_4 },
        });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is AmericanFootballPeriod.END_PERIOD_4", () => {
      it("should return true", () => {
        const result = isAmericanFootballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: AmericanFootballPeriod.END_PERIOD_4 },
        });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is AmericanFootballPeriod.OVERTIME", () => {
      it("should return true", () => {
        const result = isAmericanFootballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: AmericanFootballPeriod.OVERTIME },
        });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is AmericanFootballPeriod.END_OVERTIME", () => {
      it("should return true", () => {
        const result = isAmericanFootballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: AmericanFootballPeriod.END_OVERTIME },
        });

        expect(result).toEqual(true);
      });
    });

    describe("when the period is AmericanFootballPeriod.END", () => {
      it("should return false", () => {
        const result = isAmericanFootballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: AmericanFootballPeriod.END },
        });

        expect(result).toEqual(false);
      });
    });

    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getAmericanFootballFixtureByURN = createAmericanFootballFixtureByURNSelector();
      const fixture = getAmericanFootballFixtureByURN(
        STATE_MOCK.entities.americanfootballfixtures,
        "RANDOM_URN",
      );
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing AmericanFootball fixture", () => {
      const getAmericanFootballFixtureByURN = createAmericanFootballFixtureByURNSelector();
      const fixture = getAmericanFootballFixtureByURN(STATE_MOCK.entities.americanfootballfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.americanfootballfixtures[URN],
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

