import tableTennisFixtureReducer from "./table-tennis-fixture-reducer";

const URN = "ppb:tabletennisfixture:29605500";

const fixturePayload = {
  urn: URN,
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

const tableTennisPayload = {
  [URN]: fixturePayload,
};

const existingState = {
  [URN]: {
    currentSet: {},
    setsWon: {},
    previousSets: undefined,
  },
};

const updatedState = {
  [URN]: {
    ...existingState[URN],
    ...fixturePayload,
  },
};

describe('"tabletennisfixture" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = tableTennisFixtureReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe("when action type is FETCH_CATALOGUE_SUCCESS", () => {
    it('must return the new state with "table tennis fixtures"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            TableTennisFixture: [fixturePayload],
          },
          entities: {},
        },
      };
      const state = tableTennisFixtureReducer(existingState, action);
      expect(state).toEqual(updatedState);
    });

    describe("and the payload data has no TableTennisFixture", () => {
      it("must return same state", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              TableTennisFixture: undefined,
            },
            entities: {},
          },
        };
        const state = tableTennisFixtureReducer(existingState, action);
        expect(state).toEqual(existingState);
      });
    });
  });

  describe("NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS", () => {
    describe("when no payload is present", () => {
      it("must return the same state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: undefined,
        };

        const state = tableTennisFixtureReducer({ batatas: 2000 }, action);
        expect(state).toEqual({ batatas: 2000 });
      });
    });

    describe("when there is payload", () => {
      describe("without tabletennis", () => {
        it("must return the same state", () => {
          const action = {
            type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
            payload: {
              tabletennis: {},
            },
          };

          const state = tableTennisFixtureReducer({ batatas: 2000 }, action);
          expect(state).toEqual({ batatas: 2000 });
        });
      });

      describe("with tabletennis", () => {
        it("must return the the new state", () => {
          const action = {
            type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
            payload: {
              tabletennis: tableTennisPayload,
            },
          };

          const state = tableTennisFixtureReducer(existingState, action);
          expect(state).toEqual(tableTennisPayload);
        });
      });
    });
  });
});
