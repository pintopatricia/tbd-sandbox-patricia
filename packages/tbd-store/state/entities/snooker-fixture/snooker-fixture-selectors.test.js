import { createSnookerFixtureByURNSelector } from "./snooker-fixture-selectors";

jest.mock("../../../helpers/fixture", () => ({
  getOpponentsNames: jest.fn(() => ({
    teamA: "mocked home team",
    teamB: "mocked away team",
  })),
}));

const URN = "ppb:snookerfixture:29605500";

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
};

const STATE_MOCK = {
  entities: {
    snookerfixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

describe('"SnookerFixtures" selectors', () => {
  describe("getSnookerFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getSnookerFixtureByURN = createSnookerFixtureByURNSelector();
      const fixture = getSnookerFixtureByURN(STATE_MOCK.entities.snookerfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing Snooker fixture", () => {
      const getSnookerFixtureByURN = createSnookerFixtureByURNSelector();
      const fixture = getSnookerFixtureByURN(STATE_MOCK.entities.snookerfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.snookerfixtures[URN],
        opponentsNames: {
          teamA: "mocked home team",
          teamB: "mocked away team",
        },
        fixtureStatus: "IN_PLAY",
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createSnookerFixtureByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getSnookerFixtureByURN1 = createSnookerFixtureByURNSelector();
        const getSnookerFixtureByURN2 = createSnookerFixtureByURNSelector();

        expect(getSnookerFixtureByURN1).not.toEqual(getSnookerFixtureByURN2);
      });
    });

    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createSnookerFixtureByURNSelector()(
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
      it("must return the respective Snooker fixture", () => {
        const result = createSnookerFixtureByURNSelector()(STATE_MOCK.entities.snookerfixtures, URN);

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
        const getSnookerFixtureByURN = createSnookerFixtureByURNSelector();

        const firstCall = getSnookerFixtureByURN(STATE_MOCK.entities.snookerfixtures, URN);
        const secondCall = getSnookerFixtureByURN({ ...STATE_MOCK.entities.snookerfixtures, newProp: "newData" }, URN);

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getSnookerFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getSnookerFixtureByURN = createSnookerFixtureByURNSelector();

        const firstCall = getSnookerFixtureByURN(STATE_MOCK.entities.snookerfixtures, URN);
        const secondCall = getSnookerFixtureByURN(
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
          expect(getSnookerFixtureByURN.recomputations()).toEqual(2);
        });
      });

      it("when there is no score", () => {
        const getSnookerFixtureByURN = createSnookerFixtureByURNSelector();
        const result = getSnookerFixtureByURN(
          {
            ...STATE_MOCK.entities.snookerfixtures,
            [URN]: { ...STATE_MOCK.entities.snookerfixtures[URN], score: null },
          },
          URN,
        );
        const expectedResult = {
          ...STATE_MOCK.entities.snookerfixtures[URN],
          opponentsNames: {
            teamA: "mocked home team",
            teamB: "mocked away team",
          },
          score: null,
          fixtureStatus: "PRE_MATCH",
        };

        expect(result).toEqual(expectedResult);
      });
    });
  });
});
