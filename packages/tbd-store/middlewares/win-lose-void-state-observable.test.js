import betLiveHypotheticalsService from "../services/bet-live-hypotheticals-service";
import WinLoseVoidStateUpdatesObservable from "./win-lose-void-state-observable";

const richContentUpdatesObservableSubscribeSpy = jest.fn(() => jest.fn((fn) => fn(false)));

jest.mock("../services/bet-live-hypotheticals-service", () => ({
  getBetsResult: jest.fn(() => ({
    resultType: "POTENTIAL",
    result: "WIN",
    legs: [],
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

describe("WinLoseVoidStateUpdatesObservable", () => {
  let observable;
  beforeAll(() => {
    jest.clearAllMocks();

    observable = WinLoseVoidStateUpdatesObservable.getInstance();
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
        jest.clearAllMocks();
        observable.resetBets(); // clear any previous entries to the pool

        observable.addBet({
          betURN: "mockURN",
          betType: "DOUBLE",
          legs: [],
        });
      });

      it("should add the Bet to the pool", () => {
        expect(observable.POOL.get("mockURN")).toEqual({
          betURN: "mockURN",
          betType: "DOUBLE",
          legs: [],
          count: 1,
        });
      });
    });

    describe("when adding the same Bet to the pool multiple times", () => {
      beforeEach(() => {
        observable.resetBets(); // clear any previous entries to the pool

        const bet = {
          betURN: "mockURN",
          betType: "DOUBLE",
          legs: [],
        };
        observable.addBet(bet);
        observable.addBet({
          ...bet,
          legs: [{}, {}],
        });
      });

      it("should increase the counter to the number of times the Bet is added to the pool", () => {
        expect(observable.POOL.get("mockURN")).toEqual({
          count: 2,
          betURN: "mockURN",
          betType: "DOUBLE",
          legs: [{}, {}],
        });
      });
    });
  });

  describe("tick", () => {
    beforeAll(() => {
      jest.clearAllMocks();
      observable.resetBets(); // clear any previous entries to the pool
      observable.restart = jest.fn();
    });

    describe("when triggering a tick and we get data", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        observable.notify = jest.fn();
        observable.tick();
      });

      it("should call getBetsResult", () => {
        expect(betLiveHypotheticalsService.getBetsResult).toHaveBeenCalled();
      });

      it("should call 'notify'", () => {
        expect(observable.notify).toHaveBeenCalled();
      });

      describe("and all legs for a given Bet are 'confirmed'", () => {
        beforeEach(() => {
          jest.clearAllMocks();

          observable.addBet({
            betURN: "mockURN",
            betType: "DOUBLE",
            legs: [],
          });
          betLiveHypotheticalsService.getBetsResult.mockReturnValueOnce([
            {
              urn: "mockURN",
              resultType: "POTENTIAL",
              result: "WIN",
              legs: [
                { runners: [{ resultType: "CONFIRMED" }, { resultType: "CONFIRMED" }, { resultType: "CONFIRMED" }] },
              ],
            },
          ]);

          observable.tick();
        });

        it("should remove the Bet from the POOL", () => {
          expect(observable.POOL.get("mockURN")).toBeUndefined();
        });
      });

      describe("and only some legs are 'confirmed'", () => {
        beforeEach(() => {
          jest.clearAllMocks();
          observable.resetBets();

          observable.addBet({
            betURN: "mockURN1",
            betType: "DOUBLE",
            legs: [],
          });

          betLiveHypotheticalsService.getBetsResult.mockReturnValueOnce([
            {
              urn: "mockURN1",
              resultType: "POTENTIAL",
              result: "WIN",
              legs: [
                {
                  runners: [
                    { resultType: "CONFIRMED", result: "WIN" },
                    { resultType: "POTENTIAL", result: "WIN" },
                    { resultType: "CONFIRMED", result: "WIN" },
                  ],
                },
              ],
            },
          ]);

          observable.tick();
        });

        it("should update the POOL to identify that leg as 'confirmed'", () => {
          expect(observable.POOL.get("mockURN1")).toEqual({
            betType: "DOUBLE",
            count: 1,
            legs: [
              {
                runners: [{ result: "WIN" }, { result: null }, { result: "WIN" }],
              },
            ],
          });
        });
      });
    });

    describe("when triggering a tick and we don't get data", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        observable.notify = jest.fn();
        betLiveHypotheticalsService.getBetsResult.mockReturnValueOnce();
        observable.tick();
      });

      it("should call getBetsResult", () => {
        expect(betLiveHypotheticalsService.getBetsResult).toHaveBeenCalled();
      });

      it("should not call 'notify'", () => {
        expect(observable.notify).not.toHaveBeenCalled();
      });

      describe("and all legs for a given Bet are 'confirmed'", () => {
        beforeEach(() => {
          jest.clearAllMocks();
          betLiveHypotheticalsService.getBetsResult.mockReturnValueOnce([
            {
              urn: "mockURN",
              resultType: "POTENTIAL",
              result: "WIN",
              legs: [
                { runners: [{ resultType: "CONFIRMED" }, { resultType: "CONFIRMED" }, { resultType: "CONFIRMED" }] },
              ],
            },
          ]);

          observable.tick();
        });

        it("should remove the Bet from the POOL", () => {
          expect(observable.POOL.get("mockURN")).toBeUndefined();
        });
      });

      describe("and only some legs are 'confirmed'", () => {
        beforeEach(() => {
          jest.clearAllMocks();
          observable.resetBets();

          observable.addBet({
            betURN: "mockURN1",
            betType: "DOUBLE",
            legs: [],
          });

          betLiveHypotheticalsService.getBetsResult.mockReturnValueOnce([
            {
              urn: "mockURN1",
              resultType: "POTENTIAL",
              result: "WIN",
              legs: [
                {
                  runners: [
                    { resultType: "CONFIRMED", result: "WIN" },
                    { resultType: "POTENTIAL", result: "WIN" },
                    { resultType: "CONFIRMED", result: "WIN" },
                  ],
                },
              ],
            },
          ]);

          observable.tick();
        });

        it("should update the POOL to identify that leg as 'confirmed'", () => {
          expect(observable.POOL.get("mockURN1")).toEqual({
            betType: "DOUBLE",
            count: 1,
            legs: [
              {
                runners: [{ result: "WIN" }, { result: null }, { result: "WIN" }],
              },
            ],
          });
        });
      });
    });

    describe("when triggering a tick and we get an error", () => {
      beforeAll(() => {
        jest.clearAllMocks();

        betLiveHypotheticalsService.getBetsResult.mockImplementation(() => {
          throw new Error("http request failed");
        });
        observable.notify = jest.fn();
        observable.tick();
      });

      it("should notify subscribers about the error", () => {
        expect(observable.notify).toHaveBeenCalledWith({ error: "http request failed" });
      });
    });
  });

  describe("request", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      observable.resetBets(); // clear any previous entries to the pool
    });

    describe("when there are events with the 'isLite' flag", () => {
      beforeEach(() => {
        observable.addBet({
          betURN: "mockURN",
          betType: "SINGLE",
          legs: [],
        });

        observable.request();
      });

      it("should call 'getScaUpdates' with the 'isLite' flag set to true", () => {
        expect(betLiveHypotheticalsService.getBetsResult).toHaveBeenCalledWith({
          bets: [{ betType: "SINGLE", legs: [] }],
          urnList: ["mockURN"],
        });
      });
    });
  });
});
