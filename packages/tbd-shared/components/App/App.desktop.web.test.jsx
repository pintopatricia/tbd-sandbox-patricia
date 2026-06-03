import { getByTestId, getByText, render, waitFor } from "@testing-library/react";
import "jest-dom/extend-expect";
import useViewportHeight from "../../hooks/useViewportHeight.web";
import ConnectedRootBetslip from "../Betslip/RootBetslip";
import ConnectedGenerosityWallet from "../GenerosityWallet";
import ConnectedReceipt from "../Receipt";
import ConnectedSnacks from "../Snacks";
import ConnectedDesktopHeader from "../DesktopHeader";
import ConnectedExchangeOnboarding from "../ExchangeOnboarding";
import App from "./App.desktop.web";

// Root Betslip
jest.mock("../Betslip/RootBetslip", () =>
  jest.fn(() => <connected-root-betslip data-testid="connected-root-betslip" />),
);
jest.mock("../Betslip/RootBetslip/RootBetslip.web", () =>
  jest.fn(() => <root-betslip-web-mock data-testid="root-betslip-web" />),
);

// GenerosityWallets
jest.mock("../GenerosityWallet", () =>
  jest.fn(() => <connected-generosity-wallet data-testid="connected-generosity-wallet" />),
);
jest.mock("../GenerosityWallet/GenerosityWallet.web", () =>
  jest.fn(() => <generosity-wallet-mock data-testid="generosity-wallet-mock" />),
);

// Receipt
jest.mock("../Receipt", () => jest.fn(() => <connected-receipt data-testid="connected-receipt" />));
jest.mock("../Receipt/Receipt.web", () => jest.fn(() => <receipt-mock data-testid="receipt-web" />));

// Snacks
jest.mock("../Snacks", () => jest.fn(() => <connected-snacks data-testid="connected-snacks" />));
jest.mock("../Snacks/Snacks.web", () => jest.fn(() => <snacks-mock data-testid="snacks-web" />));

// Exchange Onboarding
jest.mock("../ExchangeOnboarding", () =>
  jest.fn(() => <connected-exchange-onboarding data-testid="connected-exchange-onboarding" />),
);
jest.mock("../ExchangeOnboarding/ExchangeOnboarding.web", () =>
  jest.fn(() => <exchange-onboarding-mock data-testid="exchange-onboarding-web" />),
);

// Spain Session WS
jest.mock("../SpainSessionWS", () => jest.fn(() => <connected-spain-session-ws-mock />));
jest.mock("../SpainSessionWS/SpainSessionWS.web", () => jest.fn(() => <spain-session-ws-mock />));

// Loyalty Messaging
jest.mock("../LoyaltyMessaging", () => jest.fn(() => <connected-loyalty-messaging />));
jest.mock("../LoyaltyMessaging/LoyaltyMessaging.web", () => jest.fn(() => <loyalty-messaging-web-mock />));

// Desktop Header
jest.mock("../DesktopHeader", () => jest.fn(() => <connected-header-mock />));
jest.mock("../DesktopHeader/DesktopHeader.web", () => jest.fn(() => <header-web-mock />));

// Left Side Bar
jest.mock("../LeftSidebar", () => jest.fn(() => <connected-left-side-bar />));
jest.mock("../LeftSidebar/LeftSidebar.web", () => jest.fn(() => <left-side-bar-web-mock />));

jest.mock("../../hooks/useViewportHeight.web", () => jest.fn(() => ({})));

const resolveMock = jest.fn().mockReturnValue(undefined);

jest.mock("../../config/routes", () =>
  jest.fn(() => ({
    resolve: resolveMock,
  })),
);

jest.mock("../../hooks/useHasWebMessagesModuleLoaded", () => ({
  useIsWebMessagesModuleLoaded: jest.fn(),
}));

function renderApp(currentUrn, currentView, isBettingActive = true) {
  return render(<App currentUrn={currentUrn} currentView={currentView} isBettingActive={isBettingActive} />);
}

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update --vh custom property", async () => {
    useViewportHeight.mockReturnValueOnce({ vh: 123 });

    const setProperty = jest.fn();
    document.documentElement.style.setProperty = setProperty;

    const { container } = renderApp("ppb:tbd:view:generic:home", "ppb:tbd:view:generic");

    await waitFor(() => getByTestId(container, "connected-receipt"));

    expect(useViewportHeight).toHaveBeenCalled();
    expect(setProperty).toHaveBeenCalledWith("--vh", "123px");
  });

  it("should call ConnectedDesktopHeader", () => {
    renderApp("ppb:tbd:view:generic:home", "ppb:tbd:view:generic");

    expect(ConnectedDesktopHeader).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedRootBetslip", async () => {
    const { container } = renderApp("ppb:tbd:view:generic:home", "ppb:tbd:view:generic");

    await waitFor(() => getByTestId(container, "connected-root-betslip"));

    expect(ConnectedRootBetslip).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedGenerosityWallet", async () => {
    const { container } = renderApp("ppb:tbd:view:generic:home", "ppb:tbd:view:generic");

    await waitFor(() => getByTestId(container, "connected-generosity-wallet"));

    expect(ConnectedGenerosityWallet).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedReceipt", async () => {
    const { container } = renderApp("ppb:tbd:view:generic:home", "ppb:tbd:view:generic");

    await waitFor(() => getByTestId(container, "connected-receipt"));

    expect(ConnectedReceipt).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedSnacks", async () => {
    const { container } = renderApp("ppb:tbd:view:generic:home", "ppb:tbd:view:generic");

    await waitFor(() => getByTestId(container, "connected-snacks"));

    expect(ConnectedSnacks).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectedExchangeOnboarding", async () => {
    const { container } = renderApp("ppb:tbd:view:generic:home", "ppb:tbd:view:generic");

    await waitFor(() => getByTestId(container, "connected-exchange-onboarding"));

    expect(ConnectedExchangeOnboarding).toHaveBeenCalledTimes(1);
  });

  it("should resolve the correct view", () => {
    renderApp("ppb:tbd:view:event", "ppb:tbd:view:event:12345");

    expect(resolveMock).toHaveBeenLastCalledWith({ pathname: "ppb:tbd:view:event:12345", urn: "ppb:tbd:view:event" });
  });

  it("should render the route component", async () => {
    resolveMock.mockReturnValueOnce(<div>Route component</div>);
    const componentContainer = renderApp("ppb:tbd:view:event", "ppb:tbd:view:event:12345").container;
    const routeComponent = await waitFor(() => getByText(componentContainer, "Route component"));

    expect(routeComponent).toBeVisible();
  });

  describe("when betting is not active", () => {
    it("shouldn't call ConnectedRootBetslip", async () => {
      renderApp("ppb:tbd:view:event", "ppb:tbd:view:event:12345", false);

      expect(ConnectedRootBetslip).not.toHaveBeenCalled();
    });
  });

  describe("when is wrapper view", () => {
    it("should not render ConnectedDesktopHeader", async () => {
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

      renderApp("ppb:tbd:view:generic:home", "ppb:tbd:view:generic");

      expect(ConnectedDesktopHeader).not.toHaveBeenCalled();
    });
  });
});
