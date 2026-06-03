import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { StatusLabel, SecondaryButton, PrimaryButton } from "@ppb/the-wall-web";
import { LogoProduct } from "../../../BetSharingCardGroup/snowflakes/Logo/Logo.types";
import { Logo } from "../../../BetSharingCardGroup/snowflakes/Logo/Logo.web";
import { Header } from "./Header.web";
import XSellBar from "@ppb/tbd-components-navigation/components/XSellBar/view/XSellBar.web";
import {
  BACK_BUTTON,
  BALANCE_BUTTON,
  BALANCE_LABEL,
  GENEROSITY_WALLET_BUTTON,
  JOIN_NOW_BUTTON,
  LOGIN_BUTTON,
  LOGIN_CONTAINER,
  LOGO_CONTAINER,
  TEST_ID,
  MENU_BUTTON,
  NOTIFICATIONS_ICON_CONTAINER,
} from "./Header.web.selectors";
import styles from "./Header.web.css";
import { NotificationsIcon } from "../Notifications/NotificationsIcon";

const onBalanceButtonClickCb = jest.fn();
const onGenerosityWalletButtonClickCb = jest.fn();
const onLogoClickCb = jest.fn().mockImplementation((ev) => ev.preventDefault());
const onBackClickCb = jest.fn().mockImplementation((ev) => ev.preventDefault());
const onJoinNowButtonTap = jest.fn().mockImplementation((ev) => ev.preventDefault());
const onLoginButtonTap = jest.fn().mockImplementation((ev) => ev.preventDefault());
const onMenuClickCb = jest.fn().mockImplementation((ev) => ev.preventDefault());
const onNotificationsClickCb = jest.fn().mockImplementation((ev) => ev.preventDefault());

jest.mock("../../../BetSharingCardGroup/snowflakes/Logo/Logo.web", () => ({
  Logo: jest.fn((props) => <logo-mock {...props} />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  StatusLabel: jest.fn(({ props }) => <status-label-mock {...props} />),
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../Notifications/NotificationsIcon", () => ({
  NotificationsIcon: jest.fn(() => <notifications-icon-mock />),
}));

jest.mock("@ppb/the-wall-common/native-for-web-tokens", () => ({
  useNativeTokens: jest.fn(() => ({
    HeaderContainerSizing: 56,
    HeaderPadding: {
      paddingTop: 8,
      paddingBottom: 8,
    },
    PrimaryButtonContainerSizing: 44,
  })),
}));

jest.mock("@ppb/tbd-components-navigation/components/XSellBar/view/XSellBar.web", () =>
  jest.fn(() => <x-sell-bar-mock />),
);

jest.mock("../../../../helpers/external-links", () => ({
  getExternalLink: jest.fn((key) => key),
}));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

function renderHeader({
  isLoggedIn = true,
  isMaintenance = false,
  canGoBack,
  logoProduct = LogoProduct.NONE,
  showBalances,
  accountBalance,
  extraHeaderHeight,
  showMenu = false,
  shouldAccountForXSellBar = false,
  isNotificationsCenterEnabled = false,
  hasUnreadNotifications = false,
  labels = {
    loginButtonLabel: "I18N.HEADER.LOGIN",
    joinNowButtonLabel: "I18N.HEADER.JOIN_NOW",
    headerWalletLabel: undefined,
  },
} = {}) {
  return render(
    <Header
      isLoggedIn={isLoggedIn}
      isMaintenance={isMaintenance}
      canGoBack={canGoBack}
      logoProduct={logoProduct}
      logoUrl={"betting/football/sport:1"}
      showBalances={showBalances}
      accountBalance={accountBalance}
      extraHeaderHeight={extraHeaderHeight}
      showMenu={showMenu}
      shouldAccountForXSellBar={shouldAccountForXSellBar}
      onBackClick={onBackClickCb}
      onLogoClick={onLogoClickCb}
      onBalanceButtonClick={onBalanceButtonClickCb}
      onGenerosityWalletButtonClick={onGenerosityWalletButtonClickCb}
      onLoginButtonTap={onLoginButtonTap}
      onJoinNowButtonTap={onJoinNowButtonTap}
      onMenuClick={onMenuClickCb}
      labels={labels}
      viewUrn={"urn"}
      isNotificationsCenterEnabled={isNotificationsCenterEnabled}
      hasUnreadNotifications={hasUnreadNotifications}
      onNotificationsClick={onNotificationsClickCb}
    />,
  );
}

describe("Header", () => {
  beforeEach(jest.clearAllMocks);

  it("should have the 'header' class", () => {
    const { container } = renderHeader();
    const header = container.querySelector(TEST_ID);

    expect(header).toHaveClass(styles.header);
  });

  it("should display the logo", () => {
    const { getByTestId } = renderHeader();
    const logo = getByTestId("logo-link");

    expect(logo.getAttribute("aria-label")).toBe("I18N.ACCESSIBILITY.HOMEPAGE");
    expect(logo).toBeVisible();
    expect(Logo).toHaveBeenCalledTimes(1);
    expect(Logo).toHaveBeenCalledWith(
      {
        product: LogoProduct.NONE,
      },
      undefined,
    );
  });

  it("should display the logo with isGaming", () => {
    renderHeader({
      logoProduct: LogoProduct.GAMING,
    });

    expect(Logo).toHaveBeenCalledTimes(1);
    expect(Logo).toHaveBeenCalledWith(
      {
        product: LogoProduct.GAMING,
      },
      undefined,
    );
  });

  it("should display the logo with isExchange", () => {
    renderHeader({
      logoProduct: LogoProduct.BETFAIR_EXCHANGE,
    });

    expect(Logo).toHaveBeenCalledTimes(1);
    expect(Logo).toHaveBeenCalledWith(
      {
        product: LogoProduct.BETFAIR_EXCHANGE,
      },
      undefined,
    );
  });

  it("should have a link on logo", () => {
    const { container } = renderHeader();
    const link = container.querySelector(LOGO_CONTAINER);

    expect(link).not.toBe(null);
  });

  it("should display the balance button", () => {
    const { container } = renderHeader();
    const balanceBtn = container.querySelector(BALANCE_BUTTON);

    expect(balanceBtn).not.toBe(null);
    expect(balanceBtn).toHaveClass(styles.accountContainer);
  });

  it("should display the balance label", () => {
    const { container } = renderHeader();
    const balanceLabel = container.querySelector(BALANCE_LABEL);

    expect(balanceLabel).not.toBe(null);
    expect(balanceLabel).toHaveClass(styles.balanceLabel);
  });

  it("should display the GenerosityWallet (button) div and the StatusLabel inside of it", () => {
    const { container } = renderHeader({
      labels: { headerWalletLabel: "freeBetsBalanceMock" },
    });
    const generosityWalletDiv = container.querySelector(GENEROSITY_WALLET_BUTTON);

    expect(generosityWalletDiv).not.toBe(null);
    expect(generosityWalletDiv).toHaveClass(styles.generosityWalletActionContainer);

    expect(StatusLabel).toHaveBeenCalledWith(
      {
        text: "freeBetsBalanceMock",
        statusLabelType: "generosity",
        statusLabelSize: "small",
        iconName: "Casino--promotions",
      },
      undefined,
    );
  });

  it("should not display the back button", () => {
    const { container } = renderHeader();
    const backButton = container.querySelector(BACK_BUTTON);

    expect(backButton).toBe(null);
  });

  describe("when canGoBack is available", () => {
    it("should display the back button", () => {
      const { container } = renderHeader({ canGoBack: true });
      const backButton = container.querySelector(BACK_BUTTON);

      expect(backButton.getAttribute("aria-label")).toBe("I18N.ACCESSIBILITY.PREVIOUS_PAGE");
      expect(backButton).not.toBe(null);
    });

    it("should display the back button icon", () => {
      renderHeader({ canGoBack: true });
      expect(GenericIcon.mock.calls[0][0]).toEqual({
        name: SystemIconName.CHEVRON_LEFT,
        color: "var(--header-icon-back-icon-colour)",
      });
    });

    describe("when click on the back button", () => {
      it("must call onBackClick callback", () => {
        const component = renderHeader({ canGoBack: true }).container;

        component.querySelector(BACK_BUTTON).click();

        expect(onBackClickCb).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when showMenu is true", () => {
    it("should display the menu button", () => {
      const { container } = renderHeader({ showMenu: true });
      const menuButton = container.querySelector(MENU_BUTTON);

      expect(menuButton).not.toBe(null);
    });

    it("should display the menu button icon", () => {
      const { getByTestId } = renderHeader({ showMenu: true });

      expect(GenericIcon.mock.calls[0][0]).toEqual(
        {
          name: SystemIconName.MENU,
          color: "var(--header-icon-action-icon-left-default-colour)",
        },
        undefined,
      );

      const burgerIconButtonByTestId = getByTestId("burger-icon");
      expect(burgerIconButtonByTestId.getAttribute("aria-label")).toBe("I18N.SEARCH.TITLE");
    });

    describe("when click on the back button", () => {
      it("must call onBackClick callback", () => {
        const component = renderHeader({ canGoBack: true }).container;

        component.querySelector(BACK_BUTTON).click();

        expect(onBackClickCb).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when an account balance is provided", () => {
    it("should display the provided account balance", () => {
      const { container } = renderHeader({ accountBalance: "€ 1,234.56" });
      const balanceLabel = container.querySelector(BALANCE_LABEL);

      expect(balanceLabel).toHaveTextContent("€ 1,234.56");
    });

    it("should not display the account balance when showBalances preference is false", () => {
      const { container } = renderHeader({ accountBalance: "€ 1,234.56", showBalances: false });
      const balanceLabel = container.querySelector(BALANCE_LABEL);

      expect(balanceLabel).toBe(null);
    });

    it("should display the account balance when showBalances preference is true", () => {
      const { container } = renderHeader({ accountBalance: "€ 1,234.56", showBalances: true });
      const balanceLabel = container.querySelector(BALANCE_LABEL);

      expect(balanceLabel).toHaveTextContent("€ 1,234.56");
    });
  });

  describe("when an account generosity wallet balance is provided", () => {
    describe("when showBalances preference is false", () => {
      it("should not display the generosity wallet balance (button) div", () => {
        const { container } = renderHeader({ showBalances: false, labels: { headerWalletLabel: "€ 10.56" } });
        const generosityWalletDiv = container.querySelector(GENEROSITY_WALLET_BUTTON);

        expect(generosityWalletDiv).toBe(null);
      });
    });

    describe("when showBalances preference is true", () => {
      it("should display the generosity wallet balance (button) div with the StatusLabel inside of it", () => {
        const { container } = renderHeader({
          labels: { headerWalletLabel: "€ 10.56" },
          showBalances: true,
        });
        const generosityWalletDiv = container.querySelector(GENEROSITY_WALLET_BUTTON);

        expect(generosityWalletDiv).not.toBe(null);
        expect(generosityWalletDiv).toHaveClass(styles.generosityWalletActionContainer);

        expect(StatusLabel).toHaveBeenCalledWith(
          {
            text: "€ 10.56",
            statusLabelType: "generosity",
            statusLabelSize: "small",
            iconName: "Casino--promotions",
          },
          undefined,
        );
      });
    });

    describe("when headerWalletLabel is not defined", () => {
      it("should not display generosity wallet balance (button) div", () => {
        const { container } = renderHeader({ showBalances: true });
        const generosityWalletDiv = container.querySelector(GENEROSITY_WALLET_BUTTON);

        expect(generosityWalletDiv).toBe(null);
      });
    });
  });

  describe("if no account balance is provided", () => {
    it("should display 'NA'", () => {
      const { container } = renderHeader();
      const balanceLabel = container.querySelector(BALANCE_LABEL);

      expect(balanceLabel).toHaveTextContent("NA");
    });

    it("should not display the account balance when showBalances preference is false", () => {
      const { container } = renderHeader({ showBalances: false });
      const balanceLabel = container.querySelector(BALANCE_LABEL);

      expect(balanceLabel).toBe(null);
    });
  });

  describe('when click on the "my account" button', () => {
    it("must call onBalanceButtonClick callback", () => {
      const component = renderHeader({ accountBalance: "€ 1,234.56" }).container;

      component.querySelector(BALANCE_BUTTON).click();

      expect(onBalanceButtonClickCb).toHaveBeenCalledTimes(1);
    });
  });

  describe("when click on the GenerosityWallet (button) div", () => {
    it("must call onBalanceButtonClick callback", () => {
      const component = renderHeader({
        accountBalance: "€ 1,234.56",
        labels: { headerWalletLabel: "€ 1,000.00" },
      }).container;

      fireEvent.click(component.querySelector(GENEROSITY_WALLET_BUTTON));

      expect(onGenerosityWalletButtonClickCb).toHaveBeenCalledTimes(1);
    });
  });

  describe("when click on the logo", () => {
    it("must call onBalanceButtonClick callback", () => {
      const component = renderHeader({ accountBalance: "€ 1,234.56" }).container;

      component.querySelector(LOGO_CONTAINER).click();

      expect(onLogoClickCb).toHaveBeenCalledTimes(1);
    });
  });

  describe("when it has extraHeaderHeight", () => {
    describe("and is logged in", () => {
      renderHeader({ extraHeaderHeight: 10 });
      const height = global.document.body.style.getPropertyValue("--header-height");

      it("height value in DOM should have value of 66px", () => {
        expect(height).toBe("66px");
      });
    });
    describe("and is logged out", () => {
      renderHeader({ isLoggedIn: false, extraHeaderHeight: 10 });
      const height = global.document.body.style.getPropertyValue("--header-height");

      it("height value in DOM should have value of 126px", () => {
        expect(height).toBe("126px");
      });
    });
    describe("and shouldAccountForXSellBar is true", () => {
      renderHeader({ extraHeaderHeight: 10, shouldAccountForXSellBar: true });
      const height = document.body.style.getPropertyValue("--header-height");

      it("height value in DOM should have value of 126px", () => {
        expect(height).toBe("calc(66px + var(--x-sell-bar-mobile-container-sizing))");
      });
    });
  });

  describe("when user is not loggedIn", () => {
    beforeEach(() => jest.clearAllMocks());

    it('should not render the "my account" button', () => {
      const { container } = renderHeader({ isLoggedIn: false });
      expect(container.querySelector(BALANCE_LABEL)).toBeFalsy();
    });

    it("should call SecondaryButton properly", () => {
      renderHeader({ isLoggedIn: false });
      expect(SecondaryButton).toHaveBeenCalledTimes(1);
      expect(SecondaryButton).toHaveBeenCalledWith(
        { label: "I18N.HEADER.LOGIN", stopAnimation: true, onTap: onLoginButtonTap },
        undefined,
      );
    });

    it("should call PrimaryButton properly", () => {
      renderHeader({ isLoggedIn: false });
      expect(PrimaryButton).toHaveBeenCalledTimes(1);
      expect(PrimaryButton).toHaveBeenCalledWith(
        { label: "I18N.HEADER.JOIN_NOW", stopAnimation: true, onTap: onJoinNowButtonTap },
        undefined,
      );
    });

    describe("when under maintenance", () => {
      it("should NOT call SecondaryButton", () => {
        renderHeader({ isLoggedIn: false, isMaintenance: true });

        expect(SecondaryButton).toHaveBeenCalledTimes(0);
        expect(SecondaryButton).not.toHaveBeenCalled();
      });

      it("should NOT call PrimaryButton", () => {
        renderHeader({ isLoggedIn: false, isMaintenance: true });

        expect(PrimaryButton).toHaveBeenCalledTimes(0);
        expect(PrimaryButton).not.toHaveBeenCalled();
      });

      it("should hide login container", () => {
        const { container } = renderHeader({ isLoggedIn: false, isMaintenance: true });

        expect(container.querySelector(LOGIN_CONTAINER)).toBeNull();
        expect(container.querySelector(LOGIN_BUTTON)).toBeNull();
        expect(container.querySelector(JOIN_NOW_BUTTON)).toBeNull();
      });
    });
  });

  describe("when isNotificationsCenterEnabled is true", () => {
    it("should render the notifications center button", () => {
      const { container } = renderHeader({ isNotificationsCenterEnabled: true, hasUnreadNotifications: false });
      const notificationIconContainer = container.querySelector(NOTIFICATIONS_ICON_CONTAINER);

      expect(notificationIconContainer).not.toBe(null);
    });

    it("should call onNotificationsClick callback when click on the notifications icon", () => {
      const { container } = renderHeader({
        isNotificationsCenterEnabled: true,
        hasUnreadNotifications: false,
        onNotificationsClick: onNotificationsClickCb,
      });
      const notificationCenterButton = container.querySelector(NOTIFICATIONS_ICON_CONTAINER).parentElement;
      fireEvent.click(notificationCenterButton);

      expect(onNotificationsClickCb).toHaveBeenCalledTimes(1);
    });

    it("should display the unread notifications badge when hasUnreadNotifications is true", () => {
      renderHeader({
        isNotificationsCenterEnabled: true,
        hasUnreadNotifications: true,
      });
      expect(NotificationsIcon).toHaveBeenCalledWith({ unreadNotifications: true }, undefined);
    });

    it("should not display the unread notifications badge when hasUnreadNotifications is false", () => {
      renderHeader({
        isNotificationsCenterEnabled: true,
        hasUnreadNotifications: false,
      });
      expect(NotificationsIcon).toHaveBeenCalledWith({ unreadNotifications: false }, undefined);
    });
  });
});
