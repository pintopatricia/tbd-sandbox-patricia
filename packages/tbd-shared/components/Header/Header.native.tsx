import { FunctionComponent, useCallback, useEffect, useContext, useMemo, useState } from "react";

import { NativeEventEmitter, NativeModules, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ShadowedView } from "react-native-fast-shadow";
import {
  useLogin,
  useJoinNow,
  useAppLaunch,
  CetContext,
  useUserLocation,
  useSessionTransfer,
  usePendingBiometricActivation,
} from "@flutter-global/react-native-cet-framework";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { FilterDrawer, Overlay } from "@ppb/the-wall-native";
import {
  navigateMyAccount,
  goBack,
  navigate,
  navigateWithThirdPartyScreenName,
  ScreenName,
  navigationRef,
  GamesLobbyObject,
} from "@ppb/tbd-router/native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { Brand } from "@ppb/tbd-store/config/Brand";
import { codecs } from "@ppb/tbd-urn-codecs";
import XSellBar from "@ppb/tbd-components-navigation/components/XSellBar/view/XSellBar.native";
import { i18n } from "../../helpers/i18n";

import useDebounce from "../../hooks/useDebounce";
import { LogoProduct } from "../BetSharingCardGroup/snowflakes/Logo/Logo.types";
import ConnectedRegulatoryHeader from "../RegulatoryHeader";
import RegulatoryHeader from "../RegulatoryHeader/RegulatoryHeader.native";

import { ComponentProps } from "./props";
import { useHeaderSizeEmitter } from "./hooks/useHeaderSize.native";
import { Header as HeaderComponent } from "./snowflakes/Header/Header.native";
import { HEADER_CONTAINER } from "./Header.native.selectors";
import LeftSidebar from "../LeftSidebar/LeftSidebar.native";
import ConnectedLeftSidebar from "../LeftSidebar";
import styles from "./Header.native.styles";
import appConfiguration from "../../config/app-configuration.native";
import { useAppStartupTimeReporter } from "../../hooks/useAppStartupTimeReporter.native";
import { useBottomBarState } from "../../hooks/useBottomBarState.native";
import { onCetInitialised } from "../../helpers/cet-init-state.native";

const Header: FunctionComponent<ComponentProps> = ({
  urn,
  userPreferences,
  isLoggedIn,
  isMaintenance,
  isExchange,
  isGaming,
  logoViewLink,
  showBalances,
  accountBalance,
  labels,
  isFreeBetsWalletActive,
  isHamburguerMenuEnabled,
  isHamburgerMenuOpen,
  isSBGJoinNowEnabled,
  hasOverlay,
  isNotificationsCenterEnabled,
  hasUnreadNotifications,
  dispatchFetchUserMainWallet,
  dispatchLogoClickAction,
  dispatchFetchGenerosityWalletCardGroupAction,
  dispatchGenerosityWalletClickAction,
  dispatchHamburgerMenuOpenAction,
  dispatchHamburgerMenuCloseAction,
  dispatchPushAction,
  dispatchHeaderOverlayClickAction,
}) => {
  const { isRootFocused } = useBottomBarState();
  const isLoading = !urn;
  useAppStartupTimeReporter(isLoading);

  const login = useLogin();
  const joinNow = useJoinNow();
  const { setUserPreferences, refreshBalance } = useContext(CetContext);
  const [disableGamesDetailsScreen, setDisableGamesDetailsScreen] = useState<boolean>(false);
  const [isCetInit, setIsCetInit] = useState<boolean>(false);

  // NOTE: this hook is used to call login automatically when biometric is turned on and user is logged out
  useAppLaunch(isCetInit);
  // NOTE: this hook will get location permisions for BF brasil, for SBG we need to add permissions in plist, podfile & manifest
  useUserLocation(isCetInit);
  // NOTE: Handles pending biometric setup (e.g., incomplete activation) when CET is ready & user is authenticated
  usePendingBiometricActivation(isCetInit);

  // NOTE: this hook is used to autologin user from another app
  const { createWebSessionTransferUrl } = useSessionTransfer(isCetInit);

  // NOTE: this useEffect will set isCetInit to true after cet was initialised with correct values
  useEffect(() => {
    const unsubscribe = onCetInitialised(() => {
      setIsCetInit(true);
    });
    return unsubscribe;
  }, []);

  useEffect(
    () => {
      // typeof refreshBalance is on the condition in order to linting tool forces it to be on the deps array
      if ((isLoggedIn && !isMaintenance) || typeof refreshBalance !== "undefined") {
        dispatchFetchUserMainWallet();
      }
    },
    // CetContext has a refreshBalance boolean which change from true-false-true when a deposit/withdraw/transaction is made
    [isLoggedIn, isMaintenance, dispatchFetchUserMainWallet, refreshBalance],
  );

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.GamesLobbyEventEmitter);

    const onOpenGameDetailsScreenSubscription = eventEmitter.addListener("onOpenGameDetailsScreen", () => {
      setDisableGamesDetailsScreen(true);
    });
    const onDismissGameDetailsScreenSubscription = eventEmitter.addListener("onDismissGameDetailsScreen", () => {
      setDisableGamesDetailsScreen(false);
    });

    return function cleanup() {
      onOpenGameDetailsScreenSubscription.remove();
      onDismissGameDetailsScreenSubscription.remove();
    };
  }, []);

  const onLogoPress = useCallback((): void => {
    const updatedLogoViewLink = isGaming
      ? {
          ...logoViewLink,
          viewUrl: "casino/gm-1",
          viewUrn: codecs.gamingView.encode("1").uid,
        }
      : logoViewLink;

    if (Platform.OS === "ios" && isGaming) {
      const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
      if (currentRoute === ScreenName.GamingMySelectionsScreen) {
        GamesLobbyObject?.triggerConfirmationPopUp(true);
        return;
      }
      if (disableGamesDetailsScreen) {
        GamesLobbyObject?.closeGameInfoScreen(true);
        return;
      }
      navigateWithThirdPartyScreenName(ScreenName.GamingLobbyScreen);
    } else {
      navigate(updatedLogoViewLink);
    }
    dispatchPushAction(updatedLogoViewLink);
    dispatchLogoClickAction(updatedLogoViewLink);
  }, [isGaming, logoViewLink, dispatchPushAction, dispatchLogoClickAction, disableGamesDetailsScreen]);

  const onBalanceButtonPress = useCallback((): void => {
    setUserPreferences(userPreferences);
    navigateMyAccount();
  }, [setUserPreferences, userPreferences]);

  const onGenerosityWalletButtonPress = useCallback((): void => {
    dispatchFetchGenerosityWalletCardGroupAction();
    dispatchGenerosityWalletClickAction();
  }, [dispatchGenerosityWalletClickAction, dispatchFetchGenerosityWalletCardGroupAction]);

  /* On iOS, when navigating via deeplink, this prevents the issue of
  having a screen height smaller than the available height */
  const debouncedIsLoggedIn = useDebounce<boolean>(isLoggedIn, 300);

  const onLayout = useHeaderSizeEmitter();

  const insets = useSafeAreaInsets();
  const menuStyles = useMemo(() => {
    const safeAreaInsetTop = Platform.OS === "ios" ? insets.top : 0;

    return {
      ...styles.hamburgerMenu,
      marginTop: tokens.HeaderContainerSizing + safeAreaInsetTop,
    };
  }, [insets.top]);

  const menuDrawer = useMemo(
    () =>
      isHamburgerMenuOpen ? (
        <FilterDrawer
          title={i18n({ key: "I18N.SEARCH.TITLE" })}
          onOutsideTap={dispatchHamburgerMenuCloseAction}
          slideFrom="left"
          onCloseTap={dispatchHamburgerMenuCloseAction}
          displayApplyButton={false}
          customStyle={menuStyles}
          snapToHeader
        >
          <ConnectedLeftSidebar component={LeftSidebar} />
        </FilterDrawer>
      ) : null,
    [isHamburgerMenuOpen, menuStyles, dispatchHamburgerMenuCloseAction],
  );

  const gamingProduct = isGaming ? LogoProduct.GAMING : LogoProduct.NONE;
  const logoProduct = isExchange ? LogoProduct.BETFAIR_EXCHANGE : gamingProduct;

  /**
   * Hides the Join Now button
   * @todo Remove when new register initiative is completed
   * @see CHCKMT-245 for more details
   */
  const hasJoinNowButton = appConfiguration.appBrand === Brand.Skybet ? isSBGJoinNowEnabled : true;

  const shadowStyle = hasOverlay ? undefined : styles.shadow;

  return (
    <ShadowedView style={shadowStyle}>
      <View {...getTestProps(HEADER_CONTAINER, false)} onLayout={onLayout}>
        <XSellBar visible createUrlTransfer={createWebSessionTransferUrl} />
        <ConnectedRegulatoryHeader component={RegulatoryHeader} />
        <HeaderComponent
          isLoading={isLoading}
          isLoggedIn={debouncedIsLoggedIn}
          isMaintenance={isMaintenance}
          logoProduct={logoProduct}
          showBalances={showBalances}
          accountBalance={accountBalance}
          labels={labels}
          onBackPress={!(isRootFocused || disableGamesDetailsScreen) ? goBack : undefined}
          onLogoPress={onLogoPress}
          onBalanceButtonPress={onBalanceButtonPress}
          onGenerosityWalletButtonPress={isFreeBetsWalletActive ? onGenerosityWalletButtonPress : onBalanceButtonPress}
          onLoginButtonTap={login}
          onJoinNowButtonTap={joinNow}
          showMenu={isHamburguerMenuEnabled}
          onMenuPress={dispatchHamburgerMenuOpenAction}
          hasJoinNowButton={hasJoinNowButton}
          isNotificationsCenterEnabled={isNotificationsCenterEnabled}
          hasUnreadNotifications={hasUnreadNotifications}
        />
        {menuDrawer}
        {hasOverlay && <Overlay onOutsideTap={dispatchHeaderOverlayClickAction} />}
      </View>
    </ShadowedView>
  );
};

export default Header;
