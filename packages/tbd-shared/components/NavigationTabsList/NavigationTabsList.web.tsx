import { useCallback, useContext, useEffect, useRef, useState } from "react";
import * as React from "react";
import { TabsGroup } from "@ppb/the-wall-web";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import classnames from "classnames";
import { TabsGroupSize } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import { buildNavigationTabsContent } from "./NavigationTabsContent/NavigationTabsContent.web";
import styles from "./NavigationTabsList.web.css";
import { ConfigContext } from "../Config/ConfigContext";

function getScrollElement(): HTMLElement | Window {
  return document.getElementById("scrollable-desktop-container") || window;
}

function getScrollOffset(el: HTMLElement | Window): number {
  return el === window ? window.scrollY : (el as HTMLElement).scrollTop;
}

const NavigationTabsList: React.FC<ComponentProps> = ({
  urn,
  stickyTabs,
  title,
  headers,
  contents,
  selectedTabUrn,
  dispatchFetchCardsFromList,
  dispatchFetchCards,
  dispatchOnTabClick,
  dispatchOnTabSwitch,
}) => {
  const contentsComponents = buildNavigationTabsContent(contents, dispatchFetchCardsFromList);
  const { isDesktopLayout } = useContext(ConfigContext);
  const [currentTab, setCurrentTab] = useState(selectedTabUrn);

  const scrollPositionsRef = useRef<Record<string, number>>({});
  const previousTabRef = useRef<string>(selectedTabUrn || "");
  const isInitialMount = useRef(true);

  useEffect((): void => {
    if (currentTab) {
      dispatchFetchCards([currentTab]);
      dispatchOnTabSwitch(urn, currentTab);
    }
  }, [currentTab, urn, dispatchFetchCards, dispatchOnTabSwitch, selectedTabUrn]);

  useEffect(() => {
    if (!currentTab) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const savedOffset = scrollPositionsRef.current[currentTab] ?? 0;

    const el = getScrollElement();
    let timeoutId: ReturnType<typeof setTimeout>;
    let settled = 0;

    const tryRestore = (remaining: number) => {
      el.scrollTo(0, savedOffset);

      const actual = getScrollOffset(el);
      const closeEnough = Math.abs(actual - savedOffset) <= 2;

      if (closeEnough) {
        settled++;
      } else {
        settled = 0;
      }

      if (settled < 3 && remaining > 0) {
        timeoutId = setTimeout(() => tryRestore(remaining - 1), 60);
      }
    };

    timeoutId = setTimeout(() => tryRestore(30), 200);

    return () => clearTimeout(timeoutId);
  }, [currentTab]);

  // TODO: this should be read from store
  const lazy = !window.__CONTENT_LOADING_PARAMETERS__.catalog;

  const onTabSwitch = useCallback(
    (tabUrn: string, label: string, viewLink?: ViewLink) => {
      const prev = previousTabRef.current;

      if (prev) {
        scrollPositionsRef.current[prev] = getScrollOffset(getScrollElement());
      }

      previousTabRef.current = tabUrn;

      dispatchOnTabClick(label, urn);
      setCurrentTab(tabUrn);
      dispatchOnTabSwitch(urn, tabUrn, viewLink);
    },
    [dispatchOnTabClick, urn, dispatchOnTabSwitch],
  );

  const navigationTabsListContainerStyle = classnames(styles.container, {
    [styles.settingsView]: urn === "ppb:tbd:card:staticNavigationTabsList:Settings",
  });

  return (
    <div className={navigationTabsListContainerStyle}>
      <TabsGroup
        headers={headers}
        contents={contentsComponents}
        defaultTab={selectedTabUrn || ""}
        label={title}
        onTabSwitch={onTabSwitch}
        size={TabsGroupSize.Regular}
        stickyTabs={stickyTabs}
        isDesktop={isDesktopLayout}
        lazy={!!lazy}
      />
    </div>
  );
};

export default NavigationTabsList;
