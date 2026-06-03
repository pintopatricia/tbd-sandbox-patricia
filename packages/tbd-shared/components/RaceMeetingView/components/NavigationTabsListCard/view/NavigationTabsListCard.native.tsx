import React, { type JSX, memo, useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { TabsGroup } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { TabsGroupSize } from "@ppb/the-wall-common/types";
import emitEvent from "../../../../../event-broker/event-emitter";
import { NavigationTabItem } from "../../../../NavigationTabItem/NavigationTabItem.native";
import NavigationTabsListCardPlaceholder from "./NavigationTabsListCardPlaceholder.native";
import { useNavigationTabsListCardVM } from "../viewmodel/NavigationTabsListCard.viewmodel";
import SELECTORS from "./NavigationTabsListCard.selectors";
import styles from "./NavigationTabsListCard.native.styles";
import { NoContentAvailableCard } from "../../../../NoContentAvailableCard/NoContentAvailableCard.native";
import { useFailedCardUrns } from "../useFailedCardUrns";

export type NavigationTabsListCardProps = {
  urn: string;
  transitioning: boolean;
};

type MemoizedProps = {
  title: string;
  selectedTabUrn: string;
  headers: { id: string; title: string }[];
  contentsComponents: { id: string; content: JSX.Element }[];
  onTabSwitch: (tabUrn: string, label: string) => void;
};

const MemoizedNavigationTabsList: React.FunctionComponent<MemoizedProps> = memo(
  ({ title, selectedTabUrn, headers, contentsComponents, onTabSwitch }) => (
    <View {...getTestProps(SELECTORS.TEST_ID, false)} style={styles.container}>
      <TabsGroup
        defaultTab={selectedTabUrn}
        headers={headers}
        contents={contentsComponents}
        onTabSwitch={onTabSwitch}
        label={title}
        size={TabsGroupSize.Regular}
        background={false}
      />
    </View>
  ),
);

MemoizedNavigationTabsList.displayName = "MemoizedNavigationTabsList";

const NavigationTabsListCard: React.FunctionComponent<NavigationTabsListCardProps> = ({ urn, transitioning }) => {
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
        <View style={styles.tabContent}>
          {showPlaceholderContent ? (
            <View style={styles.tabItem}>
              <NavigationTabsListCardPlaceholder />
            </View>
          ) : validItems.length === 0 ? (
            <NoContentAvailableCard />
          ) : (
            validItems.map(({ urn, typename }) => (
              <View key={urn} style={styles.tabItem}>
                <NavigationTabItem urn={urn} typename={typename} visible={true} />
              </View>
            ))
          )}
        </View>
      ),
    };
  });

  return (
    <MemoizedNavigationTabsList
      title={title}
      selectedTabUrn={selectedTabUrn}
      headers={headers}
      contentsComponents={contents}
      onTabSwitch={onTabSwitch}
    />
  );
};

export default NavigationTabsListCard;
