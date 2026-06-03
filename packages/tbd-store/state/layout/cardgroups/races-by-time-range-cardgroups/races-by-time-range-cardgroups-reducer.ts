import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  DELETE_VIEW_ITEMS,
  DeleteViewItems,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../../actions/catalogue";
import {
  SelectedCountriesFilterChangedAction,
  SelectedMonthFilterChangedAction,
  UI__SELECTED_COUNTRIES_FILTER_CHANGED,
} from "../../../../actions/interface";
import { APOLLO_MIGRATED_CARDS } from "../../cards/Card.types";
import { RacesByTimeRangeCardGroups } from "./RacesByTimeRangeCardGroup.types";

const INITIAL_STATE: RacesByTimeRangeCardGroups = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | DeleteViewItems
  | DeleteLayoutAction
  | SelectedMonthFilterChangedAction
  | SelectedCountriesFilterChangedAction;

export default (
  currentState: undefined | RacesByTimeRangeCardGroups,
  action: ActionTypes,
): RacesByTimeRangeCardGroups => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const groups = action.payload.data.RacesByTimeRangeCardGroup || [];

      return groups.reduce<RacesByTimeRangeCardGroups>(
        (acc, byTimeRangeCardGroup) => {
          // Filters are not available when we request filtered content so we need to keep the old state
          const prevState = state[byTimeRangeCardGroup.urn] || {};
          const filterOptions = Object.keys(byTimeRangeCardGroup.filterOptions).length
            ? byTimeRangeCardGroup.filterOptions
            : prevState.filterOptions;

          return {
            ...acc,
            [byTimeRangeCardGroup.urn]: {
              ...state[byTimeRangeCardGroup.urn],
              ...byTimeRangeCardGroup,
              filterOptions: filterOptions || {},
            },
          };
        },
        { ...state },
      );
    }
    case UI__SELECTED_COUNTRIES_FILTER_CHANGED: {
      const filteredCoupon = state[action.payload.urn];
      if (!filteredCoupon) {
        return state;
      }
      const { countriesFilter } = filteredCoupon.filterOptions;

      if (!countriesFilter) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          ...filteredCoupon,
          filterOptions: {
            ...filteredCoupon.filterOptions,
            countriesFilter: {
              ...countriesFilter,
              selectedOptions: action.payload.selectedOptions,
            },
          },
        },
      };
    }
    case DELETE_VIEW_ITEMS: {
      const urns = action.payload;

      return Object.keys(state).reduce((acc: RacesByTimeRangeCardGroups, urn) => {
        const byTimeRangeCardGroup = state[urn];

        acc[urn] = {
          ...byTimeRangeCardGroup,
          items: byTimeRangeCardGroup.items.filter(
            (item) => !urns.includes(item.urn) || APOLLO_MIGRATED_CARDS.includes(item.typename),
          ),
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
