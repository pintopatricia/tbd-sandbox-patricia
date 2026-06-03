import { getActiveThrottles } from "../state/entities/throttles/throttles-selectors";
import WinLoseVoidUpdatesObservable from "./win-lose-void-state-observable";
import { winLoseVoidUpdatesMiddleware } from "./win-lose-void-state-middleware";
import { ResultType } from "../clients/blh/bet-live-hypotheticals-response-types";

const betUrnMock = "fake:bet:urn:1";
const betLegUrnMock = "fake:leg:urn:1";
const legNumberMock = 1;
const marketIdMock = "11";
const selectionIdMock = 1;
const betTypeMock = "SINGLE";

const STATE_MOCK = {
  entities: {
    sportsbookbetlegs: {},
  },
  betting: {
    sportsbookbets: {
      [betUrnMock]: {
        resultType: ResultType.POTENTIAL,
        urn: betLegUrnMock,
      },
    },
  },
};

const getSportsbookBetByURN = jest.fn(() => ({
  urn: betUrnMock,
  resultType: ResultType.POTENTIAL,
  betType: betTypeMock,
}));

const getSportsbookBetLegsByURN = jest.fn(() => [
  {
    parts: [
      {
        marketId: marketIdMock,
        selectionId: selectionIdMock,
      },
    ],
    legNumber: legNumberMock,
    urn: betLegUrnMock,
  },
]);

const nextSpy = jest.fn();
const dispatchSpy = jest.fn();
const getStateSpy = jest.fn(() => STATE_MOCK);

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getActiveThrottles: jest.fn(() => []),
}));

jest.mock("../state/betting/sportsbook-bets/sportsbook-bets-selectors", () => ({
  createSportsbookBetSelector: jest.fn(() => () => getSportsbookBetByURN()),
}));
jest.mock("../state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors", () => ({
  createSportsbookBetLegsSelector: jest.fn(() => () => getSportsbookBetLegsByURN()),
}));

const subscribeSpy = jest.fn(() => "");
const addBetSpy = jest.fn(() => {});
const removeBetSpy = jest.fn(() => {});
const resetBetsSpy = jest.fn(() => {});

jest.mock(".//win-lose-void-state-observable", () => ({
  getInstance: jest.fn(() => ({
    subscribe: jest.fn(() => ""),
  })),
}));

describe("Win/Lose/Void Updates middleware", () => {
  beforeEach(jest.clearAllMocks);

  describe("when MY_BETS_WIN_LOSE_VOID throttle is not active", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      getActiveThrottles.mockReturnValue("[]");
    });

    it("should not need any action to be provided", () => {
      expect(winLoseVoidUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)).not.toThrow();
    });

    it("should call 'next'", () => {
      winLoseVoidUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)();
      expect(nextSpy).toHaveBeenCalled();
    });
  });

  describe("when MY_BETS_WIN_LOSE_VOID throttle is active", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      WinLoseVoidUpdatesObservable.getInstance.mockReturnValue({
        subscribe: subscribeSpy,
        addBet: addBetSpy,
        removeBet: removeBetSpy,
        resetBets: resetBetsSpy,
      });
      getActiveThrottles.mockReturnValue("[MY_BETS_WIN_LOSE_VOID]");

      const action = {
        type: "",
        payload: {},
      };
      await winLoseVoidUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
    });

    it("should subscribe to the winLoseVoidUpdatesObservable to be notified whenever there are updates", () => {
      expect(subscribeSpy).toHaveBeenCalled();
    });

    describe("and action type is 'SUBSCRIBE_BET_RESULT', with a Bet that has a result that hasn't been confirmed yet", () => {
      beforeEach(async () => {
        const action = {
          type: "SUBSCRIBE_BET_RESULT",
          payload: {
            urn: "betUrnMock",
          },
        };

        await winLoseVoidUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
      });

      it("should add the Bet to the pool of IDs to fetch from the BLH service", () => {
        expect(addBetSpy).toHaveBeenCalledWith({
          betType: "SINGLE",
          betURN: "fake:bet:urn:1",
          legs: [
            {
              legNumber: "1",
              runners: [
                {
                  id: "1",
                  marketId: "11",
                  result: null,
                },
              ],
            },
          ],
        });
      });
    });

    describe("and action type is 'SUBSCRIBE_BET_RESULT', with a Bet that has a result already confirmed", () => {
      beforeEach(async () => {
        const action = {
          type: "SUBSCRIBE_BET_RESULT",
          payload: {
            urn: "betUrnMock",
          },
        };

        getSportsbookBetByURN.mockReturnValue({ resultType: ResultType.CONFIRMED });
        await winLoseVoidUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
      });

      it("should not add the Bet to the pool of IDs to fetch from the BLH service", () => {
        expect(addBetSpy).not.toHaveBeenCalled();
      });
    });

    describe("and action type is 'UNSUBSCRIBE_BET_RESULT'", () => {
      beforeEach(async () => {
        const action = {
          type: "UNSUBSCRIBE_BET_RESULT",
          payload: {
            urn: "betUrnMock",
          },
        };

        await winLoseVoidUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
      });

      it("should remove the subscription to the winLoseVoidUpdatesObservable", () => {
        expect(removeBetSpy).toHaveBeenCalledWith("betUrnMock");
      });
    });

    describe("and action type is 'UI/MY_BETS_ORDER_TYPE_FILTER_CLICK'", () => {
      beforeEach(async () => {
        const action = {
          type: "UI/MY_BETS_ORDER_TYPE_FILTER_CLICK",
        };

        await winLoseVoidUpdatesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
      });

      it("should reset the subscriptions to the winLoseVoidUpdatesObservable", () => {
        expect(resetBetsSpy).toHaveBeenCalled();
      });
    });
  });
});
