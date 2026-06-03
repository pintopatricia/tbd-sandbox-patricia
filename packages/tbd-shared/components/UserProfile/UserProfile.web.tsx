import { FunctionComponent, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as React from "react";

import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import { PYWEvents, PYWEventActions } from "@ppb/tbd-store/state/entities/PaymentsWeb.types";
import { BannerCTA } from "@ppb/tbd-store/state/layout/cards/Card.types";

import { LinkItem } from "@ppb/the-wall-common/types";
import { MessageBanner, Overlay } from "@ppb/the-wall-web";

import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import classnames from "classnames";
import { ComponentProps } from "./props";
import styles from "./UserProfile.web.css";
import { SuccessfulDepositContent } from "./SuccessfulDepositContent/SuccessfulDepositContent.web";

import ConnectedGenericView from "../GenericView";
import { GenericView, GenericViewPlaceholder } from "../GenericView/GenericView.web";
import { ConnectedUserProfileHeader } from "../UserProfileHeader";
import UserProfileHeader from "../UserProfileHeader/UserProfileHeader.web";
import { i18n } from "../../helpers/i18n";
import { base64DecodeUrl, base64EncodeUrl } from "../../helpers/navigation";
import { getPropsForUserProfile } from "../../view-model-factories/user-profile";
import { getAuthData } from "../../config/endpoints";
import { ConfigContext } from "../Config/ConfigContext";
import { CashBalancesToggleSimpleDetailedViewClick } from "./snowflakes/CashBalances/CashBalances.web";
import { SectionItemOnClick } from "./snowflakes/SectionElements/SectionElements.web";
import { UserQuickMenuOnClick } from "./snowflakes/UserQuickMenu/UserQuickMenu.web";
import { UserProfile, UserProfileRewardsClick, UserProfileBudgetClick } from "./snowflakes/UserProfile/UserProfile.web";

const isSettingsLocation = (url: string): boolean => {
  try {
    const lastPathPart = new URL(url).pathname.split("/").pop();
    return codecs.parse(`ppb:tbd:view:${lastPathPart}`)?.type === EntityType.SettingsView;
  } catch {
    return false;
  }
};

type LocationType = "close" | "settings" | "external";

type NavigationFrame = {
  url: string;
  locationType: LocationType;
};

type NavigationLocation = {
  urn: string;
  url: string;
  encodedUrl: string;
  locationType: LocationType;
};

type UserProfileContentViewProps = ComponentProps & {
  closeLocation: NavigationLocation;
  encodedCloseUrl: string;
  setEncodedCloseUrl: React.Dispatch<React.SetStateAction<string>>;
  setOverlayClass: React.Dispatch<React.SetStateAction<string>>;
};

const DEPOSIT_SUCCESSFUL_OVERLAY_TIMEOUT = 3000;

const isSettingsView = (navigationFrame?: NavigationFrame): boolean => navigationFrame?.locationType === "settings";

const getNavigationLocation =
  (getSettingsLocation: (url: string) => boolean) =>
  (location: string | { urn: string; url: string }, isDesktop = false): NavigationLocation => {
    const isDecodedLocation = (
      encodedOrDecodedlocation: string | { urn: string; url: string },
    ): encodedOrDecodedlocation is { urn: string; url: string } =>
      (encodedOrDecodedlocation as { urn: string; url: string })?.urn !== undefined;

    const subNavigationSeparator = "###";
    let urn = "";
    let url: string;
    let encodedUrl: string;
    let isCloseLocation: boolean;
    if (isDecodedLocation(location)) {
      ({ urn, url } = location);
      encodedUrl = base64EncodeUrl(urn + subNavigationSeparator + url);
    } else {
      const decodedLocation = base64DecodeUrl(location);
      if (decodedLocation.includes(subNavigationSeparator)) {
        [urn, url] = location ? base64DecodeUrl(location).split(subNavigationSeparator) : ["", ""];
        isCloseLocation = true;
      } else if (isDesktop) {
        const queryParamSeparator = decodedLocation.includes("?") ? "&" : "?";
        url = [decodedLocation, "hideHeaderFooter=true"].join(queryParamSeparator);
      } else {
        url = decodedLocation;
      }

      encodedUrl = location;
    }

    const getLocationType = (): LocationType => {
      if (isCloseLocation) {
        return "close";
      }
      return getSettingsLocation(url) ? "settings" : "external";
    };

    return {
      urn,
      url,
      encodedUrl,
      locationType: getLocationType(),
    };
  };

const UserProfileContent: FunctionComponent<UserProfileContentViewProps> = ({
  rewards,
  rewardsTitle,
  basicPlan,
  noPlanSelected,
  packageLevelValue,
  groupsMenu,
  quickMenuItems,
  firstName,
  lastLoginDate,
  showBalances,
  simpleView,
  detailedView,
  currentViewURN,
  jurisdiction,
  currentBanner,
  accountBannersCardURN,
  budgetLimit,
  wizardUrl,
  closeLocation,
  encodedCloseUrl,
  userProfileLinks,
  hasUnreadNotifications,
  setEncodedCloseUrl,
  setOverlayClass,
  dispatchPushAction,
  dispatchFetchCatalogueAction,
  dispatchUpdateCurrentBannerAction,
  dispatchBannerActionRequest,
  dispatchOnLogoutClick,
  dispatchUserProfileMenuEyeIconClickAction,
  dispatchOnClickMenuLink,
  dispatchOnClickQuickMenu,
  dispatchOnToggleSimpleDetailedViewClick,
  dispatchOnClickBudget,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);

  const navigateToUrl = useCallback(
    (url: string) => {
      const encodedUrl = base64EncodeUrl(url);
      dispatchPushAction(`${EntityType.MyAccountView}:${encodedUrl}`, `/navigation/a-${encodedUrl}`);
    },
    [dispatchPushAction],
  );

  const navigationLocation = getNavigationLocation(isSettingsLocation);

  const encodedExternalURL = currentViewURN?.includes(EntityType.MyAccountView) ? currentViewURN.split(":")[4] : "";

  const navigationFrame = useMemo(() => {
    const loc = getNavigationLocation(isSettingsLocation)(encodedExternalURL, isDesktopLayout);
    return { url: loc.url, locationType: loc.locationType };
  }, [encodedExternalURL, isDesktopLayout]);

  const [iframeKey, setIframeKey] = useState<number>(0);

  const [title, setTitle] = useState<string>(() => {
    const loc = getNavigationLocation(isSettingsLocation)(encodedExternalURL, isDesktopLayout);
    return loc.locationType === "close" ? i18n({ key: "I18N.MY_ACCOUNT.TITLE" }) : "";
  });

  const [prevEncodedExternalURL, setPrevEncodedExternalURL] = useState(encodedExternalURL);
  const [prevIsDesktopLayout, setPrevIsDesktopLayout] = useState(isDesktopLayout);

  if (prevEncodedExternalURL !== encodedExternalURL || prevIsDesktopLayout !== isDesktopLayout) {
    setPrevEncodedExternalURL(encodedExternalURL);
    setPrevIsDesktopLayout(isDesktopLayout);
    const externalLocation = getNavigationLocation(isSettingsLocation)(encodedExternalURL, isDesktopLayout);
    if (externalLocation.locationType === "close") {
      setTitle(i18n({ key: "I18N.MY_ACCOUNT.TITLE" }));
      setEncodedCloseUrl(externalLocation.encodedUrl);
    }
  }

  useEffect(() => {
    if (isSettingsView(navigationFrame)) {
      const settingsPageStyle = classnames(styles.connectedUserProfileOverlay, styles.settingsView);
      setOverlayClass(settingsPageStyle);
    } else {
      setOverlayClass(
        classnames(styles.connectedUserProfileOverlay, {
          [styles.connectedUserProfileOverlayDesktop]: isDesktopLayout,
        }),
      );
    }
  }, [navigationFrame, isDesktopLayout, setOverlayClass]);

  useEffect(() => {
    if (isSettingsView(navigationFrame)) {
      dispatchFetchCatalogueAction(`${EntityType.SettingsView}:settings`);
    }
  }, [dispatchFetchCatalogueAction, navigationFrame]);

  useEffect(() => {
    if (wizardUrl) {
      const { open } = window;
      open(wizardUrl, "_top");
    }
  }, [wizardUrl]);

  const onBannerClose = (): void => {
    if (accountBannersCardURN && currentBanner) {
      dispatchUpdateCurrentBannerAction(accountBannersCardURN, currentBanner.index + 1);
    }
  };

  const onBannerButtonClick = (bannerAction: BannerCTA): void => {
    const { target, url } = bannerAction;
    const { open } = window;

    if (target === "close") {
      onBannerClose();
    }

    if (target === "api" && accountBannersCardURN && currentBanner) {
      dispatchBannerActionRequest(accountBannersCardURN, currentBanner.index + 1, bannerAction);
    } else if (url) {
      if (target === "_blank" || target === "_top") {
        open(url, target);
      }

      if (target === "_self") {
        navigateToUrl(url);
      }

      onBannerClose();
    }
  };

  const onLogoutClick = useCallback(() => {
    dispatchOnLogoutClick();
  }, [dispatchOnLogoutClick]);

  const onClickBudgetLink = useCallback<UserProfileBudgetClick>(
    (event, item) => {
      const {
        itemLink: { viewLink },
      } = item;

      if (!viewLink) {
        return;
      }

      if (event.currentTarget.getAttribute("target") === "_self" || isSettingsLocation(viewLink.viewUrl)) {
        event.preventDefault();

        navigateToUrl(viewLink.viewUrl);
      }

      dispatchOnClickBudget(viewLink.viewUrl, jurisdiction);
    },
    [dispatchOnClickBudget, navigateToUrl, jurisdiction],
  );

  const onEyeIconClick = useCallback(() => {
    dispatchUserProfileMenuEyeIconClickAction(!showBalances, jurisdiction);
  }, [dispatchUserProfileMenuEyeIconClickAction, showBalances, jurisdiction]);

  const onClickMenuLink = useCallback<SectionItemOnClick>(
    (event, item) => {
      if (!("viewLink" in item) || !item.viewLink) {
        return;
      }

      const menuText = "text" in item ? item.text : "";

      if (event.currentTarget.getAttribute("target") === "_self" || isSettingsLocation(item.viewLink.viewUrl)) {
        event.preventDefault();

        setTitle(menuText);
        navigateToUrl(item.viewLink.viewUrl);
      }

      dispatchOnClickMenuLink(jurisdiction, menuText, item.viewLink.viewUrl);
    },
    [dispatchOnClickMenuLink, jurisdiction, navigateToUrl],
  );

  const onNoPlanSelectedClick = useCallback((): void => {
    navigateToUrl(userProfileLinks.chooseRewardsLink);
  }, [navigateToUrl, userProfileLinks.chooseRewardsLink]);

  const onRewardsClick: UserProfileRewardsClick = useCallback(() => {
    setTitle(rewardsTitle ?? "");
    navigateToUrl(userProfileLinks.rewardsLink);
  }, [navigateToUrl, rewardsTitle, userProfileLinks.rewardsLink]);

  const onClickQuickMenu: UserQuickMenuOnClick = useCallback(
    (event, url) => {
      const target = event?.currentTarget;
      const textContent = target?.textContent || "";
      const href = target?.getAttribute("href") || "";

      setTitle(textContent);

      event?.preventDefault();
      navigateToUrl(url);

      dispatchOnClickQuickMenu(textContent, jurisdiction, href);
    },
    [dispatchOnClickQuickMenu, jurisdiction, navigateToUrl],
  );

  const onToggleSimpleDetailedViewClick: CashBalancesToggleSimpleDetailedViewClick = useCallback(
    (showLessToggle: boolean) => {
      dispatchOnToggleSimpleDetailedViewClick(showLessToggle, jurisdiction);
    },
    [dispatchOnToggleSimpleDetailedViewClick, jurisdiction],
  );

  const titleDepsKey = useMemo(
    () => ({ groupsMenu, navigationFrame, quickMenuItems, rewardsTitle }),
    [groupsMenu, navigationFrame, quickMenuItems, rewardsTitle],
  );
  const [prevTitleDepsKey, setPrevTitleDepsKey] = useState(titleDepsKey);

  if (prevTitleDepsKey !== titleDepsKey) {
    setPrevTitleDepsKey(titleDepsKey);
    const allDisplayedLinkItems: LinkItem[] = groupsMenu
      .reduce(
        (acc: LinkItem[], { groupsMenuItem }) =>
          acc.concat(groupsMenuItem.items.filter((item) => item.type === "LINK") as LinkItem[]),
        [] as LinkItem[],
      )
      .concat(quickMenuItems.map((userQuickMenuItem) => ({ ...userQuickMenuItem, text: userQuickMenuItem.label })))
      .concat({ text: rewardsTitle ?? "", viewLink: { viewUrl: userProfileLinks.chooseRewardsLink, viewUrn: "" } })
      .concat({ text: rewardsTitle ?? "", viewLink: { viewUrl: userProfileLinks.rewardsLink, viewUrn: "" } });

    const matchCurentNavigationFrameToADisplayedLink = (linkItem: LinkItem) =>
      navigationFrame && !!linkItem.viewLink && navigationFrame.url.includes(linkItem.viewLink.viewUrl);

    const currentNavigationFrameCorespondentLink = allDisplayedLinkItems.find((linkItem) =>
      matchCurentNavigationFrameToADisplayedLink(linkItem),
    );

    if (currentNavigationFrameCorespondentLink) {
      setTitle(currentNavigationFrameCorespondentLink.text ?? "");
    }
  }

  useEffect(() => {
    const handleMyAccountNavigation = (event: MessageEvent) => {
      const {
        data: { type },
      } = event;

      if (type === "MYACCOUNT.NAVIGATION") {
        const closeNavigationLocation = navigationLocation(encodedCloseUrl);
        navigateToUrl(`${closeNavigationLocation.urn}###${closeNavigationLocation.url}`);
      }
    };

    window.addEventListener("message", handleMyAccountNavigation);
    return () => {
      window.removeEventListener("message", handleMyAccountNavigation);
    };
  }, [encodedCloseUrl]);

  useEffect(() => {
    if (!navigationFrame?.url || navigationFrame.url === "/") {
      return undefined;
    }

    const messageListener = (event: MessageEvent): void => {
      const {
        data: { type },
      } = event;

      // reloads TBD when there's a language or timezone update (iframe postMessage)
      if (type === "LANGUAGE.UPDATED" || type === "TIMEZONE.UPDATED") {
        window.location.reload();
      }
      // reloads iframe content when modal is closed on SGX
      if (type === "SGX_MODAL_CLOSE") {
        setIframeKey((key) => key + 1);
      }
    };

    window.addEventListener("message", messageListener);
    return () => {
      window.removeEventListener("message", messageListener);
    };
  }, [navigationFrame]);

  const onClose = useCallback(() => {
    setOverlayClass(styles.connectedUserProfileOverlaySlideDown);
  }, [setOverlayClass]);

  if (!currentViewURN?.includes(EntityType.MyAccountView)) {
    return null;
  }

  const userProfileProps = getPropsForUserProfile(onLogoutClick);

  const bannerTitle = currentBanner?.bannerInfo?.title ? currentBanner.bannerInfo.title : "";

  const bannerText = currentBanner?.bannerInfo?.bodyContent?.text ? currentBanner.bannerInfo.bodyContent.text : "";

  const items = currentBanner?.bannerInfo?.bodyContent?.items ? currentBanner.bannerInfo.bodyContent.items : [];

  const isBannerClosable = currentBanner && currentBanner.isClosable ? currentBanner.isClosable : false;

  const logoutPadding = currentBanner && !currentBanner.isClosable ? 125 : 0;

  const loadInIframe = navigationFrame?.locationType === "external";
  const showBack = !isDesktopLayout && navigationFrame?.locationType !== "close";

  const rewardsWithDomNodes = rewards?.map((reward) => ({
    ...reward,
    monthMessage: <p dangerouslySetInnerHTML={{ __html: reward.monthMessage }} />,
  }));

  return (
    <>
      <ConnectedUserProfileHeader
        showBack={showBack}
        labels={{ title }}
        closeLocation={{
          urn: closeLocation.urn,
          url: closeLocation.url,
          encodedUrl: closeLocation.encodedUrl,
        }}
        component={UserProfileHeader}
        backToMyAccount={isSettingsView(navigationFrame)}
        onClose={onClose}
      />
      {loadInIframe ? (
        <iframe
          key={iframeKey}
          className={styles.userProfileIframe}
          id="user-profile-iframe"
          name={`user-profile-iframe-${iframeKey}`}
          title="External Content"
          allow="web-share; camera; autoplay; fullscreen; clipboard-read; clipboard-write; accelerometer; gyroscope; magnetometer"
          src={navigationFrame?.url}
        />
      ) : (
        <>
          {currentBanner && !isSettingsView(navigationFrame) && (
            <MessageBanner
              isCollapsed={false}
              title={bannerTitle}
              text={bannerText}
              isClosable={isBannerClosable}
              attentionLevel={currentBanner.attentionLevel}
              bannerActions={currentBanner.bannerActions}
              items={items}
              onBannerClose={onBannerClose}
              onBannerButtonClick={onBannerButtonClick}
            />
          )}
          <div className={styles.bannersContainer}>
            {isSettingsView(navigationFrame) && (
              <ConnectedGenericView
                urn={`${EntityType.SettingsView}:settings`}
                // @ts-expect-error TODO Universal integration with placeholders still break on ts-jest
                component={GenericView}
                placeholder={GenericViewPlaceholder}
              />
            )}
            {!isSettingsView(navigationFrame) && (
              <UserProfile
                {...userProfileProps}
                firstName={firstName}
                quickMenu={quickMenuItems}
                showBalances={showBalances}
                simpleViewBalances={simpleView}
                lastLoginDate={lastLoginDate}
                detailedViewBalance={detailedView}
                rewards={rewardsWithDomNodes}
                rewardsTitle={rewardsTitle}
                basicPlan={basicPlan}
                noPlanSelected={noPlanSelected}
                packageLevel={packageLevelValue}
                groupsMenu={groupsMenu}
                budgetLimit={budgetLimit}
                balanceToggle={jurisdiction !== Jurisdiction.INTERNATIONAL}
                onClickUserMenuLink={onClickMenuLink}
                onNoPlanSelectedClick={onNoPlanSelectedClick}
                onRewardsClick={onRewardsClick}
                onClickQuickMenuLink={onClickQuickMenu}
                onEyeIconClick={onEyeIconClick}
                onToggleSimpleDetailedViewClick={onToggleSimpleDetailedViewClick}
                onBudgetLinkClick={onClickBudgetLink}
                hasUnreadNotifications={hasUnreadNotifications}
              />
            )}
            {!isBannerClosable && !isSettingsView(navigationFrame) && (
              <div style={{ padding: logoutPadding }}>&nbsp;</div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export const UserProfileWeb: FunctionComponent<ComponentProps> = (props) => {
  const {
    walletsToCallWasService,
    currentViewURN,
    betslipDepositRedirect,
    depositSuccessfulLabels,
    isLoggedIn,
    userProfileLinks,
    dispatchPushAction,
    dispatchFetchUserWalletsAction,
    dispatchBetPlacement,
    dispatchLogin,
    dispatchDepositSuccessfulAction,
  } = props;
  const navigationLocation = getNavigationLocation(isSettingsLocation);
  const homeLocation = navigationLocation({ urn: "ppb:tbd:view:generic:home", url: "" });

  const showUserProfilePage = isLoggedIn;
  const [showCustomDepositSuccess, setShowCustomDepositSuccess] = useState(false);
  const [overlayClass, setOverlayClass] = useState(styles.connectedUserProfileOverlay);
  const [encodedCloseUrl, setEncodedCloseUrl] = useState<string>(homeLocation.encodedUrl);

  const closeLocation = navigationLocation(encodedCloseUrl);

  useEffect(() => {
    if (!isLoggedIn) {
      const { SSO_URL } = getAuthData() || {};
      const ssoWithRedirectUrl = `${SSO_URL}&url=${encodeURIComponent(window.location.href)}`;

      dispatchLogin(ssoWithRedirectUrl);
    }
  }, [isLoggedIn, dispatchLogin]);

  // fetch all user wallets
  useEffect(() => {
    if (walletsToCallWasService.length) {
      dispatchFetchUserWalletsAction(walletsToCallWasService);
    }
  }, [dispatchFetchUserWalletsAction, walletsToCallWasService]);

  // Initialize Apple Pay proxy
  useEffect(() => {
    (window as any).pywApplePayProxy = { applePayIframeTargetSelector: "*user-profile-iframe" };
    const script = document.createElement("script");

    script.src = userProfileLinks.applePay;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [userProfileLinks.applePay]);

  // Listen to events posted from PYW after deposit or withdraw to update user wallet
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handlePYWNavigation = ({ data }: MessageEvent<PYWEvents>): void => {
      const { action } = data;
      if (action === PYWEventActions.BALANCE_REFRESHED && walletsToCallWasService.length) {
        dispatchFetchUserWalletsAction(walletsToCallWasService);
      }

      const { isDepositRedirect } = betslipDepositRedirect;
      if (action === PYWEventActions.DEPOSIT_SUCCESS && isDepositRedirect) {
        setShowCustomDepositSuccess(true);
        dispatchDepositSuccessfulAction(data, document.referrer || document.location.host);
        dispatchBetPlacement(betslipDepositRedirect);

        timeout = setTimeout(() => {
          dispatchPushAction(closeLocation.urn, closeLocation.url);
        }, DEPOSIT_SUCCESSFUL_OVERLAY_TIMEOUT);
      }
    };

    window.addEventListener("message", handlePYWNavigation);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("message", handlePYWNavigation);
    };
  }, [dispatchFetchUserWalletsAction, walletsToCallWasService.length]);

  if (!currentViewURN?.includes(EntityType.MyAccountView)) {
    return null;
  }

  return (
    <>
      {showUserProfilePage && (
        <Overlay containerId="#overlay-root" className={overlayClass}>
          {showCustomDepositSuccess ? (
            <SuccessfulDepositContent
              depositSuccessful={depositSuccessfulLabels.depositSuccessful}
              placingBet={depositSuccessfulLabels.placingBet}
            />
          ) : (
            <UserProfileContent
              {...props}
              closeLocation={closeLocation}
              encodedCloseUrl={encodedCloseUrl}
              setEncodedCloseUrl={setEncodedCloseUrl}
              setOverlayClass={setOverlayClass}
            />
          )}
        </Overlay>
      )}
    </>
  );
};
