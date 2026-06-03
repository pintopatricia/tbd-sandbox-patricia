import tennisFixtureReducer from "./tennis-fixture-reducer";

const URN = "ppb:tennisfixture:29605500";

const fixturePayload = {
  urn: URN,
  actualStartTime: new Date("2022-01-16T20:00:00.000Z"),
  scheduledStartTime: new Date("2022-01-16T20:00:00.000Z"),
  status: { status: "IN_RUNNING", reason: undefined },
  surface: "CLAY",
  type: "SINGLES",
  currentSet: {
    currentGame: {
      teamAScore: "0",
      teamBScore: "15",
      teamServing: "AWAY",
      type: "NORMAL",
    },
    teamAScore: 5,
    teamBScore: 3,
  },
};

const tennisPayload = {
  [URN]: fixturePayload,
};

const simpleFixturePayload = {
  [URN]: {
    urn: "",
    actualStartTime: null,
    scheduledStartTime: null,
    status: { status: "PRE_MATCH", reason: undefined },
    surface: "CLAY",
    type: "SINGLES",
  },
};

const existingState = {
  [URN]: {
    actualStartTime: undefined,
    scheduledStartTime: undefined,
    status: {},
    currentSet: {},
    surface: "CLAY",
    type: "SINGLES",
    teamAScore: undefined,
    teamBScore: undefined,
  },
};

const updatedState = {
  [URN]: {
    ...existingState[URN],
    ...fixturePayload,
  },
};

describe('"tennisFixture" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = tennisFixtureReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe("when action type is FETCH_CATALOGUE_SUCCESS", () => {
    describe("and nothing is passed in the payload", () => {
      it("should return an empty object", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { TennisFixture: undefined },
            entities: {},
          },
        };
        const state = tennisFixtureReducer([], action);
        expect(state).toEqual({});
      });
    });

    describe("and a new state is returned", () => {
      it("should update the current state", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { TennisMatch: [fixturePayload] },
            entities: {},
          },
        };
        const state = tennisFixtureReducer(existingState, action);
        expect(state).toEqual(updatedState);
      });
    });

    describe("and scheduledStartTime is not defined", () => {
      it("should return scheduledStartTime as undefined", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { TennisFixture: [simpleFixturePayload] },
            entities: {},
          },
        };
        const state = tennisFixtureReducer({}, action);
        expect(state.scheduledStartTime).toBe(undefined);
      });
    });

    describe("and actualStartTime is not defined", () => {
      it("should return actualStartTime as undefined", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { TennisFixture: [simpleFixturePayload] },
            entities: {},
          },
        };

        const state = tennisFixtureReducer({}, action);
        expect(state.actualStartTime).toBe(undefined);
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

        const state = tennisFixtureReducer({ batatas: 2000 }, action);
        expect(state).toEqual({ batatas: 2000 });
      });
    });

    describe("when there is payload", () => {
      describe("without tennis", () => {
        it("must return the same state", () => {
          const action = {
            type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
            payload: {
              tennis: {},
            },
          };

          const state = tennisFixtureReducer({ batatas: 2000 }, action);
          expect(state).toEqual({ batatas: 2000 });
        });
      });

      describe("with tennis", () => {
        it("must return the the new state", () => {
          const action = {
            type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
            payload: {
              tennis: tennisPayload,
            },
          };

          const state = tennisFixtureReducer(existingState, action);
          expect(state).toEqual(tennisPayload);
        });
      });
    });
  });
});
