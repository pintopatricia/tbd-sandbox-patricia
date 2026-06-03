import BetMutationEligibilityObservable from "./bet-mutation-eligibility-observable";
import { betMutationEligibilityMiddleware } from "./bet-mutation-eligibility-middleware";
import { createGetThrottleSelector } from "../state";

const betUrnMock = "fake:bet:urn:12345";
const betIdMock = "12345";

const STATE_MOCK = {
  entities: {
    brandSettings: {
      ACCA_FREEZE: true,
    },
  },
  betting: {
    sportsbookbets: {},
  },
};

const getSportsbookBetByURN = jest.fn(() => ({
  urn: betUrnMock,
  betId: betIdMock,
}));

const nextSpy = jest.fn();
const dispatchSpy = jest.fn();
const getStateSpy = jest.fn(() => STATE_MOCK);

jest.mock("../state/entities/throttles/throttles-selectors", () => {
  const getThrottle = jest.fn(() => null);

  return {
    createGetThrottleSelector: () => getThrottle,
  };
});

jest.mock("../state/betting/sportsbook-bets/sportsbook-bets-selectors", () => ({
  createSportsbookBetSelector: jest.fn(() => () => getSportsbookBetByURN()),
}));

const subscribeSpy = jest.fn(() => "");
const addBetSpy = jest.fn(() => {});
const removeBetSpy = jest.fn(() => {});
const resetBetsSpy = jest.fn(() => {});

jest.mock("./bet-mutation-eligibility-observable", () => ({
  getInstance: jest.fn(() => ({
    subscribe: jest.fn(() => ""),
  })),
}));

describe("Bet Mutation Eligibility Middleware", () => {
  beforeEach(jest.clearAllMocks);

  describe("when ACCA_FREEZE throttle is not active", () => {
    beforeEach(() => {
      createGetThrottleSelector().mockReturnValueOnce({ isActive: false });
    });

    it("should not need any action to be provided", () => {
      expect(betMutationEligibilityMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)).not.toThrow();
    });

    it("should call 'next'", () => {
      betMutationEligibilityMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)();
      expect(nextSpy).toHaveBeenCalled();
    });
  });

  describe("when ACCA_FREEZE throttle and brand settings is active", () => {
    beforeEach(async () => {
      BetMutationEligibilityObservable.getInstance.mockReturnValue({
        subscribe: subscribeSpy,
        addBet: addBetSpy,
        removeBet: removeBetSpy,
        resetBets: resetBetsSpy,
      });
      createGetThrottleSelector().mockReturnValue({ isActive: true });

      const action = {
        type: "",
        payload: {},
      };
      await betMutationEligibilityMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
    });

    it("should subscribe to the betMutationEligibilityObservable to be notified whenever there are updates", () => {
      expect(subscribeSpy).toHaveBeenCalled();
    });

    describe("and action type is SUBSCRIBE_BET_MUTATION_ELIGIBILITY", () => {
      beforeEach(async () => {
        const action = {
          type: "SUBSCRIBE_BET_MUTATION_ELIGIBILITY",
          payload: {
            urn: betUrnMock,
          },
        };

        await betMutationEligibilityMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
      });

      it("should add the Bet to the pool of IDs to fetch from the BME service", () => {
        expect(addBetSpy).toHaveBeenCalledWith({
          betId: betIdMock,
        });
      });
    });

    describe("and action type is UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY", () => {
      beforeEach(async () => {
        const action = {
          type: "UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY",
          payload: {
            urn: betUrnMock,
          },
        };

        await betMutationEligibilityMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
      });

      it("should remove the subscription to the betMutationEligibilityObservable", () => {
        expect(removeBetSpy).toHaveBeenCalledWith(betIdMock);
      });
    });

    describe("and action type is 'UI/MY_BETS_ORDER_TYPE_FILTER_CLICK'", () => {
      beforeEach(async () => {
        const action = {
          type: "UI/MY_BETS_ORDER_TYPE_FILTER_CLICK",
        };

        await betMutationEligibilityMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)(action);
      });

      it("should reset the subscriptions to the betMutationEligibilityObservable", () => {
        expect(resetBetsSpy).toHaveBeenCalled();
      });
    });
  });
});
