import {
  exchangeRunnerHasUpdates,
  sportsbookRunnerStatusHasUpdates,
  exchangeRunnerPricesHasUpdates,
} from "./market-runners";

describe("marketRunners helpers", () => {
  describe("exchangeRunnerHasUpdates", () => {
    describe("when the number of back prices are different", () => {
      const runner1 = { back: [{ liquidity: 10, price: 2.3 }] };
      const runner2 = {
        back: [
          { liquidity: 10, price: 2.3 },
          { liquidity: 13, price: 2.7 },
        ],
      };
      it("should return true", () => {
        expect(exchangeRunnerHasUpdates(runner1, runner2)).toBe(true);
      });
    });

    describe("when the number of lay prices are different", () => {
      const runner1 = { back: [], lay: [{ liquidity: 10, price: 2.3 }] };
      const runner2 = {
        back: [],
        lay: [
          { liquidity: 10, price: 2.3 },
          { liquidity: 13, price: 2.7 },
        ],
      };
      it("should return true", () => {
        expect(exchangeRunnerHasUpdates(runner1, runner2)).toBe(true);
      });
    });

    describe("when a back price changes", () => {
      const runner1 = { back: [{ liquidity: 10, price: 2.3 }], lay: [] };
      const runner2 = { back: [{ liquidity: 10, price: 2.5 }], lay: [] };
      it("should return true", () => {
        expect(exchangeRunnerHasUpdates(runner1, runner2)).toBe(true);
      });
    });

    describe("when a back liquidity changes", () => {
      const runner1 = { back: [{ liquidity: 10, price: 2.3 }], lay: [] };
      const runner2 = { back: [{ liquidity: 5, price: 2.3 }], lay: [] };
      it("should return true", () => {
        expect(exchangeRunnerHasUpdates(runner1, runner2)).toBe(true);
      });
    });

    describe("when a lay price changes", () => {
      const runner1 = { back: [], lay: [{ liquidity: 10, price: 2.3 }] };
      const runner2 = { back: [], lay: [{ liquidity: 10, price: 2.5 }] };
      it("should return true", () => {
        expect(exchangeRunnerHasUpdates(runner1, runner2)).toBe(true);
      });
    });

    describe("when a lay liquidity changes", () => {
      const runner1 = { back: [], lay: [{ liquidity: 10, price: 2.3 }] };
      const runner2 = { back: [], lay: [{ liquidity: 5, price: 2.3 }] };
      it("should return true", () => {
        expect(exchangeRunnerHasUpdates(runner1, runner2)).toBe(true);
      });
    });

    describe("when nothing has changed", () => {
      const runner1 = { back: [{ liquidity: 10, price: 2.3 }], lay: [{ liquidity: 10, price: 2.3 }] };
      const runner2 = { back: [{ liquidity: 10, price: 2.3 }], lay: [{ liquidity: 10, price: 2.3 }] };
      it("should return false", () => {
        expect(exchangeRunnerHasUpdates(runner1, runner2)).toBe(false);
      });
    });
  });

  describe("sportsbookRunnerStatusHasUpdates", () => {
    describe("when the status of both runners are different", () => {
      const runner1 = { odds: { decimal: 2.38, fractional: { numerator: 11, denominator: 8 } }, status: "ACTIVE" };
      const runner2 = { odds: { decimal: 2.38, fractional: { numerator: 11, denominator: 8 } }, status: "SUSPENDED" };

      it("should return true", () => {
        expect(sportsbookRunnerStatusHasUpdates(runner1, runner2)).toBe(true);
      });
    });

    describe("when the runners status are equal", () => {
      const runner1 = { odds: { decimal: 1.11, fractional: { numerator: 11, denominator: 1 } }, status: "ACTIVE" };
      const runner2 = { odds: { decimal: 2.22, fractional: { numerator: 22, denominator: 2 } }, status: "ACTIVE" };

      it("should return false", () => {
        expect(sportsbookRunnerStatusHasUpdates(runner1, runner2)).toBe(false);
      });
    });
  });

  describe("exchangeRunnerPricesHasUpdates", () => {
    describe("when a back price changes", () => {
      const runner1 = { back: [{ liquidity: 10, price: 2.1 }], lay: [] };
      const runner2 = { back: [{ liquidity: 10, price: 2.5 }], lay: [] };

      it("should return true", () => {
        expect(exchangeRunnerPricesHasUpdates(runner1, runner2)).toBe(true);
      });
    });

    describe("when a lay price changes", () => {
      const runner1 = { back: [], lay: [{ liquidity: 10, price: 2.1 }] };
      const runner2 = { back: [], lay: [{ liquidity: 10, price: 2.5 }] };

      it("should return true", () => {
        expect(exchangeRunnerPricesHasUpdates(runner1, runner2)).toBe(true);
      });
    });

    describe("when nothing has changed", () => {
      const runner1 = { back: [{ liquidity: 10, price: 2.3 }], lay: [{ liquidity: 10, price: 2.3 }] };
      const runner2 = { back: [{ liquidity: 10, price: 2.3 }], lay: [{ liquidity: 10, price: 2.3 }] };

      it("should return false", () => {
        expect(exchangeRunnerPricesHasUpdates(runner1, runner2)).toBe(false);
      });
    });
  });
});
