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
  UI__SELECTED_MONTH_FILTER_CHANGED,
} from "../../../../actions/interface";
import { APOLLO_MIGRATED_CARDS } from "../../cards/Card.types";
import { FutureRacingCardGroups } from "./FutureRacingCardgroups.types";

const INITIAL_STATE: FutureRacingCardGroups = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | DeleteViewItems
  | DeleteLayoutAction
  | SelectedMonthFilterChangedAction
  | SelectedCountriesFilterChangedAction;

export default (currentState: undefined | FutureRacingCardGroups, action: ActionTypes): FutureRacingCardGroups => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const groups = action.payload.data.FutureRacingCardGroup || [];

      return groups.reduce<FutureRacingCardGroups>(
        (acc, futureRacingCardGroup) => {
          // Filters are not available when we request filtered content so we need to keep the old state
          const prevState = state[futureRacingCardGroup.urn] || {};
          const filterOptions = Object.keys(futureRacingCardGroup.filterOptions).length
            ? futureRacingCardGroup.filterOptions
            : prevState.filterOptions;

          return {
            ...acc,
            [futureRacingCardGroup.urn]: {
              ...state[futureRacingCardGroup.urn],
              ...futureRacingCardGroup,
              filterOptions: filterOptions || {},
            },
          };
        },
        { ...state },
      );
    }
    case DELETE_VIEW_ITEMS: {
      const urns = action.payload;

      return Object.keys(state).reduce((acc: FutureRacingCardGroups, urn) => {
        const futureRacingCardGroup = state[urn];

        acc[urn] = {
          ...futureRacingCardGroup,
          items: futureRacingCardGroup.items.filter(
            (item) => !urns.includes(item.urn) || APOLLO_MIGRATED_CARDS.includes(item.typename),
          ),
        };

        return acc;
      }, {});
    }
    case UI__SELECTED_MONTH_FILTER_CHANGED: {
      const filteredCoupon = state[action.payload.urn];
      const { monthFilter } = filteredCoupon.filterOptions;

      if (!monthFilter) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          ...filteredCoupon,
          filterOptions: {
            ...filteredCoupon.filterOptions,
            monthFilter: {
              ...monthFilter,
              selectedOptions: action.payload.selectedOptions,
            },
          },
        },
      };
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
    case DELETE_LAYOUT:
      return {};
    default:
      return state;
  }
};
