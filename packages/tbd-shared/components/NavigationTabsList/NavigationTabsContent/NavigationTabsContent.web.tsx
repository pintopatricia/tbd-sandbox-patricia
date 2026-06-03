import type { JSX } from "react";
import * as React from "react";

import type { NavigationTabListContent } from "@ppb/tbd-store/state/layout/navigation-tabs-list/NavigationTabsList.types";
import type { TabsGroupContentProps } from "@ppb/the-wall-common/types";

import { FavouriteMarketsEmptyState } from "../../FavouriteMarketsEmptyState/FavouriteMarketsEmptyState.web";
import { NoContentAvailableCard } from "../../NoContentAvailableCard/NoContentAvailableCard.web";
import SwimlaneCardGroupPlaceholder from "../../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import type { TabContentProps } from "../TabContent/TabContent.types";
import { TabContent } from "../TabContent/TabContent.web";

export const TabContentItemPlaceholder: React.FC = (): JSX.Element => (
  <>
    <SwimlaneCardGroupPlaceholder />
    <SwimlaneCardGroupPlaceholder />
    <SwimlaneCardGroupPlaceholder />
  </>
);

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

  return (
    <TabContent
      items={items}
      isFavouriteMarketsTab={isFavouriteMarketsTab}
      tooltip={tooltip}
      dispatchFetchCardsFromList={dispatchFetchCardsFromList}
    />
  );
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
