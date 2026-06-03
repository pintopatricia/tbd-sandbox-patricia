import type { NavigationTabListContent } from "@ppb/tbd-store/state/layout/navigation-tabs-list/NavigationTabsList.types";

export type TabContentProps = {
  items: NavigationTabListContent["items"];
  isFavouriteMarketsTab?: NavigationTabListContent["isFavouriteMarketsTab"];
  tooltip?: NavigationTabListContent["tooltip"];
  dispatchFetchCardsFromList: (urn: string, partials: NavigationTabListContent["items"]) => void;
};
