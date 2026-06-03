import { getBetEligibility } from "../services/bme/bme-service";
import BetMutationEligibilityObservable from "./bet-mutation-eligibility-observable";
import { ResponseError } from "../clients/__generated__/bme/runtime";

const betIdMock = "7011";

const richContentUpdatesObservableSubscribeSpy = jest.fn(() => jest.fn((fn) => fn(false)));

const aValue = "distinguishable-from-empty";

jest.mock("../services/bme/bme-service", () => ({
  getBetEligibility: jest.fn(() => ({
    betEligibilities: [
      {
        betId: betIdMock,
        betMutationEligibility: [aValue],
        legs: [aValue],
      },
    ],
  })),
}));

jest.mock("../config", () => ({
  getInterval: jest.fn(() => 5000),
}));

jest.mock("./rich-content-updates-observable", () => ({
  getInstance: () => ({
    subscribe: () => richContentUpdatesObservableSubscribeSpy(),
  }),
}));

describe("BetMutationEligibilityObservable", () => {
  let observable;

  beforeAll(() => {
    jest.clearAllMocks();

    observable = BetMutationEligibilityObservable.getInstance();
  });

  describe("getInstance", () => {
    describe("when initializing the Observable", () => {
      it("should subscribe 'richContentUpdatesObservable' to check for fixture inplay status", () => {
        expect(richContentUpdatesObservableSubscribeSpy).toHaveBeenCalled();
      });
    });
  });

  describe("addBet", () => {
    describe("when adding a Bet that didn't exist in the pool before", () => {
      beforeEach(() => {
        observable.resetBets(); // clear any previous entries to the pool

        observable.addBet({
          betId: betIdMock,
        });
      });

      it("should add the Bet to the pool", () => {
        expect(observable.POOL.get(betIdMock)).toEqual({
          count: 1,
        });
      });
    });

    describe("when adding the same Bet to the pool multiple times", () => {
      beforeEach(() => {
        observable.resetBets(); // clear any previous entries to the pool

        const bet = {
          betId: betIdMock,
        };
        observable.addBet(bet);
        observable.addBet({
          ...bet,
        });
      });

      it("should increase the counter to the number of times the Bet is added to the pool", () => {
        expect(observable.POOL.get(betIdMock)).toEqual({
          count: 2,
        });
      });
    });
  });

  describe("removeBet", () => {
    describe("when removing a Bet that was added twice before", () => {
      beforeEach(() => {
        observable.resetBets(); // clear any previous entries to the pool

        const bet = {
          betId: betIdMock,
        };
        observable.addBet(bet);
        observable.addBet({
          ...bet,
        });

        observable.removeBet(bet.betId);
      });

      it("should decrease the counter to 1", () => {
        expect(observable.POOL.get(betIdMock)).toEqual({
          count: 1,
        });
      });
    });

    describe("when removing a Bet that added once before", () => {
      beforeEach(() => {
        observable.resetBets(); // clear any previous entries to the pool

        const bet = {
          betId: betIdMock,
        };
        observable.addBet(bet);
        observable.removeBet(bet.betId);
      });

      it("should remove completely the bet from the pool", () => {
        expect(observable.POOL.get(betIdMock)).toEqual(undefined);
      });
    });
  });

  describe("tick", () => {
    beforeEach(() => {
      observable.resetBets(); // clear any previous entries to the pool
    });

    describe("when triggering a tick and we get data", () => {
      beforeEach(() => {
        observable.notify = jest.fn();
        observable.tick();
      });

      it("should call getBetEligibility", () => {
        expect(getBetEligibility).toHaveBeenCalled();
      });

      it("should call 'notify'", () => {
        expect(observable.notify).toHaveBeenCalled();
      });
    });

    describe("when triggering a tick and we get partial data", () => {
      beforeAll(() => {
        observable.notify = jest.fn();
        observable.removeBet = jest.fn();
        observable.addBet({ betId: betIdMock });
        observable.addBet({ betId: "404404" });
        observable.tick();
      });

      it("should return empty BetEligibility for only the missing betIds", () => {
        expect(observable.notify).toHaveBeenCalledWith({
          updates: {
            betEligibilities: [
              {
                betId: "7011",
                betMutationEligibility: [aValue],
                legs: [aValue],
              },
              {
                betId: "404404",
                betMutationEligibility: [],
                legs: [],
              },
            ],
          },
        });
      });

      it("should remove missing betIds from Observable", () => {
        expect(observable.removeBet).toHaveBeenCalledWith("404404");
      });
    });

    describe("when triggering a tick and we don't get data", () => {
      beforeEach(() => {
        observable.notify = jest.fn();
        getBetEligibility.mockReturnValueOnce();
        observable.tick();
      });

      it("should call getBetsResult", () => {
        expect(getBetEligibility).toHaveBeenCalled();
      });

      it("should not call 'notify'", () => {
        expect(observable.notify).not.toHaveBeenCalled();
      });
    });

    describe("when triggering a tick and we get a non-404 error", () => {
      beforeAll(() => {
        getBetEligibility.mockImplementation(() => {
          throw new Error("http request failed");
        });
        observable.tick();
      });

      it("should notify subscribers about the error", () => {
        expect(observable.notify).toHaveBeenCalledWith({ error: "http request failed" });
      });
    });

    describe("when triggering a tick and we get a 404", () => {
      beforeAll(() => {
        observable.notify = jest.fn();
        observable.removeBet = jest.fn();
        observable.addBet({
          betId: betIdMock,
        });
        getBetEligibility.mockImplementation(() => {
          const response = { status: 404 };
          throw new ResponseError(response, "not found");
        });
        observable.tick();
      });

      it("should return an empty BetEligibility for the requested betIds", () => {
        expect(observable.notify).toHaveBeenCalledWith({
          updates: {
            betEligibilities: [
              {
                betId: "7011",
                betMutationEligibility: [],
                legs: [],
              },
            ],
          },
        });
      });

      it("should remove requested betIds from Observable", () => {
        expect(observable.removeBet).toHaveBeenCalledWith("7011");
      });
    });
  });
});
