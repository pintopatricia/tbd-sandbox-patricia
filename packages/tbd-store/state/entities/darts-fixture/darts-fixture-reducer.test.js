import dartsFixtureReducer from "./darts-fixture-reducer";

const URN = "ppb:dartsfixture:29605500";

const fixturePayload = {
  urn: URN,
  score: {
    home: 3,
    away: 5,
  },
  type: "SETS",
  matchState: "IN_PLAY",
};

const dartsPayload = {
  [URN]: fixturePayload,
};

const existingState = {
  [URN]: {
    urn: URN,
    score: {},
    matchState: "PRE_MATCH",
  },
};

const simpleFixturePayload = {
  ...fixturePayload,
  score: undefined,
};

const updatedState = {
  [URN]: {
    ...existingState[URN],
    ...fixturePayload,
  },
};

describe('"dartsFixture" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = dartsFixtureReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    describe("and nothing is passed in the payload", () => {
      it("should return an empty object", () => {
        const action = {
          type,
          payload: {
            data: { DartsFixture: undefined },
            entities: {},
          },
        };
        const state = dartsFixtureReducer([], action);
        expect(state).toEqual({});
      });
    });

    describe("and a new state is returned", () => {
      it("should update the current state", () => {
        const action = {
          type,
          payload: {
            data: { DartsFixture: [fixturePayload] },
            entities: {},
          },
        };
        const state = dartsFixtureReducer(existingState, action);
        expect(state).toEqual(updatedState);
      });
    });

    describe("and score is not defined", () => {
      it("should return score as undefined inside the fixture object", () => {
        const action = {
          type,
          payload: {
            data: { DartsFixture: [simpleFixturePayload] },
            entities: {},
          },
        };
        const state = dartsFixtureReducer({}, action);
        expect(state[URN].score).toBe(undefined);
      });
    });
  });

  describe("NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS", () => {
    describe("when no darts payload is present", () => {
      it("must return the same state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            football: {},
          },
        };

        const state = dartsFixtureReducer({ mock: 2000 }, action);
        expect(state).toEqual({ mock: 2000 });
      });
    });

    describe("when there is darts payload", () => {
      it("must return the the new state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            darts: dartsPayload,
          },
        };

        const state = dartsFixtureReducer(existingState, action);
        expect(state).toEqual({
          [URN]: {
            ...existingState[URN],
            ...fixturePayload,
          },
        });
      });
    });
  });
});
