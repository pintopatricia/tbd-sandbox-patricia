import { render, act } from "@testing-library/react-native";

import { ExchangeInlineReceiptPanel } from "./snowflakes/ExchangeInlineReceiptPanel/ExchangeInlineReceiptPanel.native";

import { ExchangeInlineReceipt } from "./ExchangeInlineReceipt.native";

jest.mock("./snowflakes/ExchangeInlineReceiptPanel/ExchangeInlineReceiptPanel.native", () => ({
  ExchangeInlineReceiptPanel: jest.fn(() => <exchange-inline-receipt-panel testID="exc-receipt-test-id" />),
}));

function renderConnectedExchangeInlineReceipt({
  receipt,
  order,
  runner,
  dispatchPanelDone,
  dispatchPanelCancel,
  dispatchPanelEdit,
} = {}) {
  return render(
    <ExchangeInlineReceipt
      receipt={receipt}
      order={order}
      runner={runner}
      dispatchPanelDone={dispatchPanelDone}
      dispatchPanelCancel={dispatchPanelCancel}
      dispatchPanelEdit={dispatchPanelEdit}
    />,
  );
}

describe("ExchangeInlineReceipt", () => {
  beforeEach(jest.clearAllMocks);

  describe("when receipt is falsy", () => {
    it("should return null", () => {
      const component = renderConnectedExchangeInlineReceipt();

      expect(component.queryByTestId("exc-receipt-test-id")).toBeNull();
    });
  });

  describe("when receipt is truthy", () => {
    it("should call ExchangeInlineReceiptPanel with receipt", () => {
      renderConnectedExchangeInlineReceipt({ receipt: { foo: "bar" } });

      expect(ExchangeInlineReceiptPanel).toHaveBeenCalledWith(
        expect.objectContaining({
          foo: "bar",
        }),
        undefined,
      );
    });

    describe("when onDone is called", () => {
      it("should call dispatchPanelDone", () => {
        const dispatchPanelDone = jest.fn();
        renderConnectedExchangeInlineReceipt({
          receipt: { foo: "bar" },
          dispatchPanelDone,
        });

        const { onDone } = ExchangeInlineReceiptPanel.mock.calls[0][0];

        act(() => {
          onDone();
        });

        expect(dispatchPanelDone).toHaveBeenCalledWith();
        expect(dispatchPanelDone).toHaveBeenCalledTimes(1);
      });
    });

    describe("when performing interactions", () => {
      describe("when cancelling", () => {
        describe("when order is empty", () => {
          it("should not pass onCancel callback", () => {
            const dispatchPanelCancel = jest.fn();

            renderConnectedExchangeInlineReceipt({
              receipt: { unmatched: "bar" },
              runner: "runner:urn",
              dispatchPanelCancel,
            });

            const { onCancel } = ExchangeInlineReceiptPanel.mock.calls[0][0];

            expect(onCancel).toBeNull();
          });
        });

        describe("when runner is falsy", () => {
          it("should not call dispatchPanelCancel", () => {
            const dispatchPanelCancel = jest.fn();

            renderConnectedExchangeInlineReceipt({
              receipt: { unmatched: "bar" },
              order: { betId: "some bet id" },
              dispatchPanelCancel,
            });

            const { onCancel } = ExchangeInlineReceiptPanel.mock.calls[0][0];

            act(() => {
              onCancel();
            });
            expect(dispatchPanelCancel).not.toHaveBeenCalled();
          });
        });

        describe("when there is an order and the receipt is unmatched", () => {
          it("should call dispatchPanelCancel", () => {
            const dispatchPanelCancel = jest.fn();

            renderConnectedExchangeInlineReceipt({
              receipt: { unmatched: "bar" },
              runner: "runner:urn",
              order: { betId: "some bet id" },
              dispatchPanelCancel,
            });

            const { onCancel } = ExchangeInlineReceiptPanel.mock.calls[0][0];

            act(() => {
              onCancel();
            });

            expect(dispatchPanelCancel).toHaveBeenCalledWith("some bet id", "runner:urn");
            expect(dispatchPanelCancel).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe("when going to edit", () => {
        describe("when placed with free bets", () => {
          it("should not pass onEdit callback", () => {
            renderConnectedExchangeInlineReceipt({
              receipt: { unmatched: { hasFreeBets: true } },
              runner: "runner:urn",
              order: { betId: "some bet id" },
            });

            const { onEdit } = ExchangeInlineReceiptPanel.mock.calls[0][0];

            expect(onEdit).toBeNull();
          });
        });

        describe("when placed without free bets", () => {
          describe("when there is an order and the receipt is unmatched", () => {
            it("should call dispatchPanelEdit", () => {
              const dispatchPanelEdit = jest.fn();

              renderConnectedExchangeInlineReceipt({
                receipt: { unmatched: "bar", hasFreebets: false },
                runner: "runner:urn",
                order: { betId: "some bet id" },
                dispatchPanelEdit,
              });

              const { onEdit } = ExchangeInlineReceiptPanel.mock.calls[0][0];

              act(() => {
                onEdit();
              });

              expect(dispatchPanelEdit).toHaveBeenCalledWith("some bet id", "runner:urn");
              expect(dispatchPanelEdit).toHaveBeenCalledTimes(1);
            });
          });
        });
      });

      describe("when dismissing", () => {
        it("should call dispatchPanelDone", () => {
          const dispatchPanelDone = jest.fn();

          renderConnectedExchangeInlineReceipt({
            receipt: { unmatched: "bar", hasFreebets: false },
            runner: "runner:urn",
            order: { betId: "some bet id" },
            dispatchPanelDone,
          });

          const { onDone } = ExchangeInlineReceiptPanel.mock.calls[0][0];

          act(() => {
            onDone();
          });

          expect(dispatchPanelDone).toHaveBeenCalledWith();
          expect(dispatchPanelDone).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
