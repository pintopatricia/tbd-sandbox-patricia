import { FunctionComponent, useLayoutEffect } from "react";
import { useNativeTokens } from "@ppb/the-wall-common/native-for-web-tokens";
import { Logo } from "../../../BetSharingCardGroup/snowflakes/Logo/Logo.web";
import styles from "./HeaderPlaceholder.web.css";

export const HeaderPlaceholder: FunctionComponent<{ loggedIn?: boolean; showXSellBar?: boolean }> = ({
  loggedIn,
  showXSellBar,
}) => {
  const { HeaderContainerSizing, HeaderPadding, PrimaryButtonContainerSizing } = useNativeTokens();

  useLayoutEffect(() => {
    const BASE_HEADER_HEIGHT = HeaderContainerSizing;
    const LOGIN_SECTION_HEIGHT = HeaderPadding.paddingTop + HeaderPadding.paddingBottom + PrimaryButtonContainerSizing;
    let headerHeight = BASE_HEADER_HEIGHT;

    if (!loggedIn) {
      headerHeight += LOGIN_SECTION_HEIGHT;
    }

    let headerHeightProperty = `${headerHeight}px`;
    if (showXSellBar) {
      headerHeightProperty = `calc(${headerHeight}px + var(--x-sell-bar-mobile-container-sizing))`;
    }

    document.body.style.setProperty("--header-height", headerHeightProperty);
  }, [loggedIn, showXSellBar]);

  return (
    <div className={styles.placeholder}>
      {showXSellBar && <div className={styles.xSellBarPlaceholder}></div>}
      <div className={styles.logoContainerPlaceholder}>
        <Logo />
      </div>
      {!loggedIn && (
        <div className={styles.buttonContainerPlaceholder}>
          <div className={styles.buttonPlaceholderPrimary}></div>
          <div className={styles.buttonPlaceholderSecondary}></div>
        </div>
      )}
    </div>
  );
};
