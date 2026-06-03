import { MapStateToPropsFactory } from "react-redux";
import { createSelector, ParametricSelector } from "reselect";
import { FetchFilteredCouponAction, FETCH_FILTERED_COUPON } from "@ppb/tbd-store/actions/catalogue";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UI__CARDGROUP_VIEW_ALL_LINK_TAP, CardGroupViewAllLinkTapAction } from "@ppb/tbd-store/actions/navigation";
import { createFindCouponCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/filtered-coupon-cardgroups/filtered-coupon-cardgroups-selectors";
import { RadioListOption } from "@ppb/the-wall-common/types/RadioList/RadioList.types";
import { OptionListItem, FilterByItem, FILTER_TYPE } from "@ppb/the-wall-common/types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { formatMonthLong } from "@ppb/tbd-store/helpers/dates";
import {
  FilterApplyAction,
  FilterCloseAction,
  SelectedMarketSwitcherAction,
  SelectedMarketSwitcherPayload,
  FilterOpenAction,
  FilterResetClickAction,
  UI__SELECTED_MARKET_SWITCHER,
  UI__FILTERS_RESET_CLICK,
  UI__FILTER_APPLY,
  UI__FILTER_CLOSE,
  UI__FILTER_OPEN,
  PromoDescriptionToggleAction,
  UI__PROMO_DESCRIPTION_TOGGLE,
  UI__SELECTED_DATE_RANGE_FILTER_CHANGED,
  UI__SELECTED_SORT_FILTER_CHANGED,
  SelectedDateRangeFilterChangedAction,
  SelectedDateRangeFilterChangedPayload,
  SelectedSortFilterChangedPayload,
  SelectedSortFilterChangedAction,
  UI__SELECTED_COMPETITIONS_FILTER_CHANGED,
  SelectedCompetitionsFilterChangedPayload,
  SelectedCompetitionsFilterChangedAction,
  SelectedMonthFilterChangedPayload,
  SelectedMonthFilterChangedAction,
  SelectedCountriesFilterChangedPayload,
  SelectedCountriesFilterChangedAction,
  UI__SELECTED_MONTH_FILTER_CHANGED,
  UI__SELECTED_COUNTRIES_FILTER_CHANGED,
} from "@ppb/tbd-store/actions/interface";
import { FilterKeys, MarketTypeFilterLayout } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { ViewAllLink } from "@ppb/tbd-store/state/layout/views/ViewAll.types";
import {
  FilteredCouponOptions,
  FilteredGroupSort,
} from "@ppb/tbd-store/state/layout/cardgroups/filtered-coupon-cardgroups/FilteredCouponCardGroups.types";
import {
  CompetitionFilterGroup,
  FilteredCouponCardGroupDefaultSelections,
} from "./CompetitionFilterDrawer/CompetitionFilterDrawer.types";
import { i18n } from "../../helpers/i18n";
import MarketBlurbsGA4Variants from "../../helpers/market-blurbs-ga4-variants";
import { TranslationKey } from "../../translations/keys";

export type SingleFilterSelection = {
  [FILTER_TYPE.SORT]: string | undefined;
  [FILTER_TYPE.DATE_RANGE]: string | undefined;
  [FILTER_TYPE.MARKET_TYPE]: string | null;
};

export type MultiFilterSelections = {
  [FILTER_TYPE.COMPETITION]: string[] | undefined;
  [FILTER_TYPE.COUNTRIES]: string[] | undefined;
  [FILTER_TYPE.MONTHS]: string[] | undefined;
};

export type FilterBySelections = SingleFilterSelection & MultiFilterSelections;

export type ViewFilters = {
  genericFilters: Filter[];
  marketTypeFilter: SingleFilter | undefined;
  defaultSelections: FilteredCouponCardGroupDefaultSelections;
  filtersByItem: FilterByItem[];
};

export type CompetitionFilter = {
  id: FILTER_TYPE.COMPETITION;
  value: string;
  isSelected: boolean;
  isActive: boolean;
  isSingleSelection: boolean;
  title: string;
  topCompetitions: CompetitionFilterGroup;
  defaultOptions?: OptionListItem[];
  selectedOptions?: OptionListItem[];
  sortPriority?: number;
  numberOfSelectedOptions?: number;
};

export type SingleFilter = {
  id: FILTER_TYPE.SORT | FILTER_TYPE.MARKET_TYPE | FILTER_TYPE.DATE_RANGE;
  value: string;
  isSelected: boolean;
  isActive: boolean;
  isSingleSelection: true;
  title: string;
  availableOptions: RadioListOption[];
  defaultOption?: RadioListOption;
  selectedOption?: RadioListOption;
  sortPriority?: number;
  numberOfSelectedOptions?: number;
  layout?: MarketTypeFilterLayout;
};

export type MultipleFilter = {
  id: FILTER_TYPE.COUNTRIES | FILTER_TYPE.MONTHS;
  value: string;
  isSelected: boolean;
  isActive: boolean;
  isSingleSelection: false;
  title: string;
  availableOptions: OptionListItem[];
  defaultOptions?: OptionListItem[];
  sortPriority?: number;
  numberOfSelectedOptions?: number;
};

export type Filter = SingleFilter | MultipleFilter | CompetitionFilter;

export type RefreshFilters = {
  marketType: string | null;
  competitions: string[] | null;
  dateRange: string | null;
};

export type MarketTypeFiltersType = {
  filters: SingleFilter;
  marketSwitcherTitle: string;
  setTriggerRef?: React.Dispatch<React.SetStateAction<React.RefObject<HTMLDivElement | null> | undefined>>;
  getMarketTypeFilterLabel: () => string;
  onMarketTypeFilterTap: (value: string, id?: string) => void;
};

export type CardProps = {
  urn: URN;
  typename: string;
  title: string;
  filters: ViewFilters;
  hasMaxNumberOfEvents: boolean;
  viewAll?: ViewAllLink;
  hasResults: boolean;
  noResultsLabel: string;
  noResultsSuggestionLabel: string;
  noResultsResetLabel: string;
  resetText: string;
  marketSwitcherTitle: string;
  notificationMessageLabel: string;
  notificationDetailLabel: string;
  has90Min: boolean;
  marketUrn?: URN;
  refreshFilters: RefreshFilters;
};

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const sortFilters = (filters: FilterByItem[] | Filter[]): FilterByItem[] | Filter[] =>
  filters.sort((a, b) =>
    a.isActive === b.isActive
      ? (a.sortPriority ?? 99) - (b.sortPriority ?? 99)
      : Number(b.isActive) - Number(a.isActive),
  );

/**
 * Transform store state into generic filters view model
 *
 * @param filterOptions Store state for filter options
 * @returns Filters view mode
 */
const buildFiltersViewModel = (filterOptions: FilteredCouponOptions, userDetails: UserDetails): ViewFilters => {
  const {
    dateRangeFilter,
    sortOption,
    competitionsFilter,
    marketTypeFilter: marketTypeFilterOption,
    monthFilter,
    countriesFilter,
    filtersSorting,
  } = filterOptions;

  const genericFilters: Filter[] = [];
  let marketTypeFilter: SingleFilter | undefined;

  const labels = {
    dateRangePebbleTitle: i18n({ key: "I18N.FILTERS.DATE_RANGE" }),
    sortPebbleTitle: i18n({ key: "I18N.SORT" }),
    monthPebbleTitle: i18n({ key: "I18N.MONTH" }),
    countriesPebbleTitle: i18n({ key: "I18N.COUNTRIES" }),
    dateRangeDrawerTitle: i18n({ key: "I18N.FILTERS.SET_DATE_RANGE" }),
    sortDrawerTitle: i18n({ key: "I18N.FILTERS.SORT_MATCHES_BY" }),
    monthDrawerTitle: i18n({ key: "I18N.MONTH" }),
    countriesDrawerTitle: i18n({ key: "I18N.COUNTRIES" }),
  };

  const FILTER_SORT_BY_MAP: { [key in FilteredGroupSort]: string } = {
    [FilteredGroupSort.Rank]: i18n({ key: "I18N.SORT.RANK" }),
    [FilteredGroupSort.Time]: i18n({ key: "I18N.SORT.TIME" }),
  };

  if (sortOption) {
    const sortValueKey: FilteredGroupSort =
      sortOption.selectedOption || sortOption.defaultOption || FilteredGroupSort.Rank;

    genericFilters.push({
      id: FILTER_TYPE.SORT,
      value: sortValueKey ? FILTER_SORT_BY_MAP[sortValueKey] : i18n({ key: "I18N.SORT" }),
      isSelected: false,
      isActive: !!sortOption.defaultOption,
      isSingleSelection: true,
      title: i18n({ key: "I18N.FILTERS.SORT_MATCHES_BY" }),
      availableOptions: sortOption.availableOptions.map((opt) => ({ id: `${opt}`, text: FILTER_SORT_BY_MAP[opt] })),
      defaultOption: sortOption.defaultOption
        ? { id: `${sortOption.defaultOption}`, text: FILTER_SORT_BY_MAP[sortOption.defaultOption] }
        : undefined,
      selectedOption: sortOption.selectedOption
        ? {
            id: sortOption.selectedOption,
            text: FILTER_SORT_BY_MAP[sortOption.selectedOption],
          }
        : undefined,
      sortPriority: filtersSorting?.indexOf(FilterKeys.SortOption),
    });
  }

  if (dateRangeFilter) {
    const dateRangeValueKey: keyof TranslationKey = (dateRangeFilter.selectedOption?.name ||
      dateRangeFilter.defaultOption?.name ||
      "I18N.FILTERS.DATE_RANGE") as keyof TranslationKey;

    genericFilters.push({
      id: FILTER_TYPE.DATE_RANGE,
      value: i18n({ key: dateRangeValueKey }),
      isSelected: false,
      isActive: !!dateRangeFilter.defaultOption,
      isSingleSelection: true,
      title: i18n({ key: "I18N.FILTERS.SET_DATE_RANGE" }),
      availableOptions: dateRangeFilter.availableOptions.map((opt) => ({
        id: opt.urn,
        text: i18n({ key: opt.name as keyof TranslationKey }),
      })),
      defaultOption: dateRangeFilter.defaultOption
        ? {
            id: dateRangeFilter.defaultOption.urn,
            text: i18n({ key: dateRangeFilter.defaultOption.name as keyof TranslationKey }),
          }
        : undefined,
      selectedOption: dateRangeFilter.selectedOption
        ? {
            id: dateRangeFilter.selectedOption.urn,
            text: i18n({ key: dateRangeFilter.selectedOption.name as keyof TranslationKey }),
          }
        : undefined,
      sortPriority: filtersSorting?.indexOf(FilterKeys.DateRangeFilter),
    });
  }

  if (marketTypeFilterOption) {
    const marketTypeFilterAvailableOptions = [
      { marketType: "ppb:marketType:RECOMMENDED", name: i18n({ key: "I18N.FILTERS.MARKET_TYPE_RECOMMENDED" }) },
      ...marketTypeFilterOption.availableOptions,
    ];

    const selectedOption = marketTypeFilterOption.selectedOption && {
      id: marketTypeFilterOption.selectedOption.marketType,
      text: marketTypeFilterOption.selectedOption.name,
    };
    const defaultOption = marketTypeFilterOption.defaultOption && {
      id: marketTypeFilterOption.defaultOption.marketType,
      text: marketTypeFilterOption.defaultOption.name,
    };

    marketTypeFilter = {
      id: FILTER_TYPE.MARKET_TYPE,
      value: i18n({ key: "I18N.FILTERS.MARKET_TYPE" }),
      isSelected: false,
      isActive: true,
      isSingleSelection: true,
      title: i18n({ key: "I18N.FILTERS.MARKET_TYPE_TITLE" }),
      availableOptions: marketTypeFilterAvailableOptions.map((opt) => ({ id: opt.marketType, text: opt.name })),
      defaultOption: selectedOption ||
        defaultOption || {
          id: "ppb:marketType:RECOMMENDED",
          text: i18n({ key: "I18N.FILTERS.MARKET_TYPE_RECOMMENDED" }),
        },
      layout: marketTypeFilterOption.layout,
    };
  }

  if (competitionsFilter) {
    const defaultOptions = (competitionsFilter.defaultOptions || []).map((option) => ({
      id: option.urn,
      text: option.name,
      isSelected: true,
    }));

    const selectedOptions =
      defaultOptions.length > 0 && !competitionsFilter.selectedOptions?.length
        ? defaultOptions
        : (competitionsFilter.selectedOptions || []).map((option) => ({
            id: option.urn,
            text: option.name,
            isSelected: true,
          }));

    genericFilters.push({
      id: FILTER_TYPE.COMPETITION,
      value: i18n({ key: "I18N.FILTERS.COMPETITIONS" }),
      isSelected: false,
      isActive: !!selectedOptions && selectedOptions.length > 0,
      isSingleSelection: false,
      title: i18n({ key: "I18N.FILTERS.SET_COMPETITIONS" }),
      topCompetitions: {
        id: "topCompetitions",
        flag: undefined,
        title: i18n({ key: "I18N.FILTERS.TOP_COMPETITIONS" }),
        items: competitionsFilter.topCompetitions.map((competition) => ({
          id: competition.urn,
          text: competition.name,
          isSelected: false,
        })),
      },
      defaultOptions,
      selectedOptions,
      sortPriority: filtersSorting?.indexOf(FilterKeys.CompetitionsFilter),
      numberOfSelectedOptions: selectedOptions.length,
    });
  }

  if (monthFilter) {
    const defaultOptions = (monthFilter.defaultOptions || []).map((option) => ({
      id: option.urn,
      text: option.date,
      isSelected: true,
    }));

    const selectedOptions =
      defaultOptions.length > 0 && !monthFilter.selectedOptions?.length
        ? defaultOptions
        : (monthFilter.selectedOptions || []).map((option) => ({
            id: option.urn,
            text: option.date,
          }));

    const defaultURNs = selectedOptions.map((option) => option.id);

    genericFilters.push({
      id: FILTER_TYPE.MONTHS,
      value: labels.monthPebbleTitle,
      isSelected: false,
      isActive: !!selectedOptions && selectedOptions.length > 0,
      isSingleSelection: false,
      title: labels.monthDrawerTitle,
      availableOptions: monthFilter.availableOptions.map((opt) => {
        const isSelected = defaultURNs.includes(opt.urn) || false;
        return {
          id: opt.urn,
          text: formatMonthLong(opt.date, userDetails.localeCodeBcp47),
          isSelected,
        };
      }),
      defaultOptions: defaultOptions || undefined,
    });
  }

  if (countriesFilter) {
    const defaultOptions = (countriesFilter.defaultOptions || []).map((option) => ({
      id: option.urn,
      text: option.name,
      isSelected: true,
    }));

    const selectedOptions =
      defaultOptions.length > 0 && !countriesFilter.selectedOptions?.length
        ? defaultOptions
        : (countriesFilter.selectedOptions || []).map((option) => ({
            id: option.urn,
            text: option.name,
          }));

    const defaultURNs = selectedOptions.map((option) => option.id);

    genericFilters.push({
      id: FILTER_TYPE.COUNTRIES,
      value: labels.countriesPebbleTitle,
      isSelected: false,
      isActive: !!selectedOptions && selectedOptions.length > 0,
      isSingleSelection: false,
      title: labels.countriesDrawerTitle,
      availableOptions: countriesFilter.availableOptions.map((opt) => {
        const isSelected = defaultURNs.includes(opt.urn) || false;
        return {
          id: opt.urn,
          text: opt.name,
          isSelected,
        };
      }),
      defaultOptions: defaultOptions || undefined,
    });
  }

  const defaultSelections = {
    sortFilter: sortOption?.defaultOption,
    dateRangeFilter: dateRangeFilter?.defaultOption?.urn,
    marketTypeFilter: marketTypeFilter?.defaultOption?.id || null,
    competitionFilter: competitionsFilter?.defaultOptions?.map(({ urn, name }) => ({ urn, name })),
    monthFilter: monthFilter?.defaultOptions?.map(({ urn }) => urn),
    countriesFilter: countriesFilter?.defaultOptions?.map(({ urn }) => urn),
  };

  return {
    genericFilters: sortFilters(genericFilters) as Filter[],
    marketTypeFilter,
    defaultSelections,
    filtersByItem: genericFilters.map((filter) => {
      const { id, value, isSelected, isActive, sortPriority, numberOfSelectedOptions } = filter;
      return {
        id,
        value,
        isSelected,
        isActive,
        sortPriority,
        ...(numberOfSelectedOptions ? { numberOfSelectedOptions } : {}),
      };
    }),
  };
};

export const createFilterOptionsSelector = (): ParametricSelector<ApplicationState, URN, ViewFilters> => {
  const getFilteredCouponCardGroupByURN = createFindCouponCardGroupByURNSelector();
  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getFilteredCouponCardGroupByURN(state.layouts.cardgroups, urn),
      (state: ApplicationState) => <UserDetails>getUserDetails(state),
    ],
    (filteredCardGroup, userDetails) => {
      const filterOptions =
        filteredCardGroup && "filterOptions" in filteredCardGroup ? filteredCardGroup.filterOptions : {};
      return buildFiltersViewModel(filterOptions, userDetails);
    },
  );
};

const createRefreshFiltersSelector = () => {
  const getFilterOptions = createFilterOptionsSelector();

  return createSelector(
    [(state: ApplicationState, urn: URN) => getFilterOptions(state, urn)],
    ({ defaultSelections }) => ({
      marketType:
        !defaultSelections.marketTypeFilter || defaultSelections.marketTypeFilter === "ppb:marketType:RECOMMENDED"
          ? null
          : defaultSelections.marketTypeFilter,
      competitions: defaultSelections.competitionFilter?.map(({ urn }) => urn) || null,
      dateRange: defaultSelections.dateRangeFilter || null,
    }),
  );
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getFilteredCouponCardGroupByURN = createFindCouponCardGroupByURNSelector();
  const getFilterOptions = createFilterOptionsSelector();
  const getRefreshFilters = createRefreshFiltersSelector();

  const i18nLabels = {
    resetText: i18n({ key: "I18N.RESET" }),
    noResultsLabel: i18n({ key: "I18N.ALL_MATCHES.NO_RESULTS" }),
    noResultsSuggestionLabel: i18n({ key: "I18N.ALL_MATCHES.NO_RESULTS_SUGGESTION" }),
    noResultsResetLabel: i18n({ key: "I18N.ALL_MATCHES.NO_RESULTS_RESET" }),
    marketSwitcherTitle: i18n({ key: "I18N.FILTERS.SELECT_MARKET" }),
    notificationMessageLabel: i18n({ key: "I18N.NOTIFICATION.FILTER_WARNING_TITLE" }),
    notificationDetailLabel: i18n({ key: "I18N.NOTIFICATION.FILTER_WARNING_MESSAGE" }),
  };

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    try {
      const filteredCouponCardGroup = getFilteredCouponCardGroupByURN(state.layouts.cardgroups, urn);

      if (!filteredCouponCardGroup) {
        return {};
      }

      const isRouteInPlay = state?.router?.currentUrl?.includes("inplay");
      const title = isRouteInPlay ? "" : ("title" in filteredCouponCardGroup && filteredCouponCardGroup.title) || ""; // TODO Add title to schema

      const hasMaxNumberOfEvents =
        "pageInfo" in filteredCouponCardGroup ? filteredCouponCardGroup.pageInfo.hasNextPage : false;
      const viewAll = "viewAll" in filteredCouponCardGroup ? filteredCouponCardGroup.viewAll : undefined;
      const { typename } = filteredCouponCardGroup;
      const has90Min = "has90Min" in filteredCouponCardGroup ? !!filteredCouponCardGroup.has90Min : false;

      return {
        urn,
        typename,
        title,
        resetText: i18nLabels.resetText,
        filters: getFilterOptions(state, urn),
        refreshFilters: getRefreshFilters(state, urn),
        hasMaxNumberOfEvents,
        viewAll,
        hasResults: !!filteredCouponCardGroup.items.length,
        noResultsLabel: i18nLabels.noResultsLabel,
        noResultsSuggestionLabel: i18nLabels.noResultsSuggestionLabel,
        noResultsResetLabel: i18nLabels.noResultsResetLabel,
        marketSwitcherTitle: i18nLabels.marketSwitcherTitle,
        notificationMessageLabel: i18nLabels.notificationMessageLabel,
        notificationDetailLabel: i18nLabels.notificationDetailLabel,
        has90Min,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

const mapSortFilter = (sortFilter: string | undefined): undefined | FilteredGroupSort => {
  if (!sortFilter) {
    return undefined;
  }
  return sortFilter === "RANK" ? FilteredGroupSort.Rank : FilteredGroupSort.Time;
};

const dispatchTogglePromoDescription = (title: string, isOpen: boolean): PromoDescriptionToggleAction => {
  const variant = MarketBlurbsGA4Variants.NINETY_MINUTES;

  return {
    type: UI__PROMO_DESCRIPTION_TOGGLE,
    payload: {
      title,
      isOpen,
      variant,
    },
  };
};

const dispatchFetchFilteredCoupon = (
  urn: string,
  selections: SingleFilterSelection & MultiFilterSelections,
): FetchFilteredCouponAction => ({
  type: FETCH_FILTERED_COUPON,
  payload: {
    urn,
    sortBy: mapSortFilter(selections.sortFilter),
    filterBy: {
      dateRange: selections.dateRangeFilter || undefined,
      marketType:
        !selections.marketTypeFilter || selections.marketTypeFilter === "ppb:marketType:RECOMMENDED"
          ? null
          : selections.marketTypeFilter,
      competitions: selections.competitionFilter,
      countries: selections.countriesFilter,
      months: selections.monthFilter,
    },
  },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchFilterOpenEvent = (label: string): FilterOpenAction => ({
  type: UI__FILTER_OPEN,
  payload: {
    label,
  },
});

const dispatchFilterCloseEvent = (): FilterCloseAction => ({
  type: UI__FILTER_CLOSE,
});

const dispatchFilterApplyEvent = (
  selectedOptions: (string | undefined)[],
  module: "pebbles" | "filter",
): FilterApplyAction => ({
  type: UI__FILTER_APPLY,
  payload: {
    selectedOptions,
    module,
  },
});

const dispatchFilterResetClickEvent = (label: string): FilterResetClickAction => ({
  type: UI__FILTERS_RESET_CLICK,
  payload: {
    label,
  },
});

const dispatchSelectedMarketSwitcherFilter = (
  currentSelection: SelectedMarketSwitcherPayload,
): SelectedMarketSwitcherAction => ({
  type: UI__SELECTED_MARKET_SWITCHER,
  payload: currentSelection,
});

const dispatchSelectedDateRangeFilterChanged = (
  selectedOption: SelectedDateRangeFilterChangedPayload,
): SelectedDateRangeFilterChangedAction => ({
  type: UI__SELECTED_DATE_RANGE_FILTER_CHANGED,
  payload: selectedOption,
});

const dispatchSelectedSortFilterChanged = (
  selectedOption: SelectedSortFilterChangedPayload,
): SelectedSortFilterChangedAction => ({
  type: UI__SELECTED_SORT_FILTER_CHANGED,
  payload: selectedOption,
});

const dispatchSelectedCompetitionsFilterChanged = (
  selectedOption: SelectedCompetitionsFilterChangedPayload,
): SelectedCompetitionsFilterChangedAction => ({
  type: UI__SELECTED_COMPETITIONS_FILTER_CHANGED,
  payload: selectedOption,
});

const dispatchSelectedMonthFilterChanged = (
  selectedOption: SelectedMonthFilterChangedPayload,
): SelectedMonthFilterChangedAction => ({
  type: UI__SELECTED_MONTH_FILTER_CHANGED,
  payload: selectedOption,
});

const dispatchSelectedCountriesFilterChanged = (
  selectedOption: SelectedCountriesFilterChangedPayload,
): SelectedCountriesFilterChangedAction => ({
  type: UI__SELECTED_COUNTRIES_FILTER_CHANGED,
  payload: selectedOption,
});

const dispatchViewAllTap = (
  title: string,
  viewAllLink: ViewAllLink,
  cardgroupURN: URN,
): CardGroupViewAllLinkTapAction => ({
  type: UI__CARDGROUP_VIEW_ALL_LINK_TAP,
  payload: {
    title,
    viewAllLink,
    cardgroupURN,
  },
});

export type DispatchProps = {
  dispatchPushAction: typeof dispatchPushAction;
  dispatchViewAllTap: typeof dispatchViewAllTap;
  dispatchFetchFilteredCoupon: typeof dispatchFetchFilteredCoupon;
  dispatchFilterOpenEvent: typeof dispatchFilterOpenEvent;
  dispatchFilterCloseEvent: typeof dispatchFilterCloseEvent;
  dispatchFilterApplyEvent: typeof dispatchFilterApplyEvent;
  dispatchFilterResetClickEvent: typeof dispatchFilterResetClickEvent;
  dispatchSelectedMarketSwitcherFilter: typeof dispatchSelectedMarketSwitcherFilter;
  dispatchSelectedDateRangeFilterChanged: typeof dispatchSelectedDateRangeFilterChanged;
  dispatchSelectedSortFilterChanged: typeof dispatchSelectedSortFilterChanged;
  dispatchSelectedCompetitionsFilterChanged: typeof dispatchSelectedCompetitionsFilterChanged;
  dispatchSelectedMonthFilterChanged: typeof dispatchSelectedMonthFilterChanged;
  dispatchSelectedCountriesFilterChanged: typeof dispatchSelectedCountriesFilterChanged;
  dispatchTogglePromoDescription: typeof dispatchTogglePromoDescription;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchFilteredCoupon,
  dispatchViewAllTap,
  dispatchPushAction,
  dispatchFilterOpenEvent,
  dispatchFilterCloseEvent,
  dispatchFilterApplyEvent,
  dispatchFilterResetClickEvent,
  dispatchSelectedMarketSwitcherFilter,
  dispatchSelectedDateRangeFilterChanged,
  dispatchSelectedSortFilterChanged,
  dispatchSelectedCompetitionsFilterChanged,
  dispatchSelectedMonthFilterChanged,
  dispatchSelectedCountriesFilterChanged,
  dispatchTogglePromoDescription,
};
