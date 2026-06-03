import { createRugbyLeagueFixtureByURNSelector } from "./rugby-league-fixture-selectors";

jest.mock("../../../helpers/fixture", () => ({
  getOpponentsNames: jest.fn(() => ({
    teamA: "mocked home team",
    teamB: "mocked away team",
  })),
}));

const URN = "ppb:rugbyleaguefixture:29605500";

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
    rugbyleaguefixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

describe('"rugbyleagueFixtures" selectors', () => {
  describe("getRugbyLeagueFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getRugbyLeagueFixtureByURN = createRugbyLeagueFixtureByURNSelector();
      const fixture = getRugbyLeagueFixtureByURN(STATE_MOCK.entities.rugbyleaguefixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing rugbyleague fixture", () => {
      const getRugbyLeagueFixtureByURN = createRugbyLeagueFixtureByURNSelector();
      const fixture = getRugbyLeagueFixtureByURN(STATE_MOCK.entities.rugbyleaguefixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.rugbyleaguefixtures[URN],
        opponentsNames: {
          teamA: "mocked home team",
          teamB: "mocked away team",
        },
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createRugbyLeagueFixtureByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getRugbyLeagueFixtureByURN1 = createRugbyLeagueFixtureByURNSelector();
        const getRugbyLeagueFixtureByURN2 = createRugbyLeagueFixtureByURNSelector();

        expect(getRugbyLeagueFixtureByURN1).not.toEqual(getRugbyLeagueFixtureByURN2);
      });
    });

    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createRugbyLeagueFixtureByURNSelector()(
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
      it("must return the respective rugbyleague fixture", () => {
        const result = createRugbyLeagueFixtureByURNSelector()(STATE_MOCK.entities.rugbyleaguefixtures, URN);

        expect(result).toEqual({
          ...FIXTURE_MOCK,
          opponentsNames: {
            teamA: "mocked home team",
            teamB: "mocked away team",
          },
        });
      });

      describe("when the selector is called again and fixture relevant data didn't change", () => {
        const getRugbyLeagueFixtureByURN = createRugbyLeagueFixtureByURNSelector();

        const firstCall = getRugbyLeagueFixtureByURN(STATE_MOCK.entities.rugbyleaguefixtures, URN);
        const secondCall = getRugbyLeagueFixtureByURN(
          { ...STATE_MOCK.entities.rugbyleaguefixtures, newProp: "newData" },
          URN,
        );

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getRugbyLeagueFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getRugbyLeagueFixtureByURN = createRugbyLeagueFixtureByURNSelector();

        const firstCall = getRugbyLeagueFixtureByURN(STATE_MOCK.entities.rugbyleaguefixtures, URN);
        const secondCall = getRugbyLeagueFixtureByURN(
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
          expect(getRugbyLeagueFixtureByURN.recomputations()).toEqual(2);
        });
      });
    });
  });

  describe("isRugbyLeagueMatchInplay", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getRugbyLeagueFixtureByURN = createRugbyLeagueFixtureByURNSelector();
      const fixture = getRugbyLeagueFixtureByURN(STATE_MOCK.entities.rugbyleaguefixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing rugbyleague fixture", () => {
      const getRugbyLeagueFixtureByURN = createRugbyLeagueFixtureByURNSelector();
      const fixture = getRugbyLeagueFixtureByURN(STATE_MOCK.entities.rugbyleaguefixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.rugbyleaguefixtures[URN],
        opponentsNames: {
          teamA: "mocked home team",
          teamB: "mocked away team",
        },
      };

      expect(fixture).toEqual(expectedResult);
    });
  });
});
