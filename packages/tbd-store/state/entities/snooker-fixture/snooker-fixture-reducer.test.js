import snookerFixtureReducer from "./snooker-fixture-reducer";

const URN = "ppb:snookerfixture:29605500";

const fixturePayload = {
  urn: URN,
  score: {
    home: 3,
    away: 5,
  },
};

const snookerPayload = {
  [URN]: fixturePayload,
};

const existingState = {
  [URN]: {
    urn: URN,
    score: {},
  },
};

const updatedState = {
  [URN]: {
    ...existingState[URN],
    ...fixturePayload,
  },
};

describe('"snookerFixture" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = snookerFixtureReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    describe("and nothing is passed in the payload", () => {
      it("should return an empty object", () => {
        const action = {
          type,
          payload: {
            data: { SnookerFixture: undefined },
            entities: {},
          },
        };
        const state = snookerFixtureReducer([], action);
        expect(state).toEqual({});
      });
    });

    describe("and a new state is returned", () => {
      it("should update the current state", () => {
        const action = {
          type,
          payload: {
            data: { SnookerFixture: [fixturePayload] },
            entities: {},
          },
        };
        const state = snookerFixtureReducer(existingState, action);
        expect(state).toEqual(updatedState);
      });
    });

    describe("and score is not defined", () => {
      it("should return score as undefined", () => {
        const action = {
          type,
          payload: {
            data: { SnookerFixture: [existingState] },
            entities: {},
          },
        };
        const state = snookerFixtureReducer({}, action);
        expect(state.score).toBe(undefined);
      });
    });
  });

  describe("NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS", () => {
    describe("when no snooker payload is present", () => {
      it("must return the same state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            football: {},
          },
        };

        const state = snookerFixtureReducer({ mock: 2000 }, action);
        expect(state).toEqual({ mock: 2000 });
      });
    });

    describe("when there is snooker payload", () => {
      it("must return the the new state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            snooker: snookerPayload,
          },
        };

        const state = snookerFixtureReducer(existingState, action);
        expect(state).toEqual(snookerPayload);
      });
    });
  });
});
