import { raceResultsCardUpdatesMiddleware } from "./race-results-updates-middleware";

const stateMock = {
  layouts: { cards: { raceresults: {} } },
  entities: {},
};

const dispatchSpy = jest.fn();
const getStateSpy = jest.fn(() => stateMock);
const nextSpy = jest.fn();
const actionMock = {
  type: "NETWORK/FETCH_RACE_UPDATES_SUCCESS",
  payload: {
    "fake-urn": {
      status: "RESULT",
      resultType: "FULL_RESULT",
    },
  },
};

const setup = ({ dispatch = dispatchSpy, getState = getStateSpy, next = nextSpy, action = actionMock } = {}) =>
  raceResultsCardUpdatesMiddleware({ dispatch, getState })(next)(action);

describe("race results updates middleware", () => {
  beforeEach(jest.clearAllMocks);

  describe("and the resultType received is not different from state", () => {
    it("should not dispatch a FETCH_FULL_CARD action", async () => {
      setup({
        action: {
          ...actionMock,
        },
      });

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe("and the resultType received is different from state", () => {
    describe('when the payload resultType is "QUICK_RESULT" and in current state is undefined', () => {
      it("should dispatch a FETCH_FULL_CARD action", async () => {
        setup({
          action: {
            ...actionMock,
            payload: {
              12345: {
                status: undefined,
                resultType: "QUICK_RESULT",
              },
            },
          },
          getState() {
            return {
              entities: {
                races: {
                  12345: {
                    details: {
                      resultType: undefined,
                    },
                  },
                },
              },
              layouts: {
                cards: {
                  raceresults: {
                    12345: {
                      urn: "raceResultsCardURN",
                      typename: "RaceResultsCard",
                      race: 12345,
                    },
                  },
                },
              },
            };
          },
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "FETCH_FULL_CARD",
          payload: "raceResultsCardURN",
        });
      });
    });

    describe('when the payload resultType is "QUICK_RESULT" and in current state is "FULL_RESULT"', () => {
      it("should not dispatch a FETCH_FULL_CARD action", async () => {
        setup({
          action: {
            ...actionMock,
            payload: {
              12345: {
                status: undefined,
                resultType: "QUICK_RESULT",
              },
            },
          },
          getState() {
            return {
              entities: {
                races: {
                  12345: {
                    details: {
                      resultType: "FULL_RESULT",
                    },
                  },
                },
              },
              layouts: {
                cards: {
                  raceresults: {
                    12345: {
                      urn: "raceResultsCardURN",
                      typename: "RaceResultsCard",
                      race: 12345,
                    },
                  },
                },
              },
            };
          },
        });

        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe('when the payload resultType is "FULL_RESULT" and in current state is "QUICK_RESULT"', () => {
      it("should dispatch a FETCH_FULL_CARD action", async () => {
        setup({
          action: {
            ...actionMock,
            payload: {
              12345: {
                status: undefined,
                resultType: "FULL_RESULT",
              },
            },
          },
          getState() {
            return {
              entities: {
                races: {
                  12345: {
                    details: {
                      resultType: "QUICK_RESULT",
                    },
                  },
                },
              },
              layouts: {
                cards: {
                  raceresults: {
                    12345: {
                      urn: "raceResultsCardURN",
                      typename: "RaceResultsCard",
                      race: 12345,
                    },
                  },
                },
              },
            };
          },
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "FETCH_FULL_CARD",
          payload: "raceResultsCardURN",
        });
      });
    });

    describe('when the payload resultType is "FULL_RESULT" and in current state is undefined', () => {
      it("should dispatch a FETCH_FULL_CARD action", async () => {
        setup({
          action: {
            ...actionMock,
            payload: {
              12345: {
                status: undefined,
                resultType: "FULL_RESULT",
              },
            },
          },
          getState() {
            return {
              entities: {
                races: {
                  12345: {
                    details: {
                      resultType: undefined,
                    },
                  },
                },
              },
              layouts: {
                cards: {
                  raceresults: {
                    12345: {
                      urn: "raceResultsCardURN",
                      typename: "RaceResultsCard",
                      race: 12345,
                    },
                  },
                },
              },
            };
          },
        });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "FETCH_FULL_CARD",
          payload: "raceResultsCardURN",
        });
      });
    });
  });
});
