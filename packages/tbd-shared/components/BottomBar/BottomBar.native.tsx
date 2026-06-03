import { memo, FunctionComponent, useCallback, useEffect, useRef, useState, useMemo, useContext } from "react";
import { Platform } from "react-native";

import { CetContext } from "@flutter-global/react-native-cet-framework";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { BottomBar as BottomBarComponent } from "@ppb/the-wall-native";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { GamesLobbyObject, navigate, navigationRef, ScreenName } from "@ppb/tbd-router/native/router";
import { initDeepLinking, removeDeepLinkingEventListeners } from "@ppb/tbd-router/native/deep-linking";

import { BottomBarItem } from "@ppb/the-wall-common/types";
import { BottomBarNativeItem as BottomBarItemNative } from "@ppb/the-wall-common/types/native";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { ComponentProps } from "./props";

import { getCookie, setCookie } from "../../helpers/cookies.native";
import { CookieNames } from "../../config/cookies";
import { getEndpoint, getHomepagePaths, getHost } from "../../config/endpoints";
import { sendEvent } from "../../gtm/tagging-collector.native";

import GamingNavigator from "../Navigation/navigators/GamingNavigator.native";
import HomeNavigator from "../Navigation/navigators/HomeNavigator.native";
import MyBetsNavigator from "../Navigation/navigators/MyBetsNavigator.native";
import BrowseNavigator from "../Navigation/navigators/BrowseNavigator.native";
import BrowseSwitchNavigator from "../Navigation/navigators/BrowseSwitchNavigator.native";
import appConfiguration from "../../config/app-configuration.native";
import { getSafariSsoUrl } from "../../config/base-path-utils.native";
import { i18n } from "../../helpers/i18n";

export const BottomBarCreateItemsForNative = (
  items: BottomBarItem[],
  hasProductSwitcher: boolean,
): BottomBarItemNative[] =>
  items.map<BottomBarItemNative>((item, index) => {
    item = {
      ...item,
      accessibilityHint: i18n({
        key: "I18N.ACCESSIBILITY.X_OF_N",
        interpolationValues: {
          x: (index + 1).toString(),
          n: (hasProductSwitcher ? items.length + 1 : items.length).toString(),
        },
      }),
    };
    const { viewUrn } = item.viewLink;
    const isExternalNavigation = viewUrn.includes(EntityType.ExternalView);

    if (viewUrn.includes(EntityType.MyBetsView)) {
      return { screen: MyBetsNavigator, isExternalNavigation, ...item };
    }

    if (viewUrn.includes(EntityType.GamingView)) {
      return { screen: GamingNavigator, isExternalNavigation, ...item };
    }

    if (viewUrn.includes(EntityType.BrowseView)) {
      return {
        screen: item?.throttles?.isBrowsePagePrismic ? BrowseSwitchNavigator : BrowseNavigator,
        isExternalNavigation,
        ...item,
      };
    }

    return { screen: HomeNavigator, isExternalNavigation, ...item };
  });

const BottomBar: FunctionComponent<ComponentProps> = ({
  items,
  selectedIndex,
  isReceiptOpen,
  productSwitcherConfig,
  environmentProduct,
  jurisdiction,
  dispatchBottomBarPushAction,
  dispatchNativeSwitchProductPreferenceAction,
  dispatchCampaignMeasurementAction,
  dispatchLaunchGameFromPN,
  dispatchOpenPredicts,
  stateIndicatorView,
}) => {
  const hasBottomBarItems = useRef(false);

  const {
    isXSell,
    productPreference,
    title: switcherTitle,
    isProductSwitcherAvailable,
    isLoggedIn,
    isExcAllowedJurisdictionThrottleActive,
    showOnboardingNewLabel,
    onboardingLabelTitle,
    shouldShowXSellToPredicts,
  } = productSwitcherConfig || {};
  const hasProductSwitcher = isProductSwitcherAvailable?.native || false;

  const itemsSize = items?.length || 0;

  const { authorizationToken } = useContext(CetContext);
  const [isXSellAvailable, setIsXSellAvailable] = useState(isXSell);

  const onTilePress = useCallback(
    (viewLink: ViewLink) => {
      if (viewLink.viewUrn.includes(EntityType.ExternalView)) {
        // Temporary Fix until Brazil jurisdiction will be done on the iOS side.
        if (environmentProduct && authorizationToken && jurisdiction === Jurisdiction.BRAZIL && Platform.OS === "ios") {
          navigate({
            ...viewLink,
            viewUrl: getSafariSsoUrl(viewLink.viewUrl, authorizationToken, environmentProduct, "games-native"),
          });
          return;
        }
        navigate(viewLink);
        return;
      }
      const isGamingView = viewLink.viewUrn.includes(EntityType.GamingView);
      GamesLobbyObject?.gamesLobbyTabActive(isGamingView);

      dispatchBottomBarPushAction(viewLink);
    },
    [dispatchBottomBarPushAction, authorizationToken, environmentProduct, jurisdiction],
  );

  const checkForGamesTriggeringPopup = useCallback((): boolean => {
    if (navigationRef.current?.getCurrentRoute()?.name === ScreenName.GamingMySelectionsScreen) {
      GamesLobbyObject?.triggerConfirmationPopUp(true);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const setCookieAsync = async () => {
      if (isLoggedIn && isExcAllowedJurisdictionThrottleActive) {
        await setCookie(CookieNames.PHOENIX_ENABLED, `${!isXSell}`);
      }
    };
    setCookieAsync();
  }, [isLoggedIn, isExcAllowedJurisdictionThrottleActive, isXSell]);

  useEffect(() => {
    let isCancelled = false;
    const getCookieAsync = async () => {
      if (!isLoggedIn && isExcAllowedJurisdictionThrottleActive) {
        const phoenixEnabledCookie = await getCookie(CookieNames.PHOENIX_ENABLED);

        if (!isCancelled && phoenixEnabledCookie) {
          setIsXSellAvailable(phoenixEnabledCookie !== "true");
          return;
        }
      }
      if (!isCancelled) {
        setIsXSellAvailable(isXSell);
      }
    };

    getCookieAsync();
    return () => {
      isCancelled = true;
    };
  }, [isLoggedIn, isExcAllowedJurisdictionThrottleActive, isXSell]);

  const onProductSwitch = useCallback(async () => {
    if (shouldShowXSellToPredicts) {
      dispatchOpenPredicts();
      navigationRef.current?.navigate(ScreenName.PredictsScreen, {});
      return;
    }

    if (isXSellAvailable && productPreference === ProductsOption.sportsbook) {
      navigate({
        viewUrn: EntityType.ExternalView,
        viewUrl: "bfsportsbetting://",
        fallbackViewUrl: getEndpoint("EXCHANGE_SITE"),
      });

      return;
    }
    if (productPreference) {
      dispatchNativeSwitchProductPreferenceAction(productPreference);
    }
  }, [
    isXSellAvailable,
    productPreference,
    dispatchNativeSwitchProductPreferenceAction,
    dispatchOpenPredicts,
    shouldShowXSellToPredicts,
  ]);

  // const used to keep track of the previous state of isReceiptOpen on the cashout receipt
  // we need to stop animations on the bottomBar for all receipt transactions for them to behave as betslip receipts
  const previousIsReceiptOpen = useRef(isReceiptOpen);

  const [skipAnimation, setSkipAnimation] = useState(false);
  const isVisible = !isReceiptOpen;
  const index = selectedIndex === -1 ? 0 : selectedIndex;

  useEffect(() => {
    // we want the bottomBar to skip the animation when:
    // - the cashout receipt exchanges between visible and closed and vice-versa
    const skipAnimations =
      (!previousIsReceiptOpen.current && isReceiptOpen) || (previousIsReceiptOpen.current && !isReceiptOpen);

    setSkipAnimation(skipAnimations);

    return () => {
      previousIsReceiptOpen.current = isReceiptOpen;
    };
  }, [isReceiptOpen]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    if (!hasBottomBarItems.current && items?.length) {
      // This code needs to run one time when
      // we have items on the bottom bar
      hasBottomBarItems.current = true;

      // Initialize the deep linking service
      const host = getHost();
      const homepagePaths = getHomepagePaths();
      const handleInitDeepLinking = () => {
        initDeepLinking(
          appConfiguration.appBrand as Brand,
          appConfiguration.deeplinkConfiguration,
          host,
          homepagePaths,
          sendEvent,
          dispatchLaunchGameFromPN,
        );
      };
      if (Platform.OS === "android") {
        // This is a workaround to fix an android issue where the BottomBar becomes washed-out
        // by delaying the init we also delay the navigation that is causing the issue when the BottomBar UI
        // did not finished pressenting
        timeoutId = setTimeout(handleInitDeepLinking, 1000);
      } else {
        handleInitDeepLinking();
      }

      // Dispatch campaign measurement event
      dispatchCampaignMeasurementAction();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [items?.length, dispatchCampaignMeasurementAction, dispatchLaunchGameFromPN]);

  useEffect(
    () => () => {
      removeDeepLinkingEventListeners();
    },
    [],
  );

  const renderItems = useMemo(
    () => BottomBarCreateItemsForNative(items, hasProductSwitcher),
    [items, hasProductSwitcher],
  );

  if (items?.length === 0) {
    return stateIndicatorView || <></>;
  }

  const hasOnboardingLabel =
    !!showOnboardingNewLabel || (!isLoggedIn && !isXSellAvailable && productPreference === ProductsOption.sportsbook);

  const productSwitcherAccessibilityHint = i18n({
    key: "I18N.ACCESSIBILITY.X_OF_N",
    interpolationValues: {
      x: (itemsSize + 1).toString(),
      n: (itemsSize + 1).toString(),
    },
  });

  return (
    <>
      <BottomBarComponent
        isVisible={isVisible}
        skipAnimation={skipAnimation}
        items={renderItems}
        onTilePress={onTilePress}
        checkForGamesTriggeringPopup={checkForGamesTriggeringPopup}
        selectedIndex={index}
        hasProductSwitcher={hasProductSwitcher}
        productSwitcherTitle={switcherTitle}
        onProductSwitch={onProductSwitch}
        hasOnboardingLabel={hasOnboardingLabel}
        onboardingLabelTitle={onboardingLabelTitle}
        productSwitcherAccessibilityHint={productSwitcherAccessibilityHint}
      />
    </>
  );
};

export default memo(BottomBar);
