import { ELIGIBLE_KEEP_ALIVE_ACTIONS, keepAliveMiddleware } from "./keep-alive-middleware";

const getThrottle = jest.fn();
jest.mock("../state", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

const getUserDetails = jest.fn().mockReturnValue({});
jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

const stateMock = { entities: {} };
const keepAliveFnSpy = jest.fn();
const getStateSpy = jest.fn().mockReturnValue(stateMock);
const nextSpy = jest.fn();
const actionMock = {
  type: "some action",
  payload: "some payload",
};

const setup = ({ action = actionMock } = {}) =>
  keepAliveMiddleware(keepAliveFnSpy)({ getState: getStateSpy })(nextSpy)(action);

describe("Keep Alive middleware", () => {
  beforeEach(jest.clearAllMocks);

  it("should forward action to next middlewares", () => {
    setup();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(nextSpy).toHaveBeenCalledWith(actionMock);
  });

  describe("when action is not eligible for keep alive", () => {
    describe("and the throttle is active", () => {
      beforeEach(() => {
        getThrottle.mockReturnValueOnce({ isActive: true });
      });

      describe("and the user is logged in", () => {
        beforeEach(() => {
          getUserDetails.mockReturnValueOnce({ loggedIn: true });
        });

        it("should not call keepAliveFn", () => {
          setup({
            action: {
              type: "NOT_ELIGIBLE_ACTION",
              payload: "some payload",
            },
          });

          expect(keepAliveFnSpy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe.each(ELIGIBLE_KEEP_ALIVE_ACTIONS)("when action type is %s", (actionType) => {
    it("should call getUserDetails", () => {
      setup({
        action: {
          type: actionType,
          payload: "some payload",
        },
      });

      expect(getUserDetails).toHaveBeenCalledTimes(1);
      expect(getUserDetails).toHaveBeenCalledWith(stateMock);
    });

    describe("the user is logged out", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValueOnce({ loggedIn: false });
      });

      it("should not call keepAliveFn", () => {
        setup({
          action: {
            type: actionType,
            payload: "some payload",
          },
        });

        expect(keepAliveFnSpy).not.toHaveBeenCalled();
      });
    });

    describe("the user is logged in", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValueOnce({ loggedIn: true });
      });

      it("should call keepAliveFn", () => {
        setup({
          action: {
            type: actionType,
            payload: "some payload",
          },
        });

        expect(keepAliveFnSpy).toHaveBeenCalledTimes(1);
        expect(keepAliveFnSpy).toHaveBeenCalledWith();
      });
    });
  });
});
