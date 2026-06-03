import { BasketballPeriod } from "./BasketballFixture";
import { createBasketballFixtureByURNSelector, isBasketballMatchInplay } from "./basketball-fixture-selectors";

jest.mock("../../../helpers/fixture", () => ({
  getOpponentsNames: jest.fn(() => ({
    teamA: "mocked home team",
    teamB: "mocked away team",
  })),
}));

const URN = "ppb:basketballfixture:29605500";

const FIXTURE_MOCK = {
  isAmericanFormat: false,
  runnerNames: {
    home: "home team",
    away: "away team",
  },
  score: {
    home: 95,
    away: 77,
  },
  clock: {
    period: "PERIOD_1",
    segment: "Q1",
    timeElapsed: 563,
    timeRemaining: 37,
  },
  periodScores: [
    {
      score: {
        home: 21,
        away: 16,
      },
      period: "PERIOD_1",
    },
  ],
};

const STATE_MOCK = {
  entities: {
    basketballfixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

describe('"basketballFixtures" selectors', () => {
  describe("getBasketballFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getBasketballFixtureByURN = createBasketballFixtureByURNSelector();
      const fixture = getBasketballFixtureByURN(STATE_MOCK.entities.basketballfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing basketball fixture", () => {
      const getBasketballFixtureByURN = createBasketballFixtureByURNSelector();
      const fixture = getBasketballFixtureByURN(STATE_MOCK.entities.basketballfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.basketballfixtures[URN],
        opponentsNames: {
          teamA: "mocked home team",
          teamB: "mocked away team",
        },
        fixtureStatus: "IN_PLAY",
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createBasketballFixtureByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getBasketballFixtureByURN1 = createBasketballFixtureByURNSelector();
        const getBasketballFixtureByURN2 = createBasketballFixtureByURNSelector();

        expect(getBasketballFixtureByURN1).not.toEqual(getBasketballFixtureByURN2);
      });
    });

    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createBasketballFixtureByURNSelector()(
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
      it("must return the respective basketball fixture", () => {
        const result = createBasketballFixtureByURNSelector()(STATE_MOCK.entities.basketballfixtures, URN);

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
        const getBasketballFixtureByURN = createBasketballFixtureByURNSelector();

        const firstCall = getBasketballFixtureByURN(STATE_MOCK.entities.basketballfixtures, URN);
        const secondCall = getBasketballFixtureByURN(
          { ...STATE_MOCK.entities.basketballfixtures, newProp: "newData" },
          URN,
        );

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getBasketballFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getBasketballFixtureByURN = createBasketballFixtureByURNSelector();

        const firstCall = getBasketballFixtureByURN(STATE_MOCK.entities.basketballfixtures, URN);
        const secondCall = getBasketballFixtureByURN(
          {
            URN: {
              ...FIXTURE_MOCK,
              score: {
                home: 22,
                away: 16,
              },
            },
          },
          URN,
        );

        it("should return a different fixture object", () => {
          expect(firstCall === secondCall).toBe(false);
        });

        it("should recompute the selector", () => {
          expect(getBasketballFixtureByURN.recomputations()).toEqual(2);
        });
      });
    });
  });

  describe("isBasketballMatchInplay", () => {
    describe("when the clock is not defined", () => {
      it("should return false", () => {
        const result = isBasketballMatchInplay({ ...FIXTURE_MOCK, clock: undefined });

        expect(result).toEqual(false);
      });
    });

    describe("when the period is not defined", () => {
      it("should return false", () => {
        const result = isBasketballMatchInplay({ ...FIXTURE_MOCK, clock: { period: undefined } });

        expect(result).toEqual(false);
      });
    });

    describe("when the period is BasketballPeriod.PERIOD_1", () => {
      it("should return true", () => {
        const result = isBasketballMatchInplay({ ...FIXTURE_MOCK, clock: { period: BasketballPeriod.PERIOD_1 } });

        expect(result).toEqual(true);
      });
    });
    describe("when the period is BasketballPeriod.END_PERIOD_1", () => {
      it("should return true", () => {
        const result = isBasketballMatchInplay({ ...FIXTURE_MOCK, clock: { period: BasketballPeriod.END_PERIOD_1 } });

        expect(result).toEqual(true);
      });
    });
    describe("when the period is BasketballPeriod.OVERTIME", () => {
      it("should return true", () => {
        const result = isBasketballMatchInplay({ ...FIXTURE_MOCK, clock: { period: BasketballPeriod.OVERTIME } });

        expect(result).toEqual(true);
      });
    });
    describe("when the period is BasketballPeriod.END_OVERTIME", () => {
      it("should return true", () => {
        const result = isBasketballMatchInplay({ ...FIXTURE_MOCK, clock: { period: BasketballPeriod.END_OVERTIME } });

        expect(result).toEqual(true);
      });
    });
    describe("when the period is BasketballPeriod.END", () => {
      it("should return false", () => {
        const result = isBasketballMatchInplay({ ...FIXTURE_MOCK, clock: { period: BasketballPeriod.END } });

        expect(result).toEqual(false);
      });
    });
    describe("when the period is BasketballPeriod.UNKNOWN_PERIOD", () => {
      it("should return false", () => {
        const result = isBasketballMatchInplay({
          ...FIXTURE_MOCK,
          clock: { period: BasketballPeriod.UNKNOWN_PERIOD },
        });

        expect(result).toEqual(false);
      });
    });

    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getBasketballFixtureByURN = createBasketballFixtureByURNSelector();
      const fixture = getBasketballFixtureByURN(STATE_MOCK.entities.basketballfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing basketball fixture", () => {
      const getBasketballFixtureByURN = createBasketballFixtureByURNSelector();
      const fixture = getBasketballFixtureByURN(STATE_MOCK.entities.basketballfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.basketballfixtures[URN],
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
