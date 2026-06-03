import cashoutService from "../services/cashout-service";
import FixedOddsCashoutQuotesUpdatesObservable from "./fixed-odds-cashout-quotes-observable";
import HttpPollerObservable from "./http-poller/http-poller-observable";
import HttpPoller from "./http-poller/http-poller";

jest.mock("../services/cashout-service", () => ({
  betQuotes: jest.fn(),
}));

describe("FixedOddsCashoutQuotesUpdatesObservable", () => {
  let observable;
  let superRestartSpy;
  let superResetSpy;
  let superRemoveSpy;
  let superSetPollIntervalSpy;
  let superNotifySpy;

  beforeAll(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    observable = FixedOddsCashoutQuotesUpdatesObservable.getInstance();
    superRestartSpy = jest.spyOn(HttpPollerObservable.prototype, "restart");
    superResetSpy = jest.spyOn(HttpPollerObservable.prototype, "reset");
    superRemoveSpy = jest.spyOn(HttpPollerObservable.prototype, "remove");
    superSetPollIntervalSpy = jest.spyOn(HttpPoller.prototype, "setPollInterval");
    superNotifySpy = jest.spyOn(HttpPollerObservable.prototype, "notify");
  });

  describe("addBet", () => {
    describe("when adding a bet that didn't exist in the pool before", () => {
      beforeEach(() => {
        observable.addBet({
          betId: "12345678",
          betURN: "URN:12345678",
        });
      });

      it("should add the bet to the pool", () => {
        expect(observable.POOL.get("URN:12345678")).toEqual({
          betId: "12345678",
          betURN: "URN:12345678",
          count: 1,
        });
      });

      describe("and the same bet is added", () => {
        beforeEach(() => {
          observable.addBet({
            betId: "12345678",
            betURN: "URN:12345678",
          });
        });

        it("should not increment the count on the POOL", () => {
          expect(observable.POOL.get("URN:12345678")).toEqual({
            betId: "12345678",
            betURN: "URN:12345678",
            count: 1,
          });
        });
      });
    });
  });

  describe("resetBets", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      observable.addBet({
        betId: "12345678",
        betURN: "URN:12345678",
      });

      observable.addBet({
        betId: "87654321",
        betURN: "URN:87654321",
      });

      observable.resetBets();
    });

    it("should call the HttpPollerObservable reset", () => {
      expect(superResetSpy).toHaveBeenCalled();
    });

    it("should clear the POOL", () => {
      expect(observable.POOL.size).toBe(0);
    });
  });

  describe("removeBet", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      observable.addBet({
        betId: "12345678",
        betURN: "URN:12345678",
      });

      observable.addBet({
        betId: "87654321",
        betURN: "URN:87654321",
      });

      observable.removeBet("URN:87654321");
    });

    it("should call the HttpPollerObservable remove", () => {
      expect(superRemoveSpy).toHaveBeenCalled();
    });

    it("should only have one bet in the POOL", () => {
      expect(observable.POOL.size).toBe(1);
      expect(observable.POOL.get("URN:12345678")).toEqual({
        betId: "12345678",
        betURN: "URN:12345678",
        count: 1,
      });
    });
  });

  describe("restart", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      observable.restart();
    });

    it("should call the HttpPollerObservable restart", () => {
      expect(superRestartSpy).toHaveBeenCalled();
    });
  });

  describe("request", () => {
    let requestResult;
    const quotesResponse = {
      12345678: {
        betDelay: 0,
        betUrn: "URN:12345678",
        cashOutToken: "cashOutToken",
        quote: 10,
        stake: 9,
        step: "DISPLAY",
        refreshRate: 10,
      },
      87654321: {
        betDelay: 0,
        betUrn: "URN:87654321",
        cashOutToken: "cashOutToken",
        quote: 10,
        stake: 9,
        step: "DISPLAY",
        refreshRate: 10,
      },
    };

    beforeEach(async () => {
      jest.resetAllMocks();

      observable.addBet({
        betId: "12345678",
        betURN: "URN:12345678",
      });

      observable.addBet({
        betId: "87654321",
        betURN: "URN:87654321",
      });

      cashoutService.betQuotes.mockReturnValueOnce(quotesResponse);

      requestResult = await observable.request();
    });

    it("should call 'betQuotes' with the subscribed bet ids", () => {
      expect(cashoutService.betQuotes).toHaveBeenCalledWith(["12345678", "87654321"]);
    });

    it("should return the quotes given by the service", () => {
      expect(requestResult).toEqual(quotesResponse);
    });
  });

  describe("tick", () => {
    const twoQuotesWithResetRefreshRates = {
      12345678: {
        betDelay: 0,
        betUrn: "URN:12345678",
        cashOutToken: "cashOutToken",
        quote: 10,
        stake: 9,
        step: "DISPLAY",
        refreshRate: 10,
      },
      87654321: {
        betDelay: 0,
        betUrn: "URN:87654321",
        cashOutToken: "cashOutToken",
        quote: 10,
        stake: 9,
        step: "DISPLAY",
        refreshRate: 10,
      },
    };

    const twoQuotesWithoutRefreshRates = {
      12345678: {
        betDelay: 0,
        betUrn: "URN:12345678",
        cashOutToken: "cashOutToken",
        quote: 10,
        stake: 9,
        step: "DISPLAY",
      },
      87654321: {
        betDelay: 0,
        betUrn: "URN:87654321",
        cashOutToken: "cashOutToken",
        quote: 10,
        stake: 9,
        step: "DISPLAY",
      },
    };

    const twoQuotesWithDifferentRefreshRates = {
      12345678: {
        betDelay: 0,
        betUrn: "URN:12345678",
        cashOutToken: "cashOutToken",
        quote: 10,
        stake: 9,
        step: "DISPLAY",
        refreshRate: 10,
      },
      87654321: {
        betDelay: 0,
        betUrn: "URN:87654321",
        cashOutToken: "cashOutToken",
        quote: 10,
        stake: 9,
        step: "DISPLAY",
        refreshRate: 5,
      },
    };

    const oneQuoteWithRefreshRate = {
      12345678: {
        betDelay: 0,
        betUrn: "URN:12345678",
        cashOutToken: "cashOutToken",
        quote: 10,
        stake: 9,
        step: "DISPLAY",
      },
      87654321: {
        betDelay: 0,
        betUrn: "URN:87654321",
        cashOutToken: "cashOutToken",
        quote: 10,
        stake: 9,
        step: "DISPLAY",
        refreshRate: 5,
      },
    };

    beforeAll(async () => {
      jest.resetAllMocks();

      observable.addBet({
        betId: "12345678",
        betURN: "URN:12345678",
      });

      observable.addBet({
        betId: "87654321",
        betURN: "URN:87654321",
      });
    });

    describe("when cashout service trows an error", () => {
      const error = new Error("Cashout service error");

      beforeEach(async () => {
        jest.resetAllMocks();

        cashoutService.betQuotes.mockImplementationOnce(() => {
          throw error;
        });

        await observable.tick();
      });

      it("should call 'betQuotes' with the subscribed bet ids", () => {
        expect(cashoutService.betQuotes).toHaveBeenCalledWith(["12345678", "87654321"]);
      });

      it("should call the HttpPoller with the error message", () => {
        expect(superNotifySpy).toHaveBeenCalledWith({ error });
      });
    });

    describe("when cashout service returns quotes without refresh rate", () => {
      beforeEach(async () => {
        jest.resetAllMocks();

        cashoutService.betQuotes.mockReturnValueOnce(twoQuotesWithoutRefreshRates);

        await observable.tick();
      });

      it("should call 'betQuotes' with the subscribed bet ids", () => {
        expect(cashoutService.betQuotes).toHaveBeenCalledWith(["12345678", "87654321"]);
      });

      it("should notify with the fcqQuotes", () => {
        expect(superNotifySpy).toHaveBeenCalledWith({ fcqQuotes: twoQuotesWithoutRefreshRates });
      });

      it("should not change the poll interval", () => {
        expect(superSetPollIntervalSpy).not.toHaveBeenCalled();
      });

      it("should not restart the poller", () => {
        expect(superRestartSpy).not.toHaveBeenCalled();
      });
    });

    describe("when cashout service returns quotes with different refresh rate", () => {
      beforeEach(async () => {
        // RESET refresh rate to 10 seconds again (mimicking default state)
        cashoutService.betQuotes.mockReturnValueOnce(twoQuotesWithResetRefreshRates);
        await observable.tick();

        jest.resetAllMocks();

        cashoutService.betQuotes.mockReturnValueOnce(twoQuotesWithDifferentRefreshRates);

        await observable.tick();
      });

      it("should call 'betQuotes' with the subscribed bet ids", () => {
        expect(cashoutService.betQuotes).toHaveBeenCalledWith(["12345678", "87654321"]);
      });

      it("should notify with the fcqQuotes", () => {
        expect(superNotifySpy).toHaveBeenCalledWith({ fcqQuotes: twoQuotesWithDifferentRefreshRates });
      });

      it("should change the poll interval with the lowest refresh rate", () => {
        expect(superSetPollIntervalSpy).toHaveBeenCalledWith(5000);
      });

      it("should restart the poller", () => {
        expect(superRestartSpy).toHaveBeenCalled();
      });
    });

    describe("when cashout service returns mixed quotes with and without refresh rate", () => {
      beforeEach(async () => {
        // RESET refresh rate to 10 seconds again (mimicking default state)
        cashoutService.betQuotes.mockReturnValueOnce(twoQuotesWithResetRefreshRates);
        await observable.tick();

        jest.resetAllMocks();

        cashoutService.betQuotes.mockReturnValueOnce(oneQuoteWithRefreshRate);

        await observable.tick();
      });

      it("should call 'betQuotes' with the subscribed bet ids", () => {
        expect(cashoutService.betQuotes).toHaveBeenCalledWith(["12345678", "87654321"]);
      });

      it("should notify with the fcqQuotes", () => {
        expect(superNotifySpy).toHaveBeenCalledWith({ fcqQuotes: oneQuoteWithRefreshRate });
      });

      it("should change the poll interval with the lowest defined refresh rate", () => {
        expect(superSetPollIntervalSpy).toHaveBeenCalledWith(5000);
      });

      it("should restart the poller", () => {
        expect(superRestartSpy).toHaveBeenCalled();
      });
    });

    describe("when cashout service returns quotes with the lowest defined refresh rate equal to the current poll interval", () => {
      beforeEach(async () => {
        cashoutService.betQuotes.mockReturnValueOnce(oneQuoteWithRefreshRate);

        await observable.tick();

        jest.resetAllMocks();

        cashoutService.betQuotes.mockReturnValueOnce(oneQuoteWithRefreshRate);

        await observable.tick();
      });

      it("should call 'betQuotes' with the subscribed bet ids", () => {
        expect(cashoutService.betQuotes).toHaveBeenCalledWith(["12345678", "87654321"]);
      });

      it("should notify with the fcqQuotes", () => {
        expect(superNotifySpy).toHaveBeenCalledWith({ fcqQuotes: oneQuoteWithRefreshRate });
      });

      it("should not change the poll interval", () => {
        expect(superSetPollIntervalSpy).not.toHaveBeenCalled();
      });

      it("should not restart the poller", () => {
        expect(superRestartSpy).not.toHaveBeenCalled();
      });
    });

    describe("when cashout service returns quotes without refresh rate after having returned quotes with refresh rate different from the default one", () => {
      beforeEach(async () => {
        cashoutService.betQuotes.mockReturnValueOnce(twoQuotesWithDifferentRefreshRates);

        await observable.tick();

        jest.resetAllMocks();
        cashoutService.betQuotes.mockReturnValueOnce(twoQuotesWithoutRefreshRates);

        await observable.tick();
      });

      it("should call 'betQuotes' with the subscribed bet ids", () => {
        expect(cashoutService.betQuotes).toHaveBeenCalledWith(["12345678", "87654321"]);
      });

      it("should notify with the fcqQuotes", () => {
        expect(superNotifySpy).toHaveBeenCalledWith({ fcqQuotes: twoQuotesWithoutRefreshRates });
      });

      it("should not change the poll interval", () => {
        expect(superSetPollIntervalSpy).not.toHaveBeenCalled();
      });

      it("should not restart the poller", () => {
        expect(superRestartSpy).not.toHaveBeenCalled();
      });
    });
  });
});
