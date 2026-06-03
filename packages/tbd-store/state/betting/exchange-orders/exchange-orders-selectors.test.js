import { getExchangeOrder } from "./exchange-order-selectors";

describe("getExchangeOrder", () => {
  const APP_STATE = {
    betting: {
      exchangeorders: {
        "urn:market:1": {
          orders: [
            {
              betId: "some betId",
            },
          ],
        },
      },
    },
  };
  describe("when there is not market info for given market urn", () => {
    it("should return null", () => {
      expect(getExchangeOrder(APP_STATE, "urn:market:2", "some betId")).toBe(null);
    });
  });
  describe("when there is market info for given market urn", () => {
    describe("but there is no order with given betId", () => {
      it("should return null", () => {
        expect(getExchangeOrder(APP_STATE, "urn:market:1", "another betId")).toBe(null);
      });
    });
    describe("and there is an order with given betId", () => {
      it("should return that order", () => {
        expect(getExchangeOrder(APP_STATE, "urn:market:1", "some betId")).toEqual({
          betId: "some betId",
        });
      });
    });
  });
});
