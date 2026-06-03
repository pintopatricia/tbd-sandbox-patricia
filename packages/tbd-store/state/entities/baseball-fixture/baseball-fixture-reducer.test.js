import baseballFixtureReducer from "./baseball-fixture-reducer";

const URN = "ppb:baseballfixture:123456";

const fixturePayload = {
  urn: URN,
  score: {
    home: 5,
    away: 2,
  },
  clock: {
    period: "INNING_4",
  },
  scorePerInning: [
    {
      score: {
        home: 1,
        away: 0,
      },
      period: "INNING_1",
    },
  ],
};

const baseballPayload = {
  [URN]: fixturePayload,
};

const existingState = {
  [URN]: {
    urn: URN,
    score: {},
    clock: {},
    scorePerInning: [],
  },
};

const simpleFixturePayload = {
  ...fixturePayload,
  score: {},
};

const updatedState = {
  [URN]: {
    ...existingState[URN],
    ...fixturePayload,
  },
};

describe('"baseballFixture" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = baseballFixtureReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    describe("and nothing is passed in the payload", () => {
      it("should return an empty object", () => {
        const action = {
          type,
          payload: {
            data: { BaseballFixture: undefined },
            entities: {},
          },
        };
        const state = baseballFixtureReducer([], action);
        expect(state).toEqual({});
      });
    });

    describe("and a new state is returned", () => {
      it("should update the current state", () => {
        const action = {
          type,
          payload: {
            data: { BaseballFixture: [fixturePayload] },
            entities: {},
          },
        };
        const state = baseballFixtureReducer(existingState, action);
        expect(state).toEqual(updatedState);
      });
    });

    describe("and score is not defined", () => {
      it("should return score as undefined (or empty if passed as empty)", () => {
        const action = {
          type,
          payload: {
            data: { BaseballFixture: [simpleFixturePayload] },
            entities: {},
          },
        };
        const state = baseballFixtureReducer({}, action);

        expect(state[URN].score).toEqual({});
      });
    });
  });

  describe("NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS", () => {
    describe("when no baseball payload is present", () => {
      it("must return the same state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            football: {},
            icehockey: {},
          },
        };

        const state = baseballFixtureReducer({ mock: 2000 }, action);
        expect(state).toEqual({ mock: 2000 });
      });
    });

    describe("when there is baseball payload", () => {
      it("must return the the new state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            baseball: baseballPayload,
          },
        };

        const state = baseballFixtureReducer(existingState, action);
        expect(state).toEqual(baseballPayload);
      });
    });
  });
});
