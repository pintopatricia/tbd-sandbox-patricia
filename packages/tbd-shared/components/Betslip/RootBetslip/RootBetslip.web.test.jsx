import { render } from "@testing-library/react";
import { useContext } from "react";
import "jest-dom/extend-expect";

import { ModalBetslip } from "./ModalBetslip/ModalBetslip.web";
import RootBetslip from "./RootBetslip.web";
import { DesktopBetslip } from "./snowflakes/DesktopBetslip/DesktopBetslip.web";
import { RootBetslipContextProvider } from "./RootBetslipContext";

jest.mock("./ModalBetslip/ModalBetslip.web", () => ({
  ModalBetslip: jest.fn(() => <modal-betslip />),
}));

jest.mock("./snowflakes/DesktopBetslip/DesktopBetslip.web", () => ({
  DesktopBetslip: jest.fn(() => <desktop-betslip />),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

jest.mock("./RootBetslipContext", () => ({
  ...jest.requireActual("./RootBetslipContext"),
  RootBetslipContextProvider: jest.fn(({ children }) => (
    <root-betslip-context-provider-mock>{children}</root-betslip-context-provider-mock>
  )),
}));

jest.mock("../Keyboard/KeyboardContext", () => ({
  KeyboardProvider: jest.fn(({ children, props }) => (
    <keyboard-provider-mock {...props}>{children}</keyboard-provider-mock>
  )),
}));

describe("RootBetslip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const baseProps = {
    hasMultiples: true,
    hasConfirmation: true,
    activeProduct: "SPORTSBOOK",
    step: 1,
    totalSelections: 3,
    minimizedTitle: "TITLE MOCK",
    hasFailures: false,
    isClosed: false,
    isCollapsed: false,
    activeBetslipType: "SINGLE",
    quickBetslipBet: null,
    dispatchHeaderToggle: jest.fn(),
    dispatchDismissClick: jest.fn(),
  };

  it("renders ModalBetslip when isDesktopLayout is false", () => {
    useContext.mockReturnValueOnce({ isDesktopLayout: false });

    render(<RootBetslip {...baseProps} />);

    expect(RootBetslipContextProvider).toHaveBeenCalledTimes(1);
    expect(ModalBetslip).toHaveBeenCalledWith(
      expect.objectContaining({
        quickBetslipBet: null,
        hasMultiples: true,
        hasConfirmation: true,
        activeProduct: "SPORTSBOOK",
        step: 1,
        isClosed: false,
        isCollapsed: false,
        activeBetslipType: "SINGLE",
        dispatchHeaderToggle: expect.any(Function),
        dispatchDismissClick: expect.any(Function),
      }),
      undefined,
    );
    expect(ModalBetslip).toHaveBeenCalledTimes(1);
  });

  it("renders DesktopBetslip when isDesktopLayout is true", () => {
    useContext.mockReturnValueOnce({ isDesktopLayout: true });

    render(<RootBetslip {...baseProps} />);

    expect(RootBetslipContextProvider).toHaveBeenCalledTimes(1);
    expect(DesktopBetslip).toHaveBeenCalledWith(
      expect.objectContaining({
        activeBetslipType: "SINGLE",
        step: 1,
        hasConfirmation: true,
      }),
      undefined,
    );
    expect(DesktopBetslip).toHaveBeenCalledTimes(1);
    expect(ModalBetslip).not.toHaveBeenCalled();
  });

  describe("when is desktop layout and step is REPORT", () => {
    it("should render DesktopBetslip with onClose callback", () => {
      useContext.mockReturnValueOnce({ isDesktopLayout: true });

      render(<RootBetslip {...baseProps} step="REPORT" />);

      expect(RootBetslipContextProvider).toHaveBeenCalledTimes(1);
      expect(DesktopBetslip).toHaveBeenCalledWith(
        expect.objectContaining({
          activeBetslipType: "SINGLE",
          step: "REPORT",
          hasConfirmation: true,
          onClose: expect.any(Function),
        }),
        undefined,
      );
      expect(DesktopBetslip).toHaveBeenCalledTimes(1);
      expect(ModalBetslip).not.toHaveBeenCalled();
    });
  });
});
