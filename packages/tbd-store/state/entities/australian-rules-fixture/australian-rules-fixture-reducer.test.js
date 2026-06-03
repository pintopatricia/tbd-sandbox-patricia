import australianRulesFixtureReducer from "./australian-rules-fixture-reducer";

const URN = "ppb:australianrulesfixture:29605500";

const fixturePayload = {
  urn: URN,
  score: {
    goals: {
      home: 10,
      away: 5,
    },
    behinds: {
      home: 3,
      away: 1,
    },
    points: {
      home: 13,
      away: 7,
    },
  },
  periodScores: [
    {
      score: {
        goals: {
          home: 10,
          away: 5,
        },
        behinds: {
          home: 3,
          away: 1,
        },
        points: {
          home: 13,
          away: 7,
        },
      },
      period: "PERIOD_1",
    },
  ],
};

const australianRulesPayload = {
  [URN]: fixturePayload,
};

const existingState = {
  [URN]: {
    urn: URN,
    score: {},
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

describe('"australianRulesFixture" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = australianRulesFixtureReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    describe("and nothing is passed in the payload", () => {
      it("should return an empty object", () => {
        const action = {
          type,
          payload: {
            data: { AustralianRulesFixture: undefined },
            entities: {},
          },
        };
        const state = australianRulesFixtureReducer([], action);
        expect(state).toEqual({});
      });
    });

    describe("and a new state is returned", () => {
      it("should update the current state", () => {
        const action = {
          type,
          payload: {
            data: { AustralianRulesFixture: [fixturePayload] },
            entities: {},
          },
        };
        const state = australianRulesFixtureReducer(existingState, action);
        expect(state).toEqual(updatedState);
      });
    });

    describe("and score is not defined", () => {
      it("should return score as undefined", () => {
        const action = {
          type,
          payload: {
            data: { AustralianRulesFixture: [simpleFixturePayload] },
            entities: {},
          },
        };
        const state = australianRulesFixtureReducer({}, action);
        expect(state.score).toBe(undefined);
      });
    });
  });

  describe("NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS", () => {
    describe("when no australianRules payload is present", () => {
      it("must return the same state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            football: {},
          },
        };

        const state = australianRulesFixtureReducer({ mock: 2000 }, action);
        expect(state).toEqual({ mock: 2000 });
      });
    });

    describe("when there is australianRules payload", () => {
      it("must return the the new state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            australianrules: australianRulesPayload,
          },
        };

        const state = australianRulesFixtureReducer(existingState, action);
        expect(state).toEqual(australianRulesPayload);
      });
    });
  });
});
