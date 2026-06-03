import iceHockeyFixtureReducer from "./ice-hockey-fixture-reducer";

const URN = "ppb:icehockeyfixture:29605500";

const fixturePayload = {
  urn: URN,
  score: {
    home: 3,
    away: 5,
  },
  clock: {
    period: "PERIOD_1",
  },
  periodScores: [
    {
      score: {
        home: 3,
        away: 5,
      },
      period: "PERIOD_1",
    },
  ],
};

const iceHockeyPayload = {
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

describe('"iceHockeyFixture" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = iceHockeyFixtureReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    describe("and nothing is passed in the payload", () => {
      it("should return an empty object", () => {
        const action = {
          type,
          payload: {
            data: { IceHockeyFixture: undefined },
            entities: {},
          },
        };
        const state = iceHockeyFixtureReducer([], action);
        expect(state).toEqual({});
      });
    });

    describe("and a new state is returned", () => {
      it("should update the current state", () => {
        const action = {
          type,
          payload: {
            data: { IceHockeyFixture: [fixturePayload] },
            entities: {},
          },
        };
        const state = iceHockeyFixtureReducer(existingState, action);
        expect(state).toEqual(updatedState);
      });
    });

    describe("and score is not defined", () => {
      it("should return score as undefined", () => {
        const action = {
          type,
          payload: {
            data: { IceHockeyFixture: [simpleFixturePayload] },
            entities: {},
          },
        };
        const state = iceHockeyFixtureReducer({}, action);
        expect(state.score).toBe(undefined);
      });
    });
  });

  describe("NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS", () => {
    describe("when no iceHockey payload is present", () => {
      it("must return the same state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            football: {},
          },
        };

        const state = iceHockeyFixtureReducer({ mock: 2000 }, action);
        expect(state).toEqual({ mock: 2000 });
      });
    });

    describe("when there is iceHockey payload", () => {
      it("must return the the new state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            icehockey: iceHockeyPayload,
          },
        };

        const state = iceHockeyFixtureReducer(existingState, action);
        expect(state).toEqual(iceHockeyPayload);
      });
    });
  });
});
