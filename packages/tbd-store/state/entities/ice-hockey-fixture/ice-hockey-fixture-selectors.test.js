import { IceHockeyPeriod } from "./IceHockeyFixture";
import { createIceHockeyFixtureByURNSelector, isIceHockeyMatchInplay } from "./ice-hockey-fixture-selectors";

jest.mock("../../../helpers/fixture", () => ({
  getOpponentsNames: jest.fn(() => ({
    teamA: "mocked home team",
    teamB: "mocked away team",
  })),
}));

const URN = "ppb:icehockeyfixture:29605500";

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
    icehockeyfixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

describe('"IceHockeyFixtures" selectors', () => {
  describe("getIceHockeyFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getIceHockeyFixtureByURN = createIceHockeyFixtureByURNSelector();
      const fixture = getIceHockeyFixtureByURN(STATE_MOCK.entities.icehockeyfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing IceHockey fixture", () => {
      const getIceHockeyFixtureByURN = createIceHockeyFixtureByURNSelector();
      const fixture = getIceHockeyFixtureByURN(STATE_MOCK.entities.icehockeyfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.icehockeyfixtures[URN],
        opponentsNames: {
          teamA: "mocked home team",
          teamB: "mocked away team",
        },
        fixtureStatus: "IN_PLAY",
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createIceHockeyFixtureByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getIceHockeyFixtureByURN1 = createIceHockeyFixtureByURNSelector();
        const getIceHockeyFixtureByURN2 = createIceHockeyFixtureByURNSelector();

        expect(getIceHockeyFixtureByURN1).not.toEqual(getIceHockeyFixtureByURN2);
      });
    });

    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createIceHockeyFixtureByURNSelector()(
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
      it("must return the respective IceHockey fixture", () => {
        const result = createIceHockeyFixtureByURNSelector()(STATE_MOCK.entities.icehockeyfixtures, URN);

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
        const getIceHockeyFixtureByURN = createIceHockeyFixtureByURNSelector();

        const firstCall = getIceHockeyFixtureByURN(STATE_MOCK.entities.icehockeyfixtures, URN);
        const secondCall = getIceHockeyFixtureByURN(
          { ...STATE_MOCK.entities.icehockeyfixtures, newProp: "newData" },
          URN,
        );

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getIceHockeyFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getIceHockeyFixtureByURN = createIceHockeyFixtureByURNSelector();

        const firstCall = getIceHockeyFixtureByURN(STATE_MOCK.entities.icehockeyfixtures, URN);
        const secondCall = getIceHockeyFixtureByURN(
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
          expect(getIceHockeyFixtureByURN.recomputations()).toEqual(2);
        });
      });
    });
  });

  describe("isIceHockeyMatchInplay", () => {
    describe("when the clock is not defined", () => {
      it("should return false", () => {
        const result = isIceHockeyMatchInplay({ ...FIXTURE_MOCK, clock: undefined });

        expect(result).toEqual(false);
      });
    });

    describe("when the period is not defined", () => {
      it("should return false", () => {
        const result = isIceHockeyMatchInplay({ ...FIXTURE_MOCK, clock: { period: undefined } });

        expect(result).toEqual(false);
      });
    });

    describe("when the period is IceHockeyPeriod.PERIOD_1", () => {
      it("should return true", () => {
        const result = isIceHockeyMatchInplay({ ...FIXTURE_MOCK, clock: { period: IceHockeyPeriod.PERIOD_1 } });

        expect(result).toEqual(true);
      });
    });
    describe("when the period is IceHockeyPeriod.END_PERIOD_1", () => {
      it("should return true", () => {
        const result = isIceHockeyMatchInplay({ ...FIXTURE_MOCK, clock: { period: IceHockeyPeriod.END_PERIOD_1 } });

        expect(result).toEqual(true);
      });
    });
    describe("when the period is IceHockeyPeriod.PENALTIES", () => {
      it("should return true", () => {
        const result = isIceHockeyMatchInplay({ ...FIXTURE_MOCK, clock: { period: IceHockeyPeriod.PENALTIES } });

        expect(result).toEqual(true);
      });
    });
    describe("when the period is IceHockeyPeriod.OVERTIME", () => {
      it("should return true", () => {
        const result = isIceHockeyMatchInplay({ ...FIXTURE_MOCK, clock: { period: IceHockeyPeriod.OVERTIME } });

        expect(result).toEqual(true);
      });
    });
    describe("when the period is IceHockeyPeriod.END_OVERTIME", () => {
      it("should return true", () => {
        const result = isIceHockeyMatchInplay({ ...FIXTURE_MOCK, clock: { period: IceHockeyPeriod.END_OVERTIME } });

        expect(result).toEqual(true);
      });
    });
    describe("when the period is IceHockeyPeriod.END", () => {
      it("should return false", () => {
        const result = isIceHockeyMatchInplay({ ...FIXTURE_MOCK, clock: { period: IceHockeyPeriod.END } });

        expect(result).toEqual(false);
      });
    });

    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getIceHockeyFixtureByURN = createIceHockeyFixtureByURNSelector();
      const fixture = getIceHockeyFixtureByURN(STATE_MOCK.entities.icehockeyfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing IceHockey fixture", () => {
      const getIceHockeyFixtureByURN = createIceHockeyFixtureByURNSelector();
      const fixture = getIceHockeyFixtureByURN(STATE_MOCK.entities.icehockeyfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.icehockeyfixtures[URN],
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
