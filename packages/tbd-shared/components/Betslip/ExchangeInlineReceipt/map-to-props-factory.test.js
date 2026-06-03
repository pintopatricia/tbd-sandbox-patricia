import { getExchangeRunnerTree } from "@ppb/tbd-store/state/entities/entities-selectors";
import { getExchangeOrder } from "@ppb/tbd-store/state/betting/exchange-orders/exchange-order-selectors";

import { makeMapStateToProps } from "./map-to-props-factory";
import { buildExchangeInlineReceipt } from "./exchange-inline-receipt-mapper";

jest.mock("@ppb/tbd-store/state/entities/entities-selectors");
jest.mock("@ppb/tbd-store/state/betting/exchange-orders/exchange-order-selectors");
jest.mock("./exchange-inline-receipt-mapper");

function setup({ report, runnerTree = { market: { urn: "market urn" } }, exchangeOrder = "some order" } = {}) {
  const state = {
    entities: {},
    betslip: { exchangeReport: report },
  };

  getExchangeRunnerTree.mockReturnValue(runnerTree);
  getExchangeOrder.mockReturnValue(exchangeOrder);

  return makeMapStateToProps()(state);
}

describe("ExchangeInlineReceipt View Model Builder", () => {
  beforeEach(jest.clearAllMocks);

  describe("when exchangeReport is undefined", () => {
    it("should return an empty state", () => {
      const mappedProps = setup({});

      expect(mappedProps).toEqual({
        order: null,
      });
    });
  });

  describe("when exchangeReport is defined", () => {
    it("should call getExchangeRunnerTree with the app state and runner urn", () => {
      setup({ report: { runner: "runner urn" } });

      expect(getExchangeRunnerTree).toHaveBeenCalledWith({}, "runner urn");
    });

    it("should return the mapped out state", () => {
      buildExchangeInlineReceipt.mockReturnValue("some receipt data");

      const mappedProps = setup({
        report: {
          runner: "runner urn",
          betIds: ["some bet id"],
        },
      });

      expect(mappedProps).toEqual({
        order: "some order",
        runner: "runner urn",
        receipt: "some receipt data",
      });
    });

    describe("buildExchangeInlineReceipt", () => {
      describe("when runner tree and bet ids are defined", () => {
        it("should be called with correct parameters", () => {
          setup({ report: { betIds: ["first bet id"] } });

          expect(buildExchangeInlineReceipt).toHaveBeenCalledWith({
            entities: {},
            betslip: { exchangeReport: { betIds: ["first bet id"] } },
          });
        });

        it("should return exchange order", () => {
          const { order } = setup({ report: { betIds: ["first bet id"] } });

          expect(getExchangeOrder).toHaveBeenCalledWith(
            {
              entities: {},
              betslip: { exchangeReport: { betIds: ["first bet id"] } },
            },
            "market urn",
            "first bet id",
          );
          expect(order).toBe("some order");
        });
      });

      describe("when bet ids are not defined", () => {
        it("should be called with correct parameters", () => {
          setup({ report: { foo: "bar" } });

          expect(buildExchangeInlineReceipt).toHaveBeenCalledWith({
            entities: {},
            betslip: { exchangeReport: { foo: "bar" } },
          });
        });
      });

      describe("when runner tree is not defined", () => {
        it("should be called with correct parameters", () => {
          setup({ report: { betIds: ["first bet id"] }, runnerTree: null });

          expect(buildExchangeInlineReceipt).toHaveBeenCalledWith({
            entities: {},
            betslip: { exchangeReport: { betIds: ["first bet id"] } },
          });
        });
      });
    });
  });
});
