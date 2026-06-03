import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  DELETE_VIEW_ITEMS,
  DeleteViewItems,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../../actions/catalogue";
import {
  SelectedMarketSwitcherAction,
  UI__SELECTED_MARKET_SWITCHER,
  UI__SELECTED_DATE_RANGE_FILTER_CHANGED,
  UI__SELECTED_SORT_FILTER_CHANGED,
  UI__SELECTED_COMPETITIONS_FILTER_CHANGED,
  SelectedDateRangeFilterChangedAction,
  SelectedSortFilterChangedAction,
  SelectedCompetitionsFilterChangedAction,
} from "../../../../actions/interface";
import { APOLLO_MIGRATED_CARDS } from "../../cards/Card.types";
import { FilteredCouponCardGroups } from "./FilteredCouponCardGroups.types";

const INITIAL_STATE: FilteredCouponCardGroups = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | DeleteViewItems
  | SelectedMarketSwitcherAction
  | SelectedDateRangeFilterChangedAction
  | SelectedSortFilterChangedAction
  | SelectedCompetitionsFilterChangedAction
  | DeleteLayoutAction;

export default (currentState: undefined | FilteredCouponCardGroups, action: ActionTypes): FilteredCouponCardGroups => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const groups = action.payload.data.FilteredCouponCardGroup || [];

      return groups.reduce<FilteredCouponCardGroups>(
        (acc, filteredCouponCardGroup) => {
          // Filters are not available when we request filtered content so we need to keep the old state
          const prevState = state[filteredCouponCardGroup.urn] || {};
          const filterOptions = Object.keys(filteredCouponCardGroup.filterOptions).length
            ? filteredCouponCardGroup.filterOptions
            : prevState.filterOptions;

          const title = filteredCouponCardGroup.title || prevState.title;
          const viewAll = filteredCouponCardGroup.viewAll || prevState.viewAll;

          // Keeping from the previous state
          const selectedMarketTab = prevState?.selectedMarketTab;

          return {
            ...acc,
            [filteredCouponCardGroup.urn]: {
              ...state[filteredCouponCardGroup.urn],
              ...filteredCouponCardGroup,
              title,
              viewAll,
              filterOptions: filterOptions || {},
              selectedMarketTab,
            },
          };
        },
        { ...state },
      );
    }
    case DELETE_VIEW_ITEMS: {
      const urns = action.payload;

      return Object.keys(state).reduce((acc: FilteredCouponCardGroups, urn) => {
        const filteredCouponCardGroup = state[urn];

        acc[urn] = {
          ...filteredCouponCardGroup,
          items: filteredCouponCardGroup.items.filter(
            (item) => !urns.includes(item.urn) || APOLLO_MIGRATED_CARDS.includes(item.typename),
          ),
        };

        return acc;
      }, {});
    }
    case UI__SELECTED_MARKET_SWITCHER: {
      const filteredCoupon = state[action.payload.urn];
      const { marketTypeFilter } = filteredCoupon.filterOptions;

      if (!marketTypeFilter) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          ...filteredCoupon,
          filterOptions: {
            ...filteredCoupon.filterOptions,
            marketTypeFilter: {
              ...marketTypeFilter,
              selectedOption: action.payload.selectedOption,
            },
          },
        },
      };
    }
    case UI__SELECTED_DATE_RANGE_FILTER_CHANGED: {
      const filteredCoupon = state[action.payload.urn];
      const { dateRangeFilter } = filteredCoupon.filterOptions;
      if (!dateRangeFilter) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          ...filteredCoupon,
          filterOptions: {
            ...filteredCoupon.filterOptions,
            dateRangeFilter: {
              ...dateRangeFilter,
              selectedOption: action.payload.selectedOption,
            },
          },
        },
      };
    }
    case UI__SELECTED_SORT_FILTER_CHANGED: {
      const filteredCoupon = state[action.payload.urn];
      const { sortOption } = filteredCoupon.filterOptions;

      if (!sortOption) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          ...filteredCoupon,
          filterOptions: {
            ...filteredCoupon.filterOptions,
            sortOption: {
              ...sortOption,
              selectedOption: action.payload.selectedOption,
            },
          },
        },
      };
    }
    case UI__SELECTED_COMPETITIONS_FILTER_CHANGED: {
      const filteredCoupon = state[action.payload.urn];
      const { competitionsFilter } = filteredCoupon.filterOptions;

      if (!competitionsFilter) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          ...filteredCoupon,
          filterOptions: {
            ...filteredCoupon.filterOptions,
            competitionsFilter: {
              ...competitionsFilter,
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
