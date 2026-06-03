import { Cards } from "./cards/Card.types";
import { CardGroups } from "./cardgroups/CardGroup.types";
import { ViewZones } from "./cards/ViewZone.types";
import { LeftSidebar } from "./left-side-bar/LeftSideBar.types";
import { NavigationTabsLists, NavigationTabListItems } from "./navigation-tabs-list/NavigationTabsList.types";
import { PartialItem } from "./views/PartialItem.types";
import { Views } from "./views/View.types";
import { SearchBar } from "./search-bar/SearchBar.types";
import { SearchBarState } from "./search-bar-state/SearchBarState.types";
import { SearchZones } from "./cards/SearchZone.types";
import { GamingSearch } from "./gaming-search/GamingSearch.types";

/**
 * Layouts data model interface
 * The main entry for layout related state on the application
 */
export type Layouts = {
  readonly cardgroups: CardGroups;
  readonly cards: Cards;

  readonly navigationtabs: NavigationTabListItems;
  readonly navigationtabslists: NavigationTabsLists;
  readonly recentlyPlayedGames: PartialItem[];
  readonly views: Views;
  readonly viewzones: ViewZones;
  readonly searchzones: SearchZones;
  readonly leftSidebar: LeftSidebar;
  readonly searchBar: SearchBar;
  readonly searchBarState: SearchBarState;
  readonly gamingSearch: GamingSearch;
  readonly failedCardUrns: string[];
};
export type { PartialItem };
