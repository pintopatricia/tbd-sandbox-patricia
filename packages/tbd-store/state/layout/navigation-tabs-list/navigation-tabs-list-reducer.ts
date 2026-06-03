import { EntityType } from "@ppb/tbd-urn-codecs";
import { NavigationTabsLists } from "./NavigationTabsList.types";
import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../actions/catalogue";
import {
  TAB_ROUTE_UPDATE,
  TabRouteUpdateAction,
  PUSH_SAME_VIEW,
  PushSameViewAction,
  PUSH,
  PushAction,
} from "../../../actions/router";

const INITIAL_STATE: NavigationTabsLists = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | DeleteLayoutAction
  | TabRouteUpdateAction
  | PushSameViewAction
  | PushAction;

export default (currentState: undefined | NavigationTabsLists, action: ActionTypes): NavigationTabsLists => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case PUSH:
    case PUSH_SAME_VIEW: {
      const queryString = action.payload.viewUrl.split("?").pop();
      const tabId = new URLSearchParams(queryString).get("tabId");

      if (tabId) {
        let tabUrn;

        const navigationTabsListUrn = Object.keys(state).find((urn) => {
          if (!urn.includes(tabId)) {
            return false;
          }

          return state[urn].items.find((navigationTab) => {
            if (!navigationTab.urn.includes(tabId)) {
              return false;
            }

            tabUrn = navigationTab.urn;
            return true;
          });
        });

        if (navigationTabsListUrn) {
          return {
            ...state,
            [navigationTabsListUrn]: {
              ...state[navigationTabsListUrn],
              selectedTabUrn: tabUrn,
            },
          };
        }
      }

      return state;
    }
    case FETCH_CATALOGUE_SUCCESS: {
      const tabs = action.payload.data.NavigationTabsList || [];

      return tabs.reduce<NavigationTabsLists>(
        (acc, tabsList) => {
          // Keeping from the previous state unless undefined
          const lastSelectedTabUrn = state[tabsList.urn]?.selectedTabUrn;
          const selectedTabUrn = lastSelectedTabUrn || tabsList.selectedTabUrn;

          return {
            ...acc,
            [tabsList.urn]: {
              ...state[tabsList.urn],
              ...tabsList,
              selectedTabUrn,
            },
          };
        },
        { ...state },
      );
    }
    case DELETE_LAYOUT:
      return {};
    case TAB_ROUTE_UPDATE:
      if (action.payload.tabsListURN && state[action.payload.tabsListURN]) {
        /** At this time we don't want to update the selected tab on derived NavigationTabs like static */
        const isNavigationTabsListValid =
          action.payload.tabsListURN.startsWith(EntityType.NavigationTabsList) ||
          action.payload.tabsListURN.startsWith(EntityType.VirtualNavigationTabsList);

        if (isNavigationTabsListValid) {
          return {
            ...state,
            [action.payload.tabsListURN]: {
              ...state[action.payload.tabsListURN],
              selectedTabUrn: action.payload.selectedTabUrn,
            },
          };
        }
      }

      return state;
    default:
      return state;
  }
};
