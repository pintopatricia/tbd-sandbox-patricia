import { createCricketFixtureByURNSelector } from "./cricket-fixture-selectors";

const URN = "ppb:cricketfixture:29605500";

const FIXTURE_MOCK = {
  score: {
    home: [
      {
        inningNumber: 1,
        runs: 2,
        wickets: 3,
      },
    ],
    away: [
      {
        inningNumber: 4,
        runs: 5,
        wickets: 6,
      },
    ],
  },
  currentTeamBatting: "HOME",
  currentTime: {
    inning: 99,
    over: 22,
  },
};

const STATE_MOCK = {
  entities: {
    cricketfixtures: {
      [URN]: FIXTURE_MOCK,
    },
  },
};

describe('"cricketfixtures" selectors', () => {
  describe("getCricketFixtureByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing fixture", () => {
      const getCricketFixtureByURN = createCricketFixtureByURNSelector();
      const fixture = getCricketFixtureByURN(STATE_MOCK.entities.cricketfixtures, "RANDOM_URN");
      expect(fixture).toBe(undefined);
    });

    it("must return a fixture when receiving an URN for an existing cricket fixture", () => {
      const getCricketFixtureByURN = createCricketFixtureByURNSelector();
      const fixture = getCricketFixtureByURN(STATE_MOCK.entities.cricketfixtures, URN);
      const expectedResult = {
        ...STATE_MOCK.entities.cricketfixtures[URN],
      };

      expect(fixture).toEqual(expectedResult);
    });
  });

  describe("createCricketFixtureByURNSelector selector", () => {
    describe("when creating new selector instances", () => {
      it("must return a new instance every time it is called", () => {
        const getCricketFixtureByURN1 = createCricketFixtureByURNSelector();
        const getCricketFixtureByURN2 = createCricketFixtureByURNSelector();

        expect(getCricketFixtureByURN1).not.toEqual(getCricketFixtureByURN2);
      });
    });

    describe("when providing an URN for a non-existing fixture", () => {
      it("must return undefined", () => {
        const result = createCricketFixtureByURNSelector()(
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
        const result = createCricketFixtureByURNSelector()(STATE_MOCK.entities.cricketfixtures, URN);

        expect(result).toEqual(FIXTURE_MOCK);
      });

      describe("when the selector is called again and fixture relevant data didn't change", () => {
        const getCricketFixtureByURN = createCricketFixtureByURNSelector();

        const firstCall = getCricketFixtureByURN(STATE_MOCK.entities.cricketfixtures, URN);
        const secondCall = getCricketFixtureByURN({ ...STATE_MOCK.entities.cricketfixtures, newProp: "newData" }, URN);

        it("should return the same fixture object", () => {
          expect(firstCall === secondCall).toBe(true);
        });

        it("should not recompute the selector", () => {
          expect(getCricketFixtureByURN.recomputations()).toEqual(1);
        });
      });

      describe("when the selector is called again but fixture relevant data changed", () => {
        const getCricketFixtureByURN = createCricketFixtureByURNSelector();

        const firstCall = getCricketFixtureByURN(STATE_MOCK.entities.cricketfixtures, URN);
        const secondCall = getCricketFixtureByURN(
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
          expect(getCricketFixtureByURN.recomputations()).toEqual(2);
        });
      });
    });
  });
});
