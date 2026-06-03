import type URN from "../URN";
import type { TranslatableText } from "../cards/Card.types";
import type { ViewLink } from "../cards/ViewLink.types";
import type { PartialItem } from "../views/PartialItem.types";

export type NavigationTabPartial = {
  urn: URN;
  typename: "NavigationTab";
  title: TranslatableText;
  badgeText?: TranslatableText;
  viewLink?: ViewLink;
};

export type FavouriteMarketsNavigationTabPartial = Omit<NavigationTabPartial, "typename"> & {
  typename: "FavouriteMarketsNavigationTab";
  metadataTotalURN?: URN;
};

export type NavigationTabListItemPartial = NavigationTabPartial | FavouriteMarketsNavigationTabPartial;

export type NavigationTabList = {
  urn: URN;
  typename: "NavigationTabsList";
  title: string;
  items: NavigationTabListItemPartial[];
  selectedTabUrn?: string;
};

export type NavigationTabListHeader = {
  id: string;
  title: string;
  ariaLabel?: string;
  statusLabelText?: string;
  viewLink?: ViewLink;
  icon?: string;
};

export type NavigationTabListContent = {
  id: string;
  items: PartialItem[];
  isFavouriteMarketsTab: boolean;
  hasEmptyStateImage: boolean;
  hasContent: boolean;
  tooltip?: {
    title: string;
    description: string;
    onClose: () => void;
  };
};

export type NavigationTabListProcessed = Omit<NavigationTabList, "items"> & {
  headers: NavigationTabListHeader[];
  contents: NavigationTabListContent[];
};

export type NavigationTabsLists = {
  [urn: string]: NavigationTabList;
};

export type NavigationTab = NavigationTabPartial & {
  items: PartialItem[];
};

export type FavouriteMarketsNavigationTab = FavouriteMarketsNavigationTabPartial & {
  items: PartialItem[];
};

export type NavigationTabListItem = NavigationTab | FavouriteMarketsNavigationTab;

export type NavigationTabListItems = {
  [urn: string]: NavigationTabListItem;
};

export type TabsGroupSize = "REGULAR" | "SMALL";
