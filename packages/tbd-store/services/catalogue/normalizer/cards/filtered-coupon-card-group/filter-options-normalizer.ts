/* eslint-disable no-underscore-dangle */

import {
  FilteredGroupSort as FilteredGroupSortFragment,
  FilteredCouponOptionsFragment,
  FutureRacingOptionsFragment,
  ByTimeRangeOptions,
  FilteredGroupSort,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { FilteredCouponOptions } from "../../../../../state/layout/cardgroups/filtered-coupon-cardgroups/FilteredCouponCardGroups.types";
import normalizeCompetitionFragmentIntoCompetition from "../../entities/competitions/competition-normalizer";
import normalizeDisplayNameFragment from "../display-name/display-name-normalizer";

const FILTER_SORT_BY_MAP: { [key in FilteredGroupSortFragment]: FilteredGroupSort } = {
  [FilteredGroupSortFragment.Rank]: FilteredGroupSort.Rank,
  [FilteredGroupSortFragment.Time]: FilteredGroupSort.Time,
};

type FilterFragments = FilteredCouponOptionsFragment | FutureRacingOptionsFragment | ByTimeRangeOptions;

const normalizeFilterOptionsFragmentIntoFilterOptions = (fragment: FilterFragments): FilteredCouponOptions => {
  const filters: FilteredCouponOptions = {};

  // Sort
  if ("sortOption" in fragment && fragment.sortOption) {
    filters.sortOption = {
      defaultOption: fragment.sortOption.defaultOption
        ? FILTER_SORT_BY_MAP[fragment.sortOption.defaultOption]
        : undefined,
      availableOptions: fragment.sortOption.availableOptions.map((option) => FILTER_SORT_BY_MAP[option]),
    };
  }

  // Date range filter
  if ("dateRangeFilter" in fragment && fragment.dateRangeFilter) {
    const { defaultOption } = fragment.dateRangeFilter;

    filters.dateRangeFilter = {
      urn: fragment.dateRangeFilter.urn,
      defaultOption: defaultOption
        ? { urn: defaultOption.urn, name: normalizeDisplayNameFragment(defaultOption.title) }
        : undefined,
      availableOptions: fragment.dateRangeFilter.availableOptions.map((opt) => ({
        urn: opt.urn,
        name: normalizeDisplayNameFragment(opt.title),
      })),
    };
  }

  // Market type filter
  if ("marketTypeFilter" in fragment && fragment.marketTypeFilter) {
    const { urn, defaultOption, availableOptions, layout } = fragment.marketTypeFilter;

    filters.marketTypeFilter = {
      urn,
      defaultOption: defaultOption
        ? {
            name: defaultOption.name,
            marketType: defaultOption.marketType.urn,
          }
        : undefined,
      availableOptions: availableOptions.map((option) => ({
        name: option.name,
        marketType: option.marketType.urn,
      })),
      layout,
    };
  }

  if ("competitionsFilter" in fragment && fragment.competitionsFilter) {
    const { urn, defaultOptions, topCompetitions } = fragment.competitionsFilter;

    filters.competitionsFilter = {
      urn,
      defaultOptions: defaultOptions
        ? defaultOptions.map((option) => normalizeCompetitionFragmentIntoCompetition(option).data)
        : [],
      topCompetitions: topCompetitions.map(
        (competition) => normalizeCompetitionFragmentIntoCompetition(competition).data,
      ),
    };
  }

  // Countries filter
  if ("countriesFilter" in fragment && fragment.countriesFilter) {
    const { urn, defaultOptions, availableOptions } = fragment.countriesFilter;

    filters.countriesFilter = {
      urn,
      defaultOptions: defaultOptions || undefined,
      availableOptions,
    };
  }

  // Month filter
  if ("monthFilter" in fragment && fragment.monthFilter) {
    const { urn, defaultOptions, availableOptions } = fragment.monthFilter;

    filters.monthFilter = {
      urn,
      defaultOptions: defaultOptions || undefined,
      availableOptions,
    };
  }

  if ("filtersSorting" in fragment && fragment.filtersSorting) {
    filters.filtersSorting = fragment.filtersSorting;
  }

  return filters;
};

export default normalizeFilterOptionsFragmentIntoFilterOptions;
