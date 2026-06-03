import { rateMyAppMiddleware } from "./rate-my-app-triggers";
import { NETWORK__CASHOUT_TAKE_SUCCESS } from "../actions/cashout";
import { NETWORK__PLACE_EXC_BET_SUCCESS, NETWORK__PLACE_SBK_BET_SUCCESS } from "../actions/betslip";
import {
  dispatchRateMyAppTriggeredAction,
  dispatchRatingUpdateBetsAction,
  dispatchRatingUpdateSessionAction,
} from "../actions/rating";
import { FETCH_CATALOGUE_SUCCESS } from "../actions/catalogue";

jest.mock("../actions/rating", () => ({
  dispatchRateMyAppTriggeredAction: jest.fn(),
  dispatchRatingUpdateBetsAction: jest.fn(),
  dispatchRatingUpdateSessionAction: jest.fn(),
}));

const ratingModule = {
  checkRatingRequirements: jest.fn(),
  handleSession: jest.fn(),
};

const stateMock = {
  rating: {
    numberOfBets: 1,
    session: "session mock",
  },
  entities: {
    throttles: {
      RATE_MY_APP: {
        isActive: true,
      },
    },
  },
};

const storeMock = {
  getState: jest.fn(() => stateMock),
  dispatch: jest.fn(),
};

function setup(nextSpy, actionType, payload = { errorCode: "SUCCESS" }) {
  return rateMyAppMiddleware(ratingModule)(storeMock)(nextSpy)({ type: actionType, payload });
}

describe("rate-my-app-triggers Middleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when the action type is NETWORK__CASHOUT_TAKE_SUCCESS", () => {
    it("should call 'checkRatingRequirements' with the expected arguments", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__CASHOUT_TAKE_SUCCESS);

      expect(ratingModule.checkRatingRequirements).toHaveBeenCalledWith(stateMock);
    });

    it("should not prevent 'next' from being called", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__CASHOUT_TAKE_SUCCESS);

      expect(nextSpy).toHaveBeenCalledTimes(1);
    });

    it("should not call 'dispatchRateMyAppTriggeredAction'", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__CASHOUT_TAKE_SUCCESS);

      expect(dispatchRateMyAppTriggeredAction).not.toHaveBeenCalled();
    });

    describe("and matches the rating requirements", () => {
      it("should call 'dispatchRateMyAppTriggeredAction' with the expected arguments", () => {
        const nextSpy = jest.fn();
        ratingModule.checkRatingRequirements.mockReturnValueOnce(true);
        setup(nextSpy, NETWORK__CASHOUT_TAKE_SUCCESS);

        expect(dispatchRateMyAppTriggeredAction).toHaveBeenCalledWith(storeMock.dispatch);
      });
    });

    describe("and the error code in the payload is not 'SUCCESS'", () => {
      it("should not call 'dispatchRateMyAppTriggeredAction' with the expected arguments", () => {
        const nextSpy = jest.fn();
        ratingModule.checkRatingRequirements.mockReturnValueOnce(true);
        setup(nextSpy, NETWORK__CASHOUT_TAKE_SUCCESS, { errorCode: "SOME_ERROR" });

        expect(dispatchRateMyAppTriggeredAction).not.toHaveBeenCalled();
      });

      it("should not prevent 'next' from being called", () => {
        const nextSpy = jest.fn();
        setup(nextSpy, NETWORK__CASHOUT_TAKE_SUCCESS, { errorCode: "SOME_ERROR" });

        expect(nextSpy).toHaveBeenCalledTimes(1);
      });

      it("should not call 'dispatchRateMyAppTriggeredAction'", () => {
        const nextSpy = jest.fn();
        setup(nextSpy, NETWORK__CASHOUT_TAKE_SUCCESS, { errorCode: "SOME_ERROR" });

        expect(dispatchRateMyAppTriggeredAction).not.toHaveBeenCalled();
      });
    });

    describe("and throttle is off", () => {
      it("should not call 'dispatchRateMyAppTriggeredAction'", () => {
        const nextSpy = jest.fn();
        rateMyAppMiddleware(ratingModule)({
          getState: () => ({
            rating: {
              numberOfBets: 1,
              session: "session mock",
            },
            entities: {
              throttles: {
                RATE_MY_APP: {
                  isActive: false,
                },
              },
            },
          }),
          dispatch: jest.fn(),
        })(nextSpy)({ type: NETWORK__CASHOUT_TAKE_SUCCESS });

        expect(dispatchRateMyAppTriggeredAction).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the action type is NETWORK__PLACE_EXC_BET_SUCCESS", () => {
    it("should call 'checkRatingRequirements' with the expected arguments", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__PLACE_EXC_BET_SUCCESS);

      expect(ratingModule.checkRatingRequirements).toHaveBeenCalledWith(stateMock, true);
    });

    it("should not prevent 'next' from being called", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__PLACE_EXC_BET_SUCCESS);

      expect(nextSpy).toHaveBeenCalledTimes(1);
    });

    it("should call 'dispatchRatingUpdateBetsAction' and increment the number of bets by 1", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__PLACE_EXC_BET_SUCCESS);

      expect(dispatchRatingUpdateBetsAction).toHaveBeenCalledWith(
        storeMock.dispatch,
        stateMock.rating.numberOfBets + 1,
      );
    });

    it("should not call 'dispatchRateMyAppTriggeredAction'", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__PLACE_EXC_BET_SUCCESS);

      expect(dispatchRateMyAppTriggeredAction).not.toHaveBeenCalled();
    });

    describe("and matches the rating requirements", () => {
      it("should call 'dispatchRateMyAppTriggeredAction' with the expected arguments", () => {
        const nextSpy = jest.fn();
        ratingModule.checkRatingRequirements.mockReturnValueOnce(true);
        setup(nextSpy, NETWORK__PLACE_EXC_BET_SUCCESS);

        expect(dispatchRateMyAppTriggeredAction).toHaveBeenCalledWith(storeMock.dispatch);
      });
    });

    describe("and throttle is off", () => {
      it("should not call 'dispatchRateMyAppTriggeredAction'", () => {
        const nextSpy = jest.fn();
        rateMyAppMiddleware(ratingModule)({
          getState: () => ({
            rating: {
              numberOfBets: 1,
              session: "session mock",
            },
            entities: {
              throttles: {
                RATE_MY_APP: {
                  isActive: false,
                },
              },
            },
          }),
          dispatch: jest.fn(),
        })(nextSpy)({ type: NETWORK__PLACE_EXC_BET_SUCCESS });

        expect(dispatchRateMyAppTriggeredAction).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the action type is NETWORK__PLACE_SBK_BET_SUCCESS", () => {
    it("should call 'checkRatingRequirements' with the expected arguments", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__PLACE_SBK_BET_SUCCESS);

      expect(ratingModule.checkRatingRequirements).toHaveBeenCalledWith(stateMock, true);
    });

    it("should not prevent 'next' from being called", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__PLACE_SBK_BET_SUCCESS);

      expect(nextSpy).toHaveBeenCalledTimes(1);
    });

    it("should call 'dispatchRatingUpdateBetsAction' and increment the number of bets by 1", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__PLACE_SBK_BET_SUCCESS);

      expect(dispatchRatingUpdateBetsAction).toHaveBeenCalledWith(
        storeMock.dispatch,
        stateMock.rating.numberOfBets + 1,
      );
    });

    it("should not call 'dispatchRateMyAppTriggeredAction'", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__PLACE_SBK_BET_SUCCESS);

      expect(dispatchRateMyAppTriggeredAction).not.toHaveBeenCalled();
    });

    describe("and matches the rating requirements", () => {
      it("should call 'dispatchRateMyAppTriggeredAction' with the expected arguments", () => {
        const nextSpy = jest.fn();
        ratingModule.checkRatingRequirements.mockReturnValueOnce(true);
        setup(nextSpy, NETWORK__PLACE_SBK_BET_SUCCESS);

        expect(dispatchRateMyAppTriggeredAction).toHaveBeenCalledWith(storeMock.dispatch);
      });
    });

    describe("and throttle is off", () => {
      it("should not call 'dispatchRateMyAppTriggeredAction'", () => {
        const nextSpy = jest.fn();
        rateMyAppMiddleware(ratingModule)({
          getState: () => ({
            rating: {
              numberOfBets: 1,
              session: "session mock",
            },
            entities: {
              throttles: {
                RATE_MY_APP: {
                  isActive: false,
                },
              },
            },
          }),
          dispatch: jest.fn(),
        })(nextSpy)({ type: NETWORK__PLACE_SBK_BET_SUCCESS });

        expect(dispatchRateMyAppTriggeredAction).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the action type is FETCH_CATALOGUE_SUCCESS", () => {
    it("should call 'checkRatingRequirements' with the expected arguments", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, FETCH_CATALOGUE_SUCCESS);

      expect(ratingModule.handleSession).toHaveBeenCalledWith(stateMock.rating.session);
    });

    it("should not prevent 'next' from being called", () => {
      const nextSpy = jest.fn();
      setup(nextSpy, NETWORK__PLACE_SBK_BET_SUCCESS);

      expect(nextSpy).toHaveBeenCalledTimes(1);
    });

    it("should call 'dispatchRatingUpdateSessionAction' with the expected arguments", () => {
      const nextSpy = jest.fn();
      ratingModule.handleSession.mockReturnValueOnce(stateMock.rating.session);
      setup(nextSpy, FETCH_CATALOGUE_SUCCESS);

      expect(dispatchRatingUpdateSessionAction).toHaveBeenCalledWith(storeMock.dispatch, stateMock.rating.session);
    });

    describe("and throttle is off", () => {
      it("should not call 'dispatchRateMyAppTriggeredAction'", () => {
        const nextSpy = jest.fn();
        rateMyAppMiddleware(ratingModule)({
          getState: () => ({
            rating: {
              numberOfBets: 1,
              session: "session mock",
            },
            entities: {
              throttles: {
                RATE_MY_APP: {
                  isActive: false,
                },
              },
            },
          }),
          dispatch: jest.fn(),
        })(nextSpy)({ type: FETCH_CATALOGUE_SUCCESS });

        expect(dispatchRateMyAppTriggeredAction).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the action type is unknown", () => {
    it("should ignore the action", () => {
      const nextSpy = jest.fn();
      const ACTION_MOCK = {
        type: "SOME_OTHER_ACTION",
        payload: "some payload",
      };

      setup(nextSpy, ACTION_MOCK.type, ACTION_MOCK.payload);

      expect(nextSpy).toHaveBeenCalledWith(ACTION_MOCK);
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });
});
