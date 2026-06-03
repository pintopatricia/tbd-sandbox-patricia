import sportsbookRunnersReducer, { getSportsbookRunnerByURN } from "./sportsbook-runners-reducer";

const stateMock = {
  "ppb:sbkRunner:924.166528790/20": {},
  "ppb:sbkRunner:924.166528788/19": {
    urn: "ppb:sbkRunner:924.166528788/19",
    market: "924.166528788",
    selectionId: 19,
    odds: {
      fractional: {
        numerator: 1,
        denominator: 2,
      },
      decimal: 1,
    },
  },
};

describe('"sportsbookrunners" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = sportsbookRunnersReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS"', () => {
    it("must return an updated state with sportsbook runners", () => {
      const action = {
        type: "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:sbkMarket:924.166528788",
              status: "OPEN",
            },
          ],
          runners: [
            {
              urn: "ppb:sbkRunner:924.166528788/19",
              selectionId: 19,
              market: "924.166528788",
              odds: {
                fractional: {
                  numerator: 3,
                  denominator: 2,
                },
                decimal: 2.5,
              },
            },
          ],
        },
      };

      const state = sportsbookRunnersReducer(stateMock, action);

      expect(state).toEqual({
        "ppb:sbkRunner:924.166528790/20": {},
        "ppb:sbkRunner:924.166528788/19": {
          urn: "ppb:sbkRunner:924.166528788/19",
          selectionId: 19,
          market: "924.166528788",
          odds: {
            fractional: {
              numerator: 3,
              denominator: 2,
            },
            decimal: 2.5,
          },
        },
      });
    });

    it("should throw an exception if the runner urn is undefined", () => {
      const action = {
        type: "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [],
          runners: [
            {
              status: "REMOVED",
            },
          ],
        },
      };

      expect(() => {
        sportsbookRunnersReducer(stateMock, action);
      }).toThrow("Runner URN is required");
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS case in reducer"', () => {
    it("should return the updated state with valid runner data", () => {
      const initialState = {};

      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            SportsbookRunnerLiveData: [
              {
                urn: "urn:runner1",
                status: "ACTIVE",
                marketURN: "urn:market1",
              },
              {
                urn: "urn:runner2",
                status: "INACTIVE",
                marketURN: "urn:market2",
              },
            ],
          },
        },
      };

      const state = sportsbookRunnersReducer(initialState, action);

      expect(state).toEqual({
        "urn:runner1": {
          urn: "urn:runner1",
          status: "ACTIVE",
          marketURN: "urn:market1",
        },
        "urn:runner2": {
          urn: "urn:runner2",
          status: "INACTIVE",
          marketURN: "urn:market2",
        },
      });
    });

    it("should return initial state if SportsbookRunnerLiveData is undefined", () => {
      const initialState = { existingRunner: { urn: "urn:existing", status: "ACTIVE" } };

      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {},
        },
      };

      const state = sportsbookRunnersReducer(initialState, action);

      expect(state).toEqual(initialState);
    });

    it("should merge runner updates with existing state", () => {
      const initialState = {
        "urn:runner1": { urn: "urn:runner1", status: "INACTIVE", marketURN: "urn:market1" },
      };

      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            SportsbookRunnerLiveData: [
              {
                urn: "urn:runner1",
                status: "ACTIVE", // Should overwrite previous status
                marketURN: "urn:market1",
              },
            ],
          },
        },
      };

      const expectedState = {
        "urn:runner1": { urn: "urn:runner1", status: "ACTIVE", marketURN: "urn:market1" },
      };

      const state = sportsbookRunnersReducer(initialState, action);

      expect(state).toEqual(expectedState);
    });
  });
});

describe('"sportsbookrunners" selectors', () => {
  describe("getSportsbookRunnerByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing runner", () => {
      const page = getSportsbookRunnerByURN("RANDOM_URN");
      expect(page).toBe(undefined);
    });

    it("must return a sportsbook runner when receiving an URN for an existing runner", () => {
      const state = getSportsbookRunnerByURN(stateMock, "ppb:sbkRunner:924.166528788/19");
      expect(state).toEqual(stateMock["ppb:sbkRunner:924.166528788/19"]);
    });
  });
});
