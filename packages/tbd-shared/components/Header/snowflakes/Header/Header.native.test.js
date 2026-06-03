import { render, fireEvent } from "@testing-library/react-native";

import { OffsetProvider } from "@ppb/the-wall-native/helpers/ScrollContext";
import { PrimaryButton, SecondaryButton, StatusLabel } from "@ppb/the-wall-native";

import { LogoProduct } from "../../../BetSharingCardGroup/snowflakes/Logo/Logo.types";
import { Logo } from "../../../BetSharingCardGroup/snowflakes/Logo/Logo.native";
import { Header } from "./Header.native";
import {
  HEADER_BACK_BUTTON,
  HEADER_BALANCE_BUTTON,
  HEADER_LOGO,
  HEADER_BALANCE_PRESSABLE,
  HEADER_BALANCE_LABEL,
  HEADER_GENEROSITY_WALLET_PRESSABLE,
  HEADER,
  JOIN_NOW_BUTTON,
  LOGIN_BUTTON,
  LOGIN_CONTAINER,
  HEADER_MENU_BUTTON,
  HEADER_GAMES_LOGO,
} from "./Header.native.selectors";
import styles from "./Header.native.styles";

jest.mock("../../../BetSharingCardGroup/snowflakes/Logo/Logo.native", () => ({
  Logo: jest.fn(({ props }) => <logo-mock-svg {...props} />),
}));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("@ppb/the-wall-native", () => ({
  StatusLabel: jest.fn(() => <status-label-mock />),
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
  Text: jest.requireActual("react-native").Text,
}));
const mockSetOffset = jest.fn();

jest.mock("@ppb/the-wall-native/helpers/ScrollContext", () => ({
  OffsetProvider: jest.fn(({ children }) => <offset-provider-mock>{children}</offset-provider-mock>),
  useScrollOffsetContext: jest.fn(() => 0),
  useUpdateScrollOffsetContext: jest.fn(() => mockSetOffset),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  useNotifications: jest.fn(() => ({
    hasUnreadNotifications: false,
    openNotifications: jest.fn(),
  })),
}));

jest.mock("../Notifications/NotificationsIcon", () => ({
  NotificationsIcon: jest.fn(() => <notifications-icon-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    HeaderBackgroundPrimaryColour: "red",
    HeaderIconSecondaryIconPadding: { padding: {} },
  },
}));

const onButtonTapSpy = jest.fn(() => {});

function renderHeader({
  isLoading,
  isLoggedIn = true,
  isMaintenance = false,
  logoProduct = LogoProduct.NONE,
  showBalances,
  accountBalance,
  showMenu,
  onBackPress,
  onLogoPress,
  onBalanceButtonPress,
  onGenerosityWalletButtonPress,
  onLoginButtonTap,
  onJoinNowButtonTap,
  onMenuPress,
  hasJoinNowButton,
  labels = {
    loginButtonLabel: "loginLabel",
    joinNowButtonLabel: "joinNowLabel",
    headerWalletLabel: undefined,
  },
} = {}) {
  return render(
    <OffsetProvider>
      <Header
        logoProduct={logoProduct}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        isMaintenance={isMaintenance}
        showBalances={showBalances}
        accountBalance={accountBalance}
        showMenu={showMenu}
        onBackPress={onBackPress}
        onLogoPress={onLogoPress}
        onBalanceButtonPress={onBalanceButtonPress}
        onGenerosityWalletButtonPress={onGenerosityWalletButtonPress}
        onLoginButtonTap={onLoginButtonTap}
        onJoinNowButtonTap={onJoinNowButtonTap}
        onMenuPress={onMenuPress}
        hasJoinNowButton={hasJoinNowButton}
        labels={labels}
      />
    </OffsetProvider>,
  );
}

describe("Header", () => {
  const onLogoPress = jest.fn();
  const onBalanceButtonPress = jest.fn();
  const onGenerosityWalletButtonPress = jest.fn();
  const onBackPress = jest.fn();
  const onMenuPress = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("should render the correct logo", () => {
    it("when Exchange", () => {
      const { queryByTestId } = renderHeader({ onBalanceButtonPress, logoProduct: LogoProduct.BETFAIR_EXCHANGE });
      const logo = queryByTestId(HEADER_LOGO);

      expect(logo).not.toBe(null);

      expect(Logo).toHaveBeenCalledTimes(1);
      expect(Logo).toHaveBeenCalledWith(
        {
          product: LogoProduct.BETFAIR_EXCHANGE,
        },
        undefined,
      );
    });

    it("when Betfair", () => {
      const { queryByTestId } = renderHeader({ onBalanceButtonPress });
      const logo = queryByTestId(HEADER_LOGO);

      expect(logo).not.toBe(null);

      expect(Logo).toHaveBeenCalledTimes(1);
      expect(Logo).toHaveBeenCalledWith(
        {
          product: LogoProduct.NONE,
        },
        undefined,
      );
    });

    it("when Games", () => {
      const { queryByTestId } = renderHeader({ onBalanceButtonPress, logoProduct: LogoProduct.GAMING });
      const logo = queryByTestId(HEADER_GAMES_LOGO);

      expect(logo).not.toBe(null);

      expect(Logo).toHaveBeenCalledTimes(1);
      expect(Logo).toHaveBeenCalledWith(
        {
          product: LogoProduct.GAMING,
        },
        undefined,
      );
    });
  });

  it("should handle logo press", () => {
    const { queryByTestId } = renderHeader({ onBalanceButtonPress, onLogoPress });
    const logo = queryByTestId(HEADER_LOGO);

    expect(onLogoPress).not.toHaveBeenCalled();
    fireEvent.press(logo);
    expect(onLogoPress).toHaveBeenCalled();
  });

  it("should have accessibility props on logo", () => {
    const { queryByTestId } = renderHeader({ onBalanceButtonPress, onLogoPress });
    const logo = queryByTestId(HEADER_LOGO);

    expect(logo).toBeTruthy();
    expect(logo.props.accessibilityLabel).toBe("I18N.ACCESSIBILITY.HOMEPAGE");
    expect(logo.props.accessibilityRole).toBe("link");
  });

  it("should have accessibility props on balance link", () => {
    const { queryByTestId } = renderHeader({ accountBalance: "€ 10" });
    const balance = queryByTestId(HEADER_BALANCE_PRESSABLE);

    expect(balance).toBeTruthy();
    expect(balance.props.accessibilityRole).toBe("link");
    expect(balance.props.accessibilityLabel).toBe("€ 10");
    expect(balance.props.accessibilityHint).toBe("I18N.ACCESSIBILITY.BALANCE_LINK_HINT");
  });

  it("should have accessibility props on bonus balance button", () => {
    const { queryByTestId } = renderHeader({ labels: { headerWalletLabel: "€ 10" } });
    const bonusBalance = queryByTestId(HEADER_GENEROSITY_WALLET_PRESSABLE);

    expect(bonusBalance).toBeTruthy();
    expect(bonusBalance.props.accessibilityRole).toBe("button");
    expect(bonusBalance.props.accessibilityLabel).toBe("€ 10");
    expect(bonusBalance.props.accessibilityHint).toBe("I18N.ACCESSIBILITY.PROMOS_WALLET_BUTTON_HINT");
  });

  it("should handle balance press", () => {
    const { queryByTestId } = renderHeader({ onBalanceButtonPress });
    const balance = queryByTestId(HEADER_BALANCE_BUTTON);

    expect(onBalanceButtonPress).not.toHaveBeenCalled();
    fireEvent.press(balance);
    expect(onBalanceButtonPress).toHaveBeenCalled();
  });

  it("should handle generosity wallet press", () => {
    const { queryByTestId } = renderHeader({
      onGenerosityWalletButtonPress,
      labels: { headerWalletLabel: "headerWalletLabel" },
    });
    const generosityWalletPressable = queryByTestId(HEADER_GENEROSITY_WALLET_PRESSABLE);

    expect(onGenerosityWalletButtonPress).not.toHaveBeenCalled();
    fireEvent.press(generosityWalletPressable);
    expect(onGenerosityWalletButtonPress).toHaveBeenCalled();
  });

  it("should render account without balance", () => {
    const { queryByTestId } = renderHeader({ onBalanceButtonPress });
    const balance = queryByTestId(HEADER_BALANCE_LABEL);

    expect(balance).toHaveTextContent("NA");
  });

  it("should render account with balance", () => {
    const { queryByTestId } = renderHeader({ onBalanceButtonPress, accountBalance: "€ 100" });
    const balance = queryByTestId(HEADER_BALANCE_LABEL);

    expect(balance).toHaveTextContent("€ 100");
  });

  it("should render account with hidden balance", () => {
    const { queryByTestId } = renderHeader({
      onBalanceButtonPress,
      accountBalance: "€ 100",
      showBalances: false,
    });
    const balance = queryByTestId(HEADER_BALANCE_LABEL);

    expect(balance).toBe(null);
  });

  it("should render stacked screen header", () => {
    const { queryByTestId } = renderHeader({
      onBalanceButtonPress,
      onBackPress,
    });
    const logo = queryByTestId(HEADER_LOGO);
    const backButton = queryByTestId(HEADER_BACK_BUTTON);

    expect(logo).not.toBe(null);
    expect(backButton).not.toBe(null);
  });

  it("should have accessibility props on back button", () => {
    const { queryByTestId } = renderHeader({ onBalanceButtonPress, onBackPress });
    const backButton = queryByTestId(HEADER_BACK_BUTTON);

    expect(backButton.props.accessibilityLabel).toBe("I18N.LABEL.BACK");
    expect(backButton.props.accessibilityHint).toBe("I18N.ACCESSIBILITY.PREVIOUS_PAGE");
    expect(backButton.props.accessibilityRole).toBe("button");
  });

  it("should not call set offset if no back function is passed", () => {
    const { queryByTestId } = renderHeader({ onBalanceButtonPress });
    const backButton = queryByTestId(HEADER_BACK_BUTTON);
    expect(backButton).toBeNull();
    expect(mockSetOffset).not.toHaveBeenCalled();
  });

  it("should handle back button press", () => {
    const { queryByTestId } = renderHeader({ onBalanceButtonPress, onBackPress });
    const backButton = queryByTestId(HEADER_BACK_BUTTON);
    expect(onBackPress).not.toHaveBeenCalled();
    fireEvent.press(backButton);
    expect(onBackPress).toHaveBeenCalled();
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it("should render account stick to the right", () => {
    const { queryByTestId } = renderHeader({
      onBalanceButtonPress,
      onBackPress: undefined,
    });
    const header = queryByTestId(HEADER);

    expect(header).toHaveStyle(styles.headerOnlyMyAccount);
  });

  describe("when an account free bets balance is provided", () => {
    describe("when showBalances preference is false", () => {
      it("should not display the generosity wallet pressable", () => {
        const { queryByTestId } = renderHeader({
          onBalanceButtonPress,
          onGenerosityWalletButtonPress,
          accountBalance: "€ 100",
          showBalances: false,
          labels: { headerWalletLabel: "freebetsLabel" },
        });
        const generosityWalletPressable = queryByTestId(HEADER_GENEROSITY_WALLET_PRESSABLE);

        expect(generosityWalletPressable).toBe(null);
      });
    });

    describe("when showBalances preference is true", () => {
      it("should display the generosity wallet pressable", () => {
        const { queryByTestId } = renderHeader({
          onBalanceButtonPress,
          accountBalance: "€ 100",
          showBalances: true,
          labels: { headerWalletLabel: "€ 10" },
        });
        const generosityWalletPressable = queryByTestId(HEADER_GENEROSITY_WALLET_PRESSABLE);

        expect(generosityWalletPressable).not.toBe(null);
        expect(StatusLabel).toHaveBeenCalledWith(
          {
            text: "€ 10",
            iconName: "Casino--promotions",
            statusLabelType: "generosity",
            statusLabelSize: "small",
            accessible: false,
          },
          undefined,
        );
      });
    });

    describe("when headerWalletLabel is not defined", () => {
      it("should not display generosity wallet pressable", () => {
        const { queryByTestId } = renderHeader({
          onBalanceButtonPress,
          accountBalance: "€ 100",
          showBalances: true,
        });
        const generosityWalletPressable = queryByTestId(HEADER_GENEROSITY_WALLET_PRESSABLE);

        expect(generosityWalletPressable).toBe(null);
      });
    });
  });

  describe("when user is not loggedIn", () => {
    it('should not render the "my account" button', () => {
      const { queryByTestId } = renderHeader({
        isLoggedIn: false,
        onLoginButtonTap: onButtonTapSpy,
        onJoinNowButtonTap: onButtonTapSpy,
        loginButtonLabel: "Mock Login Button Text",
        joinNowButtonLabel: "Mock Join Now Button Text",
      });

      expect(queryByTestId(HEADER_BALANCE_BUTTON)).toBeFalsy();
    });

    it("should hide join now button", () => {
      const { queryByTestId } = renderHeader({
        isLoggedIn: false,
        onLoginButtonTap: onButtonTapSpy,
        onJoinNowButtonTap: onButtonTapSpy,
        loginButtonLabel: "Mock Login Button Text",
        joinNowButtonLabel: "Mock Join Now Button Text",
        hasJoinNowButton: false,
      });

      const joinNowButton = queryByTestId(JOIN_NOW_BUTTON);
      expect(joinNowButton).toBeNull();
    });

    it("should call SecondaryButton", () => {
      renderHeader({
        isLoggedIn: false,
        onLoginButtonTap: onButtonTapSpy,
        onJoinNowButtonTap: onButtonTapSpy,
        labels: { loginButtonLabel: "Mock Login Button Text", joinNowButtonLabel: "Mock Join Now Button Text" },
      });

      expect(SecondaryButton).toHaveBeenCalledWith(
        { label: "Mock Login Button Text", stopAnimation: true, onTap: onButtonTapSpy },
        undefined,
      );
    });

    it("should call PrimaryButton", () => {
      renderHeader({
        isLoggedIn: false,
        onLoginButtonTap: onButtonTapSpy,
        onJoinNowButtonTap: onButtonTapSpy,
        labels: { loginButtonLabel: "Mock Login Button Text", joinNowButtonLabel: "Mock Join Now Button Text" },
      });

      expect(PrimaryButton).toHaveBeenCalledWith(
        { label: "Mock Join Now Button Text", stopAnimation: true, onTap: onButtonTapSpy },
        undefined,
      );
    });

    it("should show login container and buttons with correct style", () => {
      const { getByTestId } = renderHeader({
        isLoggedIn: false,
        onLoginButtonTap: onButtonTapSpy,
        onJoinNowButtonTap: onButtonTapSpy,
        loginButtonLabel: "Mock Login Button Text",
        joinNowButtonLabel: "Mock Join Now Button Text",
      });

      const loginContainer = getByTestId(LOGIN_CONTAINER);
      expect(loginContainer).toBeDefined();
      expect(loginContainer).toHaveStyle(styles.loginContainer);

      const loginButton = getByTestId(LOGIN_BUTTON);
      expect(loginButton).toBeDefined();
      expect(loginButton).toHaveStyle(styles.loginContainerButton);

      const joinNowButton = getByTestId(JOIN_NOW_BUTTON);
      expect(joinNowButton).toBeDefined();
      expect(joinNowButton).toHaveStyle(styles.loginContainerButton);
    });

    describe("when under maintenance", () => {
      it("should NOT call SecondaryButton", () => {
        renderHeader({
          isLoggedIn: false,
          isMaintenance: true,
          onLoginButtonTap: onButtonTapSpy,
          onJoinNowButtonTap: onButtonTapSpy,
          loginButtonLabel: "Mock Login Button Text",
          joinNowButtonLabel: "Mock Join Now Button Text",
        });

        expect(SecondaryButton).toHaveBeenCalledTimes(0);
        expect(SecondaryButton).not.toHaveBeenCalled();
      });

      it("should NOT call PrimaryButton", () => {
        renderHeader({
          isLoggedIn: false,
          isMaintenance: true,
          onLoginButtonTap: onButtonTapSpy,
          onJoinNowButtonTap: onButtonTapSpy,
          loginButtonLabel: "Mock Login Button Text",
          joinNowButtonLabel: "Mock Join Now Button Text",
        });

        expect(PrimaryButton).toHaveBeenCalledTimes(0);
        expect(PrimaryButton).not.toHaveBeenCalled();
      });

      it("should hide login container", () => {
        const { queryByTestId } = renderHeader({
          isLoggedIn: false,
          isMaintenance: true,
          onLoginButtonTap: onButtonTapSpy,
          onJoinNowButtonTap: onButtonTapSpy,
          loginButtonLabel: "Mock Login Button Text",
          joinNowButtonLabel: "Mock Join Now Button Text",
        });

        const loginContainer = queryByTestId(LOGIN_CONTAINER);
        expect(loginContainer).toBeNull();

        const loginButton = queryByTestId(LOGIN_BUTTON);
        expect(loginButton).toBeNull();

        const joinNowButton = queryByTestId(JOIN_NOW_BUTTON);
        expect(joinNowButton).toBeNull();
      });
    });
  });

  describe("when the showMenu prop is true", () => {
    it("should render the menu button", () => {
      const { queryByTestId } = renderHeader({
        showMenu: true,
        onMenuPress,
      });
      const menuButton = queryByTestId(HEADER_MENU_BUTTON);

      expect(menuButton).toBeTruthy();
    });

    it("should render the menu button with accessible information", () => {
      const { queryByTestId } = renderHeader({
        showMenu: true,
        onMenuPress,
      });
      const menuButton = queryByTestId(HEADER_MENU_BUTTON);

      expect(menuButton.props.accessibilityLabel).toBe("I18N.SEARCH.TITLE");
      expect(menuButton.props.accessibilityHint).toBe("I18N.ACCESSIBILITY.BROWSE_BUTTON_HINT");
      expect(menuButton.props.accessibilityRole).toBe("button");
    });

    it("should handle menu button press", () => {
      const { queryByTestId } = renderHeader({
        showMenu: true,
        onMenuPress,
      });
      const menuButton = queryByTestId(HEADER_MENU_BUTTON);

      expect(onMenuPress).not.toHaveBeenCalled();
      fireEvent.press(menuButton);
      expect(onMenuPress).toHaveBeenCalled();
    });
  });
});
