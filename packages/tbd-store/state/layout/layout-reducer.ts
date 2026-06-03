import { Reducer, combineReducers } from "redux";
import viewsReducer from "./views/views-reducer";
import cardsReducer from "./cards/cards-reducer";
import cardGroupsReducer from "./cardgroups/cardgroups-reducer";
import viewzonesReducer from "./viewzones/viewzone-reducer";
import searchzonesReducer from "./searchzones/searchzone-reducer";
import navigationTabsListsReducer from "./navigation-tabs-list/navigation-tabs-list-reducer";
import navigationTabsReducer from "./navigation-tabs/navigation-tabs-reducer";
import recentlyPlayedGamesReducer from "./recently-played-games/recently-played-games-reducer";
import leftSidebarReducer from "./sidebars/left-sidebar/left-sidebar-reducer";
import searchBarReducer from "./search-bar/search-bar-reducer";
import searchBarStateReducer from "./search-bar-state/search-bar-state-reducer";
import { Layouts } from "./Layout.types";
import gamingSearchReducer from "./gaming-search/gaming-search-reducer";
import failedCardUrnsReducer from "./failed-card-urns/failed-card-urns-reducer";

const layoutReducer: Reducer<Layouts> = combineReducers<Layouts>({
  views: viewsReducer,
  navigationtabslists: navigationTabsListsReducer,
  navigationtabs: navigationTabsReducer,
  cards: cardsReducer,
  cardgroups: cardGroupsReducer,
  viewzones: viewzonesReducer,
  searchzones: searchzonesReducer,
  recentlyPlayedGames: recentlyPlayedGamesReducer,
  leftSidebar: leftSidebarReducer,
  searchBar: searchBarReducer,
  searchBarState: searchBarStateReducer,
  gamingSearch: gamingSearchReducer,
  failedCardUrns: failedCardUrnsReducer,
});

export default layoutReducer;
