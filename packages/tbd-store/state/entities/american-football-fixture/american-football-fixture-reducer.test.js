import americanFootballFixtureReducer from "./american-football-fixture-reducer";

const URN = "ppb:americanfootballfixture:29605500";

const fixturePayload = {
  urn: URN,
  score: {
    home: 21,
    away: 14,
  },
  clock: {
    period: "PERIOD_1",
  },
  quarterScores: [
    {
      score: {
        home: 7,
        away: 7,
      },
      period: "PERIOD_1",
    },
  ],
};

const americanFootballPayload = {
  [URN]: fixturePayload,
};

const existingState = {
  [URN]: {
    urn: URN,
    score: {},
    clock: {},
    quarterScores: {},
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

describe('"americanFootballFixture" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = americanFootballFixtureReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    describe("and nothing is passed in the payload", () => {
      it("should return an empty object", () => {
        const action = {
          type,
          payload: {
            data: { AmericanFootballFixture: undefined },
            entities: {},
          },
        };
        const state = americanFootballFixtureReducer([], action);
        expect(state).toEqual({});
      });
    });

    describe("and a new state is returned", () => {
      it("should update the current state", () => {
        const action = {
          type,
          payload: {
            data: { AmericanFootballFixture: [fixturePayload] },
            entities: {},
          },
        };
        const state = americanFootballFixtureReducer(existingState, action);
        expect(state).toEqual(updatedState);
      });
    });

    describe("and score is not defined", () => {
      it("should return score as undefined", () => {
        const action = {
          type,
          payload: {
            data: { AmericanFootballFixture: [simpleFixturePayload] },
            entities: {},
          },
        };
        const state = americanFootballFixtureReducer({}, action);
        expect(state.score).toBe(undefined);
      });
    });
  });

  describe("NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS", () => {
    describe("when no americanFootball payload is present", () => {
      it("must return the same state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            football: {},
          },
        };

        const state = americanFootballFixtureReducer({ mock: 2000 }, action);
        expect(state).toEqual({ mock: 2000 });
      });
    });

    describe("when there is americanFootball payload", () => {
      it("must return the the new state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            americanfootball: americanFootballPayload,
          },
        };

        const state = americanFootballFixtureReducer(existingState, action);
        expect(state).toEqual(americanFootballPayload);
      });
    });
  });
});
