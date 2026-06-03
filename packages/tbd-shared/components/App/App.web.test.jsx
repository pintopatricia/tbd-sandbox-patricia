import { getByTestId, getByText, render, waitFor } from "@testing-library/react";
import "jest-dom/extend-expect";
import useViewportHeight from "../../hooks/useViewportHeight.web";
import ConnectedRootBetslip from "../Betslip/RootBetslip";
import ConnectedGenerosityWallet from "../GenerosityWallet";
import ConnectedBottomBar from "../BottomBar";
import ConnectedReceipt from "../Receipt";
import ConnectedPredicts from "../Predicts";
import ConnectedSnacks from "../Snacks";
import ConnectedHeader from "../Header";
import ConnectedWebMessagePopup from "../WebMessagePopup";
import ConnectedExchangeOnboarding from "../ExchangeOnboarding";
import ConnectedSpainSessionWs from "../SpainSessionWS";
import ConnectedFloatingContainer from "../FloatingContainer";
import App from "./App.web";
import { useIsWebMessagesModuleLoaded } from "../../hooks/useHasWebMessagesModuleLoaded";

// Mock timers for interval testing
jest.useFakeTimers();

jest.mock("../Betslip/RootBetslip", () =>
  jest.fn(() => <connected-root-betslip data-testid="connected-root-betslip" />),
);

jest.mock("../GenerosityWallet", () =>
  jest.fn(() => <connected-generosity-wallet data-testid="connected-generosity-wallet" />),
);

jest.mock("../Receipt", () => jest.fn(() => <connected-receipt data-testid="connected-receipt" />));
jest.mock("../Receipt/Receipt.web", () => jest.fn(() => <receipt-mock data-testid="receipt-web" />));

jest.mock("../Predicts", () => jest.fn(() => <connected-predicts data-testid="connected-predicts" />));
jest.mock("../Predicts/Predicts.web", () => jest.fn(() => <predicts-mock data-testid="predicts-web" />));

jest.mock("../Snacks", () => jest.fn(() => <connected-snacks data-testid="connected-snacks" />));
jest.mock("../Snacks/Snacks.web", () => jest.fn(() => <snacks-mock data-testid="snacks-web" />));

jest.mock("../ExchangeOnboarding", () =>
  jest.fn(() => <connected-exchange-onboarding data-testid="connected-exchange-onboarding" />),
);
jest.mock("../ExchangeOnboarding/ExchangeOnboarding.web", () =>
  jest.fn(() => <exchange-onboarding-mock data-testid="exchange-onboarding-web" />),
);

jest.mock("../Feedback/Feedback.web", () =>
  jest.fn(({ onFeedbackTap }) => <feedback-mock data-testid="feedback-button" onClick={onFeedbackTap} />),
);

jest.mock("../SpainSessionWS", () =>
  jest.fn(() => <connected-exchange-onboarding data-testid="connected-spain-session-websocket" />),
);
jest.mock("../SpainSessionWS/SpainSessionWS.web", () =>
  jest.fn(() => <exchange-onboarding-mock data-testid="spain-session-websocket" />),
);

jest.mock("../UserProfile/UserProfile.web", () => jest.fn(() => <connected-user-profile />));
jest.mock("../../hooks/useViewportHeight.web", () => jest.fn(() => ({})));

const resolveMock = jest.fn();

jest.mock("../../config/routes", () =>
  jest.fn(() => ({
    resolve: resolveMock,
  })),
);

jest.mock("../../hooks/useHasWebMessagesModuleLoaded", () => ({
  useIsWebMessagesModuleLoaded: jest.fn(),
}));

jest.mock("../Header", () => jest.fn(() => <connected-header-mock />));
jest.mock("../LoyaltyMessaging", () => jest.fn(() => <connected-loyalty-messaging />));
jest.mock("../Header/Header.web", () => jest.fn(() => <header-mock />));
jest.mock("../BottomBar", () =>
  jest.fn((props) => <connected-bottom-bar-mock data-testid={`bottom-bar-${props.selectedIndex}`} />),
);
jest.mock("../BottomBar/BottomBar.web", () => jest.fn(() => <bottom-bar-mock />));

jest.mock("../WebMessagePopup", () =>
  jest.fn(() => <connected-web-message-popup data-testid="connected-web-message-popup" />),
);
jest.mock("../WebMessagePopup/WebMessagePopup.web", () => jest.fn(() => <web-message-popup />));

jest.mock("../FloatingContainer", () =>
  jest.fn(() => <connected-floating-container data-testid="connected-floating-container" />),
);
jest.mock("../FloatingContainer/FloatingContainer.web", () =>
  jest.fn(() => <floating-container-mock data-testid="floating-container-web" />),
);

const defaultProps = {
  currentUrn: "ppb:tbd:view:generic:home",
  currentView: "ppb:tbd:view:generic",
  isBettingActive: true,
  isBetslipCollapsed: false,
  loggedIn: true,
  showXSellBar: false,
  pinGamingSearch: false,
  hasSearchZone: false,
  pinGamingRibbonNav: false,
  hasGamingRibbonZone: true,
  showExcFeedbackButton: false,
  accountId: 12345,
  dispatchPushExternalBlankAction: jest.fn(),
};

function renderApp({
  currentUrn,
  currentView,
  isBettingActive,
  isBetslipCollapsed,
  loggedIn,
  showXSellBar,
  pinGamingSearch,
  hasSearchZone,
  pinGamingRibbonNav,
  hasGamingRibbonZone,
  showExcFeedbackButton,
  accountId,
  dispatchPushExternalBlankAction,
}) {
  return render(
    <App
      currentUrn={currentUrn}
      currentView={currentView}
      isBettingActive={isBettingActive}
      isBetslipCollapsed={isBetslipCollapsed}
      loggedIn={loggedIn}
      showXSellBar={showXSellBar}
      pinGamingSearch={pinGamingSearch}
      hasSearchZone={hasSearchZone}
      pinGamingRibbonNav={pinGamingRibbonNav}
      hasGamingRibbonZone={hasGamingRibbonZone}
      showExcFeedbackButton={showExcFeedbackButton}
      accountId={accountId}
      dispatchPushExternalBlankAction={dispatchPushExternalBlankAction}
    />,
  );
}

describe("App", () => {
  let mockSetProperty;
  let mockGetComputedStyle;
  let mockGetPropertyValue;

  beforeEach(() => {
    ConnectedHeader.mockClear();
    resolveMock.mockReturnValue(undefined);
    ConnectedBottomBar.mockClear();
    ConnectedRootBetslip.mockClear();
    ConnectedGenerosityWallet.mockClear();
    ConnectedReceipt.mockClear();
    ConnectedPredicts.mockClear();
    ConnectedSnacks.mockClear();
    ConnectedWebMessagePopup.mockClear();
    ConnectedExchangeOnboarding.mockClear();
    ConnectedSpainSessionWs.mockClear();
    ConnectedFloatingContainer.mockClear();

    // Setup DOM mocks
    mockSetProperty = jest.fn();
    mockGetPropertyValue = jest.fn();

    mockGetComputedStyle = jest.fn(() => ({
      getPropertyValue: mockGetPropertyValue,
      fontSize: "16px",
    }));

    Object.defineProperty(document.documentElement, "style", {
      value: { setProperty: mockSetProperty },
      writable: true,
    });

    Object.defineProperty(window, "getComputedStyle", {
      value: mockGetComputedStyle,
      writable: true,
    });

    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it("should update --vh custom property", async () => {
    useViewportHeight.mockReturnValueOnce({ vh: 123 });

    const setProperty = jest.fn();
    document.documentElement.style.setProperty = setProperty;

    const { container } = renderApp(defaultProps);

    await waitFor(() => getByTestId(container, "connected-receipt"));

    expect(useViewportHeight).toHaveBeenCalled();
    expect(setProperty).toHaveBeenCalledWith("--vh", "123px");
  });

  describe("Apple system font adjustment", () => {
    it("should set up interval for Apple system font adjustment", () => {
      renderApp(defaultProps);

      expect(jest.getTimerCount()).toBe(1);
    });

    it("should adjust text size when Apple system font is detected", () => {
      mockGetPropertyValue.mockImplementation((prop) => {
        if (prop === "--apple-system-body") return "some-value";
        if (prop === "--page-px-max") return "18";
        return "";
      });

      renderApp(defaultProps);

      // Fast forward the interval
      jest.advanceTimersByTime(1000);

      expect(mockGetComputedStyle).toHaveBeenCalledWith(document.documentElement);
      expect(mockSetProperty).toHaveBeenCalledWith("-webkit-text-size-adjust", "100%");
    });

    it("should scale down text when fontSize exceeds maxPx", () => {
      mockGetPropertyValue.mockImplementation((prop) => {
        if (prop === "--apple-system-body") return "some-value";
        if (prop === "--page-px-max") return "14"; // smaller than 16px fontSize
        return "";
      });

      renderApp(defaultProps);

      jest.advanceTimersByTime(1000);

      expect(mockSetProperty).toHaveBeenCalledWith("-webkit-text-size-adjust", "100%");
      // 14/16 * 100 = 87.5, Math.floor = 87
      expect(mockSetProperty).toHaveBeenCalledWith("-webkit-text-size-adjust", "87%");
    });

    it("should not scale down text when fontSize is within maxPx", () => {
      mockGetPropertyValue.mockImplementation((prop) => {
        if (prop === "--apple-system-body") return "some-value";
        if (prop === "--page-px-max") return "20"; // larger than 16px fontSize
        return "";
      });

      renderApp(defaultProps);

      jest.advanceTimersByTime(1000);

      expect(mockSetProperty).toHaveBeenCalledWith("-webkit-text-size-adjust", "100%");
      // Should not call setProperty again for scaling
      expect(mockSetProperty).toHaveBeenCalledTimes(1);
    });

    it("should clear interval when Apple system font is not detected", () => {
      mockGetPropertyValue.mockImplementation(() => ""); // No apple-system-body

      renderApp(defaultProps);

      jest.advanceTimersByTime(1000);

      expect(jest.getTimerCount()).toBe(0); // Interval should be cleared
    });

    it("should clear interval on component unmount", () => {
      mockGetPropertyValue.mockImplementation((prop) => {
        if (prop === "--apple-system-body") return "some-value";
        return "";
      });

      const { unmount } = renderApp(defaultProps);

      expect(jest.getTimerCount()).toBe(1);

      unmount();

      expect(jest.getTimerCount()).toBe(0);
    });
  });

  it("should call ConnectedHeader", () => {
    renderApp(defaultProps);

    expect(ConnectedHeader).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedBottomBar", () => {
    const props = {
      ...defaultProps,
      currentUrn: "ppb:tbd:view:event:12345",
      currentView: "ppb:tbd:view:event",
    };
    renderApp(props);
    expect(ConnectedBottomBar).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedRootBetslip", async () => {
    const { container } = renderApp(defaultProps);

    await waitFor(() => getByTestId(container, "connected-root-betslip"));

    expect(ConnectedRootBetslip).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedGenerosityWallet", async () => {
    const { container } = renderApp(defaultProps);

    await waitFor(() => getByTestId(container, "connected-generosity-wallet"));

    expect(ConnectedGenerosityWallet).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedReceipt", async () => {
    const { container } = renderApp(defaultProps);

    await waitFor(() => getByTestId(container, "connected-receipt"));

    expect(ConnectedReceipt).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedPredicts", async () => {
    const { container } = renderApp(defaultProps);

    await waitFor(() => getByTestId(container, "connected-predicts"));

    expect(ConnectedPredicts).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedSnacks", async () => {
    const { container } = renderApp(defaultProps);

    await waitFor(() => getByTestId(container, "connected-snacks"));

    expect(ConnectedSnacks).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedExchangeOnboarding", async () => {
    const { container } = renderApp(defaultProps);

    await waitFor(() => getByTestId(container, "connected-exchange-onboarding"));

    expect(ConnectedExchangeOnboarding).toHaveBeenCalledTimes(1);
  });

  it("should call hook to check if web messages module was loaded", () => {
    useIsWebMessagesModuleLoaded.mockReset();
    renderApp(defaultProps);

    expect(useIsWebMessagesModuleLoaded).toHaveBeenCalledTimes(1);
    expect(useIsWebMessagesModuleLoaded).toHaveBeenCalledWith();
  });

  describe("when web messages module is loaded", () => {
    it("should call ConnectedWebMessagePopup", async () => {
      useIsWebMessagesModuleLoaded.mockReturnValueOnce(true);
      const { container } = renderApp(defaultProps);

      await waitFor(() => getByTestId(container, "connected-web-message-popup"));

      expect(ConnectedWebMessagePopup).toHaveBeenCalledTimes(1);
    });
  });

  describe("when web messages module is not loaded yet", () => {
    it("should not call ConnectedWebMessagePopup", async () => {
      useIsWebMessagesModuleLoaded.mockReturnValueOnce(false);
      ConnectedWebMessagePopup.mockReset();

      expect(ConnectedWebMessagePopup).not.toHaveBeenCalled();
    });
  });

  it("should call ConnectedFloatingContainer", async () => {
    const { container } = renderApp(defaultProps);

    await waitFor(() => getByTestId(container, "connected-floating-container"));

    expect(ConnectedFloatingContainer).toHaveBeenCalledTimes(1);
  });

  it("should resolve the correct view", () => {
    const props = {
      ...defaultProps,
      currentUrn: "ppb:tbd:view:event",
      currentView: "ppb:tbd:view:event:12345",
    };
    renderApp(props);

    expect(resolveMock).toHaveBeenLastCalledWith({ pathname: "ppb:tbd:view:event:12345", urn: "ppb:tbd:view:event" });
  });

  it("should render the route component", async () => {
    const props = {
      ...defaultProps,
      currentUrn: "ppb:tbd:view:event",
      currentView: "ppb:tbd:view:event:12345",
    };
    resolveMock.mockReturnValue(<div>Route component</div>);
    const componentContainer = renderApp(props).container;
    const routeComponent = await waitFor(() => getByText(componentContainer, "Route component"));

    expect(routeComponent).toBeVisible();
  });

  describe("when betting is not active", () => {
    it("shouldn't call ConnectedRootBetslip", async () => {
      const props = {
        ...defaultProps,
        currentUrn: "ppb:tbd:view:event",
        currentView: "ppb:tbd:view:event:12345",
        isBettingActive: false,
      };
      renderApp(props);

      expect(ConnectedRootBetslip).not.toHaveBeenCalled();
    });
  });

  describe("when is wrapper view", () => {
    beforeAll(() => {
      Object.defineProperty(window, "__TBD_CLIENT_CONTEXT__", {
        writable: true,
        value: {
          platform: "android",
          uiVariant: "mobile",
          wrapper: {
            wrapperName: "GamingWrapper",
            bridgeAPIVersion: "1.0.0",
          },
          webWrappedExperience: true,
        },
      });
    });

    it("should not render ConnectedBottomBar", () => {
      renderApp(defaultProps);

      expect(ConnectedBottomBar).not.toHaveBeenCalled();
    });
  });

  describe("Feedback Button", () => {
    it("should render Feedback component when showExcFeedbackButton is true", async () => {
      const { container } = renderApp({ ...defaultProps, showExcFeedbackButton: true });

      const feedback = await waitFor(() => getByTestId(container, "feedback-button"));
      expect(feedback).toBeInTheDocument();
    });

    it("should NOT render Feedback component when showExcFeedbackButton is false", () => {
      const { queryByTestId } = renderApp({ ...defaultProps, showExcFeedbackButton: false });

      const feedback = queryByTestId("feedback-button");
      expect(feedback).not.toBeInTheDocument();
    });

    it("should call dispatchPushExternalBlankAction with accountId when feedback is tapped", async () => {
      const dispatchMock = jest.fn();
      const { container } = renderApp({
        ...defaultProps,
        showExcFeedbackButton: true,
        dispatchPushExternalBlankAction: dispatchMock,
      });

      const feedback = await waitFor(() => getByTestId(container, "feedback-button"));
      feedback.click();

      expect(dispatchMock).toHaveBeenCalledWith(12345);
    });
  });
});
