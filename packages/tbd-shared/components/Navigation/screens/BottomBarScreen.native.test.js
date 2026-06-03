import { render, waitFor } from "@testing-library/react-native";
import { useSelector } from "react-redux";
import ConnectedBottomBar from "../../BottomBar";
import ConnectedWebMessagePopup from "../../WebMessagePopup";
import ConnectedTransactions from "../../Betslip/Transactions";
import { BottomBarScreen } from "./BottomBarScreen.native";

jest.mock("../../BottomBar", () => ({
  __esModule: true,
  default: jest.fn(() => <connected-bottom-bar />),
}));

jest.mock("../../BottomBar/BottomBar.native", () => ({
  __esModule: true,
  default: "BottomBarMock",
}));

jest.mock("../../Header", () => ({
  __esModule: true,
  default: jest.fn(() => <connected-header />),
}));

jest.mock("../../Header/Header.native", () => ({
  __esModule: true,
  default: "HeaderMock",
}));

jest.mock("../../WebMessagePopup", () => ({
  __esModule: true,
  default: jest.fn(() => <connected-web-message-popup />),
}));

jest.mock("../../WebMessagePopup/WebMessagePopup.native", () => ({
  __esModule: true,
  default: "WebMessagePopupMock",
}));

jest.mock("../../Betslip/Transactions", () => ({
  __esModule: true,
  default: jest.fn(() => <connected-transactions testID="connected-transactions-mock" />),
}));

jest.mock("../../Betslip/Transactions/Transactions.native", () => ({
  Transactions: "TransactionsMock",
}));

jest.mock("../../GenerosityWallet", () => ({
  __esModule: true,
  default: jest.fn(() => <connected-generosity-wallet testID="connected-generosity-wallet-mock" />),
}));

jest.mock("../../GenerosityWallet/GenerosityWallet.native", () => ({
  GenerosityWallet: "GenerosityWallet",
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

const StateIndicatorMock = () => <state-indicator-mock />;

function setup() {
  return render(<BottomBarScreen StateIndicatorView={StateIndicatorMock} />);
}

describe("BottomBarScreen", () => {
  beforeEach(jest.clearAllMocks);

  it("should call ConnectedTransactions", async () => {
    const screen = setup();

    await waitFor(() => {
      screen.getByTestId("connected-transactions-mock");
    });

    expect(ConnectedTransactions).toHaveBeenCalledWith({ component: "TransactionsMock" }, undefined);
    expect(ConnectedTransactions).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedBottomBar", () => {
    setup();

    expect(ConnectedBottomBar).toHaveBeenCalledTimes(1);

    const { selectedIndex, component, stateIndicatorView } = ConnectedBottomBar.mock.calls[0][0];

    expect(selectedIndex).toBe(0);
    expect(component).toBe("BottomBarMock");
    expect(stateIndicatorView.type).toBe(StateIndicatorMock);
  });

  describe("when user preferences and accountId are in the store", () => {
    beforeEach(() => {
      useSelector.mockImplementation((fn) => fn({ entities: { userdetails: { accountId: "12345" } } }));
    });
    it("should call ConnectedWebMessagePopup", () => {
      setup();
      expect(ConnectedWebMessagePopup).toHaveBeenCalledWith({ component: "WebMessagePopupMock" }, undefined);
      expect(ConnectedWebMessagePopup).toHaveBeenCalledTimes(1);
    });
  });
});
