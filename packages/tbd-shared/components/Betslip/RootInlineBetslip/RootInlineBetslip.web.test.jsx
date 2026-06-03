import { render } from "@testing-library/react";

import RootInlineBetslip from "./RootInlineBetslip.web";

import ConnectedExchangeInlinePlace from "../ExchangeInlinePlace";
import { ExchangeInlinePlace } from "../ExchangeInlinePlace/ExchangeInlinePlace.web";
import ConnectedExchangeInlineConfirm from "../ExchangeInlineConfirm";
import { ExchangeInlineConfirm } from "../ExchangeInlineConfirm/ExchangeInlineConfirm.web";
import ConnectedExchangeInlineReceipt from "../ExchangeInlineReceipt";
import { ExchangeInlineReceipt } from "../ExchangeInlineReceipt/ExchangeInlineReceipt.web";
import ConnectedExchangeInlineEdit from "../ExchangeInlineEdit";
import { ExchangeInlineEdit } from "../ExchangeInlineEdit/ExchangeInlineEdit.web";
import { KeyboardProvider } from "../Keyboard/KeyboardContext";

jest.mock("../ExchangeInlinePlace", () => jest.fn(({ props }) => <connected-inline-exchange-place-mock {...props} />));
jest.mock("../ExchangeInlinePlace/ExchangeInlinePlace.web", () => ({
  ExchangeInlinePlace: jest.fn(() => <inline-exchange-place-web-mock />),
}));
jest.mock("../ExchangeInlineConfirm", () =>
  jest.fn(({ props }) => <connected-exchange-inline-confirm-mock {...props} />),
);
jest.mock("../ExchangeInlineConfirm/ExchangeInlineConfirm.web", () => ({
  ExchangeInlineConfirm: jest.fn(() => <exchange-inline-confirm-web-mock />),
}));
jest.mock("../ExchangeInlineReceipt", () =>
  jest.fn(({ props }) => <connected-inline-exchange-receipt-mock {...props} />),
);
jest.mock("../ExchangeInlineReceipt/ExchangeInlineReceipt.web", () => ({
  ExchangeInlineReceipt: jest.fn(() => <inline-exchange-receipt-web-mock />),
}));
jest.mock("../ExchangeInlineEdit", () => jest.fn(({ props }) => <connected-inline-exchange-edit-mock {...props} />));
jest.mock("../ExchangeInlineEdit/ExchangeInlineEdit.web", () => ({
  ExchangeInlineEdit: jest.fn(() => <inline-exchange-edit-web-mock />),
}));
jest.mock("../Keyboard/KeyboardContext", () => ({
  KeyboardProvider: jest.fn(({ children, props }) => (
    <keyboard-provider-mock {...props}>{children}</keyboard-provider-mock>
  )),
}));

function renderConnectedRootInlineBetslip(props) {
  return render(<RootInlineBetslip {...props} />);
}

describe("Connected Exchange Betslip", () => {
  beforeEach(jest.clearAllMocks);

  it("should call KeyboardProvider", () => {
    renderConnectedRootInlineBetslip({});

    expect(KeyboardProvider).toHaveBeenCalledWith(
      {
        children: expect.anything(),
      },
      undefined,
    );
    expect(KeyboardProvider).toHaveBeenCalledTimes(1);
  });

  describe("when in PLACE_POTENTIAL state", () => {
    it("should delegate to ConnectedExchangeInlinePlace", () => {
      renderConnectedRootInlineBetslip({ step: "PLACE_POTENTIAL" });

      expect(ConnectedExchangeInlinePlace).toHaveBeenCalledTimes(1);
      expect(ConnectedExchangeInlinePlace).toHaveBeenCalledWith({ component: ExchangeInlinePlace }, undefined);
    });
  });

  describe("when in EDIT_POTENTIAL state", () => {
    it("should delegate to ConnectedExchangeInlinePlace", () => {
      renderConnectedRootInlineBetslip({ step: "EDIT_POTENTIAL" });

      expect(ConnectedExchangeInlinePlace).toHaveBeenCalledTimes(1);
      expect(ConnectedExchangeInlinePlace).toHaveBeenCalledWith(
        { component: ExchangeInlinePlace, isEditing: true },
        undefined,
      );
    });
  });

  describe("when in CONFIRM_POTENTIAL state", () => {
    it("should delegate to ConnectedExchangeInlineConfirm", () => {
      renderConnectedRootInlineBetslip({ step: "CONFIRM_POTENTIAL" });

      expect(ConnectedExchangeInlineConfirm).toHaveBeenCalledTimes(1);
      expect(ConnectedExchangeInlineConfirm).toHaveBeenCalledWith({ component: ExchangeInlineConfirm }, undefined);
    });
  });

  describe("when in REPORT state", () => {
    it("should delegate to ConnectedExchangeInlinePlace", () => {
      renderConnectedRootInlineBetslip({ step: "REPORT" });

      expect(ConnectedExchangeInlineReceipt).toHaveBeenCalledTimes(1);
      expect(ConnectedExchangeInlineReceipt).toHaveBeenCalledWith({ component: ExchangeInlineReceipt }, undefined);
    });
  });

  describe("when in EDIT state", () => {
    it("should delegate to ConnectedExchangeInlineEdit", () => {
      renderConnectedRootInlineBetslip({ step: "EDIT_UNMATCHED" });

      expect(ConnectedExchangeInlineEdit).toHaveBeenCalledTimes(1);
      expect(ConnectedExchangeInlineEdit).toHaveBeenCalledWith({ component: ExchangeInlineEdit }, undefined);
    });
  });
});
