import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import { PUSH, PushAction, BOTTOM_BAR_PUSH, BottomBarPushAction } from "../../../../actions/router";
import {
  FETCH_CATALOGUE_SUCCESS,
  DELETE_LAYOUT,
  FetchCatalogueSuccessAction,
  DeleteLayoutAction,
} from "../../../../actions/catalogue";
import {
  BrowseIconClickAction,
  FetchSearchResultsSuccessAction,
  NETWORK__FETCH_SEARCH_RESULTS_SUCCESS,
  SearchAzLinkClickAction,
  SearchCancelAction,
  SearchClearResultsAction,
  SearchInputChangeAction,
  SearchInputChangeClearAction,
  SearchLinkClickAction,
  DeleteGamesFromSearchResults,
  UI__CLEAR_SEARCH_RESULTS,
  UI__SEARCH_CANCEL_CLICK,
  UI__SEARCH_INPUT_CHANGE,
  UI__SEARCH_INPUT_CHANGE_CLEAR,
  UI__DELETE_ITEMS_FROM_SEARCH_RESULTS,
} from "../../../../actions/browse";
import { SearchResultItem } from "./Browse.types";
import { BrowseView, BrowseViews } from "../View.types";

export enum BrowseTab {
  Sports = "sports",
  Gaming = "gaming",
}

/** **********************
 *  Search Interface reducer *
 *********************** */
function buildInitialState(tab: string): BrowseView {
  return {
    urn: codecs.browseView.encode(tab).uid,
    url: `browse/b-${tab}`,
    typename: "BrowseView",
    items: [],
    isOpen: false,
    search: {
      inputSearchTerm: "",
      result: {
        query: "",
        startIndex: 0,
        pageSize: 0,
        items: [],
      },
    },
  };
}

const INITIAL_STATE: BrowseViews = {
  [codecs.browseView.encode(BrowseTab.Sports).uid]: buildInitialState(BrowseTab.Sports),
  [codecs.browseView.encode(BrowseTab.Gaming).uid]: buildInitialState(BrowseTab.Gaming),
};

type ActionTypes =
  | BottomBarPushAction
  | BrowseIconClickAction
  | FetchSearchResultsSuccessAction
  | SearchClearResultsAction
  | PushAction
  | SearchInputChangeClearAction
  | SearchInputChangeAction
  | SearchLinkClickAction
  | SearchCancelAction
  | SearchAzLinkClickAction
  | FetchCatalogueSuccessAction
  | DeleteGamesFromSearchResults
  | DeleteLayoutAction;

export default (currentState: undefined | BrowseViews, action: ActionTypes): BrowseViews => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    // [TODO] PRODUCT SWITHCER: we need to clear both since the `currentViewUrn` in the BrowsePage is not properly updated
    // when user switches tabs. When that is fixed we can use the `UI__CLEAR_SEARCH_RESULTS` directly or add the urn to
    // this action payload and use the same switch case entry.
    case DELETE_LAYOUT:
      return Object.entries(state).reduce(
        (acc: BrowseViews, [urn]) => ({
          ...acc,
          [urn]: {
            ...state[urn],
            search: INITIAL_STATE[urn].search,
          },
        }),
        state,
      );
    case NETWORK__FETCH_SEARCH_RESULTS_SUCCESS:
      if (!action.payload.urn) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          ...state[action.payload.urn],
          search: { ...state[action.payload.urn].search, result: action.payload.results },
        },
      };
    case UI__CLEAR_SEARCH_RESULTS:
    case UI__SEARCH_CANCEL_CLICK:
      if (!action.payload.urn) {
        return state;
      }
      return {
        ...state,
        [action.payload.urn]: {
          ...state[action.payload.urn],
          search: INITIAL_STATE[action.payload.urn].search,
        },
      };

    case BOTTOM_BAR_PUSH:
    case PUSH: {
      // Not a push for browse view
      if (codecs.parse(action.payload.viewUrn)?.type !== EntityType.BrowseView) {
        return Object.entries(state).reduce(
          (acc: BrowseViews, [urn]) => ({
            ...acc,
            [urn]: {
              ...state[urn],
              isOpen: false,
            },
          }),
          state,
        );
      }

      // If page is already opened we should clear search data
      return {
        ...state,
        [action.payload.viewUrn]: {
          ...state[action.payload.viewUrn],
          isOpen: true,
          search: state[action.payload.viewUrn].isOpen
            ? INITIAL_STATE[action.payload.viewUrn].search
            : { ...state[action.payload.viewUrn].search },
        },
      };
    }
    case UI__SEARCH_INPUT_CHANGE_CLEAR:
      if (!action.payload.urn) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          ...state[action.payload.urn],
          search: {
            ...INITIAL_STATE[action.payload.urn].search,
            inputSearchTerm: state[action.payload.urn].search.inputSearchTerm,
          },
        },
      };
    case UI__SEARCH_INPUT_CHANGE:
      if (!action.payload.urn) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          ...state[action.payload.urn],
          search: { ...state[action.payload.urn].search, inputSearchTerm: action.payload.text },
        },
      };
    case FETCH_CATALOGUE_SUCCESS: {
      const views = action.payload.data.BrowseView;

      if (!views) {
        return state;
      }
      // we only want to update the items field
      return views.reduce((acc: BrowseViews, browseView) => {
        const { urn, url, items } = browseView;

        if (state[urn]) {
          return {
            ...acc,
            [urn]: {
              ...state[urn],
              url,
              items,
            },
          };
        }
        return {
          ...acc,
          [urn]: browseView,
        };
      }, state);
    }
    case UI__DELETE_ITEMS_FROM_SEARCH_RESULTS: {
      if (!action.payload.urn) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          ...state[action.payload.urn],
          search: {
            ...state[action.payload.urn].search,
            result: {
              ...state[action.payload.urn].search.result,
              items: state[action.payload.urn].search.result.items.filter(
                (item: SearchResultItem) => !action.payload.itemsUrnsToDelete.includes(item.urn),
              ),
            },
          },
        },
      };
    }
    default:
      return state;
  }
};
