import {
  DELETE_LAYOUT,
  DELETE_VIEW_ITEMS,
  FETCH_CATALOGUE_SUCCESS,
  type DeleteLayoutAction,
  type DeleteViewItems,
  type FetchCatalogueSuccessAction,
} from "../../../actions";
import {
  DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS,
  type DeleteFavouriteMarketsNavigationTabsAction,
} from "../../../actions/favourite-markets";
import { APOLLO_MIGRATED_CARDS } from "../cards/Card.types";
import type { NavigationTabListItems } from "../navigation-tabs-list/NavigationTabsList.types";

const INITIAL_STATE: NavigationTabListItems = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | DeleteFavouriteMarketsNavigationTabsAction
  | DeleteViewItems
  | DeleteLayoutAction;

export default (currentState: undefined | NavigationTabListItems, action: ActionTypes): NavigationTabListItems => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const tabs = [
        ...(action.payload.data.NavigationTab || []),
        ...(action.payload.data.FavouriteMarketsNavigationTab || []),
      ];

      return tabs.reduce<NavigationTabListItems>(
        (acc, card) => ({
          ...acc,
          [card.urn]: {
            ...state[card.urn],
            ...card,
          },
        }),
        { ...state },
      );
    }
    case DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS:
      return Object.fromEntries(
        Object.entries(state).filter(
          ([, navigationTab]): boolean => navigationTab.typename !== "FavouriteMarketsNavigationTab",
        ),
      );
    case DELETE_VIEW_ITEMS: {
      const urns = action.payload;

      return Object.keys(state).reduce((acc: NavigationTabListItems, urn) => {
        const navigationTab = state[urn];

        const items = navigationTab.items?.filter(
          (item) => !urns.includes(item.urn) || APOLLO_MIGRATED_CARDS.includes(item.typename),
        );

        acc[urn] = {
          ...navigationTab,
          items,
        };

        return acc;
      }, {});
    }
    case DELETE_LAYOUT:
      return {};
    default:
      return state;
  }
};
