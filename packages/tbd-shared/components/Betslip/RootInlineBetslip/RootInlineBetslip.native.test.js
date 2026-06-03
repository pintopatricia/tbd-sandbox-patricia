import { render } from "@testing-library/react-native";

import RootInlineBetslip from "./RootInlineBetslip.native";

import ConnectedExchangeInlinePlace from "../ExchangeInlinePlace";
import { ExchangeInlinePlace } from "../ExchangeInlinePlace/ExchangeInlinePlace.native";
import ConnectedExchangeInlineConfirm from "../ExchangeInlineConfirm";
import { ExchangeInlineConfirm } from "../ExchangeInlineConfirm/ExchangeInlineConfirm.native";
import ConnectedExchangeInlineReceipt from "../ExchangeInlineReceipt";
import { ExchangeInlineReceipt } from "../ExchangeInlineReceipt/ExchangeInlineReceipt.native";
import ConnectedExchangeInlineEdit from "../ExchangeInlineEdit";
import { ExchangeInlineEdit } from "../ExchangeInlineEdit/ExchangeInlineEdit.native";

jest.mock("../ExchangeInlinePlace", () => jest.fn(({ props }) => <connected-inline-exchange-place-mock {...props} />));
jest.mock("../ExchangeInlinePlace/ExchangeInlinePlace.native", () => ({
  ExchangeInlinePlace: jest.fn(() => <inline-exchange-place-native-mock />),
}));
jest.mock("../ExchangeInlineConfirm", () =>
  jest.fn(({ props }) => <connected-exchange-inline-confirm-mock {...props} />),
);
jest.mock("../ExchangeInlineConfirm/ExchangeInlineConfirm.native", () => ({
  ExchangeInlineConfirm: jest.fn(() => <exchange-inline-confirm-native-mock />),
}));
jest.mock("../ExchangeInlineReceipt", () =>
  jest.fn(({ props }) => <connected-inline-exchange-receipt-mock {...props} />),
);
jest.mock("../ExchangeInlineReceipt/ExchangeInlineReceipt.native", () => ({
  ExchangeInlineReceipt: jest.fn(() => <inline-exchange-receipt-native-mock />),
}));
jest.mock("../ExchangeInlineEdit", () => jest.fn(({ props }) => <connected-inline-exchange-edit-mock {...props} />));
jest.mock("../ExchangeInlineEdit/ExchangeInlineEdit.native", () => ({
  ExchangeInlineEdit: jest.fn(() => <inline-exchange-edit-native-mock />),
}));
jest.mock("../Keyboard/KeyboardContext", () => ({
  KeyboardProvider: jest.fn(({ children, props }) => (
    <keyboard-provider-mock {...props}>{children}</keyboard-provider-mock>
  )),
}));

function renderConnectedRootInlineBetslip({ step } = {}) {
  return render(<RootInlineBetslip step={step} />);
}

describe("Connected Exchange Betslip", () => {
  beforeEach(jest.clearAllMocks);

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
    it("should delegate to ConnectedExchangeInlineReceipt", () => {
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
