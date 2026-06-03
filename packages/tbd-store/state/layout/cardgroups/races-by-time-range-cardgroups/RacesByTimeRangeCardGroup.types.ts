import URN from "../../URN";
import { PartialItem } from "../../views/PartialItem.types";

type PageInfo = {
  hasNextPage: boolean;
};

// Countries Filter
export type CountriesFilter = {
  urn: URN;
  defaultOptions?: CountriesFilterOption[];
  availableOptions: CountriesFilterOption[];
  selectedOptions: CountriesFilterOption[];
};

export type CountriesFilterOption = {
  urn: URN;
  name: string;
};

// List of all filters
export type ByTimeRangeFilters = {
  countriesFilter?: CountriesFilter;
};

// Card
export type RacesByTimeRangeCardGroup = {
  urn: URN;
  typename: "RacesByTimeRangeCardGroup";
  filterOptions: ByTimeRangeFilters;
  pageInfo: PageInfo;
  items: PartialItem[];
};

// Store entry
export type RacesByTimeRangeCardGroups = {
  [urn: string]: RacesByTimeRangeCardGroup;
};
