import {
  dispatchRateMyAppTriggeredAction,
  dispatchRatingUpdateSessionAction,
  dispatchRatingUpdateBetsAction,
  dispatchRatingResetAction,
  RATING__RATE_MY_APP_TRIGGERED,
  RATING__UPDATE_SESSION,
  RATING__UPDATE_BETS,
  RATING__RESET,
} from "./rating";

const mockDispatch = jest.fn();

const SESSION_MOCK = {
  numberOfSessions: 2,
  lastSessionDate: "2020-01-01T16:01:56.244Z",
};
const NUMBER_OF_BETS = 1;
const RATING_COUNT = 1;
const LAST_RATING_DATE = "2050-01-01T16:01:56.244Z";

describe("rating action creators", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchRateMyAppTriggeredAction", () => {
    it("should create an action with the type RATING__RATE_MY_APP_TRIGGERED", () => {
      dispatchRateMyAppTriggeredAction(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: RATING__RATE_MY_APP_TRIGGERED,
      });
    });
  });

  describe("dispatchRatingUpdateSessionAction", () => {
    it("should create an action with the type RATING__UPDATE_SESSION and the expected arguments", () => {
      dispatchRatingUpdateSessionAction(mockDispatch, SESSION_MOCK);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: RATING__UPDATE_SESSION,
        payload: {
          session: SESSION_MOCK,
        },
      });
    });
  });

  describe("dispatchRatingUpdateBetsAction", () => {
    it("should create an action with the type RATING__UPDATE_BETS and the expected arguments", () => {
      dispatchRatingUpdateBetsAction(mockDispatch, NUMBER_OF_BETS);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: RATING__UPDATE_BETS,
        payload: {
          numberOfBets: NUMBER_OF_BETS,
        },
      });
    });
  });

  describe("dispatchRatingResetAction", () => {
    it("should create an action with the type RATING__RESET and the expected arguments and static values", () => {
      dispatchRatingResetAction(mockDispatch, LAST_RATING_DATE, RATING_COUNT);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: RATING__RESET,
        payload: {
          lastRatingDate: LAST_RATING_DATE,
          rateMyAppTriggered: false,
          numberOfBets: 0,
          ratingCount: RATING_COUNT + 1,
          session: {
            numberOfSessions: 0,
            lastSessionDate: LAST_RATING_DATE,
          },
        },
      });
    });
  });
});
