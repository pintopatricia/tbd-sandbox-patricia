import { createDartsFixtureByURNSelector, isDartsMatchInplay } from "./darts-fixture-selectors";

jest.mock("../../../helpers/fixture", () => ({
  getOpponentsNames: jest.fn(() => ({
    teamA: "mocked player A",
    teamB: "mocked player B",
  })),
}));

const URN = "ppb:dartsfixture:29605500";

const FIXTURE_MOCK = {
  typename: "DartsFixture",
  isAmericanFormat: false,
  runnerNames: {
    home: "Player A",
    away: "Player B",
  },
  id: "29605500",
  type: "LEGS",
  score: {
    home: 3,
    away: 2,
  },
};

const STATE_MOCK = {
  entities: {
    dartsfixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

describe('"DartsFixtures" selectors', () => {
  describe("getDartsFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getDartsFixtureByURN = createDartsFixtureByURNSelector();
      const fixture = getDartsFixtureByURN(STATE_MOCK.entities.dartsfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing Darts fixture", () => {
      const getDartsFixtureByURN = createDartsFixtureByURNSelector();
      const fixture = getDartsFixtureByURN(STATE_MOCK.entities.dartsfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.dartsfixtures[URN],
        opponentsNames: {
          teamA: "mocked player A",
          teamB: "mocked player B",
        },
        fixtureStatus: "IN_PLAY",
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createDartsFixtureByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getDartsFixtureByURN1 = createDartsFixtureByURNSelector();
        const getDartsFixtureByURN2 = createDartsFixtureByURNSelector();

        expect(getDartsFixtureByURN1).not.toEqual(getDartsFixtureByURN2);
      });
    });

    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createDartsFixtureByURNSelector()(
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
      it("must return the respective Darts fixture", () => {
        const result = createDartsFixtureByURNSelector()(STATE_MOCK.entities.dartsfixtures, URN);

        expect(result).toEqual({
          ...FIXTURE_MOCK,
          opponentsNames: {
            teamA: "mocked player A",
            teamB: "mocked player B",
          },
          fixtureStatus: "IN_PLAY",
        });
      });

      describe("when the selector is called again and fixture relevant data didn't change", () => {
        const getDartsFixtureByURN = createDartsFixtureByURNSelector();

        const firstCall = getDartsFixtureByURN(STATE_MOCK.entities.dartsfixtures, URN);
        const secondCall = getDartsFixtureByURN({ ...STATE_MOCK.entities.dartsfixtures, newProp: "newData" }, URN);

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getDartsFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getDartsFixtureByURN = createDartsFixtureByURNSelector();

        const firstCall = getDartsFixtureByURN(STATE_MOCK.entities.dartsfixtures, URN);
        const secondCall = getDartsFixtureByURN(
          {
            [URN]: {
              ...FIXTURE_MOCK,
              score: {
                home: 4,
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
          expect(getDartsFixtureByURN.recomputations()).toEqual(2);
        });
      });
    });
  });

  describe("isDartsMatchInplay", () => {
    describe("when score is not defined", () => {
      it("should return false", () => {
        const result = isDartsMatchInplay({ ...FIXTURE_MOCK, score: undefined });

        expect(result).toEqual(false);
      });
    });

    describe("when score is defined", () => {
      it("should return true", () => {
        const result = isDartsMatchInplay({ ...FIXTURE_MOCK, score: { home: 0, away: 0 } });

        expect(result).toEqual(true);
      });
    });
  });
});
