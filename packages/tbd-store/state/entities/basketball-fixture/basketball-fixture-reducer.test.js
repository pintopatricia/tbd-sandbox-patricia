import basketballFixtureReducer from "./basketball-fixture-reducer";

const URN = "ppb:basketballfixture:29605500";

const fixturePayload = {
  urn: URN,
  score: {
    home: 35,
    away: 56,
  },
  clock: {
    period: "PERIOD_1",
    segment: "Q1",
    timeElapsed: 121,
    timeRemaining: 479,
  },
  periodScores: [
    {
      score: {
        home: 35,
        away: 56,
      },
      period: "PERIOD_1",
      segment: null,
    },
  ],
};

const basketballPayload = {
  [URN]: fixturePayload,
};

const existingState = {
  [URN]: {
    urn: URN,
    score: {},
    clock: {},
    periodScores: {},
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

describe('"basketballFixture" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = basketballFixtureReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    describe("and nothing is passed in the payload", () => {
      it("should return an empty object", () => {
        const action = {
          type,
          payload: {
            data: { BasketballFixture: undefined },
            entities: {},
          },
        };
        const state = basketballFixtureReducer([], action);
        expect(state).toEqual({});
      });
    });

    describe("and a new state is returned", () => {
      it("should update the current state", () => {
        const action = {
          type,
          payload: {
            data: { BasketballFixture: [fixturePayload] },
            entities: {},
          },
        };
        const state = basketballFixtureReducer(existingState, action);
        expect(state).toEqual(updatedState);
      });
    });

    describe("and score is not defined", () => {
      it("should return score as undefined", () => {
        const action = {
          type,
          payload: {
            data: { BasketballFixture: [simpleFixturePayload] },
            entities: {},
          },
        };
        const state = basketballFixtureReducer({}, action);
        expect(state.score).toBe(undefined);
      });
    });
  });

  describe("NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS", () => {
    describe("when no basketball payload is present", () => {
      it("must return the same state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            football: {},
          },
        };

        const state = basketballFixtureReducer({ mock: 2000 }, action);
        expect(state).toEqual({ mock: 2000 });
      });
    });

    describe("when there is basketball payload", () => {
      it("must return the the new state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            basketball: basketballPayload,
          },
        };

        const state = basketballFixtureReducer(existingState, action);
        expect(state).toEqual(basketballPayload);
      });
    });
  });
});
