import { useState } from "react";
import * as React from "react";
import { Platform } from "react-native";
import {
  useLogin,
  useJoinNow,
  useAppLaunch,
  useUserLocation,
  useSessionTransfer,
  usePendingBiometricActivation,
} from "@flutter-global/react-native-cet-framework";
import { render, fireEvent, act } from "@testing-library/react-native";

import { FilterDrawer } from "@ppb/the-wall-native";
import {
  navigateMyAccount,
  goBack,
  navigate,
  navigateWithThirdPartyScreenName,
  ScreenName,
  GamesLobbyObject,
  navigationRef,
} from "@ppb/tbd-router/native";
import { LogoProduct } from "../BetSharingCardGroup/snowflakes/Logo/Logo.types";
import { Header as HeaderComponent } from "./snowflakes/Header/Header.native";
import ConnectedRegulatoryHeader from "../RegulatoryHeader";
import RegulatoryHeader from "../RegulatoryHeader/RegulatoryHeader.native";
import ConnectedLeftSidebar from "../LeftSidebar";
import LeftSidebar from "../LeftSidebar/LeftSidebar.native";
import Header from "./Header.native";
import { HEADER_CONTAINER } from "./Header.native.selectors";
import { useHeaderSizeEmitter } from "./hooks/useHeaderSize.native";
import appConfiguration from "../../config/app-configuration.native";
import { getExternalLink } from "../../helpers/external-links";
import { useBottomBarState } from "../../hooks/useBottomBarState.native";
import { useAppStartupTimeReporter } from "../../hooks/useAppStartupTimeReporter.native";

jest.mock("../../hooks/useDebounce", () => jest.fn().mockReturnValue(true));

jest.mock("../RegulatoryHeader", () => jest.fn(() => <connected-regulatory-header-mock />));
jest.mock("../RegulatoryHeader/RegulatoryHeader.native", () => jest.fn(() => <regulatory-header-mock />));

jest.mock("../LeftSidebar", () => jest.fn(() => <connected-left-sidebar-mock />));
jest.mock("../LeftSidebar/LeftSidebar.native", () => jest.fn(() => <left-sidebar-mock />));

jest.mock("./snowflakes/Header/Header.native", () => ({
  Header: jest.fn((props) => <filter-drawer-mock {...props} />),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(),
}));

jest.mock("@ppb/the-wall-native", () => ({
  FilterDrawer: jest.fn((props) => <filter-drawer-mock {...props} />),
}));

jest.mock("@ppb/tbd-components-navigation/components/XSellBar/view/XSellBar.native", () =>
  jest.fn(() => <x-sell-bar-mock />),
);

jest.mock("@ppb/tbd-router/native", () => ({
  goBack: jest.fn(),
  navigate: jest.fn(),
  navigateMyAccount: jest.fn(),
  navigateWithThirdPartyScreenName: jest.fn(),
  ScreenName: {
    GamingMySelectionsScreen: "GamingMySelectionsScreen",
    GamingLobbyScreen: "GamingLobbyScreen",
    GamingGamesCollectionScreen: "GamingGamesCollectionScreen",
  },
  navigationRef: {
    current: {
      getCurrentRoute: jest.fn(),
    },
  },
  GamesLobbyObject: {
    closeGameInfoScreen: jest.fn(),
    triggerConfirmationPopUp: jest.fn(),
  },
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 10 })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    HeaderContainerSizing: 10,
    HeaderContainerDropShadow: {
      shadowOffset: {},
    },
  },
}));

const mockAddListener = jest.fn(() => ({
  remove: jest.fn(),
}));

jest.mock("react-native", () => {
  const { StyleSheet, View, DeviceEventEmitter } = jest.requireActual("react-native");
  return {
    requireNativeComponent: jest.fn(),
    DeviceEventEmitter,
    NativeEventEmitter: () => ({
      addListener: mockAddListener,
    }),
    NativeModules: {
      GamesLobbyEventEmitter: jest.fn(),
    },
    Platform: { OS: "ios" },
    View,
    StyleSheet,
  };
});

jest.mock("@flutter-global/react-native-cet-framework", () => {
  const loginCET = jest.fn();
  const joinNowCET = jest.fn();
  const loginAppLaunch = jest.fn();
  const userLocation = jest.fn();
  const sessionTransfer = jest.fn();
  const pendingBiometricActivation = jest.fn();

  return {
    useLogin: jest.fn(() => loginCET),
    useJoinNow: jest.fn(() => joinNowCET),
    useAppLaunch: jest.fn(() => loginAppLaunch),
    useUserLocation: jest.fn(() => userLocation),
    useSessionTransfer: jest.fn(() => sessionTransfer),
    usePendingBiometricActivation: jest.fn(() => pendingBiometricActivation),
  };
});

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    setUserPreferences: jest.fn(),
    setSessionTime: jest.fn(),
    refreshBalance: undefined,
  })),
  useState: jest.fn(() => [false, jest.fn()]),
}));

jest.mock("./hooks/useHeaderSize.native", () => ({
  useHeaderSizeEmitter: jest.fn(),
}));

jest.mock("../../helpers/external-links", () => ({
  getExternalLink: jest.fn(() => "xsell item url"),
}));

jest.mock("../../hooks/useBottomBarState", () => ({
  useBottomBarState: jest.fn(() => ({ isRootFocused: false, isLoading: true })),
}));

jest.mock("../../hooks/useAppStartupTimeReporter", () => ({
  useAppStartupTimeReporter: jest.fn(),
}));

jest.mock("../../helpers/cet-init-state.native", () => ({
  onCetInitialised: jest.fn((cb) => {
    cb();
    return jest.fn();
  }),
}));

const dispatchFetchUserMainWalletMock = jest.fn();
const dispatchLogoClickActionMock = jest.fn();
const dispatchFetchGenerosityWalletCardGroupActionMock = jest.fn();
const dispatchGenerosityWalletClickActionMock = jest.fn();
const dispatchHamburgerMenuOpenActionMock = jest.fn();
const dispatchHamburgerMenuCloseActionMock = jest.fn();
const dispatchPushActionMock = jest.fn();

const DEFAULT_PROPS = {
  userPreferences: ["sportsbook"],
  isLoggedIn: true,
  logoViewLink: {
    viewUrl: "",
    viewUrn: "ppb:tbd:view:generic:home",
  },
  showBalances: true,
  accountBalance: "€1,234567.89",
  labels: {
    loginButtonLabel: "loginLabel",
    joinNowButtonLabel: "joinNowLabel",
    headerWalletLabel: "€10.00",
  },
  isFreeBetsWalletActive: false,
  isHamburguerMenuEnabled: false,
  isHamburgerMenuOpen: false,
};

function renderHeader({
  userPreferences,
  isLoggedIn = true,
  isMaintenance = false,
  isExchange = false,
  isGaming = false,
  logoViewLink,
  showBalances,
  accountBalance,
  labels,
  isFreeBetsWalletActive,
  isHamburguerMenuEnabled,
  isHamburgerMenuOpen,
  dispatchFetchUserMainWallet = dispatchFetchUserMainWalletMock,
  dispatchLogoClickAction = dispatchLogoClickActionMock,
  dispatchFetchGenerosityWalletCardGroupAction = dispatchFetchGenerosityWalletCardGroupActionMock,
  dispatchGenerosityWalletClickAction = dispatchGenerosityWalletClickActionMock,
  dispatchHamburgerMenuOpenAction = dispatchHamburgerMenuOpenActionMock,
  dispatchHamburgerMenuCloseAction = dispatchHamburgerMenuCloseActionMock,
  dispatchPushAction = dispatchPushActionMock,
  isSBGJoinNowEnabled,
  shouldAccountForXSellBar = false,
} = DEFAULT_PROPS) {
  return render(
    <Header
      userPreferences={userPreferences}
      isLoggedIn={isLoggedIn}
      isMaintenance={isMaintenance}
      isExchange={isExchange}
      isGaming={isGaming}
      logoViewLink={logoViewLink}
      showBalances={showBalances}
      accountBalance={accountBalance}
      labels={labels}
      isFreeBetsWalletActive={isFreeBetsWalletActive}
      isHamburguerMenuEnabled={isHamburguerMenuEnabled}
      isHamburgerMenuOpen={isHamburgerMenuOpen}
      dispatchFetchUserMainWallet={dispatchFetchUserMainWallet}
      dispatchLogoClickAction={dispatchLogoClickAction}
      dispatchFetchGenerosityWalletCardGroupAction={dispatchFetchGenerosityWalletCardGroupAction}
      dispatchGenerosityWalletClickAction={dispatchGenerosityWalletClickAction}
      dispatchHamburgerMenuOpenAction={dispatchHamburgerMenuOpenAction}
      dispatchHamburgerMenuCloseAction={dispatchHamburgerMenuCloseAction}
      dispatchPushAction={dispatchPushAction}
      isSBGJoinNowEnabled={isSBGJoinNowEnabled}
      shouldAccountForXSellBar={shouldAccountForXSellBar}
    />,
  );
}

describe("Header component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    appConfiguration.setAppBrand("betfair");
  });

  describe("when header is defined", () => {
    it("must render the header component with the correct props", () => {
      renderHeader();

      expect(HeaderComponent).toHaveBeenCalledWith(
        {
          isLoggedIn: true,
          isLoading: true,
          isMaintenance: false,
          logoProduct: LogoProduct.NONE,
          accountBalance: "€1,234567.89",
          onBackPress: goBack,
          onLogoPress: expect.any(Function),
          onBalanceButtonPress: expect.any(Function),
          onGenerosityWalletButtonPress: expect.any(Function),
          onLoginButtonTap: expect.any(Function),
          onJoinNowButtonTap: expect.any(Function),
          showBalances: true,
          onMenuPress: expect.any(Function),
          showMenu: false,
          hasJoinNowButton: true,
          labels: {
            loginButtonLabel: "loginLabel",
            joinNowButtonLabel: "joinNowLabel",
            headerWalletLabel: "€10.00",
          },
        },
        undefined,
      );
      expect(HeaderComponent).toHaveBeenCalledTimes(1);
    });

    it("must render the header component with the correct props for skybet, and the join now button toggled on", () => {
      appConfiguration.setAppBrand("skybet");
      renderHeader({ ...DEFAULT_PROPS, isSBGJoinNowEnabled: true });

      expect(HeaderComponent).toHaveBeenCalledWith(
        {
          isLoggedIn: true,
          isLoading: true,
          isMaintenance: false,
          logoProduct: LogoProduct.NONE,
          accountBalance: "€1,234567.89",
          onBackPress: goBack,
          onLogoPress: expect.any(Function),
          onBalanceButtonPress: expect.any(Function),
          onGenerosityWalletButtonPress: expect.any(Function),
          onLoginButtonTap: expect.any(Function),
          onJoinNowButtonTap: expect.any(Function),
          showBalances: true,
          onMenuPress: expect.any(Function),
          showMenu: false,
          hasJoinNowButton: true,
          labels: {
            loginButtonLabel: "loginLabel",
            joinNowButtonLabel: "joinNowLabel",
            headerWalletLabel: "€10.00",
          },
        },
        undefined,
      );
    });

    it("must render the header component with the correct props for skybet, and the join now button toggled off", () => {
      appConfiguration.setAppBrand("skybet");
      renderHeader({ ...DEFAULT_PROPS, isSBGJoinNowEnabled: false });

      expect(HeaderComponent).toHaveBeenCalledWith(
        {
          isLoggedIn: true,
          isLoading: true,
          isMaintenance: false,
          logoProduct: LogoProduct.NONE,
          accountBalance: "€1,234567.89",
          onBackPress: goBack,
          onLogoPress: expect.any(Function),
          onBalanceButtonPress: expect.any(Function),
          onGenerosityWalletButtonPress: expect.any(Function),
          onLoginButtonTap: expect.any(Function),
          onJoinNowButtonTap: expect.any(Function),
          showBalances: true,
          onMenuPress: expect.any(Function),
          showMenu: false,
          hasJoinNowButton: false,
          labels: {
            loginButtonLabel: "loginLabel",
            joinNowButtonLabel: "joinNowLabel",
            headerWalletLabel: "€10.00",
          },
        },
        undefined,
      );
    });

    it("must render the header component with the correct props for betfair", () => {
      renderHeader();

      expect(HeaderComponent).toHaveBeenCalledWith(
        {
          isLoggedIn: true,
          isLoading: true,
          isMaintenance: false,
          logoProduct: LogoProduct.NONE,
          accountBalance: "€1,234567.89",
          onBackPress: goBack,
          onLogoPress: expect.any(Function),
          onBalanceButtonPress: expect.any(Function),
          onGenerosityWalletButtonPress: expect.any(Function),
          onLoginButtonTap: expect.any(Function),
          onJoinNowButtonTap: expect.any(Function),
          showBalances: true,
          onMenuPress: expect.any(Function),
          showMenu: false,
          hasJoinNowButton: true,
          labels: {
            loginButtonLabel: "loginLabel",
            joinNowButtonLabel: "joinNowLabel",
            headerWalletLabel: "€10.00",
          },
        },
        undefined,
      );
    });

    it("must render the header component with the correct props for gaming", () => {
      renderHeader({ ...DEFAULT_PROPS, isGaming: true });

      expect(HeaderComponent).toHaveBeenCalledWith(
        {
          isLoggedIn: true,
          isLoading: true,
          isMaintenance: false,
          logoProduct: LogoProduct.GAMING,
          accountBalance: "€1,234567.89",
          onBackPress: goBack,
          onLogoPress: expect.any(Function),
          onBalanceButtonPress: expect.any(Function),
          onGenerosityWalletButtonPress: expect.any(Function),
          onLoginButtonTap: expect.any(Function),
          onJoinNowButtonTap: expect.any(Function),
          showBalances: true,
          onMenuPress: expect.any(Function),
          showMenu: false,
          hasJoinNowButton: true,
          labels: {
            loginButtonLabel: "loginLabel",
            joinNowButtonLabel: "joinNowLabel",
            headerWalletLabel: "€10.00",
          },
        },
        undefined,
      );
      expect(HeaderComponent).toHaveBeenCalledTimes(1);
    });

    it("must render the header component with the correct props for exchange", () => {
      renderHeader({ ...DEFAULT_PROPS, isExchange: true });

      expect(HeaderComponent).toHaveBeenCalledWith(
        {
          isLoggedIn: true,
          isLoading: true,
          isMaintenance: false,
          logoProduct: LogoProduct.BETFAIR_EXCHANGE,
          accountBalance: "€1,234567.89",
          onBackPress: goBack,
          onLogoPress: expect.any(Function),
          onBalanceButtonPress: expect.any(Function),
          onGenerosityWalletButtonPress: expect.any(Function),
          onLoginButtonTap: expect.any(Function),
          onJoinNowButtonTap: expect.any(Function),
          showBalances: true,
          onMenuPress: expect.any(Function),
          showMenu: false,
          hasJoinNowButton: true,
          labels: {
            loginButtonLabel: "loginLabel",
            joinNowButtonLabel: "joinNowLabel",
            headerWalletLabel: "€10.00",
          },
        },
        undefined,
      );
      expect(HeaderComponent).toHaveBeenCalledTimes(1);
    });

    it("must render the header component with the correct props for skybet games", () => {
      renderHeader({ ...DEFAULT_PROPS, isGaming: true });

      expect(HeaderComponent).toHaveBeenCalledWith(
        {
          isLoggedIn: true,
          isLoading: true,
          isMaintenance: false,
          logoProduct: LogoProduct.GAMING,
          accountBalance: "€1,234567.89",
          onBackPress: goBack,
          onLogoPress: expect.any(Function),
          onBalanceButtonPress: expect.any(Function),
          onGenerosityWalletButtonPress: expect.any(Function),
          onLoginButtonTap: expect.any(Function),
          onJoinNowButtonTap: expect.any(Function),
          showBalances: true,
          onMenuPress: expect.any(Function),
          showMenu: false,
          hasJoinNowButton: true,
          labels: {
            loginButtonLabel: "loginLabel",
            joinNowButtonLabel: "joinNowLabel",
            headerWalletLabel: "€10.00",
          },
        },
        undefined,
      );
      expect(HeaderComponent).toHaveBeenCalledTimes(1);
    });

    it("must call ConnectedRegulatoryHeader with the correct props", () => {
      renderHeader();

      expect(ConnectedRegulatoryHeader).toHaveBeenCalledWith(
        {
          component: RegulatoryHeader,
        },
        undefined,
      );
      expect(ConnectedRegulatoryHeader).toHaveBeenCalledTimes(1);
    });

    it("must call useAppStartupTimeReporter with the correct params", () => {
      renderHeader();

      expect(useAppStartupTimeReporter).toHaveBeenCalledTimes(1);
      expect(useAppStartupTimeReporter).toHaveBeenCalledWith(true);
    });

    it("must add the native listeners", () => {
      renderHeader();

      expect(mockAddListener).toHaveBeenCalledTimes(2);
    });

    describe("when there is no maintenance", () => {
      it("should call the dispatchFetchUserMainWallet", () => {
        renderHeader({ ...DEFAULT_PROPS, isMaintenance: false, isLoggedIn: true });

        expect(dispatchFetchUserMainWalletMock).toHaveBeenCalled();
        expect(HeaderComponent).toHaveBeenCalledTimes(1);
      });
    });

    describe("when under maintenance", () => {
      it("should not call the dispatchFetchUserMainWallet", () => {
        renderHeader({ ...DEFAULT_PROPS, isMaintenance: true, isLoggedIn: true });

        expect(dispatchFetchUserMainWalletMock).not.toHaveBeenCalled();
      });
    });

    describe("when user is not loggedIn", () => {
      it("should not call dispatchFetchUserMainWallet", () => {
        renderHeader({ ...DEFAULT_PROPS, isLoggedIn: false });

        expect(dispatchFetchUserMainWalletMock).not.toHaveBeenCalled();
        expect(HeaderComponent).toHaveBeenCalledTimes(1);
      });
    });

    describe("when root screen is not focused", () => {
      beforeEach(() => {
        useBottomBarState.mockReturnValueOnce({ isRootFocused: false });
        renderHeader();
      });

      it("should have onBackPress defined", () => {
        const { onBackPress } = HeaderComponent.mock.calls[0][0];

        expect(onBackPress).toBeDefined();
      });

      it("should call goBack when onBackPress is called", () => {
        const { onBackPress } = HeaderComponent.mock.calls[0][0];

        onBackPress();

        expect(goBack).toHaveBeenCalledTimes(1);
      });
    });

    describe("when root screen is focused", () => {
      beforeEach(() => {
        useBottomBarState.mockReturnValueOnce({ isRootFocused: true });
        renderHeader();
      });

      it("should have onBackPress as undefined", () => {
        const { onBackPress } = HeaderComponent.mock.calls[0][0];

        expect(onBackPress).toBeUndefined();
      });
    });

    describe("when onLogoPress is called", () => {
      beforeEach(() => {
        renderHeader();

        const { onLogoPress } = HeaderComponent.mock.calls[0][0];

        onLogoPress();
      });

      it("should call navigate with logoViewLink prop", () => {
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith(DEFAULT_PROPS.logoViewLink);
      });

      it("should call the dispatchLogoClickAction with logoViewLink prop", () => {
        expect(dispatchLogoClickActionMock).toHaveBeenCalledTimes(1);
        expect(dispatchLogoClickActionMock).toHaveBeenCalledWith(DEFAULT_PROPS.logoViewLink);
      });

      describe("when platform is ios and product is sky bet gaming", () => {
        beforeEach(() => {
          Platform.OS = "ios";
          jest.clearAllMocks();
        });

        describe("when platform is ios and product is sky bet games", () => {
          describe("when the current route is GamingMySelectionsScreen", () => {
            beforeEach(() => {
              navigationRef.current.getCurrentRoute.mockReturnValue({ name: ScreenName.GamingMySelectionsScreen });
              renderHeader({
                ...DEFAULT_PROPS,
                isGaming: true,
                logoViewLink: { viewUrl: "", viewUrn: "ppb:tbd:view:gaming:1" },
              });
            });

            it("should trigger confirmation popup when current roure is GamingMySelectionsScreen", () => {
              expect(HeaderComponent.mock.calls.length).toBeGreaterThan(0);
              const { onLogoPress } = HeaderComponent.mock.calls[0][0];
              onLogoPress();
              expect(GamesLobbyObject.triggerConfirmationPopUp).toHaveBeenCalledWith(true);
            });
          });

          describe("when disableGamesDetailsScreen is true", () => {
            beforeEach(() => {
              navigationRef.current.getCurrentRoute.mockReturnValue({ name: ScreenName.GamingGamesCollectionScreen });
              useState.mockImplementationOnce(() => [true, jest.fn()]);
              renderHeader({
                ...DEFAULT_PROPS,
                isGaming: true,
                logoViewLink: { viewUrl: "", viewUrn: "ppb:tbd:view:gaming:1" },
              });
            });

            it("should trigger closeGameInfoScreen", async () => {
              expect(HeaderComponent.mock.calls.length).toBeGreaterThan(0);

              const { onLogoPress } = HeaderComponent.mock.calls[0][0];
              onLogoPress();

              expect(GamesLobbyObject.closeGameInfoScreen).toHaveBeenCalledWith(true);
            });
          });

          describe("when the disableGamesDetailsScreen is false and the current route is different GamingMySelectionsScreen", () => {
            beforeEach(() => {
              navigationRef.current.getCurrentRoute.mockReturnValue({ name: ScreenName.GamingGamesCollectionScreen });
              useState.mockImplementationOnce(() => [false, jest.fn()]);
              renderHeader({
                ...DEFAULT_PROPS,
                isGaming: true,
                logoViewLink: { viewUrl: "", viewUrn: "ppb:tbd:view:gaming:1" },
              });
              const { onLogoPress } = HeaderComponent.mock.calls[0][0];
              onLogoPress();
            });

            it("should call navigateWithThirdPartyScreenName with GamingLobbyScreen", () => {
              expect(navigateWithThirdPartyScreenName).toHaveBeenCalledTimes(1);
              expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.GamingLobbyScreen);
              expect(dispatchLogoClickActionMock).toHaveBeenCalledTimes(1);
              expect(dispatchLogoClickActionMock).toHaveBeenCalledWith({
                viewUrl: "casino/gm-1",
                viewUrn: "ppb:tbd:view:gaming:1",
              });
            });
          });
        });
      });
    });

    describe("when onBalanceButtonPress is called", () => {
      beforeEach(() => {
        renderHeader({
          ...DEFAULT_PROPS,
        });

        const { onBalanceButtonPress } = HeaderComponent.mock.calls[0][0];
        onBalanceButtonPress();
      });

      it("should call the dispatchMyAccountIconClickAction", () => {
        expect(navigateMyAccount).toHaveBeenCalled();
      });
    });

    describe("when onGenerosityWalletButtonPress is called", () => {
      describe("and FREE_BETS_WALLET throttle is active", () => {
        beforeEach(() => {
          renderHeader({
            ...DEFAULT_PROPS,
            isFreeBetsWalletActive: true,
          });

          const { onGenerosityWalletButtonPress } = HeaderComponent.mock.calls[0][0];
          onGenerosityWalletButtonPress();
        });

        it("should call the dispatchGenerosityWalletClickAction", () => {
          expect(dispatchGenerosityWalletClickActionMock).toHaveBeenCalled();
        });

        it("should call the dispatchFetchGenerosityWalletCardGroupAction", () => {
          expect(dispatchFetchGenerosityWalletCardGroupActionMock).toHaveBeenCalled();
        });
      });
      describe("and FREE_BETS_WALLET throttle is not active", () => {
        beforeEach(() => {
          renderHeader({
            ...DEFAULT_PROPS,
            isFreeBetsWalletActive: false,
          });

          const { onGenerosityWalletButtonPress } = HeaderComponent.mock.calls[0][0];
          onGenerosityWalletButtonPress();
        });

        it("should call the navigateMyAccount function", () => {
          expect(navigateMyAccount).toHaveBeenCalled();
        });
      });
    });

    describe("when login button is triggered", () => {
      beforeEach(() => {
        renderHeader({
          ...DEFAULT_PROPS,
        });

        const { onLoginButtonTap } = HeaderComponent.mock.calls[0][0];
        onLoginButtonTap();
      });

      it("should call CET login", () => {
        expect(useLogin()).toHaveBeenCalledTimes(1);
      });
    });

    describe("when join now button is triggered", () => {
      beforeEach(() => {
        renderHeader({
          ...DEFAULT_PROPS,
        });

        const { onJoinNowButtonTap } = HeaderComponent.mock.calls[0][0];
        onJoinNowButtonTap();
      });

      it("should call CET join now", () => {
        expect(useJoinNow()).toHaveBeenCalledTimes(1);
      });
    });

    describe("when app is launched", () => {
      beforeEach(() => {
        renderHeader({
          ...DEFAULT_PROPS,
        });
      });

      it("useAppLaunch is defined", () => {
        expect(useAppLaunch).toBeDefined();
      });

      it("useAppLaunch is called", () => {
        expect(useAppLaunch).toHaveBeenCalled();
      });
    });

    describe("when user location is called", () => {
      beforeEach(() => {
        renderHeader({
          ...DEFAULT_PROPS,
        });
      });
      it("useUserLocation is defined", () => {
        expect(useUserLocation).toBeDefined();
      });
      it("useUserLocation is called", () => {
        expect(useUserLocation).toHaveBeenCalled();
      });
    });

    describe("when useSessionTransfer is called", () => {
      beforeEach(() => {
        renderHeader({
          ...DEFAULT_PROPS,
        });
      });
      it("useSessionTransfer is defined", () => {
        expect(useSessionTransfer).toBeDefined();
      });
      it("useSessionTransfer is called", () => {
        expect(useSessionTransfer).toHaveBeenCalled();
      });
    });

    describe("pending biometric activation checks", () => {
      beforeEach(() => {
        renderHeader({
          ...DEFAULT_PROPS,
        });
      });
      it("usePendingBiometricActivation is defined", () => {
        expect(usePendingBiometricActivation).toBeDefined();
      });
      it("usePendingBiometricActivation is called", () => {
        expect(usePendingBiometricActivation).toHaveBeenCalled();
      });
    });

    describe("on layout changes", () => {
      const onLayoutCallback = jest.fn();
      const eventMock = { nativeEvent: { layout: { width: 101, height: 202 } } };

      beforeEach(() => {
        useHeaderSizeEmitter.mockReturnValue(onLayoutCallback);
        const { getByTestId } = renderHeader();
        const header = getByTestId(HEADER_CONTAINER);

        fireEvent(header, "layout", eventMock);
      });

      it("should call hook callback", () => {
        expect(onLayoutCallback).toHaveBeenCalledWith(eventMock);
      });
    });

    describe("when refreshBalance changes", () => {
      it("should call dispatchFetchUserMainWallet", async () => {
        const { rerender } = renderHeader({ ...DEFAULT_PROPS, isLoggedIn: true });

        expect(dispatchFetchUserMainWalletMock).toHaveBeenCalledTimes(1);

        React.useContext.mockReturnValueOnce({
          refreshBalance: true,
        });

        await act(() => {
          rerender(<Header {...DEFAULT_PROPS} dispatchFetchUserMainWallet={dispatchFetchUserMainWalletMock} />);
        });

        expect(dispatchFetchUserMainWalletMock).toHaveBeenCalledTimes(2);
      });
    });

    describe("when onMenuPress is called", () => {
      beforeEach(() => {
        renderHeader({
          ...DEFAULT_PROPS,
        });

        const { onMenuPress } = HeaderComponent.mock.calls[0][0];
        onMenuPress();
      });

      it("should call the dispatchHamburgerMenuOpenAction", () => {
        expect(dispatchHamburgerMenuOpenActionMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the hamburger menu is enabled", () => {
      describe("and is open", () => {
        beforeEach(() => {
          renderHeader({
            ...DEFAULT_PROPS,
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
            },
            undefined,
          );
          expect(ConnectedLeftSidebar).toHaveBeenCalledTimes(1);
        });
      });

      describe("and is closed", () => {
        beforeEach(() => {
          renderHeader({
            ...DEFAULT_PROPS,
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
  });
});
