import type { JSX } from "react";
import { useState, useEffect } from "react";
import { Animated, Easing } from "react-native";

import type { NavigationTabListContent } from "@ppb/tbd-store/state/layout/navigation-tabs-list/NavigationTabsList.types";
import type { TabsGroupContentProps } from "@ppb/the-wall-common/types";
import { withStyle } from "@ppb/the-wall-native";

import { FavouriteMarketsEmptyState } from "../../FavouriteMarketsEmptyState/FavouriteMarketsEmptyState.native";
import { NoContentAvailableCard } from "../../NoContentAvailableCard/NoContentAvailableCard.native";
import LoadingDots from "./LoadingDots.native";
import type { TabContentProps } from "../TabContent/TabContent.types";
import { TabContent } from "../TabContent/TabContent.native";

import styles from "./NavigationTabsContent.native.styles";

export const TabContentItemPlaceholder = withStyle(LoadingDots, styles.placeholder);

export const TabContentEnter: React.FC<Pick<TabContentProps, "items" | "tooltip" | "dispatchFetchCardsFromList">> = ({
  items,
  tooltip,
  dispatchFetchCardsFromList,
}) => {
  const [translateY] = useState(() => new Animated.Value(12));
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      translateY.setValue(12);
      opacity.setValue(0);
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            stiffness: 300,
            damping: 20,
            mass: 1,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [translateY, opacity]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <TabContent items={items} tooltip={tooltip} dispatchFetchCardsFromList={dispatchFetchCardsFromList} />
    </Animated.View>
  );
};

/**
 * Receives the tab content item and returns the rendered items.
 */
const renderTabContent = (
  items: TabContentProps["items"],
  tooltip: TabContentProps["tooltip"],
  dispatchFetchCardsFromList: TabContentProps["dispatchFetchCardsFromList"],
  tabHasContent: boolean,
  isFavouriteMarketsTab: boolean,
  hasEmptyStateImage: boolean,
): JSX.Element => {
  if (!tabHasContent) {
    if (isFavouriteMarketsTab) {
      return <FavouriteMarketsEmptyState hasImage={hasEmptyStateImage} />;
    }

    return <NoContentAvailableCard />;
  }

  if (!items.length) {
    return <TabContentItemPlaceholder />;
  }

  return <TabContentEnter items={items} tooltip={tooltip} dispatchFetchCardsFromList={dispatchFetchCardsFromList} />;
};

/**
 * Receives an array of navigation tabs props and returns an array with the built tabs data.
 */
export const buildNavigationTabsContent = (
  contents: NavigationTabListContent[],
  dispatchFetchCardsFromList: TabContentProps["dispatchFetchCardsFromList"],
): TabsGroupContentProps[] =>
  contents.map(
    (content: NavigationTabListContent): TabsGroupContentProps => ({
      id: content.id,
      content: renderTabContent(
        content.items,
        content.tooltip,
        dispatchFetchCardsFromList,
        content.hasContent,
        content.isFavouriteMarketsTab,
        content.hasEmptyStateImage,
      ),
    }),
  );
