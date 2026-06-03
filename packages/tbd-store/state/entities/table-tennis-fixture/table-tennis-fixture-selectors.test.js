import { createTableTennisFixtureByURNSelector } from "./table-tennis-fixture-selectors";

const URN = "ppb:tabletennisfixture:29605500";

const FIXTURE_MOCK = {
  currentSet: {
    number: 2,
    currentServer: "HOME",
    score: {
      home: 3,
      away: 4,
    },
  },
  setsWon: {
    home: 2,
    away: 1,
  },
  previousSets: [
    {
      number: 1,
      currentServer: null,
      score: {
        home: 1,
        away: 2,
      },
    },
  ],
};

const STATE_MOCK = {
  entities: {
    tabletennisfixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

describe('"tabletennisfixtures" selectors', () => {
  describe("getTableTennisFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getTableTennisFixtureByURN = createTableTennisFixtureByURNSelector();
      const fixture = getTableTennisFixtureByURN(STATE_MOCK.entities.tabletennisfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing cricket fixture", () => {
      const getTableTennisFixtureByURN = createTableTennisFixtureByURNSelector();
      const fixture = getTableTennisFixtureByURN(STATE_MOCK.entities.tabletennisfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.tabletennisfixtures[URN],
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createTableTennisFixtureByURNSelector selector", () => {
    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createTableTennisFixtureByURNSelector()(
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
      it("must return the respective cricket fixture", () => {
        const result = createTableTennisFixtureByURNSelector()(STATE_MOCK.entities.tabletennisfixtures, URN);

        expect(result).toEqual(FIXTURE_MOCK);
      });

      describe("when the selector is called again and fixture relevant data didn't change", () => {
        const getTableTennisFixtureByURN = createTableTennisFixtureByURNSelector();

        const firstCall = getTableTennisFixtureByURN(STATE_MOCK.entities.tabletennisfixtures, URN);
        const secondCall = getTableTennisFixtureByURN(
          { ...STATE_MOCK.entities.tabletennisfixtures, newProp: "newData" },
          URN,
        );

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getTableTennisFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getTableTennisFixtureByURN = createTableTennisFixtureByURNSelector();

        const firstCall = getTableTennisFixtureByURN(STATE_MOCK.entities.tabletennisfixtures, URN);
        const secondCall = getTableTennisFixtureByURN(
          {
            URN: {
              ...FIXTURE_MOCK,
              currentTeamBatting: "AWAY",
            },
          },
          URN,
        );

        it("should return a different fixture object", () => {
          expect(firstCall === secondCall).toBe(false);
        });

        it("should recompute the selector", () => {
          expect(getTableTennisFixtureByURN.recomputations()).toEqual(2);
        });
      });
    });
  });
});
