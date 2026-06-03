import { FunctionComponent, useCallback, useEffect, useState, useContext } from "react";
import { useDisableBodyScroll } from "@ppb/the-wall-web/hooks/useDisableBodyScroll";
import history from "@ppb/tbd-router/web/history";
import classnames from "classnames";
import { ConfigContext } from "../Config/ConfigContext";
import { ComponentProps } from "./props";
import { UserProfileHeader as HeaderComponent } from "./snowflakes/UserProfileHeader/UserProfileHeader.web";
import headerStyles from "./UserProfileHeader.web.css";

const updateClassesWithNoAnimation = (isDesktopLayout: boolean) => {
  if (!isDesktopLayout) {
    const header = document.getElementById("header");

    if (header) {
      header.className = headerStyles.headerContainer;
    }

    const overlay = document.getElementById("overlay");
    if (overlay) {
      overlay.className = headerStyles.overlay;
    }
  }
};

const updateClassesWithAnimations = (isDesktopLayout: boolean) => {
  if (!isDesktopLayout) {
    const header = document.getElementById("header");

    if (header) {
      header.className = headerStyles.headerFadeIn;
    }

    const overlay = document.getElementById("overlay");
    if (overlay) {
      overlay.className = headerStyles.overlaySlideIn;
    }
  }

  const scrollableSection = document.getElementById("scrollable-section");
  if (scrollableSection) {
    scrollableSection.className = headerStyles.scrollableFadeIn;
  }
};

const UserProfileHeader: FunctionComponent<ComponentProps> = ({
  accountBalance,
  freeBetsBalance,
  showBalances,
  labels,
  freeBetsLabel,
  dispatchFetchUserMainWallet,
  dispatchChangeUrl,
  dispatchMyAccountClickAction,
  closeLocation,
  showBack,
  backToMyAccount,
  onClose,
}) => {
  useEffect(() => {
    dispatchFetchUserMainWallet();
  }, [dispatchFetchUserMainWallet]);
  const { isDesktopLayout } = useContext(ConfigContext);

  const [headerClassName, setHeaderClassName] = useState(
    classnames(headerStyles.headerContainer, {
      [headerStyles.headerContainerDesktop]: isDesktopLayout,
    }),
  );

  const onMyAccountClose = useCallback(() => {
    setHeaderClassName(headerStyles.headerContainerSlideDown);
    onClose();
    dispatchMyAccountClickAction(false);
    updateClassesWithAnimations(isDesktopLayout);
    setTimeout(() => {
      dispatchChangeUrl(closeLocation.urn, closeLocation.url);
      updateClassesWithNoAnimation(isDesktopLayout);
    }, 500);
  }, [onClose, dispatchChangeUrl, dispatchMyAccountClickAction, closeLocation.urn, closeLocation.url, isDesktopLayout]);

  const goBack = useCallback(() => {
    if (backToMyAccount) {
      dispatchChangeUrl(
        `ppb:tbd:view:myAccountView:${closeLocation.encodedUrl}`,
        `/navigation/a-${closeLocation.encodedUrl}`,
      );
    } else {
      history.goBack();
    }
  }, [backToMyAccount, closeLocation.encodedUrl, dispatchChangeUrl]);

  useDisableBodyScroll();

  return (
    <div id="userProfileHeader" className={headerClassName}>
      <HeaderComponent
        showBack={showBack}
        accountBalance={accountBalance}
        freeBetsBalance={freeBetsBalance}
        title={labels.title}
        freeBetsLabel={freeBetsLabel}
        onCloseClick={onMyAccountClose}
        onBackClick={goBack}
        showBalances={showBalances}
      />
    </div>
  );
};

export default UserProfileHeader;
