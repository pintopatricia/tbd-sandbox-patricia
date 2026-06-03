import cricketFixtureReducer from "./cricket-fixture-reducer";

const URN = "ppb:cricketfixture:29605500";
const fixturePayload = {
  urn: URN,
  score: {
    home: [
      {
        inningNumber: 1,
        runs: 2,
        wickets: 3,
      },
    ],
    away: [
      {
        inningNumber: 4,
        runs: 5,
        wickets: 6,
      },
    ],
  },
  currentTeamBatting: "HOME",
  currentTime: {
    inning: 99,
    over: 22,
  },
};

const cricketPayload = {
  [URN]: fixturePayload,
};

const existingState = {
  [URN]: {
    score: {},
    currentTeamBatting: undefined,
    currentTime: {},
  },
};

const updatedState = {
  [URN]: {
    ...existingState[URN],
    urn: URN,
    score: {
      home: [
        {
          inningNumber: 1,
          runs: 2,
          wickets: 3,
        },
      ],
      away: [
        {
          inningNumber: 4,
          runs: 5,
          wickets: 6,
        },
      ],
    },
    currentTeamBatting: "HOME",
    currentTime: {
      inning: 99,
      over: 22,
    },
  },
};

describe('"cricketfixture" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = cricketFixtureReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe("when action type is FETCH_CATALOGUE_SUCCESS", () => {
    it('must return the new state with "cricket fixtures"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: { CricketFixture: [fixturePayload] },
          entities: {},
        },
      };
      const state = cricketFixtureReducer(existingState, action);
      expect(state).toEqual(updatedState);
    });
  });

  describe("NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS", () => {
    describe("when no cricket payload is present", () => {
      it("must return the same state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            data: { basketball: {} },
            entities: {},
          },
        };

        const state = cricketFixtureReducer({ dummy: 2000 }, action);
        expect(state).toEqual({ dummy: 2000 });
      });
    });

    describe("when there is cricket payload", () => {
      it("must return the the new state", () => {
        const action = {
          type: "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS",
          payload: {
            cricket: cricketPayload,
          },
        };

        const state = cricketFixtureReducer(existingState, action);
        expect(state).toEqual(cricketPayload);
      });
    });
  });
});
