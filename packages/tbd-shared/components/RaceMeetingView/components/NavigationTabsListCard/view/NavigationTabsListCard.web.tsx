import type { FunctionComponent } from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import { TabsGroup } from "@ppb/the-wall-web";
import NavigationTabsListCardPlaceholder from "./NavigationTabsListCardPlaceholder.web";
import { TabsGroupSize } from "@ppb/the-wall-common/types";
import emitEvent from "../../../../../event-broker/event-emitter";
import { NavigationTabItem } from "../../../../NavigationTabItem/NavigationTabItem.web";
import { ConfigContext } from "../../../../Config/ConfigContext";
import { useNavigationTabsListCardVM } from "../viewmodel/NavigationTabsListCard.viewmodel";
import SELECTORS from "./NavigationTabsListCard.selectors";
import styles from "./NavigationTabsListCard.web.module.css";
import { NoContentAvailableCard } from "../../../../NoContentAvailableCard/NoContentAvailableCard.web";
import { useFailedCardUrns } from "../useFailedCardUrns";

export type NavigationTabsListCardProps = {
  urn: string;
  transitioning: boolean;
};

const NavigationTabsListCard: FunctionComponent<NavigationTabsListCardProps> = ({ urn, transitioning }) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const failedCardUrns = useFailedCardUrns();
  const {
    loading,
    transitioning: cardTransitioning,
    vm: {
      data: { title, tabs, headers, selectedTabUrn },
      events,
    },
  } = useNavigationTabsListCardVM(urn);

  const showPlaceholderContent = transitioning || cardTransitioning;

  const [activeTabUrn, setActiveTabUrn] = useState<string | null>(null);
  const [prevSelectedTabUrn, setPrevSelectedTabUrn] = useState(selectedTabUrn);

  if (selectedTabUrn !== prevSelectedTabUrn) {
    setPrevSelectedTabUrn(selectedTabUrn);
    setActiveTabUrn(null);
  }

  const effectiveTabUrn = activeTabUrn || selectedTabUrn;

  const onTabSwitch = useCallback(
    (tabUrn: string, label: string) => {
      setActiveTabUrn(tabUrn);
      events.onTabClick(label);
      const tab = tabs.find((t) => t.id === tabUrn);
      events.onTabSwitch(urn, tabUrn, tab?.viewLink ?? undefined);
    },
    [events, urn, tabs],
  );

  const activeTab = useMemo(() => tabs.find((tab) => tab.id === effectiveTabUrn), [tabs, effectiveTabUrn]);

  const activeTabCardGroupUrns = useMemo(
    () => (activeTab?.items ?? []).filter((item) => !failedCardUrns.includes(item.urn)).map((item) => item.urn),
    [activeTab, failedCardUrns],
  );

  useEffect(() => {
    if (activeTabCardGroupUrns.length > 0) {
      emitEvent("@@UI/FETCH_CARDS", { itemUrns: activeTabCardGroupUrns });
    }
  }, [activeTabCardGroupUrns]);

  if (loading || headers.length === 0) {
    return null;
  }

  const contents = tabs.map((tab) => {
    const validItems = tab.items.filter((item) => !failedCardUrns.includes(item.urn));

    return {
      id: tab.id,
      content: (
        <div className={styles.tabContent}>
          {showPlaceholderContent ? (
            <div className={styles.tabItem}>
              <NavigationTabsListCardPlaceholder />
            </div>
          ) : validItems.length === 0 ? (
            <NoContentAvailableCard />
          ) : (
            validItems.map(({ urn, typename }) => (
              <div
                key={urn}
                className={classnames(styles.tabItem, {
                  [styles.swimlaneWrapper]: typename === "SwimlaneCardGroup",
                })}
              >
                <NavigationTabItem urn={urn} typename={typename} visible={true} />
              </div>
            ))
          )}
        </div>
      ),
    };
  });

  return (
    <div data-testid={SELECTORS.TEST_ID} className={styles.container}>
      <TabsGroup
        headers={headers}
        contents={contents}
        defaultTab={selectedTabUrn}
        label={title}
        onTabSwitch={onTabSwitch}
        size={TabsGroupSize.Regular}
        stickyTabs
        isDesktop={isDesktopLayout}
      />
    </div>
  );
};

export default NavigationTabsListCard;
