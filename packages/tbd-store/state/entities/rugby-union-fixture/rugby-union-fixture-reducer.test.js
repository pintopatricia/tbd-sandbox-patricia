import rugbyUnionFixtureReducer from "./rugby-union-fixture-reducer";

const URN = "ppb:rugbyUnionfixture:29605500";

const fixturePayload = {
  urn: URN,
  score: {
    home: 35,
    away: 56,
  },
  halfTimeScore: {
    home: 0,
    away: 0,
  },
};

const rugbyUnionPayload = {
  [URN]: fixturePayload,
};

const existingState = {
  [URN]: {
    urn: URN,
    score: {},
    halfTimeScore: {},
  },
};

const simpleFixturePayload = {
  [URN]: {
    ...fixturePayload,
    score: {},
  },
};

const updatedState = {
  [URN]: {
    ...existingState[URN],
    ...fixturePayload,
  },
};

describe('"rugbyUnionFixture" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = rugbyUnionFixtureReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    describe("and nothing is passed in the payload", () => {
      it("should return an empty object", () => {
        const action = {
          type,
          payload: {
            data: { RugbyUnionFixture: undefined },
            entities: {},
          },
        };
        const state = rugbyUnionFixtureReducer([], action);
        expect(state).toEqual({});
      });
    });

    describe("and a new state is returned", () => {
      it("should update the current state", () => {
        const action = {
          type,
          payload: {
            data: { RugbyUnionFixture: [fixturePayload] },
            entities: {},
          },
        };
        const state = rugbyUnionFixtureReducer(existingState, action);
        expect(state).toEqual(updatedState);
      });
    });

    describe("and score is not defined", () => {
      it("should return score as undefined", () => {
        const action = {
          type,
          payload: {
            data: { RugbyUnionFixture: [simpleFixturePayload] },
            entities: {},
          },
        };
        const state = rugbyUnionFixtureReducer({}, action);
        expect(state.score).toBe(undefined);
      });
    });
  });

  describe("NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS", () => {
    describe("when no rugbyUnion payload is present", () => {
      it("must return the same state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            football: {},
          },
        };

        const state = rugbyUnionFixtureReducer({ mock: 2000 }, action);
        expect(state).toEqual({ mock: 2000 });
      });
    });

    describe("when there is rugbyUnion payload", () => {
      it("must return the the new state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            rugbyunion: rugbyUnionPayload,
          },
        };

        const state = rugbyUnionFixtureReducer(existingState, action);
        expect(state).toEqual(rugbyUnionPayload);
      });
    });
  });
});
