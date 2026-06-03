import fixedOddsCashoutQuotesUpdatesObserver from "./fixed-odds-cashout-quotes-observable";
import { fixedOddsCashoutQuotesUpdatesMiddleware } from "./fixed-odds-cashout-quotes-middleware";
import { UI__MY_BETS_ORDER_TYPE_FILTER_CLICK } from "../actions/my-bets";
import { UPDATE_PRODUCT_PREFERENCE } from "../actions/preferences";
import { PUSH } from "../actions";
import { NETWORK__CASHOUT_TAKE } from "../actions/cashout";
import cashoutService from "../services/cashout-service";

jest.mock("../services/cashout-service", () => ({
  takeSBK: jest.fn(),
}));

const dispatchSpy = jest.fn();
const getStateSpy = jest.fn(() => ({
  betting: {
    sportsbookbets: {},
  },
  entities: {
    throttles: {},
  },
}));

const nextSpy = jest.fn();
const subscribeSpy = jest.fn();
const addBetSpy = jest.fn();
const removeBetSpy = jest.fn();
const resetBetsSpy = jest.fn();
const restartBetsSpy = jest.fn();

jest.mock("./fixed-odds-cashout-quotes-observable", () => ({
  getInstance: jest.fn(),
}));

function setup() {
  fixedOddsCashoutQuotesUpdatesObserver.getInstance.mockReturnValue({
    subscribe: subscribeSpy,
    addBet: addBetSpy,
    removeBet: removeBetSpy,
    resetBets: resetBetsSpy,
    restart: restartBetsSpy,
  });
}

describe("Fixed Odds Cashout Quotes Updates middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setup();
  });

  describe("when initializing the observer", () => {
    it("should get the observable instance and subscribe to it", async () => {
      const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
        nextSpy,
      );

      await middleware({ type: "ANY_ACTION" });

      expect(fixedOddsCashoutQuotesUpdatesObserver.getInstance).toHaveBeenCalled();
      expect(subscribeSpy).toHaveBeenCalled();
    });
  });

  describe("on MY_BETS_SUBSCRIBE_CARD_UPDATES action", () => {
    const betURN = "URN:sportsbook-bet:12345678";
    const betId = "12345678";

    describe("when the bet exists", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValueOnce({
          betting: {
            sportsbookbets: {
              [betURN]: {
                urn: betURN,
                betId,
              },
            },
          },
          entities: {
            throttles: {},
          },
        });

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: "MY_BETS_SUBSCRIBE_CARD_UPDATES",
          payload: { urn: betURN },
        });
      });

      it("should call next with the action", () => {
        expect(nextSpy).toHaveBeenCalledWith({
          type: "MY_BETS_SUBSCRIBE_CARD_UPDATES",
          payload: { urn: betURN },
        });
      });

      it("should add the bet to the observable", () => {
        expect(addBetSpy).toHaveBeenCalledWith({ betURN, betId });
      });
    });

    describe("when the bet doesn't exist", () => {
      beforeEach(async () => {
        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: "MY_BETS_SUBSCRIBE_CARD_UPDATES",
          payload: { urn: betURN },
        });
      });

      it("should not add the bet to the observable", () => {
        expect(addBetSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("on MY_BETS_UNSUBSCRIBE_CARD_UPDATES action", () => {
    const betURN = "URN:sportsbook-bet:12345678";

    beforeEach(async () => {
      const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
        nextSpy,
      );

      await middleware({
        type: "MY_BETS_UNSUBSCRIBE_CARD_UPDATES",
        payload: { urn: betURN },
      });
    });

    it("should call next with the action", () => {
      expect(nextSpy).toHaveBeenCalledWith({
        type: "MY_BETS_UNSUBSCRIBE_CARD_UPDATES",
        payload: { urn: betURN },
      });
    });

    it("should remove the bet from the observable", () => {
      expect(removeBetSpy).toHaveBeenCalledWith(betURN);
    });
  });

  describe("on UI__MY_BETS_ORDER_TYPE_FILTER_CLICK action", () => {
    beforeEach(async () => {
      const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
        nextSpy,
      );

      await middleware({
        type: UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
        payload: {},
      });
    });

    it("should call next with the action", () => {
      expect(nextSpy).toHaveBeenCalledWith({
        type: UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
        payload: {},
      });
    });

    it("should reset all bets in the observable", () => {
      expect(resetBetsSpy).toHaveBeenCalled();
    });
  });

  describe("on UPDATE_PRODUCT_PREFERENCE action", () => {
    beforeEach(async () => {
      const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
        nextSpy,
      );

      await middleware({
        type: UPDATE_PRODUCT_PREFERENCE,
        payload: {},
      });
    });

    it("should call next with the action", () => {
      expect(nextSpy).toHaveBeenCalledWith({
        type: UPDATE_PRODUCT_PREFERENCE,
        payload: {},
      });
    });

    it("should reset all bets in the observable", () => {
      expect(resetBetsSpy).toHaveBeenCalled();
    });
  });

  describe("on PUSH action", () => {
    describe("when navigating to MyBetsView", () => {
      beforeEach(async () => {
        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: PUSH,
          payload: { viewUrn: "ppb:tbd:view:myBets:123" },
        });
      });

      it("should call next with the action", () => {
        expect(nextSpy).toHaveBeenCalledWith({
          type: PUSH,
          payload: { viewUrn: "ppb:tbd:view:myBets:123" },
        });
      });

      it("should not reset the poller", () => {
        expect(resetBetsSpy).not.toHaveBeenCalled();
      });
    });

    describe("when navigating to a different view", () => {
      beforeEach(async () => {
        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: PUSH,
          payload: { viewUrn: "URN:event-view:123" },
        });
      });

      it("should call next with the action", () => {
        expect(nextSpy).toHaveBeenCalledWith({
          type: PUSH,
          payload: { viewUrn: "URN:event-view:123" },
        });
      });

      it("should reset the poller", () => {
        expect(resetBetsSpy).toHaveBeenCalled();
      });
    });
  });

  describe("on NETWORK__CASHOUT_TAKE action", () => {
    const cashoutUrn = "URN:sportsbook-cashout:12345678";
    const betUrn = "URN:sportsbook-bet:12345678";
    const betId = "12345678";
    const legUrn = "URN:sportsbook-bet-leg:1";

    describe("when the quote doesn't exist", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValue({
          betting: {
            sportsbookbets: {},
            sportsbookcashouts: {},
          },
          entities: {
            throttles: {},
            sportsbookbetlegs: {},
          },
        });

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: NETWORK__CASHOUT_TAKE,
          payload: { cashoutUrn },
        });
      });

      it("should not dispatch any actions", () => {
        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when the quote step is CASHING_OUT", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValue({
          betting: {
            sportsbookbets: {},
            sportsbookcashouts: {
              [cashoutUrn]: {
                step: "CASHING_OUT",
              },
            },
          },
          entities: {
            throttles: {},
            sportsbookbetlegs: {},
          },
        });

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: NETWORK__CASHOUT_TAKE,
          payload: { cashoutUrn },
        });
      });

      it("should not dispatch any actions", () => {
        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when the bet doesn't exist", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValue({
          betting: {
            sportsbookbets: {},
            sportsbookcashouts: {
              [cashoutUrn]: {
                step: "DISPLAY",
                betUrn,
                quote: 100,
                stake: 50,
                cashOutToken: "token123",
              },
            },
          },
          entities: {
            throttles: {},
            sportsbookbetlegs: {},
          },
        });

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: NETWORK__CASHOUT_TAKE,
          payload: { cashoutUrn },
        });
      });

      it("should not dispatch any actions", () => {
        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when the first leg doesn't exist", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValue({
          betting: {
            sportsbookbets: {
              [betUrn]: {
                betId,
                legs: [legUrn],
                betType: "SINGLE",
                numLines: 1,
                isSGM: false,
              },
            },
            sportsbookcashouts: {
              [cashoutUrn]: {
                step: "DISPLAY",
                betUrn,
                quote: 100,
                stake: 50,
                cashOutToken: "token123",
              },
            },
          },
          entities: {
            throttles: {},
            sportsbookbetlegs: {},
          },
        });

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: NETWORK__CASHOUT_TAKE,
          payload: { cashoutUrn },
        });
      });

      it("should not dispatch any actions", () => {
        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe("when takeSBK succeeds", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValue({
          betting: {
            sportsbookbets: {
              [betUrn]: {
                betId,
                legs: [legUrn],
                betType: "SINGLE",
                numLines: 1,
                isSGM: false,
              },
            },
            sportsbookcashouts: {
              [cashoutUrn]: {
                step: "DISPLAY",
                betUrn,
                quote: 100,
                stake: 50,
                cashOutToken: "token123",
                betDelay: 0,
              },
            },
          },
          entities: {
            throttles: {},
            sportsbookbetlegs: {
              [legUrn]: {
                parts: [
                  {
                    eventDescription: "Team A vs Team B",
                    eventMarketDescription: "Match Winner",
                  },
                ],
              },
            },
          },
        });

        cashoutService.takeSBK.mockResolvedValue({
          respStatus: "SUCCESS",
          cashedOutQuote: 100,
        });

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: NETWORK__CASHOUT_TAKE,
          payload: { cashoutUrn },
        });
      });

      it("should dispatch take cashout in progress action", () => {
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "NETWORK/CASHOUT_TAKE_IN_PROGRESS",
          payload: { cashoutUrn },
        });
      });

      it("should call takeSBK service with correct parameters", () => {
        expect(cashoutService.takeSBK).toHaveBeenCalledWith(0, "12345678", "token123", 100);
      });

      it("should dispatch take cashout success action", () => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "NETWORK/CASHOUT_TAKE_SUCCESS",
            payload: expect.objectContaining({
              product: "Sportsbook",
              errorCode: "SUCCESS",
            }),
          }),
        );
      });

      it("should restart the poller", () => {
        expect(restartBetsSpy).toHaveBeenCalled();
      });
    });

    describe("when takeSBK fails with respStatus", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValue({
          betting: {
            sportsbookbets: {
              [betUrn]: {
                betId,
                legs: [legUrn],
                betType: "SINGLE",
                numLines: 1,
                isSGM: false,
              },
            },
            sportsbookcashouts: {
              [cashoutUrn]: {
                step: "DISPLAY",
                betUrn,
                quote: 100,
                stake: 50,
                cashOutToken: "token123",
                betDelay: 0,
              },
            },
          },
          entities: {
            throttles: {},
            sportsbookbetlegs: {
              [legUrn]: {
                parts: [
                  {
                    eventDescription: "Team A vs Team B",
                    eventMarketDescription: "Match Winner",
                  },
                ],
              },
            },
          },
        });

        cashoutService.takeSBK.mockResolvedValue({
          respStatus: "ODDS_CHANGED",
        });

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: NETWORK__CASHOUT_TAKE,
          payload: { cashoutUrn },
        });
      });

      it("should dispatch take cashout failure action", () => {
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "NETWORK/CASHOUT_TAKE_FAILURE_SBK",
          payload: {
            entityURN: cashoutUrn,
            errorCode: "ODDS_CHANGED",
          },
        });
      });

      it("should not restart the poller", () => {
        expect(restartBetsSpy).not.toHaveBeenCalled();
      });
    });

    describe("when takeSBK fails without respStatus", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValue({
          betting: {
            sportsbookbets: {
              [betUrn]: {
                betId,
                legs: [legUrn],
                betType: "SINGLE",
                numLines: 1,
                isSGM: false,
              },
            },
            sportsbookcashouts: {
              [cashoutUrn]: {
                step: "DISPLAY",
                betUrn,
                quote: 100,
                stake: 50,
                cashOutToken: "token123",
                betDelay: 0,
              },
            },
          },
          entities: {
            throttles: {},
            sportsbookbetlegs: {
              [legUrn]: {
                parts: [
                  {
                    eventDescription: "Team A vs Team B",
                    eventMarketDescription: "Match Winner",
                  },
                ],
              },
            },
          },
        });

        cashoutService.takeSBK.mockResolvedValue({});

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: NETWORK__CASHOUT_TAKE,
          payload: { cashoutUrn },
        });
      });

      it("should dispatch take cashout failure action", () => {
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "NETWORK/CASHOUT_TAKE_FAILURE_SBK",
          payload: {
            entityURN: cashoutUrn,
            errorCode: "GENERIC",
          },
        });
      });

      it("should not restart the poller", () => {
        expect(restartBetsSpy).not.toHaveBeenCalled();
      });
    });

    describe("when takeSBK throws an error with errorCode", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValue({
          betting: {
            sportsbookbets: {
              [betUrn]: {
                betId,
                legs: [legUrn],
                betType: "SINGLE",
                numLines: 1,
                isSGM: false,
              },
            },
            sportsbookcashouts: {
              [cashoutUrn]: {
                step: "DISPLAY",
                betUrn,
                quote: 100,
                stake: 50,
                cashOutToken: "token123",
                betDelay: 0,
              },
            },
          },
          entities: {
            throttles: {},
            sportsbookbetlegs: {
              [legUrn]: {
                parts: [
                  {
                    eventDescription: "Team A vs Team B",
                    eventMarketDescription: "Match Winner",
                  },
                ],
              },
            },
          },
        });

        const error = new Error("Network error");
        error.errorCode = "NETWORK_ERROR";
        cashoutService.takeSBK.mockRejectedValue(error);

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: NETWORK__CASHOUT_TAKE,
          payload: { cashoutUrn },
        });
      });

      it("should dispatch take cashout failure action", () => {
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "NETWORK/CASHOUT_TAKE_FAILURE_SBK",
          payload: {
            entityURN: cashoutUrn,
            errorCode: "NETWORK_ERROR",
          },
        });
      });

      it("should not restart the poller", () => {
        expect(restartBetsSpy).not.toHaveBeenCalled();
      });
    });

    describe("when takeSBK throws an error without errorCode", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValue({
          betting: {
            sportsbookbets: {
              [betUrn]: {
                betId,
                legs: [legUrn],
                betType: "SINGLE",
                numLines: 1,
                isSGM: false,
              },
            },
            sportsbookcashouts: {
              [cashoutUrn]: {
                step: "DISPLAY",
                betUrn,
                quote: 100,
                stake: 50,
                cashOutToken: "token123",
                betDelay: 0,
              },
            },
          },
          entities: {
            throttles: {},
            sportsbookbetlegs: {
              [legUrn]: {
                parts: [
                  {
                    eventDescription: "Team A vs Team B",
                    eventMarketDescription: "Match Winner",
                  },
                ],
              },
            },
          },
        });

        const error = new Error("Network error");
        cashoutService.takeSBK.mockRejectedValue(error);

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: NETWORK__CASHOUT_TAKE,
          payload: { cashoutUrn },
        });
      });

      it("should dispatch take cashout failure action", () => {
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "NETWORK/CASHOUT_TAKE_FAILURE_SBK",
          payload: {
            entityURN: cashoutUrn,
            errorCode: "GENERIC",
          },
        });
      });

      it("should not restart the poller", () => {
        expect(restartBetsSpy).not.toHaveBeenCalled();
      });
    });

    describe("when takeSBK throws an unauthorized error with CASHOUT_AUTH_REDIRECT throttle on", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValue({
          betting: {
            sportsbookbets: {
              [betUrn]: {
                betId,
                legs: [legUrn],
                betType: "SINGLE",
                numLines: 1,
                isSGM: false,
              },
            },
            sportsbookcashouts: {
              [cashoutUrn]: {
                step: "DISPLAY",
                betUrn,
                quote: 100,
                stake: 50,
                cashOutToken: "token123",
                betDelay: 0,
              },
            },
          },
          entities: {
            throttles: {
              CASHOUT_AUTH_REDIRECT: { isActive: true },
            },
            sportsbookbetlegs: {
              [legUrn]: {
                parts: [
                  {
                    eventDescription: "Team A vs Team B",
                    eventMarketDescription: "Match Winner",
                  },
                ],
              },
            },
          },
        });

        const error = new Error("Unauthorized - StatusCode=401");
        error.errorCode = "UNAUTHORIZED";
        cashoutService.takeSBK.mockRejectedValue(error);

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: NETWORK__CASHOUT_TAKE,
          payload: { cashoutUrn },
        });
      });

      it("should dispatch take cashout failure action", () => {
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "NETWORK/CASHOUT_TAKE_FAILURE_SBK",
          payload: {
            entityURN: cashoutUrn,
            errorCode: "UNAUTHORIZED",
          },
        });
      });

      it("should dispatch auth failure action", () => {
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "NETWORK/CASHOUT_TAKE_AUTH_FAILURE_SBK",
        });
      });

      it("should not restart the poller", () => {
        expect(restartBetsSpy).not.toHaveBeenCalled();
      });
    });

    describe("when takeSBK throws an unauthorized error with CASHOUT_AUTH_REDIRECT throttle off", () => {
      beforeEach(async () => {
        getStateSpy.mockReturnValue({
          betting: {
            sportsbookbets: {
              [betUrn]: {
                betId,
                legs: [legUrn],
                betType: "SINGLE",
                numLines: 1,
                isSGM: false,
              },
            },
            sportsbookcashouts: {
              [cashoutUrn]: {
                step: "DISPLAY",
                betUrn,
                quote: 100,
                stake: 50,
                cashOutToken: "token123",
                betDelay: 0,
              },
            },
          },
          entities: {
            throttles: {
              CASHOUT_AUTH_REDIRECT: { isActive: false },
            },
            sportsbookbetlegs: {
              [legUrn]: {
                parts: [
                  {
                    eventDescription: "Team A vs Team B",
                    eventMarketDescription: "Match Winner",
                  },
                ],
              },
            },
          },
        });

        const error = new Error("Unauthorized - StatusCode=401");
        error.errorCode = "UNAUTHORIZED";
        cashoutService.takeSBK.mockRejectedValue(error);

        const middleware = fixedOddsCashoutQuotesUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(
          nextSpy,
        );

        await middleware({
          type: NETWORK__CASHOUT_TAKE,
          payload: { cashoutUrn },
        });
      });

      it("should dispatch take cashout failure action", () => {
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "NETWORK/CASHOUT_TAKE_FAILURE_SBK",
          payload: {
            entityURN: cashoutUrn,
            errorCode: "UNAUTHORIZED",
          },
        });
      });

      it("should not dispatch auth failure action", () => {
        expect(dispatchSpy).not.toHaveBeenCalledWith({
          type: "NETWORK/CASHOUT_TAKE_AUTH_FAILURE_SBK",
        });
      });

      it("should not restart the poller", () => {
        expect(restartBetsSpy).not.toHaveBeenCalled();
      });
    });
  });
});
