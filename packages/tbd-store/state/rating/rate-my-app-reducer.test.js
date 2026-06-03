import {
  RATING__RATE_MY_APP_TRIGGERED,
  RATING__UPDATE_BETS,
  RATING__UPDATE_SESSION,
  RATING__RESET,
} from "../../actions/rating";
import ratingReducer from "./rate-my-app-reducer";

const SESSION_MOCK = {
  numberOfSessions: 2,
  lastSessionDate: "2020-01-01T16:01:56.244Z",
};

const STATE_MOCK = {
  rateMyAppTriggered: false,
  lastRatingDate: undefined,
  ratingCount: 0,
  session: {
    numberOfSessions: 1,
    lastSessionDate: "2020-06-06T16:01:56.244Z",
  },
};

describe('"rating" reducer', () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is not met by the reducer", () => {
    it("must return the default state", () => {
      const state = ratingReducer({ rateMyAppTriggered: false }, {});
      expect(state).toEqual({ rateMyAppTriggered: false });
    });
  });

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      const state = ratingReducer(undefined, {});
      expect(state).toEqual({ rateMyAppTriggered: false, lastRatingDate: undefined, ratingCount: 0 });
    });
  });

  describe('when action type is "RATING__UPDATE_SESSION"', () => {
    const action = {
      type: RATING__UPDATE_SESSION,
      payload: {
        session: SESSION_MOCK,
      },
    };

    it("should update the state with the correct session arguments", async () => {
      const state = ratingReducer(STATE_MOCK, action);

      expect(state).toEqual({
        ...STATE_MOCK,
        session: SESSION_MOCK,
      });
    });
  });

  describe('when action type is "RATING__UPDATE_BETS"', () => {
    const action = {
      type: RATING__UPDATE_BETS,
      payload: {
        numberOfBets: 2,
      },
    };

    it("should update the state with the correct number of bets", async () => {
      const state = ratingReducer(STATE_MOCK, action);

      expect(state).toEqual({
        ...STATE_MOCK,
        numberOfBets: action.payload.numberOfBets,
      });
    });
  });

  describe('when action type is "RATING__RATE_MY_APP_TRIGGERED"', () => {
    const action = {
      type: RATING__RATE_MY_APP_TRIGGERED,
    };

    it("should update the state and set rateMyAppTriggered to *true*", async () => {
      const state = ratingReducer(STATE_MOCK, action);

      expect(state).toEqual({
        ...STATE_MOCK,
        rateMyAppTriggered: true,
      });
    });
  });

  describe('when action type is "RATING__RESET"', () => {
    const action = {
      type: RATING__RESET,
      payload: {
        rateMyAppTriggered: false,
        lastRatingDate: SESSION_MOCK.lastSessionDate,
        session: SESSION_MOCK,
      },
    };

    it("should replace the state with the action payload", async () => {
      const state = ratingReducer(STATE_MOCK, action);

      expect(state).toEqual(action.payload);
    });
  });
});
