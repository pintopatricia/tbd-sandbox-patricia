import { FunctionComponent, useLayoutEffect } from "react";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import XSellBar from "@ppb/tbd-components-navigation/components/XSellBar/view/XSellBar.web";
import { useNativeTokens } from "@ppb/the-wall-common/native-for-web-tokens";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { CasinoIconName, NavigationIconName, SystemIconName } from "@ppb/the-wall-icons";
import { StatusLabel, SecondaryButton, PrimaryButton } from "@ppb/the-wall-web";
import styles from "./Header.web.css";

import { Logo } from "../../../BetSharingCardGroup/snowflakes/Logo/Logo.web";
import { HeaderWebViewModel } from "./Header.web.types";
import { i18n } from "../../../../helpers/i18n";
import { NotificationsIcon } from "../Notifications/NotificationsIcon";

const noop = (): void => {};

export const Header: FunctionComponent<HeaderWebViewModel> = ({
  isLoggedIn,
  isMaintenance,
  canGoBack,
  logoProduct,
  logoUrl,
  showBalances = true,
  accountBalance = "NA",
  extraHeaderHeight,
  showMenu,
  onBackClick,
  onLogoClick,
  onBalanceButtonClick,
  onGenerosityWalletButtonClick,
  onLoginButtonTap,
  onJoinNowButtonTap,
  onMenuClick,
  onNotificationsClick,
  labels: { loginButtonLabel, joinNowButtonLabel, headerWalletLabel },
  shouldAccountForXSellBar,
  hasUnreadNotifications,
  isNotificationsCenterEnabled,
}) => {
  const hasLoginSection = !isLoggedIn && !isMaintenance && onLoginButtonTap && onJoinNowButtonTap;

  const { HeaderContainerSizing, HeaderPadding, PrimaryButtonContainerSizing } = useNativeTokens();

  useLayoutEffect(() => {
    const BASE_HEADER_HEIGHT = HeaderContainerSizing;
    const LOGIN_SECTION_HEIGHT = HeaderPadding.paddingTop + HeaderPadding.paddingBottom + PrimaryButtonContainerSizing;

    let headerHeight = BASE_HEADER_HEIGHT;
    const notLoggedInExtraHeight = LOGIN_SECTION_HEIGHT;

    if (extraHeaderHeight) {
      headerHeight += extraHeaderHeight;
    }

    if (!isLoggedIn && !isMaintenance) {
      headerHeight += notLoggedInExtraHeight;
    }

    let headerHeightProperty = `${headerHeight}px`;
    if (shouldAccountForXSellBar) {
      headerHeightProperty = `calc(${headerHeight}px + var(--x-sell-bar-mobile-container-sizing))`;
    }

    /**
     * We are updating the property directly in the DOM since there are other components who rely on its value
     * to calculate paddings/margins. This way, when the header height changes they are also affected.
     */
    document.body.style.setProperty("--header-height", headerHeightProperty);
  }, [isLoggedIn, isMaintenance, extraHeaderHeight, shouldAccountForXSellBar]);

  return (
    <header className={styles.header} id="header">
      {shouldAccountForXSellBar && <XSellBar visible listLabel={i18n({ key: "I18N.ACCESSIBILITY.BRAND_PRODUCTS" })} />}
      <div className={styles.accountHeader}>
        {!isMaintenance && showMenu && (
          <button
            className={styles.menuButton}
            onClick={onMenuClick}
            aria-label={i18n({ key: "I18N.SEARCH.TITLE" })}
            data-testid="burger-icon"
          >
            <div aria-hidden>
              <GenericIcon name={SystemIconName.MENU} color="var(--header-icon-action-icon-left-default-colour)" />
            </div>
          </button>
        )}
        {!isMaintenance && canGoBack && (
          <button
            className={styles.backButton}
            onClick={onBackClick}
            aria-label={i18n({ key: "I18N.ACCESSIBILITY.PREVIOUS_PAGE" })}
          >
            <div aria-hidden>
              <GenericIcon name={SystemIconName.CHEVRON_LEFT} color="var(--header-icon-back-icon-colour)" />
            </div>
          </button>
        )}
        <div className={styles.logoContainer}>
          <a
            href={logoUrl}
            className={styles.logoLink}
            onClick={onLogoClick}
            aria-label={i18n({ key: "I18N.ACCESSIBILITY.HOMEPAGE" })}
            data-testid="logo-link"
          >
            <Logo product={logoProduct} />
          </a>
        </div>
        <div className={styles.accountContainersGroup}>
          {isLoggedIn && !isMaintenance && (
            <>
              <button className={styles.accountContainer} onClick={onBalanceButtonClick}>
                {showBalances && (
                  <div className={styles.balanceContainer}>
                    <span className={styles.balanceLabel}>{accountBalance}</span>
                    {!!headerWalletLabel && (
                      <div
                        className={styles.generosityWalletActionContainer}
                        onClick={onGenerosityWalletButtonClick}
                        role="button"
                        onKeyUp={noop}
                        tabIndex={0}
                      >
                        <StatusLabel
                          text={headerWalletLabel}
                          iconName={CasinoIconName.PROMOTIONS}
                          statusLabelType={StatusLabelType.GENEROSITY}
                          statusLabelSize={StatusLabelSizeType.SMALL}
                        />
                      </div>
                    )}
                  </div>
                )}
                <div className={styles.userIconContainer}>
                  <GenericIcon name={NavigationIconName.ACCOUNT} color="var(--header-icon-profile-icon-colour)" />
                </div>
              </button>
              {isNotificationsCenterEnabled && (
                <button onClick={onNotificationsClick}>
                  <div className={styles.notificationIconContainer}>
                    <NotificationsIcon unreadNotifications={hasUnreadNotifications} />
                  </div>
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {hasLoginSection && (
        <div className={styles.loginContainer}>
          <SecondaryButton label={loginButtonLabel} onTap={onLoginButtonTap} stopAnimation />
          <PrimaryButton label={joinNowButtonLabel} onTap={onJoinNowButtonTap} stopAnimation />
        </div>
      )}
    </header>
  );
};
