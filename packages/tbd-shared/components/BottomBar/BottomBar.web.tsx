// Please check the following documentation to fully understand the logic and the planning for this particular file
// available on https://confluence.app.betfair/display/BSBG/BFRB+Feature+Analysis+-+Navigation+Bar
import { memo, FunctionComponent, useCallback, useEffect, MouseEvent, useMemo } from "react";

import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { BottomBar as BottomBarComponent } from "@ppb/the-wall-web";
import { type BottomBarItem, ExperimentalBottomBarTileTypes } from "@ppb/the-wall-common/types";

import { ComponentProps } from "./props";
import styles from "./BottomBar.web.css";
import { CookieNames } from "../../config/cookies";
import { getCookie, setCookie } from "../../helpers/cookies.web";
import usePrevious from "../../hooks/usePrevious";
import { ProductUrlSuffix } from "@ppb/tbd-store";

const GAME_LAUNCH_BOTTOM_BAR_TILE_TYPES: BottomBarItem["tileType"][] = [
  ExperimentalBottomBarTileTypes.BLACKJACK,
  ExperimentalBottomBarTileTypes.ROULETTE,
  ExperimentalBottomBarTileTypes.LIVE_ROULETTE,
  ExperimentalBottomBarTileTypes.LIVE_BLACKJACK,
];

const BottomBar: FunctionComponent<ComponentProps> = ({
  items = [],
  selectedIndex,
  isBetslipCollapsed,
  isBetslipOpen,
  isReceiptOpen,
  productSwitcherConfig,
  gtmTranslations = [],
  dispatchBottomBarNavigation,
  dispatchBottomBarGameLaunch,
  dispatchGenericPushAction,
  dispatchWebSwitchProductPreferenceAction,
  dispatchGoToExchangeXSellAction,
  dispatchOpenPredicts,
}) => {
  // Keep track of the previous state of isCollapsed on the betslip
  // to stop animations on the bottomBar on the following betslip movements:
  // - Collapsed to expanded = no bottomBar animation
  // - Expanded to collapsed = no bottomBar animation
  // - Otherwise, we keep animations as normal
  const previousIsBetslipCollapsed = usePrevious(isBetslipCollapsed);
  // Keep track of the previous state of isReceiptOpen on the cashout receipt
  // to stop animations on the bottomBar for all receipt transactions for them to behave as betslip receipts
  const previousIsReceiptOpen = usePrevious(isReceiptOpen);

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
  const hasProductSwitcher = isProductSwitcherAvailable?.default || false;

  const isVisible = !isBetslipOpen && !isReceiptOpen;

  // we want the bottomBar to skip the animation when:
  // - the betslip exchanges between expanded to collapsed and vice-versa
  // - the cashout receipt exchanges between visible and closed and vice-versa
  const skipAnimation =
    (!previousIsBetslipCollapsed && isBetslipCollapsed) ||
    (!previousIsReceiptOpen && isReceiptOpen) ||
    (previousIsBetslipCollapsed && isBetslipOpen) ||
    (previousIsReceiptOpen && !isReceiptOpen);

  const onTileClick = useCallback(
    (event: MouseEvent, tileType: BottomBarItem["tileType"], idx: number, viewLink: BottomBarItem["viewLink"]) => {
      event.preventDefault();
      if (GAME_LAUNCH_BOTTOM_BAR_TILE_TYPES.includes(tileType)) {
        dispatchBottomBarGameLaunch(viewLink, gtmTranslations[idx]);
      } else {
        dispatchBottomBarNavigation(viewLink, gtmTranslations[idx]);
      }
      dispatchGenericPushAction(viewLink);
    },
    [dispatchBottomBarGameLaunch, dispatchBottomBarNavigation, dispatchGenericPushAction, gtmTranslations],
  );

  const isXSellAvailable = useMemo(() => {
    if (!isLoggedIn && isExcAllowedJurisdictionThrottleActive) {
      const phoenixEnabledCookie = getCookie(CookieNames.PHOENIX_ENABLED);
      return phoenixEnabledCookie ? phoenixEnabledCookie !== "true" : isXSell;
    }
    return isXSell;
  }, [isLoggedIn, isExcAllowedJurisdictionThrottleActive, isXSell]);

  useEffect(() => {
    if (isLoggedIn && isExcAllowedJurisdictionThrottleActive) {
      setCookie(CookieNames.PHOENIX_ENABLED, isXSell ? "false" : "true", "/");
    }
  }, [isLoggedIn, isExcAllowedJurisdictionThrottleActive, isXSell]);

  const onProductSwitch = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (shouldShowXSellToPredicts) {
        dispatchOpenPredicts();
        return;
      }

      if (isXSellAvailable && productPreference === ProductsOption.sportsbook) {
        dispatchGoToExchangeXSellAction();
        return;
      }

      if (productPreference) {
        const targetUrl =
          productPreference === ProductsOption.sportsbook ? ProductUrlSuffix.Exchange : ProductUrlSuffix.Sportsbook;
        const targetProductPreference =
          productPreference === ProductsOption.sportsbook ? ProductsOption.exchange : ProductsOption.sportsbook;
        dispatchWebSwitchProductPreferenceAction(targetUrl, targetProductPreference);
      }
    },
    [
      dispatchGoToExchangeXSellAction,
      dispatchWebSwitchProductPreferenceAction,
      dispatchOpenPredicts,
      isXSellAvailable,
      productPreference,
      shouldShowXSellToPredicts,
    ],
  );

  if (items.length === 0) {
    return null;
  }

  const hasOnboardingLabel =
    !!showOnboardingNewLabel || (!isLoggedIn && !isXSellAvailable && productPreference === ProductsOption.sportsbook);

  return (
    <div className={styles.bottomBarContainer} data-testid="bottom-bar-container">
      <BottomBarComponent
        isVisible={isVisible}
        skipAnimation={skipAnimation}
        items={items}
        onTileClick={onTileClick}
        selectedIndex={selectedIndex}
        hasProductSwitcher={hasProductSwitcher}
        productSwitcherTitle={switcherTitle}
        onProductSwitch={onProductSwitch}
        hasOnboardingLabel={hasOnboardingLabel}
        onboardingLabelTitle={onboardingLabelTitle}
      />
    </div>
  );
};

export default memo(BottomBar);
