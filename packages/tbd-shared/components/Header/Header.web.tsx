import { FunctionComponent, MouseEvent, useCallback, useEffect, useState, useMemo } from "react";
import classnames from "classnames";

import history from "@ppb/tbd-router/web/history";
import { codecs } from "@ppb/tbd-urn-codecs";
import { FilterDrawer } from "@ppb/the-wall-web";
import {
  HEADER_CONTAINER_ID,
  HEADER_SPACE_ID,
} from "@ppb/the-wall-web/components/bricks/StickyHeader/StickyHeader.types";
import useResizeObserver from "@ppb/the-wall-web/hooks/useResizeObserver";

import { i18n } from "../../helpers/i18n";
import { base64EncodeUrl } from "../../helpers/navigation";
import { LogoProduct } from "../BetSharingCardGroup/snowflakes/Logo/Logo.types";
import ConnectedRegulatoryHeader from "../RegulatoryHeader";
import RegulatoryHeader from "../RegulatoryHeader/RegulatoryHeader.web";
import ConnectedLeftSidebar from "../LeftSidebar";
import LeftSidebar from "../LeftSidebar/LeftSidebar.web";
import ConnectedSmartAppBanner from "../SmartAppBanner";
import SmartAppBanner from "../SmartAppBanner/SmartAppBanner.web";
import { useScrollForSearchBar } from "../../hooks/useScrollForSearchBar.web";
import { useMutationObserver } from "../../hooks/useMutationObserver";

import { Header as HeaderComponent } from "./snowflakes/Header/Header.web";
import { ComponentProps } from "./props";
import styles from "./Header.web.css";
import { Notifications } from "./snowflakes/Notifications/Notifications.web";

const onBlockBackToMyAccount = (event: any) => {
  const blackListedViewUrns = ["ppb:tbd:view:myAccountView", "ppb:tbd:view:settings"];
  const isBlackListed = !!blackListedViewUrns.find((blackListedViewUrn) =>
    event.state.state.viewUrn.startsWith(blackListedViewUrn),
  );

  /**
   * It will iterate over the history and if it finds a blacklisted view urn
   * it will skip it by performing an additional history.goBack().
   */
  if (isBlackListed) {
    history.goBack();
    /**
     * When closing my account, it will perform an additional history.goBack() to navigate to
     * the correct history pointer.
     */
    history.goBack();
  } else {
    /**
     * Once it finds no blacklisted view urn, it will end the loop.
     */
    window.removeEventListener("popstate", onBlockBackToMyAccount);
  }
};

const onBackClick = (event: MouseEvent): void => {
  event.preventDefault();

  window.addEventListener("popstate", onBlockBackToMyAccount);
  history.goBack();
};

const Header: FunctionComponent<ComponentProps> = ({
  urn,
  url,
  authData,
  isMyAccount,
  isLoggedIn,
  isMaintenance,
  canGoBack,
  isExchange,
  isGaming,
  logoViewLink,
  showBalances,
  accountBalance,
  labels,
  isFreeBetsWalletActive,
  pinGamingSearch,
  scrollForSearchBar,
  pinGamingRibbonNav,
  dispatchFetchUserMainWallet,
  dispatchPushAction,
  dispatchLogoClickAction,
  dispatchMyAccountIconClickAction,
  dispatchMyAccountClickAction,
  dispatchGenerosityWalletClickAction,
  dispatchFetchGenerosityWalletCardGroupAction,
  dispatchExternalPushAction,
  removeStickyElement,
  dispatchHamburgerMenuOpenAction,
  dispatchHamburgerMenuCloseAction,
  isHamburguerMenuEnabled,
  isHamburgerMenuOpen,
  hideHeader,
  shouldAccountForXSellBar,
  onPortalContainerResize = () => {},
  isNotificationsCenterEnabled,
  hasUnreadNotifications,
  dispatchFetchNotificationsAction,
}) => {
  const [extraHeaderHeight, setExtraHeaderHeight] = useState(0);
  const [hasShadow, setHasShadow] = useState(false);
  const isSearchBarVisible = useScrollForSearchBar(!!scrollForSearchBar);
  const [searchBarHasContent, setSearchBarHasContent] = useState(false);
  const [ribbonNavHasContent, setRibbonNavHasContent] = useState(false);
  const [showNotificationFrame, setShowNotificationFrame] = useState(false);
  const onSearchBarResize = useCallback<MutationCallback>((mutationsList) => {
    if (mutationsList.length > 0) {
      setSearchBarHasContent(mutationsList[0].target.hasChildNodes());
    }
  }, []);

  const onRibbonNavResize = useCallback<MutationCallback>((mutationsList) => {
    if (mutationsList.length > 0) {
      setRibbonNavHasContent(mutationsList[0].target.hasChildNodes());
    }
  }, []);

  const onExtraHeaderResize = useCallback((target: HTMLDivElement) => {
    setExtraHeaderHeight(target.offsetHeight);
  }, []);

  const onPortalsContainerResizeEvent = useCallback(
    (target: HTMLDivElement) => {
      onPortalContainerResize(target?.offsetHeight);
    },
    [onPortalContainerResize],
  );

  const searchBarRef = useMutationObserver<HTMLDivElement>(onSearchBarResize);
  const ribbonNavRef = useMutationObserver<HTMLDivElement>(onRibbonNavResize);
  const extraHeaderRef = useResizeObserver(onExtraHeaderResize);
  const portalsContainerRef = useResizeObserver(onPortalsContainerResizeEvent);

  useEffect(() => {
    if (isLoggedIn && !isMaintenance) {
      dispatchFetchUserMainWallet();
    }

    const handleScroll = () => {
      setHasShadow(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoggedIn, isMaintenance, dispatchFetchUserMainWallet]);

  const onLogoClick = useCallback(
    (event: MouseEvent): void => {
      event.preventDefault();

      let updatedLogoViewLink = logoViewLink;

      if (isGaming) {
        updatedLogoViewLink = {
          ...logoViewLink,
          viewUrl: "casino/gm-1",
          viewUrn: codecs.gamingView.encode("1").uid,
        };
      }

      dispatchPushAction(updatedLogoViewLink);
      dispatchLogoClickAction(updatedLogoViewLink);
    },
    [dispatchPushAction, dispatchLogoClickAction, logoViewLink, isGaming],
  );

  const onLoginButtonClick = useCallback((): void => {
    const ssoWithRedirectUrl = `${authData?.SSO_URL}&url=${encodeURIComponent(window.location.href)}`;

    dispatchExternalPushAction("login", "header", ssoWithRedirectUrl);
  }, [dispatchExternalPushAction, authData]);

  const onJoinNowButtonClick = useCallback((): void => {
    const joinWithRedirectUrl = authData?.JOIN_DATA.joinNowLink || "";
    dispatchExternalPushAction("join now", "header", joinWithRedirectUrl);
  }, [dispatchExternalPushAction, authData]);

  const onMyAccountClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const closeUrl = base64EncodeUrl(`${urn}###${url}`);
      dispatchMyAccountIconClickAction(closeUrl);
      dispatchMyAccountClickAction(true);
    },
    [dispatchMyAccountIconClickAction, dispatchMyAccountClickAction, urn, url],
  );

  useEffect(() => {
    // Close the notifications center when the user
    // navigates through other means (e.g. browser back button)
    // TODO: This should be removed once the notifications center is migrated to its own route
    const unlisten = history.listen((location) => {
      const notificationsOpen = location.state?.notificationsOpen;
      setShowNotificationFrame(!!notificationsOpen);
    });

    return () => unlisten();
  }, [history]);

  const onNotificationCenterClose = useCallback(() => {
    history.goBack();
    dispatchFetchNotificationsAction();
    setShowNotificationFrame(false);
  }, [dispatchFetchNotificationsAction]);

  const onNotificationsClick = useCallback(() => {
    history.push({
      pathname: history.location.pathname,
      state: { ...history.location.state, notificationsOpen: true },
    });
    setShowNotificationFrame(true);
  }, []);

  const onGenerosityWalletButtonClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      dispatchFetchGenerosityWalletCardGroupAction();
      dispatchGenerosityWalletClickAction();
    },
    [dispatchGenerosityWalletClickAction, dispatchFetchGenerosityWalletCardGroupAction],
  );

  const openHamburgerMenu = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      dispatchHamburgerMenuOpenAction();
    },
    [dispatchHamburgerMenuOpenAction],
  );

  const closeHamburgerMenu = useCallback(() => {
    dispatchHamburgerMenuCloseAction();
  }, [dispatchHamburgerMenuCloseAction]);

  const menuDrawer = useMemo(
    () =>
      isHamburgerMenuOpen ? (
        <FilterDrawer
          title={i18n({ key: "I18N.SEARCH.TITLE" })}
          onOutsideTap={closeHamburgerMenu}
          slideFrom="left"
          onCloseTap={closeHamburgerMenu}
          displayApplyButton={false}
          snapToHeader
        >
          <ConnectedLeftSidebar component={LeftSidebar} isDesktop={false} />
        </FilterDrawer>
      ) : null,
    [isHamburgerMenuOpen, closeHamburgerMenu],
  );

  const headerClassNames = classnames(styles.headerContainer, {
    [styles.headerFadeOut]: isMyAccount,
    [styles.headerShadow]: hasShadow,
  });

  const gamingProduct = isGaming ? LogoProduct.GAMING : LogoProduct.NONE;
  const logoProduct = isExchange ? LogoProduct.BETFAIR_EXCHANGE : gamingProduct;
  const showPortalContainer = pinGamingSearch || scrollForSearchBar || pinGamingRibbonNav;
  const showSearchPortalContainer = pinGamingSearch || scrollForSearchBar;
  const showGamingRibbonNavPortalContainer = pinGamingRibbonNav;

  return (
    <div id={HEADER_CONTAINER_ID} className={headerClassNames}>
      <div ref={extraHeaderRef}>
        <ConnectedSmartAppBanner component={SmartAppBanner} />
        <ConnectedRegulatoryHeader component={RegulatoryHeader} />
      </div>

      {!hideHeader && (
        <HeaderComponent
          isLoggedIn={isLoggedIn}
          isMaintenance={isMaintenance}
          isNotificationsCenterEnabled={isNotificationsCenterEnabled}
          canGoBack={canGoBack}
          logoProduct={logoProduct}
          logoUrl={logoViewLink && logoViewLink.viewUrl}
          showBalances={showBalances}
          accountBalance={accountBalance}
          labels={labels}
          extraHeaderHeight={extraHeaderHeight}
          onBackClick={onBackClick}
          onLogoClick={onLogoClick}
          onBalanceButtonClick={onMyAccountClick}
          onGenerosityWalletButtonClick={isFreeBetsWalletActive ? onGenerosityWalletButtonClick : onMyAccountClick}
          onLoginButtonTap={onLoginButtonClick}
          onJoinNowButtonTap={onJoinNowButtonClick}
          showMenu={isHamburguerMenuEnabled}
          onMenuClick={openHamburgerMenu}
          onNotificationsClick={onNotificationsClick}
          shouldAccountForXSellBar={shouldAccountForXSellBar}
          hasUnreadNotifications={hasUnreadNotifications}
          viewUrn={urn}
        />
      )}

      {showPortalContainer ? (
        <div
          ref={portalsContainerRef}
          id="portals-container"
          className={classnames({
            [styles.portalsContainer]: showSearchPortalContainer && showGamingRibbonNavPortalContainer,
            [styles.portalsContainerWithSearch]:
              showSearchPortalContainer && isSearchBarVisible && !showGamingRibbonNavPortalContainer,
            // Prevent showing the portals-container on other pages without content
            [styles.hidePortalContainer]: !searchBarHasContent && !ribbonNavHasContent,
          })}
        >
          <div id="search-bar-portal" ref={searchBarRef} />
          <div id="gaming-ribbon-nav-portal" ref={ribbonNavRef} />
        </div>
      ) : null}
      {!removeStickyElement && <div id={HEADER_SPACE_ID}></div>}
      {menuDrawer}
      {showNotificationFrame && <Notifications onClose={onNotificationCenterClose} />}
    </div>
  );
};

export default Header;
