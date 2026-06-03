import { useState, useCallback } from "react";
import { FilterByItem, FILTER_TYPE } from "@ppb/the-wall-common/types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { FetchFilteredCouponAction } from "@ppb/tbd-store/actions/catalogue";
import {
  FilterApplyAction,
  FilterCloseAction,
  SelectedMarketSwitcherAction,
  SelectedMarketSwitcherPayload,
  FilterOpenAction,
  FilterResetClickAction,
  SelectedDateRangeFilterChangedPayload,
  SelectedDateRangeFilterChangedAction,
  SelectedSortFilterChangedPayload,
  SelectedSortFilterChangedAction,
  SelectedCompetitionsFilterChangedPayload,
  SelectedCompetitionsFilterChangedAction,
  SelectedMonthFilterChangedPayload,
  SelectedMonthFilterChangedAction,
  SelectedCountriesFilterChangedPayload,
  SelectedCountriesFilterChangedAction,
} from "@ppb/tbd-store/actions/interface";
import { FilteredGroupSort } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import {
  CompetitionFilter,
  SingleFilter,
  MultipleFilter,
  Filter,
  SingleFilterSelection,
  MultiFilterSelections,
  sortFilters,
  ViewFilters,
} from "./map-to-props-factory";
import {
  CompetitionFilterDrawerOnApply,
  FilteredCouponCardGroupDefaultSelections,
} from "./CompetitionFilterDrawer/CompetitionFilterDrawer.types";
import { MultipleFilterDrawerOnApply } from "./MultipleFilterDrawer/MultipleFilterDrawer.types";
import { SingleFilterDrawerOnApply } from "./SingleFilterDrawer/SingleFilterDrawer.types";

export type OnApplyCallback = SingleFilterDrawerOnApply | MultipleFilterDrawerOnApply | CompetitionFilterDrawerOnApply;

export function isCompetitionFilter(filter: Filter | FilterByItem | undefined): filter is CompetitionFilter {
  return filter?.id === FILTER_TYPE.COMPETITION;
}
export function isSingleFilter(filter: Filter | undefined): filter is SingleFilter {
  return filter?.isSingleSelection === true;
}
export function isMultipleFilter(filter: Filter | undefined): filter is MultipleFilter {
  return filter?.isSingleSelection === false && filter?.id !== FILTER_TYPE.COMPETITION;
}
function isMarketTypeFilter(filter: Filter): filter is SingleFilter {
  return filter.id === FILTER_TYPE.MARKET_TYPE;
}

function isDateRangeTypeFilter(filter: Filter | FilterByItem): filter is SingleFilter {
  return filter.id === FILTER_TYPE.DATE_RANGE;
}

function isSortFilter(filter: Filter | FilterByItem): filter is SingleFilter {
  return filter.id === FILTER_TYPE.SORT;
}

function isMonthFilter(filter: Filter | FilterByItem): filter is MultipleFilter {
  return filter.id === FILTER_TYPE.MONTHS;
}

function isCountriesFilter(filter: Filter | FilterByItem): filter is MultipleFilter {
  return filter.id === FILTER_TYPE.COUNTRIES;
}

type FiltersHelper = {
  isModalClosed: boolean;
  currentFilter: Filter | undefined;
  filterByState: FilterByItem[];
  currentSelections: FilteredCouponCardGroupDefaultSelections;
  getMarketTypeFilterLabel: () => string;
  onClose: () => void;
  onReset: (label: string) => void;
  onApply: OnApplyCallback;
  onFilterTap: (id: FILTER_TYPE, value: string) => void;
  onMarketTypeFilterTap: (value: string, id?: string) => void;
};

const getSelectedOptions = (
  currentFilterId: Filter,
  numberOfSelectedOptions: number,
): { numberOfSelectedOptions?: number } => (isCompetitionFilter(currentFilterId) ? { numberOfSelectedOptions } : {});

function mapFilterSelections(
  filter: SingleFilter | MultipleFilter | CompetitionFilter,
  selectedOptionIds: string[],
  selectedOptionsNames: (string | undefined)[],
) {
  if (isCompetitionFilter(filter)) {
    return selectedOptionIds.map((urn, index) => ({
      urn,
      name: selectedOptionsNames[index],
    }));
  }

  return filter.isSingleSelection ? selectedOptionIds[0] : selectedOptionIds;
}

export function useFilters(
  viewFilters: ViewFilters,
  urn: URN,
  dispatchFetchFilteredCoupon: (
    urn: URN,
    selections: SingleFilterSelection & MultiFilterSelections,
  ) => FetchFilteredCouponAction,
  dispatchFilterOpenEvent: (label: string) => FilterOpenAction,
  dispatchFilterCloseEvent: () => FilterCloseAction,
  dispatchFilterApplyEvent: (
    selectedOptions: (string | undefined)[],
    module: "pebbles" | "filter",
  ) => FilterApplyAction,
  dispatchFilterResetClickEvent: (label: string) => FilterResetClickAction,
  dispatchSelectedMarketSwitcherFilter: (selectedOption: SelectedMarketSwitcherPayload) => SelectedMarketSwitcherAction,
  dispatchSelectedDateRangeFilterChanged: (
    selectedOption: SelectedDateRangeFilterChangedPayload,
  ) => SelectedDateRangeFilterChangedAction,
  dispatchSelectedSortFilterChanged: (
    selectedOption: SelectedSortFilterChangedPayload,
  ) => SelectedSortFilterChangedAction,
  dispatchSelectedCompetitionsFilterChanged: (
    selectedOption: SelectedCompetitionsFilterChangedPayload,
  ) => SelectedCompetitionsFilterChangedAction,
  dispatchSelectedMonthFilterChanged: (
    selectedOption: SelectedMonthFilterChangedPayload,
  ) => SelectedMonthFilterChangedAction,
  dispatchSelectedCountriesFilterChanged: (
    selectedOption: SelectedCountriesFilterChangedPayload,
  ) => SelectedCountriesFilterChangedAction,
): FiltersHelper {
  const {
    genericFilters: filters,
    defaultSelections: selectionsInitialState,
    marketTypeFilter,
    filtersByItem,
  } = viewFilters;

  const [isModalClosed, setIsModalClosed] = useState<boolean>(true);
  const [filterByState, setFilterByState] = useState<FilterByItem[]>(filtersByItem);
  const [currentFilter, setCurrentFilter] = useState<Filter | undefined>(undefined);
  const [currentSelections, setCurrentSelections] =
    useState<FilteredCouponCardGroupDefaultSelections>(selectionsInitialState);

  const onFilterTap = useCallback(
    (id: FILTER_TYPE, value: string) => {
      const tappedFilters = filters.find((filter) => filter.id === id);
      setCurrentFilter(tappedFilters);

      let updatedSelections: FilteredCouponCardGroupDefaultSelections = currentSelections;

      filters.map((filter) => {
        if (
          filter &&
          (isDateRangeTypeFilter(filter) || isSortFilter(filter)) &&
          (filter.selectedOption || filter.defaultOption)
        ) {
          const { id: selectedId, text } = filter.selectedOption || filter.defaultOption || { id: "", text: "" };
          updatedSelections = {
            ...updatedSelections,
            [filter.id]: mapFilterSelections(filter, selectedId ? [selectedId] : [], [text]),
          };
        }

        if (filter && isCompetitionFilter(filter) && filter.selectedOptions) {
          updatedSelections = {
            ...updatedSelections,
            [filter.id]: mapFilterSelections(
              filter,
              filter.selectedOptions.map((selection) => selection.id),
              filter.selectedOptions.map((selection) => selection.text),
            ) as { urn: string; name: string }[],
          };
        }

        if (filter && (isMonthFilter(filter) || isCountriesFilter(filter)) && filter.availableOptions) {
          updatedSelections = {
            ...updatedSelections,
            [filter.id]: filter.availableOptions.filter((item) => item.isSelected).map((item) => item.id),
          };
        }

        return updatedSelections;
      });
      setIsModalClosed(false);
      setCurrentSelections(updatedSelections);

      const updatedFilterByState = filterByState.map((curr) => {
        if (curr.id === id) {
          return {
            ...curr,
            isSelected: true,
          };
        }
        return curr;
      });
      setFilterByState(updatedFilterByState);
      dispatchFilterOpenEvent(value);
    },
    [dispatchFilterOpenEvent, currentSelections, filterByState, filters],
  );

  const isCurrentFilterSortOrDataRange = (filterId: FILTER_TYPE): boolean =>
    [FILTER_TYPE.SORT, FILTER_TYPE.DATE_RANGE].includes(filterId);

  const onApply = useCallback<OnApplyCallback>(
    (selectedOptionIds, selectedOptionsNames, selectedFilter) => {
      const filter = selectedFilter || currentFilter;
      if (filter) {
        const updatedFilterByState = filterByState.map((curr) => {
          if (curr.id === filter.id) {
            return {
              ...curr,
              value: isCurrentFilterSortOrDataRange(curr.id) ? selectedOptionsNames[0] ?? "" : filter.value,
              isSelected: false,
              isActive: !!selectedOptionIds.length,
              ...getSelectedOptions(filter, selectedOptionIds.length),
            };
          }

          return curr;
        });

        const updatedCurrentSelections: FilteredCouponCardGroupDefaultSelections = {
          ...currentSelections,
          [filter.id]: mapFilterSelections(filter, selectedOptionIds, selectedOptionsNames),
        };
        const updatedDispatch: SingleFilterSelection & MultiFilterSelections = {
          ...updatedCurrentSelections,
          competitionFilter: updatedCurrentSelections.competitionFilter?.map((competition) => competition.urn),
        };

        setFilterByState(sortFilters(updatedFilterByState));
        setCurrentSelections(updatedCurrentSelections);
        setIsModalClosed(true);

        dispatchFetchFilteredCoupon(urn, updatedDispatch);
        dispatchFilterApplyEvent(selectedOptionsNames?.filter(Boolean), selectedFilter ? "pebbles" : "filter");

        if (isDateRangeTypeFilter(filter)) {
          dispatchSelectedDateRangeFilterChanged({
            urn,
            selectedOption: {
              urn: updatedCurrentSelections.dateRangeFilter || "",
              name: updatedFilterByState.find((item) => item.id === FILTER_TYPE.DATE_RANGE)?.value || "",
            },
          });
        }
        if (isSortFilter(filter)) {
          dispatchSelectedSortFilterChanged({
            urn,
            selectedOption:
              (updatedFilterByState
                .find((item) => item.id === FILTER_TYPE.SORT)
                ?.value.toUpperCase() as FilteredGroupSort) || FilteredGroupSort.Rank,
          });
        }
        if (isCompetitionFilter(filter)) {
          dispatchSelectedCompetitionsFilterChanged({
            urn,
            selectedOptions: updatedCurrentSelections.competitionFilter || [],
          });
        }
        if (isMonthFilter(filter)) {
          dispatchSelectedMonthFilterChanged({
            urn,
            selectedOptions:
              filter.availableOptions
                .filter((option) => updatedCurrentSelections.monthFilter?.includes(option.id))
                .map((option) => ({
                  urn: option.id,
                  date: option.text,
                })) || [],
          });
        }
        if (isCountriesFilter(filter)) {
          dispatchSelectedCountriesFilterChanged({
            urn,
            selectedOptions:
              filter.availableOptions
                .filter((option) => updatedCurrentSelections.countriesFilter?.includes(option.id))
                .map((option) => ({
                  urn: option.id,
                  name: option.text,
                })) || [],
          });
        }
        if (isMarketTypeFilter(filter)) {
          dispatchSelectedMarketSwitcherFilter({
            urn,
            selectedOption: {
              marketType: selectedOptionIds[0],
              name: selectedOptionsNames[0] as string,
            },
          });
        }
      }
    },
    [
      currentFilter,
      currentSelections,
      dispatchFetchFilteredCoupon,
      dispatchFilterApplyEvent,
      dispatchSelectedMarketSwitcherFilter,
      dispatchSelectedDateRangeFilterChanged,
      dispatchSelectedSortFilterChanged,
      dispatchSelectedCompetitionsFilterChanged,
      dispatchSelectedMonthFilterChanged,
      dispatchSelectedCountriesFilterChanged,
      filterByState,
      urn,
    ],
  );

  const onReset = useCallback(
    (label: string) => {
      // Remove market switcher filters from filters to reset
      const filtersWithoutMarketTypeFilter = filters.filter((item) => !isMarketTypeFilter(item));
      if (filtersWithoutMarketTypeFilter.length) {
        const dateRangeFilter = filtersByItem.find((item) => item.id === FILTER_TYPE.DATE_RANGE);
        if (
          dateRangeFilter &&
          isDateRangeTypeFilter(dateRangeFilter) &&
          isSingleFilter(filtersWithoutMarketTypeFilter[0])
        ) {
          const { id, text } = (
            filtersWithoutMarketTypeFilter.find((item) => item.id === FILTER_TYPE.DATE_RANGE) as SingleFilter
          )?.defaultOption || { id: "", text: "" };

          dateRangeFilter.value = text;
          dispatchSelectedDateRangeFilterChanged({ urn, selectedOption: { urn: id, name: text } });
        }

        const sortFilter = filtersByItem.find((item) => item.id === FILTER_TYPE.SORT);
        if (sortFilter && isSortFilter(sortFilter) && isSingleFilter(filtersWithoutMarketTypeFilter[0])) {
          const { text } = (filtersWithoutMarketTypeFilter.find((item) => item.id === FILTER_TYPE.SORT) as SingleFilter)
            ?.defaultOption || { id: "", text: "" };

          sortFilter.value = text;
          dispatchSelectedSortFilterChanged({
            urn,
            selectedOption: undefined,
          });
        }

        const competitionFilter = filtersByItem.find((item) => item.id === FILTER_TYPE.COMPETITION);
        if (competitionFilter && isCompetitionFilter(competitionFilter)) {
          dispatchSelectedCompetitionsFilterChanged({ urn, selectedOptions: [] });
          competitionFilter.isActive = false;
          competitionFilter.selectedOptions = [];
          competitionFilter.numberOfSelectedOptions = 0;
        }

        const monthFilter = filtersByItem.find((item) => item.id === FILTER_TYPE.MONTHS);
        if (monthFilter && isMonthFilter(monthFilter)) {
          dispatchSelectedMonthFilterChanged({ urn, selectedOptions: [] });
          monthFilter.isActive = false;
        }

        const countriesFilter = filtersByItem.find((item) => item.id === FILTER_TYPE.COUNTRIES);
        if (countriesFilter && isCountriesFilter(countriesFilter)) {
          dispatchSelectedCountriesFilterChanged({ urn, selectedOptions: [] });
          countriesFilter.isActive = false;
        }

        setFilterByState(filtersByItem);
        setCurrentFilter(filtersWithoutMarketTypeFilter[0]);
        setCurrentSelections(selectionsInitialState);

        dispatchFetchFilteredCoupon(urn, {
          ...selectionsInitialState,
          competitionFilter: selectionsInitialState.competitionFilter?.map((competition) => competition.urn),
        });
        dispatchFilterResetClickEvent(label);
      }
    },
    [
      dispatchFetchFilteredCoupon,
      dispatchFilterResetClickEvent,
      dispatchSelectedDateRangeFilterChanged,
      dispatchSelectedSortFilterChanged,
      dispatchSelectedCompetitionsFilterChanged,
      dispatchSelectedMonthFilterChanged,
      dispatchSelectedCountriesFilterChanged,
      filters,
      selectionsInitialState,
      urn,
      filtersByItem,
    ],
  );

  const onClose = useCallback(() => {
    setIsModalClosed(true);
    if (currentFilter) {
      const updatedFilterByState = filterByState.map((curr) => {
        if (curr.id === currentFilter.id) {
          return {
            ...curr,
            isSelected: false,
          };
        }
        return curr;
      });

      const filter = filterByState.find((item) => item.id === currentFilter.id);
      if (filter) {
        filter.isSelected = false;
      }

      setFilterByState(updatedFilterByState);
      setCurrentFilter(undefined);
      dispatchFilterCloseEvent();
    }
  }, [currentFilter, dispatchFilterCloseEvent, filterByState]);

  const onMarketTypeFilterTap = useCallback(
    (value: string, id?: string) => {
      if (id) {
        const text = marketTypeFilter?.availableOptions.find((opt) => opt.id === id)?.text;
        onApply([id], [text], marketTypeFilter);
      } else {
        setCurrentFilter(marketTypeFilter);
        setIsModalClosed(false);
        dispatchFilterOpenEvent(value);
      }
    },
    [dispatchFilterOpenEvent, marketTypeFilter, onApply],
  );

  const getMarketTypeFilterLabel = useCallback(
    () =>
      (marketTypeFilter?.availableOptions.find(({ id }) => id === currentSelections.marketTypeFilter)?.text ||
        marketTypeFilter?.defaultOption?.text) ??
      "",
    [currentSelections, marketTypeFilter],
  );

  return {
    isModalClosed,
    currentFilter,
    filterByState,
    currentSelections,
    getMarketTypeFilterLabel,
    onClose,
    onReset,
    onApply,
    onFilterTap,
    onMarketTypeFilterTap,
  };
}
