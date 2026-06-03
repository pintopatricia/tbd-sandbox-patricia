import { createRugbyUnionFixtureByURNSelector } from "./rugby-union-fixture-selectors";

jest.mock("../../../helpers/fixture", () => ({
  getOpponentsNames: jest.fn(() => ({
    teamA: "mocked home team",
    teamB: "mocked away team",
  })),
}));

const URN = "ppb:rugbyunionfixture:29605500";

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
  halfTimeScore: {
    home: 0,
    away: 0,
  },
};

const STATE_MOCK = {
  entities: {
    rugbyunionfixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

describe('"rugbyunionFixtures" selectors', () => {
  describe("getRugbyUnionFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getRugbyUnionFixtureByURN = createRugbyUnionFixtureByURNSelector();
      const fixture = getRugbyUnionFixtureByURN(STATE_MOCK.entities.rugbyunionfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing rugbyunion fixture", () => {
      const getRugbyUnionFixtureByURN = createRugbyUnionFixtureByURNSelector();
      const fixture = getRugbyUnionFixtureByURN(STATE_MOCK.entities.rugbyunionfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.rugbyunionfixtures[URN],
        opponentsNames: {
          teamA: "mocked home team",
          teamB: "mocked away team",
        },
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createRugbyUnionFixtureByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getRugbyUnionFixtureByURN1 = createRugbyUnionFixtureByURNSelector();
        const getRugbyUnionFixtureByURN2 = createRugbyUnionFixtureByURNSelector();

        expect(getRugbyUnionFixtureByURN1).not.toEqual(getRugbyUnionFixtureByURN2);
      });
    });

    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createRugbyUnionFixtureByURNSelector()(
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
      it("must return the respective rugbyunion fixture", () => {
        const result = createRugbyUnionFixtureByURNSelector()(STATE_MOCK.entities.rugbyunionfixtures, URN);

        expect(result).toEqual({
          ...FIXTURE_MOCK,
          opponentsNames: {
            teamA: "mocked home team",
            teamB: "mocked away team",
          },
        });
      });

      describe("when the selector is called again and fixture relevant data didn't change", () => {
        const getRugbyUnionFixtureByURN = createRugbyUnionFixtureByURNSelector();

        const firstCall = getRugbyUnionFixtureByURN(STATE_MOCK.entities.rugbyunionfixtures, URN);
        const secondCall = getRugbyUnionFixtureByURN(
          { ...STATE_MOCK.entities.rugbyunionfixtures, newProp: "newData" },
          URN,
        );

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getRugbyUnionFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getRugbyUnionFixtureByURN = createRugbyUnionFixtureByURNSelector();

        const firstCall = getRugbyUnionFixtureByURN(STATE_MOCK.entities.rugbyunionfixtures, URN);
        const secondCall = getRugbyUnionFixtureByURN(
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
          expect(getRugbyUnionFixtureByURN.recomputations()).toEqual(2);
        });
      });
    });
  });

  describe("isRugbyUnionMatchInplay", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getRugbyUnionFixtureByURN = createRugbyUnionFixtureByURNSelector();
      const fixture = getRugbyUnionFixtureByURN(STATE_MOCK.entities.rugbyunionfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing rugbyunion fixture", () => {
      const getRugbyUnionFixtureByURN = createRugbyUnionFixtureByURNSelector();
      const fixture = getRugbyUnionFixtureByURN(STATE_MOCK.entities.rugbyunionfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.rugbyunionfixtures[URN],
        opponentsNames: {
          teamA: "mocked home team",
          teamB: "mocked away team",
        },
      };

      expect(fixture).toEqual(expectedResult);
    });
  });
});
