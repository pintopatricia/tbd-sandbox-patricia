import { act, render } from "@testing-library/react";

import history from "@ppb/tbd-router/web/history";
import { FilterDrawer } from "@ppb/the-wall-web";

import { LogoProduct } from "../BetSharingCardGroup/snowflakes/Logo/Logo.types";
import ConnectedRegulatoryHeader from "../RegulatoryHeader";
import RegulatoryHeader from "../RegulatoryHeader/RegulatoryHeader.web";
import ConnectedLeftSidebar from "../LeftSidebar";
import LeftSidebar from "../LeftSidebar/LeftSidebar.web";
import ConnectedSmartAppBanner from "../SmartAppBanner";
import SmartAppBanner from "../SmartAppBanner/SmartAppBanner.web";

import { Header as HeaderComponent } from "./snowflakes/Header/Header.web";
import Header from "./Header.web";
import { SHADOW } from "./Header.web.selectors";
import styles from "./Header.web.css";

jest.mock("@ppb/tbd-router/web/history", () => ({
  goBack: jest.fn(),
  listen: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/the-wall-web", () => ({
  FilterDrawer: jest.fn((props) => <filter-drawer-mock {...props} />),
}));

jest.mock("@ppb/the-wall-web/hooks/useResizeObserver");

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../helpers/navigation", () => ({
  base64EncodeUrl: jest.fn(() => "dW5kZWZpbmVkIyMjdW5kZWZpbmVk"),
}));

jest.mock("../RegulatoryHeader", () => jest.fn(() => <connected-regulatory-header-mock />));
jest.mock("../RegulatoryHeader/RegulatoryHeader.web", () => jest.fn(() => <regulatory-header-mock />));

jest.mock("../LeftSidebar", () => jest.fn(() => <connected-left-sidebar-mock />));
jest.mock("../LeftSidebar/LeftSidebar.web", () => jest.fn(() => <left-sidebar-mock />));

jest.mock("../SmartAppBanner", () => jest.fn(() => <connected-smart-app-banner-mock />));
jest.mock("../SmartAppBanner/SmartAppBanner.web", () => jest.fn(() => <smart-app-banner-mock />));

jest.mock("./snowflakes/Header/Header.web", () => ({
  Header: jest.fn(() => <header-mock />),
}));

global.window = Object.create(window);
Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting/football/sport:1",
  },
});

const addEventListenerMock = jest.fn().mockReturnValue("addEventListener");
const removeEventListenerMock = jest.fn().mockReturnValue("removeEventListener");
const eventMock = {
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
};

const DEFAULT_PROPS = {
  isLoggedIn: false,
  isMaintenance: false,
  canGoBack: false,
  logoViewLink: {
    viewUrl: "",
    viewUrn: "ppb:tbd:view:generic:home",
  },
  showBalances: false,
  labels: {
    loginButtonLabel: "loginLabel",
    joinNowButtonLabel: "joinNowLabel",
    headerWalletLabel: "headerWalletLabel",
  },
  shouldAccountForXSellBar: true,
  dispatchFetchUserMainWallet: jest.fn(),
  dispatchPushAction: jest.fn(),
  dispatchLogoClickAction: jest.fn(),
  dispatchMyAccountIconClickAction: jest.fn(),
  dispatchMyAccountClickAction: jest.fn(),
  dispatchFetchGenerosityWalletCardGroupAction: jest.fn(),
  dispatchGenerosityWalletClickAction: jest.fn(),
  dispatchExternalPushAction: jest.fn(),
  dispatchHamburgerMenuOpenAction: jest.fn(),
  urn: "urn",
  isNotificationsCenterEnabled: false,
  hasUnreadNotifications: false,
  dispatchRefetchNotificationsAction: jest.fn(),
};

const renderHeader = (props = {}) => render(<Header {...DEFAULT_PROPS} {...props} />);

describe("Header component", () => {
  beforeEach(jest.clearAllMocks);

  it("must call ConnectedSmartAppBanner with the correct props", () => {
    renderHeader();

    expect(ConnectedSmartAppBanner).toHaveBeenCalledTimes(1);
    expect(ConnectedSmartAppBanner).toHaveBeenCalledWith(
      {
        component: SmartAppBanner,
      },
      undefined,
    );
  });

  it("must call ConnectedRegulatoryHeader with the correct props", () => {
    renderHeader();

    expect(ConnectedRegulatoryHeader).toHaveBeenCalledTimes(1);
    expect(ConnectedRegulatoryHeader).toHaveBeenCalledWith(
      {
        component: RegulatoryHeader,
      },
      undefined,
    );
  });

  describe("when header is defined", () => {
    let stateProps;

    beforeEach(() => {
      stateProps = {
        showBalances: true,
        accountBalance: "€1,234567.89",
        freeBetsBalance: "€10.00",
        isFreeBetsWalletActive: false,
        isHamburguerMenuEnabled: false,
        shouldAccountForXSellBar: true,
        labels: {
          loginButtonLabel: "I18N.HEADER.LOGIN",
          joinNowButtonLabel: "I18N.HEADER.JOIN_NOW",
          headerWalletLabel: "€10.00",
        },
      };
    });

    it("must render the header component with the correct props", () => {
      renderHeader(stateProps);

      expect(HeaderComponent).toHaveBeenCalledTimes(1);
      expect(HeaderComponent).toHaveBeenCalledWith(
        {
          isLoggedIn: false,
          isMaintenance: false,
          canGoBack: false,
          logoProduct: LogoProduct.NONE,
          logoUrl: "",
          showBalances: true,
          accountBalance: "€1,234567.89",
          extraHeaderHeight: 0,
          shouldAccountForXSellBar: true,
          showMenu: false,
          onBackClick: expect.any(Function),
          onLogoClick: expect.any(Function),
          onBalanceButtonClick: expect.any(Function),
          onGenerosityWalletButtonClick: expect.any(Function),
          onLoginButtonTap: expect.any(Function),
          onJoinNowButtonTap: expect.any(Function),
          onMenuClick: expect.any(Function),
          onNotificationsClick: expect.any(Function),
          labels: {
            loginButtonLabel: "I18N.HEADER.LOGIN",
            joinNowButtonLabel: "I18N.HEADER.JOIN_NOW",
            headerWalletLabel: "€10.00",
          },
          viewUrn: "urn",
          isNotificationsCenterEnabled: false,
          hasUnreadNotifications: false,
        },
        undefined,
      );
    });

    it("must render the header component with the correct logoProduct for isGaming true", () => {
      renderHeader({ isGaming: true });

      expect(HeaderComponent).toHaveBeenCalledTimes(1);
      expect(HeaderComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          logoProduct: LogoProduct.GAMING,
        }),
        undefined,
      );
    });

    it("must render the header component with the correct logoProduct for isExchange set with true", () => {
      renderHeader({ isExchange: true });

      expect(HeaderComponent).toHaveBeenCalledTimes(1);
      expect(HeaderComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          logoProduct: LogoProduct.BETFAIR_EXCHANGE,
        }),
        undefined,
      );
    });

    describe("when the user scrolls", () => {
      it("adds shadow class when user scrolls to 100", () => {
        Object.defineProperty(window, "scrollY", {
          writable: true,
          configurable: true,
          value: 20,
        });

        const { container } = renderHeader();

        act(() => {
          window.dispatchEvent(new Event("scroll"));
        });

        expect(container.querySelector(SHADOW)).toBeTruthy();
      });

      it("removes shadow class when user scrolls to 0", () => {
        Object.defineProperty(window, "scrollY", {
          writable: true,
          configurable: true,
          value: 0,
        });

        const { container } = renderHeader();

        act(() => {
          window.dispatchEvent(new Event("scroll"));
        });

        expect(container.querySelector(SHADOW)).toBeFalsy();
      });
    });

    describe("when there is no maintenance", () => {
      it("should call the dispatchFetchUserMainWallet", () => {
        renderHeader({
          isLoggedIn: true,
          isMaintenance: false,
        });

        expect(DEFAULT_PROPS.dispatchFetchUserMainWallet).toHaveBeenCalled();
      });
    });

    describe("when it is under maintenance", () => {
      it("should not call the dispatchFetchUserMainWallet", () => {
        renderHeader({
          isLoggedIn: true,
          isMaintenance: true,
        });

        expect(DEFAULT_PROPS.dispatchFetchUserMainWallet).not.toHaveBeenCalled();
      });
    });

    describe("when onLogoClick is called", () => {
      beforeEach(() => {
        renderHeader();

        const { onLogoClick } = HeaderComponent.mock.calls[0][0];
        onLogoClick(eventMock);
      });

      it("should prevent the default event", () => {
        expect(eventMock.preventDefault).toHaveBeenCalled();
      });

      it("should call the dispatchPushAction", () => {
        expect(DEFAULT_PROPS.dispatchPushAction).toHaveBeenCalledWith(DEFAULT_PROPS.logoViewLink);
      });

      it("should call the dispatchLogoClickAction", () => {
        expect(DEFAULT_PROPS.dispatchLogoClickAction).toHaveBeenCalledWith(DEFAULT_PROPS.logoViewLink);
      });
    });

    describe("when onLogoClick is called and isGaming is true", () => {
      const gamingPageViewLinkMock = {
        viewUrl: "casino/gm-1",
        viewUrn: "ppb:tbd:view:gaming:1",
      };

      beforeEach(() => {
        renderHeader({ isGaming: true });

        const { onLogoClick } = HeaderComponent.mock.calls[0][0];
        onLogoClick(eventMock);
      });

      it("should prevent the default event", () => {
        expect(eventMock.preventDefault).toHaveBeenCalled();
      });

      it("should call the dispatchPushAction", () => {
        expect(DEFAULT_PROPS.dispatchPushAction).toHaveBeenCalledWith(gamingPageViewLinkMock);
      });

      it("should call the dispatchLogoClickAction", () => {
        expect(DEFAULT_PROPS.dispatchLogoClickAction).toHaveBeenCalledWith(gamingPageViewLinkMock);
      });
    });

    describe("when onBalanceButtonClick is called", () => {
      beforeEach(() => {
        renderHeader();

        const { onBalanceButtonClick } = HeaderComponent.mock.calls[0][0];
        onBalanceButtonClick(eventMock);
      });

      it("should stop the event propagation", () => {
        expect(eventMock.stopPropagation).toHaveBeenCalled();
      });

      it("should call the dispatchMyAccountIconClickAction", () => {
        expect(DEFAULT_PROPS.dispatchMyAccountIconClickAction).toHaveBeenCalledWith("dW5kZWZpbmVkIyMjdW5kZWZpbmVk");
      });

      it("should call the dispatchMyAccountClickAction", () => {
        expect(DEFAULT_PROPS.dispatchMyAccountClickAction).toHaveBeenCalledWith(true);
      });
    });

    describe("when onGenerosityWalletButtonClick is called", () => {
      describe("and FREE_BETS_WALLET throttle is active", () => {
        beforeEach(() => {
          renderHeader({ isFreeBetsWalletActive: true });

          const { onGenerosityWalletButtonClick } = HeaderComponent.mock.calls[0][0];
          onGenerosityWalletButtonClick(eventMock);
        });

        it("should stop the event propagation", () => {
          expect(eventMock.stopPropagation).toHaveBeenCalled();
        });

        it("should call the dispatchGenerosityWalletClickAction", () => {
          expect(DEFAULT_PROPS.dispatchGenerosityWalletClickAction).toHaveBeenCalled();
        });

        it("should call the dispatchFetchGenerosityWalletCardGroupAction", () => {
          expect(DEFAULT_PROPS.dispatchFetchGenerosityWalletCardGroupAction).toHaveBeenCalled();
        });
      });

      describe("and FREE_BETS_WALLET throttle is not active", () => {
        beforeEach(() => {
          renderHeader({ isFreeBetsWalletActive: false });

          const { onGenerosityWalletButtonClick } = HeaderComponent.mock.calls[0][0];
          onGenerosityWalletButtonClick(eventMock);
        });

        it("should stop the event propagation", () => {
          expect(eventMock.stopPropagation).toHaveBeenCalled();
        });

        it("should call the dispatchMyAccountIconClickAction", () => {
          expect(DEFAULT_PROPS.dispatchMyAccountIconClickAction).toHaveBeenCalledWith("dW5kZWZpbmVkIyMjdW5kZWZpbmVk");
        });

        it("should call the dispatchMyAccountClickAction", () => {
          expect(DEFAULT_PROPS.dispatchMyAccountClickAction).toHaveBeenCalledWith(true);
        });
      });
    });

    describe("when onBackClick is called", () => {
      beforeEach(() => {
        renderHeader({
          authData: {
            SSO_URL: "SSO_URL",
            JOIN_DATA: { joinNowLink: "JOIN_URL" },
          },
        });

        addEventListenerMock.mockClear();
        removeEventListenerMock.mockClear();
        window.addEventListener = addEventListenerMock;
        window.removeEventListener = removeEventListenerMock;
      });

      it("should prevent the default event", () => {
        const { onBackClick } = HeaderComponent.mock.calls[0][0];
        onBackClick(eventMock);

        expect(eventMock.preventDefault).toHaveBeenCalled();
      });

      it("should call the history.goBack method", () => {
        const { onBackClick } = HeaderComponent.mock.calls[0][0];
        onBackClick(eventMock);

        expect(history.goBack).toHaveBeenCalled();
      });

      describe("when it finds a whitelisted view urn", () => {
        it("should call window.addEventListener and window.removeEventListener", () => {
          const { onBackClick } = HeaderComponent.mock.calls[0][0];
          onBackClick(eventMock);

          expect(addEventListenerMock.mock.calls[0][0]).toEqual("popstate", expect.any(Function));
          addEventListenerMock.mock.calls[0][1]({
            state: {
              state: {
                viewUrn: "ppb:tbd:view:whitelisted",
              },
            },
          });
          expect(removeEventListenerMock.mock.calls[0][0]).toEqual("popstate", expect.any(Function));
        });
      });

      describe("when it finds a blacklisted view urn", () => {
        it("should call window.addEventListener history.goBack()", () => {
          const { onBackClick } = HeaderComponent.mock.calls[0][0];
          onBackClick(eventMock);

          expect(addEventListenerMock.mock.calls[0][0]).toEqual("popstate", expect.any(Function));

          act(() => {
            addEventListenerMock.mock.calls[0][1]({
              state: {
                state: {
                  viewUrn: "ppb:tbd:view:myAccountView",
                },
              },
            });
          });

          expect(history.goBack).toHaveBeenCalledTimes(3);
          expect(removeEventListenerMock).not.toHaveBeenCalled();
        });
      });

      describe("when login button is triggered", () => {
        it("should dispatch External Push Action with the SSO_URL and current href", () => {
          const { onLoginButtonTap } = HeaderComponent.mock.calls[0][0];
          onLoginButtonTap();

          expect(DEFAULT_PROPS.dispatchExternalPushAction).toHaveBeenCalledWith(
            "login",
            "header",
            "SSO_URL&url=https%3A%2F%2Fwww.betfair.com%2Fbetting%2Ffootball%2Fsport%3A1",
          );
        });
      });

      describe("when join now button is triggered", () => {
        it("should dispatch External Push Action with the SSO_URL", () => {
          const { onJoinNowButtonTap } = HeaderComponent.mock.calls[0][0];
          onJoinNowButtonTap();

          expect(DEFAULT_PROPS.dispatchExternalPushAction).toHaveBeenCalledWith("join now", "header", "JOIN_URL");
        });
      });
    });

    describe("when desktop version is loaded", () => {
      it("must render the header component without the sticky element", () => {
        renderHeader({ ...stateProps, removeStickyElement: true });

        expect(HeaderComponent).toHaveBeenCalledTimes(1);
        expect(HeaderComponent).toHaveBeenCalledWith(
          {
            isLoggedIn: false,
            isMaintenance: false,
            canGoBack: false,
            logoProduct: LogoProduct.NONE,
            logoUrl: "",
            showBalances: true,
            accountBalance: "€1,234567.89",
            extraHeaderHeight: 0,
            shouldAccountForXSellBar: true,
            showMenu: false,
            onBackClick: expect.any(Function),
            onLogoClick: expect.any(Function),
            onBalanceButtonClick: expect.any(Function),
            onGenerosityWalletButtonClick: expect.any(Function),
            onLoginButtonTap: expect.any(Function),
            onJoinNowButtonTap: expect.any(Function),
            onMenuClick: expect.any(Function),
            onNotificationsClick: expect.any(Function),
            labels: {
              loginButtonLabel: "I18N.HEADER.LOGIN",
              joinNowButtonLabel: "I18N.HEADER.JOIN_NOW",
              headerWalletLabel: "€10.00",
            },
            viewUrn: "urn",
            hasUnreadNotifications: false,
            isNotificationsCenterEnabled: false,
          },
          undefined,
        );
      });
    });

    describe("when onMenuClick is called", () => {
      beforeEach(() => {
        renderHeader();

        const { onMenuClick } = HeaderComponent.mock.calls[0][0];
        onMenuClick(eventMock);
      });

      it("should stop the event propagation", () => {
        expect(eventMock.stopPropagation).toHaveBeenCalled();
      });

      it("should call the dispatchHamburgerMenuOpenAction", () => {
        expect(DEFAULT_PROPS.dispatchHamburgerMenuOpenAction).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the hamburger menu is enabled", () => {
      describe("and is open", () => {
        beforeEach(() => {
          renderHeader({
            isHamburguerMenuEnabled: true,
            isHamburgerMenuOpen: true,
          });
        });

        it("should call the FilterDrawer", () => {
          expect(FilterDrawer).toHaveBeenCalledTimes(1);
        });

        it("should call the LeftSidebar", () => {
          expect(ConnectedLeftSidebar).toHaveBeenCalledWith(
            {
              component: LeftSidebar,
              isDesktop: false,
            },
            undefined,
          );
          expect(ConnectedLeftSidebar).toHaveBeenCalledTimes(1);
        });
      });

      describe("and is closed", () => {
        beforeEach(() => {
          renderHeader({
            isHamburguerMenuEnabled: true,
            isHamburgerMenuOpen: false,
          });
        });

        it("should not call the FilterDrawer", () => {
          expect(FilterDrawer).not.toHaveBeenCalled();
        });

        it("should not call the LeftSidebar", () => {
          expect(ConnectedLeftSidebar).not.toHaveBeenCalled();
        });
      });
    });

    describe("when hideHeader prop is true", () => {
      it("should not render the header", () => {
        renderHeader({ hideHeader: true });

        expect(HeaderComponent).not.toHaveBeenCalled();
      });
    });
  });

  describe("HeaderPortalContainers functionality", () => {
    const defaultProps = {
      pinGamingSearch: true,
      scrollForSearchBar: true,
      pinGamingRibbonNav: true,
    };

    it("does not render portals container when showPortalContainer is false", () => {
      const props = {
        pinGamingSearch: false,
        scrollForSearchBar: false,
        pinGamingRibbonNav: false,
      };

      renderHeader(props);

      const portalsContainer = document.querySelector("#portals-container");
      expect(portalsContainer).toBeNull();
    });

    it("renders portals container hidden when it has no content", () => {
      renderHeader(defaultProps);

      const portalsContainer = document.querySelector("#portals-container");

      expect(portalsContainer).not.toBeNull();
      expect(portalsContainer.classList.contains(styles.hidePortalContainer)).toBe(true);
    });
  });

  describe("Notifications", () => {
    it("when THROTTLE IS DISABLED, should pass isNotificationsCenterEnabled as false to Header component", () => {
      renderHeader({ isNotificationsCenterEnabled: false });

      expect(HeaderComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          isNotificationsCenterEnabled: false,
          hasUnreadNotifications: false,
        }),
        undefined,
      );
    });

    it("when THROTTLE IS ENABLED, should pass correct props to Header component", () => {
      renderHeader({ isNotificationsCenterEnabled: true, hasUnreadNotifications: true });

      expect(HeaderComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          hasUnreadNotifications: true,
          isNotificationsCenterEnabled: true,
        }),
        undefined,
      );
    });
  });
});
